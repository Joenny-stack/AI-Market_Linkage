"""
Views for farmer profiles.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import FarmerProfile
from .serializers import FarmerProfileSerializer, FarmerProfileUpdateSerializer


class FarmerProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing farmer profiles.
    """
    queryset = FarmerProfile.objects.all()
    serializer_class = FarmerProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter profiles based on user role."""
        if self.request.user.is_farmer():
            return FarmerProfile.objects.filter(user=self.request.user)
        return FarmerProfile.objects.all()
    
    def perform_create(self, serializer):
        """Create a farmer profile for the current user."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get or update current user's farmer profile."""
        try:
            profile = FarmerProfile.objects.get(user=request.user)
            if request.method == 'GET':
                serializer = FarmerProfileSerializer(profile)
                return Response(serializer.data)
            
            elif request.method == 'PUT':
                serializer = FarmerProfileUpdateSerializer(profile, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(FarmerProfileSerializer(profile).data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except FarmerProfile.DoesNotExist:
            if request.method == 'GET':
                return Response(
                    {'error': 'Farmer profile not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            elif request.method == 'PUT':
                serializer = FarmerProfileUpdateSerializer(data=request.data)
                if serializer.is_valid():
                    profile = serializer.save(user=request.user)
                    return Response(FarmerProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
