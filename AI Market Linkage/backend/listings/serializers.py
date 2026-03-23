"""
Serializers for listings.
"""
from decimal import Decimal
import logging

from rest_framework import serializers

from .models import Listing, ListingImage


logger = logging.getLogger(__name__)


class ListingImageSerializer(serializers.ModelSerializer):
    """
    Serializer for listing images.
    """
    
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class ListingSerializer(serializers.ModelSerializer):
    """
    Serializer for listings.
    """
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    farmer_email = serializers.CharField(source='farmer.email', read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()
    price_per_kg = serializers.ReadOnlyField()
    quantity_kg = serializers.ReadOnlyField()
    pricing_warning = serializers.SerializerMethodField()
    
    class Meta:
        model = Listing
        fields = [
            'id',
            'farmer',
            'farmer_name',
            'farmer_email',
            'crop_name',
            'category',
            'description',
            'quantity_available',
            'unit',
            'price_per_unit',
            'currency',
            'harvest_date',
            'province',
            'district',
            'gps_latitude',
            'gps_longitude',
            'status',
            'images',
            'total_price',
            'price_per_kg',
            'quantity_kg',
            'quality_grade',
            'predicted_class',
            'ai_price_recommendation',
            'recommended_price',
            'price_variance_flag',
            'pricing_warning',
            'confidence_score',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'farmer',
            'quality_grade',
            'predicted_class',
            'ai_price_recommendation',
            'confidence_score',
            'created_at',
            'updated_at'
        ]

    @staticmethod
    def get_pricing_warning(obj):
        if obj.price_variance_flag == 'OVERPRICED':
            return 'Entered price is more than 20% above AI recommendation.'
        if obj.price_variance_flag == 'UNDERPRICED':
            return 'Entered price is more than 20% below AI recommendation.'
        return None


class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating listings.
    """
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True
    )
    recommended_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    
    class Meta:
        model = Listing
        fields = [
            'crop_name',
            'category',
            'description',
            'quantity_available',
            'unit',
            'price_per_unit',
            'recommended_price',
            'currency',
            'harvest_date',
            'province',
            'district',
            'gps_latitude',
            'gps_longitude',
            'status',
            'images'
        ]

    def validate_unit(self, value):
        if str(value).strip().lower() != 'kg':
            raise serializers.ValidationError('Unit must be kg. Price recommendations are standardized to price_per_kg.')
        return 'kg'

    def validate_quantity_available(self, value):
        if value <= 0:
            raise serializers.ValidationError('Quantity must be greater than 0 kg.')
        return value

    @staticmethod
    def _compute_variance_flag(user_price: Decimal, recommended_price: Decimal):
        if recommended_price is None:
            return None
        if user_price > (recommended_price * Decimal('1.20')):
            return 'OVERPRICED'
        if user_price < (recommended_price * Decimal('0.80')):
            return 'UNDERPRICED'
        return 'FAIR'

    @staticmethod
    def _is_tomato_listing(validated_data):
        crop_name = str(validated_data.get('crop_name', '')).lower()
        category = str(validated_data.get('category', '')).lower()
        return 'tomato' in crop_name or 'tomato' in category

    def _predict_recommended_price(self, listing, validated_data):
        from ai_service.price_predict import predict_price

        quality_grade = listing.quality_grade or 'Grade A'
        crop_name = str(validated_data.get('crop_name', listing.crop_name or 'Tomatoes'))
        location = str(validated_data.get('province', listing.province or 'Harare'))
        quantity = float(validated_data.get('quantity_available', listing.quantity_available or 100))
        return Decimal(str(predict_price(crop_name, location, quality_grade, quantity)))
    
    def create(self, validated_data):
        images = validated_data.pop('images', [])
        provided_recommended_price = validated_data.pop('recommended_price', None)
        listing = Listing.objects.create(**validated_data)
        
        for image_file in images:
            ListingImage.objects.create(listing=listing, image=image_file)

        if images and self._is_tomato_listing(validated_data):
            try:
                from ai_service.predict import predict_tomato

                first_image = listing.images.first()
                if first_image and first_image.image:
                    prediction = predict_tomato(first_image.image.path)
                    listing.predicted_class = prediction.get('class')
                    listing.quality_grade = prediction.get('grade')
                    listing.confidence_score = prediction.get('confidence')
                    listing.save(update_fields=['predicted_class', 'quality_grade', 'confidence_score'])
            except Exception as exc:
                logger.warning('AI tomato classification failed for listing %s: %s', listing.id, exc)

        update_fields = []

        # Price recommendation source: frontend provided value or backend model prediction.
        try:
            if provided_recommended_price is not None:
                predicted_price = Decimal(str(provided_recommended_price))
            else:
                predicted_price = self._predict_recommended_price(listing, validated_data)

            listing.ai_price_recommendation = predicted_price
            listing.recommended_price = predicted_price
            update_fields.extend(['ai_price_recommendation', 'recommended_price'])
        except Exception as exc:
            logger.warning('AI price recommendation failed for listing %s: %s', listing.id, exc)

        if listing.recommended_price is not None:
            listing.price_variance_flag = self._compute_variance_flag(
                Decimal(str(listing.price_per_unit)), Decimal(str(listing.recommended_price))
            )
            update_fields.append('price_variance_flag')

        if update_fields:
            listing.save(update_fields=list(dict.fromkeys(update_fields)))

        return listing
    
    def update(self, instance, validated_data):
        images = validated_data.pop('images', None)
        provided_recommended_price = validated_data.pop('recommended_price', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if provided_recommended_price is not None:
            instance.recommended_price = Decimal(str(provided_recommended_price))
            instance.ai_price_recommendation = instance.recommended_price

        # Recompute recommendation if key pricing inputs changed and no frontend recommendation supplied.
        if provided_recommended_price is None and any(
            key in validated_data for key in ['crop_name', 'province', 'quantity_available']
        ):
            try:
                predicted_price = self._predict_recommended_price(instance, validated_data)
                instance.recommended_price = predicted_price
                instance.ai_price_recommendation = predicted_price
            except Exception as exc:
                logger.warning('AI price recommendation failed during update for listing %s: %s', instance.id, exc)

        if instance.recommended_price is not None:
            instance.price_variance_flag = self._compute_variance_flag(
                Decimal(str(instance.price_per_unit)), Decimal(str(instance.recommended_price))
            )

        instance.save()
        
        if images is not None:
            instance.images.all().delete()
            for image_file in images:
                ListingImage.objects.create(listing=instance, image=image_file)
        
        return instance
