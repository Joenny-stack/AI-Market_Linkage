"""
Models for buyer inquiries.
"""
from django.db import models
from django.contrib.auth import get_user_model
from listings.models import Listing

User = get_user_model()


class Inquiry(models.Model):
    """
    Buyer inquiries about listings.
    """
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('RESPONDED', 'Responded'),
    ]
    
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='inquiries')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inquiries_sent')
    message = models.TextField()
    contact_phone = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Inquiry'
        verbose_name_plural = 'Inquiries'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['buyer', 'status']),
            models.Index(fields=['listing', 'status']),
        ]
    
    def __str__(self):
        return f"Inquiry from {self.buyer.email} about {self.listing.crop_name}"
