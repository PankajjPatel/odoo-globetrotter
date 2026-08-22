from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_photo = models.CharField(max_length=255, blank=True, default='')
    language_preference = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class AdminNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_notifications')
    notification_type = models.CharField(max_length=50, default='USER_SIGNUP')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Admin Notifications"
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification: {self.message[:40]}"


@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
        # Create instant Admin Notification for new signups
        full_name = f"{instance.first_name} {instance.last_name}".strip() or instance.username
        joined_time = instance.date_joined.strftime('%b %d, %Y at %H:%M')
        msg = f"New Traveler Registered: {full_name} (@{instance.username}) joined with email {instance.email} on {joined_time}."
        AdminNotification.objects.create(
            user=instance,
            notification_type='USER_SIGNUP',
            message=msg
        )
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
        else:
            UserProfile.objects.get_or_create(user=instance)



class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100, default='India')
    region = models.CharField(max_length=100, blank=True, default='')
    cost_index = models.CharField(max_length=20, blank=True, default='$$')
    popularity = models.CharField(max_length=50, blank=True, default='High')
    description = models.TextField(blank=True, default='')
    image = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Cities"
        ordering = ['name']

    def __str__(self):
        return f"{self.name}, {self.country}"

    @property
    def costIndex(self):
        return self.cost_index

    @property
    def image_url(self):
        return self.image


class Activity(models.Model):
    name = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=100, blank=True, default='Sightseeing')
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration = models.CharField(max_length=50, blank=True, default='2 hours')
    description = models.TextField(blank=True, default='')
    image = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Activities"
        ordering = ['name']
        unique_together = ('name', 'city')

    def __str__(self):
        return f"{self.name} ({self.city.name})"

    @property
    def category(self):
        return self.type

    @property
    def image_url(self):
        return self.image


class SavedDestination(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_destinations')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Saved Destinations"
        unique_together = ('user', 'city')
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.username} - {self.city.name}"

