"""
Django admin configuration for listings app.
"""
from django.contrib import admin
from .models import Listing, ListingImage


class ListingImageInline(admin.TabularInline):
    """
    Inline admin for listing images.
    """
    model = ListingImage
    extra = 1


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    """
    Admin configuration for listings.
    """
    list_display = ('crop_name', 'farmer', 'price_per_unit', 'status', 'created_at')
    list_filter = ('status', 'category', 'province', 'created_at')
    search_fields = ('crop_name', 'farmer__email', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [ListingImageInline]
    fieldsets = (
        ('Basic Information', {'fields': ('id', 'farmer', 'crop_name', 'category', 'description')}),
        ('Quantity & Pricing', {'fields': ('quantity_available', 'unit', 'price_per_unit', 'currency')}),
        ('Dates', {'fields': ('harvest_date',)}),
        ('Location', {'fields': ('province', 'district', 'gps_latitude', 'gps_longitude')}),
        ('Status', {'fields': ('status',)}),
        ('AI Fields (Phase 2)', {'fields': ('quality_grade', 'ai_price_recommendation', 'confidence_score')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
