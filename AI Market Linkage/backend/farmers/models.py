"""
Models for Farmer profiles.
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class FarmerProfile(models.Model):
    """
    Farmer profile linked to a user account.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    farm_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    primary_crop_types = models.TextField(help_text='Comma-separated list of crop types')
    province = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    gps_latitude = models.FloatField()
    gps_longitude = models.FloatField()
    profile_image = models.ImageField(upload_to='farmers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Farmer Profile'
        verbose_name_plural = 'Farmer Profiles'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.farm_name}"
