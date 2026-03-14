"""
Views for listings.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Listing, ListingImage
from .serializers import (
    ListingSerializer,
    ListingCreateUpdateSerializer,
    ListingImageSerializer
)
from .permissions import IsOwnerOrReadOnly, IsFarmer
from .filters import ListingFilter


class ListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing listings.
    Farmers can create listings, buyers can browse and filter.
    """
    queryset = Listing.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ListingFilter
    search_fields = ['crop_name', 'category', 'description']
    ordering_fields = ['created_at', 'price_per_unit', 'quantity_available']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ListingSerializer
        return ListingCreateUpdateSerializer
    
    def get_permissions(self):
        """
        Set permissions based on action.
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsFarmer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
        else:
            permission_classes = [AllowAny]
        
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        """
        Create a listing and associate it with the current farmer.
        """
        serializer.save(farmer=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Create listing and return detail serializer so AI fields are included.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        listing = serializer.save(farmer=request.user)
        output_serializer = ListingSerializer(listing, context=self.get_serializer_context())
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_destroy(self, instance):
        """
        Delete a listing (only by owner or admin).
        """
        if instance.farmer == self.request.user or self.request.user.is_staff:
            instance.delete()
        else:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsFarmer])
    def my_listings(self, request):
        """
        Get all listings by the current farmer.
        """
        listings = Listing.objects.filter(farmer=request.user)
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsFarmer])
    def add_images(self, request, pk=None):
        """
        Add images to an existing listing.
        """
        listing = self.get_object()
        
        if listing.farmer != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {'error': 'No images provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_images = []
        for image_file in images:
            listing_image = ListingImage.objects.create(listing=listing, image=image_file)
            created_images.append(ListingImageSerializer(listing_image).data)
        
        return Response(
            {'images': created_images, 'message': f'{len(created_images)} image(s) added'},
            status=status.HTTP_201_CREATED
        )
