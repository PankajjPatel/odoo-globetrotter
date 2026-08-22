from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from datetime import date, timedelta
from trips.serializers import TripListSerializer, TripCreateUpdateSerializer, TripDetailSerializer
from trips.models import Trip, City, Stop, Activity, TripActivity


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
            'id', 'name', 'description', 'start_date', 'end_date', 'cover_photo', 'is_public', 'share_uuid', 'stops'
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
        self.activity1 = Activity.objects.create(
            name="Eiffel Tower Tour",
            type="Sightseeing",
            cost=15.00,
            duration_hours=2
        )

    def test_retrieve_own_trip(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('trip-detail', kwargs={'pk': self.trip1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_fields = {
            'id', 'name', 'description', 'start_date', 'end_date', 'cover_photo', 'is_public', 'share_uuid', 'stops'
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

    def test_assign_activity_success(self):
        self.client.force_authenticate(user=self.user1)
        stop = Stop.objects.create(
            trip=self.trip1,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        url = reverse('assign-activity', kwargs={'stop_id': stop.id})
        data = {
            'activity': self.activity1.id,
            'scheduled_time': '10:00:00',
            'cost_override': '12.50'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['activity'], self.activity1.id)
        self.assertEqual(response.data['cost_override'], '12.50')
        self.assertEqual(response.data['activity_detail']['name'], "Eiffel Tower Tour")
        self.assertEqual(response.data['activity_detail']['type'], "Sightseeing")

    def test_assign_activity_other_user_stop_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        stop = Stop.objects.create(
            trip=self.trip2,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        url = reverse('assign-activity', kwargs={'stop_id': stop.id})
        data = {
            'activity': self.activity1.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_assigned_activity_success(self):
        self.client.force_authenticate(user=self.user1)
        stop = Stop.objects.create(
            trip=self.trip1,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        trip_activity = TripActivity.objects.create(
            stop=stop,
            activity=self.activity1,
            cost_override=10.00
        )
        url = reverse('assign-activity', kwargs={'stop_id': stop.id}) + f"?trip_activity_id={trip_activity.id}"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TripActivity.objects.filter(id=trip_activity.id).exists())

    def test_delete_assigned_activity_other_user_stop_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        stop = Stop.objects.create(
            trip=self.trip2,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        trip_activity = TripActivity.objects.create(
            stop=stop,
            activity=self.activity1,
            cost_override=10.00
        )
        url = reverse('assign-activity', kwargs={'stop_id': stop.id}) + f"?trip_activity_id={trip_activity.id}"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(TripActivity.objects.filter(id=trip_activity.id).exists())

    def test_itinerary_detail_success(self):
        self.client.force_authenticate(user=self.user1)
        stop = Stop.objects.create(
            trip=self.trip1,
            city=self.city1,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=1),
            order=0
        )
        trip_activity = TripActivity.objects.create(
            stop=stop,
            activity=self.activity1,
            cost_override=12.50
        )
        url = reverse('itinerary-detail', kwargs={'trip_id': self.trip1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.trip1.id)
        self.assertEqual(response.data['name'], self.trip1.name)
        self.assertEqual(len(response.data['stops']), 1)
        self.assertEqual(response.data['stops'][0]['id'], stop.id)
        self.assertEqual(response.data['stops'][0]['city_detail']['name'], "Paris")
        self.assertEqual(len(response.data['stops'][0]['activities']), 1)
        self.assertEqual(response.data['stops'][0]['activities'][0]['activity_detail']['name'], "Eiffel Tower Tour")

    def test_itinerary_detail_other_user_trip_returns_404(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('itinerary-detail', kwargs={'trip_id': self.trip2.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_stop_date_range_validation(self):
        self.client.force_authenticate(user=self.user1)
        
        # Test 1: Start date before trip start date
        url = reverse('add-stop', kwargs={'trip_id': self.trip1.id})
        data = {
            'city': self.city1.id,
            'start_date': str(self.trip1.start_date - timedelta(days=1)),
            'end_date': str(self.trip1.end_date)
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Stop start date must be within the trip dates.", str(response.data))

        # Test 2: End date after trip end date
        data = {
            'city': self.city1.id,
            'start_date': str(self.trip1.start_date),
            'end_date': str(self.trip1.end_date + timedelta(days=1))
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Stop end date must be within the trip dates.", str(response.data))

        # Test 3: End date before start date
        data = {
            'city': self.city1.id,
            'start_date': str(self.trip1.start_date + timedelta(days=2)),
            'end_date': str(self.trip1.start_date + timedelta(days=1))
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Stop end date must be greater than or equal to start date.", str(response.data))

    def test_share_trip_get_and_post(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('share-trip', kwargs={'trip_id': self.trip1.id})
        
        # Test GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('share_uuid', response.data)
        self.assertEqual(response.data['is_public'], False)

        # Test POST (Toggle to public)
        response = self.client.post(url, {'is_public': True}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_public'], True)

        self.trip1.refresh_from_db()
        self.assertEqual(self.trip1.is_public, True)

    def test_shared_trip_detail_public(self):
        # No authentication
        url = reverse('shared-trip-detail', kwargs={'share_uuid': self.trip1.share_uuid})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.trip1.id)
        self.assertEqual(response.data['name'], self.trip1.name)

    def test_copy_shared_trip(self):
        # Setup stops and activities on original trip
        stop = Stop.objects.create(
            trip=self.trip1,
            city=self.city1,
            start_date=self.trip1.start_date,
            end_date=self.trip1.start_date + timedelta(days=1),
            order=0
        )
        TripActivity.objects.create(
            stop=stop,
            activity=self.activity1,
            cost_override=15.00
        )

        # Authenticate as user2 (different user)
        self.client.force_authenticate(user=self.user2)
        url = reverse('copy-shared-trip', kwargs={'share_uuid': self.trip1.share_uuid})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_trip_id = response.data['id']
        self.assertNotEqual(new_trip_id, self.trip1.id)
        
        # Verify ownership is user2
        new_trip = Trip.objects.get(id=new_trip_id)
        self.assertEqual(new_trip.user, self.user2)
        self.assertEqual(new_trip.name, self.trip1.name)
        
        # Verify stops and activities were copied
        self.assertEqual(new_trip.stops.count(), 1)
        copied_stop = new_trip.stops.first()
        self.assertEqual(copied_stop.city, self.city1)
        self.assertEqual(copied_stop.trip_activities.count(), 1)
        copied_activity = copied_stop.trip_activities.first()
        self.assertEqual(copied_activity.activity, self.activity1)
        self.assertEqual(float(copied_activity.cost_override), 15.00)



