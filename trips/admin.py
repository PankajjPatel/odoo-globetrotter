from django.contrib import admin
from .models import Trip, Stop, TripActivity

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'start_date', 'end_date', 'is_public', 'created_at')
    search_fields = ('name', 'user__username', 'user__email')
    list_filter = ('is_public', 'created_at', 'start_date')

@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ('trip', 'city', 'arrival_date', 'departure_date')
    list_filter = ('city',)

@admin.register(TripActivity)
class TripActivityAdmin(admin.ModelAdmin):
    list_display = ('trip', 'activity')
