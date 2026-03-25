"""
Models for agricultural listings and images.
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Listing(models.Model):
    """
    Agricultural product listings created by farmers.
    """
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('SOLD', 'Sold'),
        ('PENDING', 'Pending'),
    ]
    PRICE_VARIANCE_CHOICES = [
        ('OVERPRICED', 'Overpriced'),
        ('UNDERPRICED', 'Underpriced'),
        ('FAIR', 'Fairly Priced'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    crop_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField()
    quantity_available = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, help_text='Standardized to kg')
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    recommended_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    harvest_date = models.DateField()
    location = models.CharField(max_length=150, null=True, blank=True)
    province = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    gps_latitude = models.FloatField(null=True, blank=True)
    gps_longitude = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Phase 2 AI fields (reserved, nullable)
    predicted_class = models.CharField(max_length=50, null=True, blank=True)
    quality_grade = models.CharField(max_length=50, null=True, blank=True)
    ai_price_recommendation = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_variance_flag = models.CharField(max_length=20, choices=PRICE_VARIANCE_CHOICES, null=True, blank=True)
    confidence_score = models.FloatField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Listing'
        verbose_name_plural = 'Listings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['farmer', 'status']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return f"{self.crop_name} - {self.farmer.full_name}"
    
    @property
    def total_price(self):
        return self.quantity_available * self.price_per_unit

    @property
    def price_per_kg(self):
        return self.price_per_unit

    @property
    def quantity_kg(self):
        return self.quantity_available


class ListingImage(models.Model):
    """
    Images associated with listings.
    """
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listings/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Listing Image'
        verbose_name_plural = 'Listing Images'
        ordering = ['uploaded_at']
    
    def __str__(self):
        return f"Image for {self.listing.crop_name}"
