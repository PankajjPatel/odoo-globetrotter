from django.db import models
from django.contrib.auth.models import User

class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Cities"

    def __str__(self):
        return f"{self.name}, {self.country}"


class Trip(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    cover_image = models.CharField(max_length=100, default='bg-paris')
    status = models.CharField(max_length=50, default='Upcoming')  # Upcoming, Ongoing, Past
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"


class Stop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='stops')
    order = models.IntegerField(default=1)
    arrival_date = models.DateField(blank=True, null=True)
    departure_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Stop #{self.order}: {self.city.name} - {self.trip.title}"


class Activity(models.Model):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    time = models.CharField(max_length=50, blank=True, null=True)
    cost = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    category = models.CharField(max_length=50, default='Sightseeing')
    is_completed = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.title} ({self.stop.city.name})"

