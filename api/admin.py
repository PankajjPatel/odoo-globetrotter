from django.contrib import admin
from .models import City, Trip, Stop, Activity

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'created_at')
    search_fields = ('name', 'country')

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'start_date', 'end_date', 'status', 'budget')
    list_filter = ('status', 'start_date')
    search_fields = ('title', 'user__username')

@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ('trip', 'city', 'order', 'arrival_date', 'departure_date')
    list_filter = ('city',)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'stop', 'category', 'cost', 'is_completed')
    list_filter = ('category', 'is_completed')

