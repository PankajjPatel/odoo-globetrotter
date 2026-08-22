from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TripViewSet, AddStopView, ReorderStopsView, DeleteStopView

router = DefaultRouter()
router.register(r"trips", TripViewSet, basename="trip")

urlpatterns = [
    path("trips/<int:trip_id>/add-stop/", AddStopView.as_view(), name="add-stop"),
    path("trips/<int:trip_id>/reorder-stops/", ReorderStopsView.as_view(), name="reorder-stops"),
    path("stops/<int:stop_id>/", DeleteStopView.as_view(), name="delete-stop"),
]
urlpatterns += router.urls
