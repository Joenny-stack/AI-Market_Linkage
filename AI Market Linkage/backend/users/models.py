"""
Custom User model for AI Market Linkage Platform.
"""
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    """
    ROLE_CHOICES = [
        ('FARMER', 'Farmer'),
        ('BUYER', 'Buyer'),
        ('ADMIN', 'Admin'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=False, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='BUYER')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    def is_farmer(self):
        return self.role == 'FARMER'
    
    def is_buyer(self):
        return self.role == 'BUYER'
    
    def is_admin(self):
        return self.role == 'ADMIN'
