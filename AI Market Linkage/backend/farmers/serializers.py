"""
Serializers for Farmer profiles.
"""
from rest_framework import serializers
from .models import FarmerProfile


class FarmerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for farmer profiles.
    """
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = FarmerProfile
        fields = [
            'id',
            'user',
            'user_email',
            'user_full_name',
            'farm_name',
            'description',
            'primary_crop_types',
            'province',
            'district',
            'gps_latitude',
            'gps_longitude',
            'profile_image',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class FarmerProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating farmer profile.
    """
    
    class Meta:
        model = FarmerProfile
        fields = [
            'farm_name',
            'description',
            'primary_crop_types',
            'province',
            'district',
            'gps_latitude',
            'gps_longitude',
            'profile_image'
        ]
