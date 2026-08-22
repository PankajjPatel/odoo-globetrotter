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

    def __str__(self):
        return self.name


class TripActivity(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
