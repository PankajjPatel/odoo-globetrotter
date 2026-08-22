from django.urls import path
from .search_views import CitySearchView, ActivitySearchView

urlpatterns = [
    path('cities/', CitySearchView.as_view(), name='city-search'),
    path('activities/', ActivitySearchView.as_view(), name='activity-search'),
]

