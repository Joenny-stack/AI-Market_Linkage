"""
URL routing for farmers app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmerProfileViewSet

router = DefaultRouter()
router.register(r'', FarmerProfileViewSet, basename='farmer-profile')

urlpatterns = [
    path('', include(router.urls)),
]
