from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


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
        response = self.client.post(reverse('register-register'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ListingTestCase(APITestCase):
    """Test listing creation and retrieval."""

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
