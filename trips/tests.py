from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from datetime import date, timedelta
from trips.serializers import TripListSerializer, TripCreateUpdateSerializer
from trips.models import Trip


class TripSerializerTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")

    def test_trip_list_serializer_fields(self):
        trip = Trip.objects.create(
            user=self.user,
            name="Test Trip",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=5),
            is_public=True
        )
        serializer = TripListSerializer(instance=trip)
        expected_fields = {
            'id', 'name', 'start_date', 'end_date', 'cover_photo', 'is_public', 'created_at'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_trip_create_update_serializer_valid_dates(self):
        data = {
            'name': "New Trip",
            'start_date': date.today(),
            'end_date': date.today() + timedelta(days=5),
            'is_public': False,
        }
        serializer = TripCreateUpdateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_trip_create_update_serializer_invalid_dates(self):
        data = {
            'name': "New Trip",
            'start_date': date.today(),
            'end_date': date.today() - timedelta(days=1),
            'is_public': False,
        }
        serializer = TripCreateUpdateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
