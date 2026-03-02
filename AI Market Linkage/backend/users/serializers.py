"""
Serializers for User authentication and management.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer with additional user information.
    """
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['role'] = user.role
        return token


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number', 'role', 'password', 'password2']
        extra_kwargs = {
            'phone_number': {'required': False},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        # Use email as username
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user details.
    """
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'role', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile updates.
    """
    
    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number']
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
