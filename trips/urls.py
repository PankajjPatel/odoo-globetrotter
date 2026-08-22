from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    TripViewSet,
    AddStopView,
    ReorderStopsView,
    DeleteStopView,
    AssignActivityView,
    ItineraryDetailView,
)

router = DefaultRouter()
router.register(r"trips", TripViewSet, basename="trip")

urlpatterns = [
    path("trips/<int:trip_id>/add-stop/", AddStopView.as_view(), name="add-stop"),
    path("trips/<int:trip_id>/reorder-stops/", ReorderStopsView.as_view(), name="reorder-stops"),
    path("stops/<int:stop_id>/", DeleteStopView.as_view(), name="delete-stop"),
    path("stops/<int:stop_id>/assign-activity/", AssignActivityView.as_view(), name="assign-activity"),
    path("trips/<int:trip_id>/itinerary/", ItineraryDetailView.as_view(), name="itinerary-detail"),
]
urlpatterns += router.urls
