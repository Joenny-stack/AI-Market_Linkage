"""
Views for inquiries.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Inquiry
from .serializers import (
    InquirySerializer,
    InquiryCreateSerializer,
    InquiryUpdateSerializer
)
from .permissions import IsBuyerOrOwner, IsBuyer


class InquiryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing inquiries.
    Buyers can send inquiries, farmers can view and respond.
    """
    queryset = Inquiry.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InquiryCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return InquiryUpdateSerializer
        return InquirySerializer
    
    def get_permissions(self):
        """
        Set permissions based on action.
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsBuyer]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsBuyerOrOwner]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filter inquiries based on user role.
        """
        user = self.request.user
        if user.is_farmer():
            # Farmers see inquiries about their listings
            return Inquiry.objects.filter(listing__farmer=user)
        else:
            # Buyers see their own inquiries
            return Inquiry.objects.filter(buyer=user)
    
    def perform_create(self, serializer):
        """
        Create an inquiry and associate it with the current buyer.
        """
        serializer.save(buyer=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def buyer(self, request):
        """
        Get all inquiries sent by the current buyer.
        """
        if not request.user.is_buyer():
            return Response(
                {'error': 'Only buyers can view their inquiries'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        inquiries = Inquiry.objects.filter(buyer=request.user)
        serializer = InquirySerializer(inquiries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def farmer(self, request):
        """
        Get all inquiries for listings created by the current farmer.
        """
        if not request.user.is_farmer():
            return Response(
                {'error': 'Only farmers can view inquiries about their listings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        inquiries = Inquiry.objects.filter(listing__farmer=request.user)
        serializer = InquirySerializer(inquiries, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def mark_responded(self, request, pk=None):
        """
        Mark an inquiry as responded (for farmers).
        """
        inquiry = self.get_object()
        
        if inquiry.listing.farmer != request.user:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        inquiry.status = 'RESPONDED'
        inquiry.save()
        return Response(
            InquirySerializer(inquiry).data,
            status=status.HTTP_200_OK
        )
