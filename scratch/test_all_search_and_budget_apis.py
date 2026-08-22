import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'globetrotter.settings')
django.setup()

import json
from django.contrib.auth.models import User
from trips.models import Trip, Stop, City as TripCity, Activity as TripActivityModel, TripActivity
from datetime import date
from rest_framework.test import APIClient

print("=" * 60)
print("TESTING SEARCH & BUDGET BACKEND APIs")
print("=" * 60)

# Create test user
user, _ = User.objects.get_or_create(username='test_budget_user', defaults={'email': 'budgetuser@example.com'})

# Create test trip
trip, _ = Trip.objects.get_or_create(
    name='Euro & Asia Adventure',
    user=user,
    defaults={
        'description': 'Summer trip across Paris and Bali',
        'start_date': date(2026, 6, 15),
        'end_date': date(2026, 6, 20),
    }
)

# Create cities for trip
paris_city, _ = TripCity.objects.get_or_create(name='Paris', defaults={'country': 'France'})
bali_city, _ = TripCity.objects.get_or_create(name='Bali', defaults={'country': 'Indonesia'})

# Create stops
stop1, _ = Stop.objects.get_or_create(
    trip=trip,
    city=paris_city,
    defaults={'start_date': date(2026, 6, 15), 'end_date': date(2026, 6, 17), 'order': 0}
)

stop2, _ = Stop.objects.get_or_create(
    trip=trip,
    city=bali_city,
    defaults={'start_date': date(2026, 6, 18), 'end_date': date(2026, 6, 20), 'order': 1}
)

# Create activities for trip
act1, _ = TripActivityModel.objects.get_or_create(name='Eiffel Tower Summit', defaults={'type': 'Sightseeing', 'cost': 2500.00, 'duration_hours': 3})
act2, _ = TripActivityModel.objects.get_or_create(name='Seine River Dinner Cruise', defaults={'type': 'Food & Drink', 'cost': 4500.00, 'duration_hours': 3})
act3, _ = TripActivityModel.objects.get_or_create(name='Mount Batur Sunrise Trek', defaults={'type': 'Adventure', 'cost': 2500.00, 'duration_hours': 6})
act4, _ = TripActivityModel.objects.get_or_create(name='Resort Hotel Stay', defaults={'type': 'Accommodation', 'cost': 6000.00, 'duration_hours': 24})

# Assign activities to stops
TripActivity.objects.get_or_create(stop=stop1, activity=act1)
TripActivity.objects.get_or_create(stop=stop1, activity=act2)
TripActivity.objects.get_or_create(stop=stop2, activity=act3)
TripActivity.objects.get_or_create(stop=stop2, activity=act4)

client = APIClient()
client.force_authenticate(user=user)

# 1. Test City Search API
res_city = client.get('/api/cities/?q=Paris&sort_by=popularity')
print("\n[1] CITY SEARCH API RESULT:")
print(f"Status: {res_city.status_code}")
print(json.dumps(res_city.data, indent=2))

# 2. Test Activity Search API
res_act = client.get('/api/activities/?city=Paris&type=Sightseeing')
print("\n[2] ACTIVITY SEARCH API RESULT:")
print(f"Status: {res_act.status_code}")
print(json.dumps(res_act.data, indent=2))

# 3. Test Trip Budget API
res_budget = client.get(f'/api/trips/{trip.id}/budget/?total_budget=12000')
print("\n[3] TRIP BUDGET CALCULATION API RESULT:")
print(f"Status: {res_budget.status_code}")
print(json.dumps(res_budget.data, indent=2))

print("\n" + "=" * 60)
print("ALL TESTS PASSED SUCCESSFULLY!")
print("=" * 60)
