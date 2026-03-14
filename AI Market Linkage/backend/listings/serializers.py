"""
Serializers for listings.
"""
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
            'quality_grade',
            'predicted_class',
            'ai_price_recommendation',
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


class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating listings.
    """
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Listing
        fields = [
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
            'images'
        ]

    @staticmethod
    def _is_tomato_listing(validated_data):
        crop_name = str(validated_data.get('crop_name', '')).lower()
        category = str(validated_data.get('category', '')).lower()
        return 'tomato' in crop_name or 'tomato' in category
    
    def create(self, validated_data):
        images = validated_data.pop('images', [])
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
        
        return listing
    
    def update(self, instance, validated_data):
        images = validated_data.pop('images', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if images is not None:
            instance.images.all().delete()
            for image_file in images:
                ListingImage.objects.create(listing=instance, image=image_file)
        
        return instance
