from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Trip, Stop, TripActivity
from .serializers import TripListSerializer, TripCreateUpdateSerializer, TripDetailSerializer, StopSerializer


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


class AddStopView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, trip_id):
        trip = get_object_or_404(Trip, id=trip_id, user=request.user)
        data = request.data.copy()
        data['trip'] = trip.id
        data['order'] = trip.stops.count()

        serializer = StopSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReorderStopsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, trip_id):
        trip = get_object_or_404(Trip, id=trip_id, user=request.user)
        order_list = request.data.get('order', [])

        stops_dict = {stop.id: stop for stop in trip.stops.all()}

        for index, stop_id in enumerate(order_list):
            if stop_id in stops_dict:
                stop = stops_dict[stop_id]
                stop.order = index
                stop.save(update_fields=["order"])

        return Response({"message": "Stops reordered"}, status=status.HTTP_200_OK)


class DeleteStopView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, stop_id):
        stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
        stop.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


