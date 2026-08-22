from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TripViewSet, AddStopView

router = DefaultRouter()
router.register(r"trips", TripViewSet, basename="trip")

urlpatterns = [
    path("trips/<int:trip_id>/add-stop/", AddStopView.as_view(), name="add-stop"),
]
urlpatterns += router.urls
