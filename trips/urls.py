from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TripViewSet

router = DefaultRouter()
router.register(r"trips", TripViewSet, basename="trip")

urlpatterns = []
urlpatterns += router.urls
