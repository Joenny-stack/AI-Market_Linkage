"""
Filters for listings.
"""
import django_filters
from .models import Listing


class ListingFilter(django_filters.FilterSet):
    """
    Filter for listings based on various criteria.
    """
    crop_name = django_filters.CharFilter(field_name='crop_name', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category', lookup_expr='icontains')
    province = django_filters.CharFilter(field_name='province', lookup_expr='icontains')
    district = django_filters.CharFilter(field_name='district', lookup_expr='icontains')
    status = django_filters.CharFilter(field_name='status')
    min_price = django_filters.NumberFilter(field_name='price_per_unit', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price_per_unit', lookup_expr='lte')
    
    class Meta:
        model = Listing
        fields = ['crop_name', 'category', 'province', 'district', 'status', 'min_price', 'max_price']
