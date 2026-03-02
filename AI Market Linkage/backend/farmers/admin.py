"""
Django admin configuration for farmers app.
"""
from django.contrib import admin
from .models import FarmerProfile


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    """
    Admin configuration for farmer profiles.
    """
    list_display = ('user', 'farm_name', 'province', 'district', 'created_at')
    list_filter = ('province', 'district', 'created_at')
    search_fields = ('farm_name', 'user__email', 'user__full_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Farm Information', {'fields': ('farm_name', 'description', 'primary_crop_types')}),
        ('Location', {'fields': ('province', 'district', 'gps_latitude', 'gps_longitude')}),
        ('Media', {'fields': ('profile_image',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
