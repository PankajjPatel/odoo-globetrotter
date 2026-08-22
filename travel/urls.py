from django.urls import path
from .search_views import CitySearchView

urlpatterns = [
    path('cities/', CitySearchView.as_view(), name='city-search'),
]
