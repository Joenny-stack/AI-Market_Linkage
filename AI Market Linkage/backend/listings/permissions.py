"""
Permissions for listings.
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a listing to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        return obj.farmer == request.user


class IsFarmer(permissions.BasePermission):
    """
    Permission to check if user is a farmer.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_farmer()
