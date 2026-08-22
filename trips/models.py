import uuid
from django.db import models
from django.contrib.auth.models import User


class City(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}, {self.country}"


class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_trips")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    cover_photo = models.ImageField(upload_to="covers/", blank=True, null=True)
    share_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Stop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="stops")
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    order = models.PositiveIntegerField()


class Activity(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, default="Sightseeing")
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration_hours = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.name


class TripActivity(models.Model):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name="trip_activities")
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name="trip_activities")
    scheduled_time = models.TimeField(null=True, blank=True)
    cost_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

