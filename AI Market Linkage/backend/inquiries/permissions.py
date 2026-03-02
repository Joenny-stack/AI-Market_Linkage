"""
Permissions for inquiries.
"""
from rest_framework import permissions


class IsBuyerOrOwner(permissions.BasePermission):
    """
    Custom permission to allow buyers to view their own inquiries
    and farmers to view inquiries about their listings.
    """
    
    def has_object_permission(self, request, view, obj):
        # Buyer can view their own inquiries
        if obj.buyer == request.user:
            return True
        
        # Farmer can view inquiries about their listings
        if obj.listing.farmer == request.user:
            return True
        
        return False


class IsBuyer(permissions.BasePermission):
    """
    Permission to check if user is a buyer.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_buyer()
