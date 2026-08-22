from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from datetime import date, timedelta
from trips.serializers import TripListSerializer, TripCreateUpdateSerializer, TripDetailSerializer
from trips.models import Trip, City, Stop


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

    def test_trip_detail_serializer_fields(self):
        trip = Trip.objects.create(
            user=self.user,
            name="Test Trip Detail",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=5),
            is_public=True
        )
        serializer = TripDetailSerializer(instance=trip)
        expected_fields = {
            'id', 'name', 'description', 'start_date', 'end_date', 'cover_photo', 'is_public', 'share_uuid'
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


class TripAPIViewSetTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", password="password1")
        self.user2 = User.objects.create_user(username="user2", password="password2")
        self.trip1 = Trip.objects.create(
            user=self.user1,
            name="User 1 Trip",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=2),
            is_public=False
        )
        self.trip2 = Trip.objects.create(
            user=self.user2,
            name="User 2 Trip",
            start_date=date.today(),
            end_date=date.today() + timedelta(days=3),
            is_public=True
        )
        self.city1 = City.objects.create(name="Paris", country="France")

    def test_retrieve_own_trip(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('trip-detail', kwargs={'pk': self.trip1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_fields = {
            'id', 'name', 'description', 'start_date', 'end_date', 'cover_photo', 'is_public', 'share_uuid'
        }
        self.assertEqual(set(response.data.keys()), expected_fields)

    def test_retrieve_other_user_trip_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('trip-detail', kwargs={'pk': self.trip2.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_own_trip(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('trip-detail', kwargs={'pk': self.trip1.pk})
        data = {
            'name': "Updated User 1 Trip",
            'start_date': date.today(),
            'end_date': date.today() + timedelta(days=5),
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.trip1.refresh_from_db()
        self.assertEqual(self.trip1.name, "Updated User 1 Trip")

    def test_update_other_user_trip_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('trip-detail', kwargs={'pk': self.trip2.pk})
        data = {
            'name': "Hack Attempt",
            'start_date': date.today(),
            'end_date': date.today() + timedelta(days=5),
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_own_trip(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('trip-detail', kwargs={'pk': self.trip1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Trip.objects.filter(pk=self.trip1.pk).exists())

    def test_delete_other_user_trip_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('trip-detail', kwargs={'pk': self.trip2.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Trip.objects.filter(pk=self.trip2.pk).exists())

    def test_add_stop_success(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('add-stop', kwargs={'trip_id': self.trip1.id})
        data = {
            'city': self.city1.id,
            'start_date': date.today().strftime('%Y-%m-%d'),
            'end_date': (date.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['order'], 0)
        self.assertEqual(response.data['city'], self.city1.id)
        self.assertEqual(response.data['city_detail']['name'], "Paris")
        self.assertEqual(response.data['city_detail']['country'], "France")

        data2 = {
            'city': self.city1.id,
            'start_date': (date.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
            'end_date': (date.today() + timedelta(days=2)).strftime('%Y-%m-%d'),
        }
        response2 = self.client.post(url, data2)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.data['order'], 1)

    def test_add_stop_other_user_trip_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('add-stop', kwargs={'trip_id': self.trip2.id})
        data = {
            'city': self.city1.id,
            'start_date': date.today().strftime('%Y-%m-%d'),
            'end_date': (date.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_reorder_stops_success(self):
        self.client.force_authenticate(user=self.user1)
        stop1 = Stop.objects.create(
            trip=self.trip1,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        stop2 = Stop.objects.create(
            trip=self.trip1,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=1
        )
        url = reverse('reorder-stops', kwargs={'trip_id': self.trip1.id})
        data = {
            'order': [stop2.id, stop1.id]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        stop1.refresh_from_db()
        stop2.refresh_from_db()
        self.assertEqual(stop1.order, 1)
        self.assertEqual(stop2.order, 0)

    def test_reorder_stops_other_user_trip_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('reorder-stops', kwargs={'trip_id': self.trip2.id})
        data = {
            'order': []
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_stop_success(self):
        self.client.force_authenticate(user=self.user1)
        stop = Stop.objects.create(
            trip=self.trip1,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        url = reverse('delete-stop', kwargs={'stop_id': stop.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Stop.objects.filter(id=stop.id).exists())

    def test_delete_stop_other_user_stop_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        stop = Stop.objects.create(
            trip=self.trip2,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        url = reverse('delete-stop', kwargs={'stop_id': stop.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Stop.objects.filter(id=stop.id).exists())

