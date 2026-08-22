from django.contrib import admin
from .models import City, Activity


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
