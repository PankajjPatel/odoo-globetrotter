from django.contrib import admin
from .models import City, Activity, UserProfile, SavedDestination


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'language_preference', 'profile_photo', 'created_at')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    list_filter = ('language_preference', 'created_at')


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'region', 'cost_index', 'popularity')
    search_fields = ('name', 'country', 'region')
    list_filter = ('country', 'region', 'cost_index', 'popularity')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'type', 'cost', 'duration')
    search_fields = ('name', 'city__name', 'type')
    list_filter = ('type', 'city')


@admin.register(SavedDestination)
class SavedDestinationAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'saved_at')
    search_fields = ('user__username', 'city__name')
    list_filter = ('saved_at',)

