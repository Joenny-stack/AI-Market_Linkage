"""
Serializers for inquiries.
"""
from rest_framework import serializers
from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):
    """
    Serializer for inquiries.
    """
    buyer_email = serializers.CharField(source='buyer.email', read_only=True)
    buyer_name = serializers.CharField(source='buyer.full_name', read_only=True)
    listing_crop = serializers.CharField(source='listing.crop_name', read_only=True)
    listing_price = serializers.CharField(source='listing.price_per_unit', read_only=True)
    listing_currency = serializers.CharField(source='listing.currency', read_only=True)
    listing_unit = serializers.CharField(source='listing.unit', read_only=True)
    listing_location = serializers.CharField(source='listing.location', read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id',
            'listing',
            'listing_crop',
            'listing_price',
            'listing_currency',
            'listing_unit',
            'listing_location',
            'buyer',
            'buyer_email',
            'buyer_name',
            'message',
            'contact_phone',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'buyer', 'created_at', 'updated_at']


class InquiryCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating inquiries.
    """
    
    class Meta:
        model = Inquiry
        fields = ['listing', 'message', 'contact_phone']
    
    def create(self, validated_data):
        # Add the buyer from the request context
        validated_data['buyer'] = self.context['request'].user
        return super().create(validated_data)


class InquiryUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating inquiry status (for farmers).
    """
    
    class Meta:
        model = Inquiry
        fields = ['status']
