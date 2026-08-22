from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Trip, Stop, TripActivity
from .serializers import TripListSerializer, TripCreateUpdateSerializer, TripDetailSerializer


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return TripListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return TripCreateUpdateSerializer
        return TripDetailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
