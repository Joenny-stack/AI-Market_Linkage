"""
Django admin configuration for inquiries app.
"""
from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    """
    Admin configuration for inquiries.
    """
    list_display = ('buyer', 'listing', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('buyer__email', 'listing__crop_name', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
