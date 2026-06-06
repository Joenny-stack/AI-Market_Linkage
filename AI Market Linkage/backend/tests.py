from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from listings.location_utils import map_location_to_coordinates

User = get_user_model()


def make_test_image(name='produce.jpg'):
    buffer = BytesIO()
    Image.new('RGB', (96, 96), color=(180, 45, 45)).save(buffer, format='JPEG')
    return SimpleUploadedFile(name, buffer.getvalue(), content_type='image/jpeg')


class UserRegistrationTestCase(APITestCase):
    """Test user registration."""

    def test_register_farmer(self):
        data = {
            'email': 'farmer@example.com',
            'full_name': 'John Farmer',
            'phone_number': '+1234567890',
            'role': 'FARMER',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        response = self.client.post(reverse('register'), data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['role'], 'FARMER')
        self.assertTrue(User.objects.filter(email='farmer@example.com').exists())


class ListingTestCase(APITestCase):
    """Test listing retrieval and farmer listing creation."""

    def setUp(self):
        self.farmer = User.objects.create_user(
            email='farmer@example.com',
            full_name='John Farmer',
            role='FARMER',
            password='testpass123'
        )

    def test_get_listings(self):
        response = self.client.get(reverse('listing-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_farmer_can_create_listing_with_price_recommendation(self):
        self.client.force_authenticate(user=self.farmer)
        payload = {
            'crop_name': 'Maize',
            'category': 'Grain',
            'description': 'Fresh maize for sale',
            'quantity_available': '100.00',
            'unit': 'kg',
            'price_per_unit': '0.80',
            'currency': 'USD',
            'harvest_date': '2026-06-01',
            'location': 'Harare',
            'province': 'Harare',
            'district': 'Harare',
            'images': [make_test_image()],
        }

        response = self.client.post(reverse('listing-list'), payload, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['crop_name'], 'Maize')
        self.assertTrue(response.data['images'])
        self.assertIsNotNone(response.data['recommended_price'])
        self.assertIsNotNone(response.data['latitude'])
        self.assertIsNotNone(response.data['longitude'])


class PriceRecommendationTestCase(APITestCase):
    """Test the price prediction endpoint."""

    def setUp(self):
        self.buyer = User.objects.create_user(
            email='buyer@example.com',
            full_name='Jane Buyer',
            role='BUYER',
            password='testpass123'
        )

    def test_price_recommendation_returns_positive_price(self):
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(
            reverse('recommend-price'),
            {
                'crop': 'Tomatoes',
                'location': 'Harare',
                'grade': 'Grade A',
                'quantity': 50,
            },
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(response.data['recommended_price'], 0)


class LocationMappingTestCase(APITestCase):
    """Test location-to-coordinate fallback mapping."""

    def test_combined_location_maps_to_city_coordinates(self):
        self.assertEqual(map_location_to_coordinates('Gweru, Midlands'), (-19.45, 29.81))
        self.assertEqual(map_location_to_coordinates('Harare Province'), (-17.83, 31.05))
