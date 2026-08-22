from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Trip, Stop, TripActivity
from .serializers import TripListSerializer, TripCreateUpdateSerializer, TripDetailSerializer, StopSerializer, TripActivitySerializer


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


class AssignActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, stop_id):
        stop = get_object_or_404(Stop, id=stop_id, trip__user=request.user)
        data = request.data.copy()
        data['stop'] = stop.id

        serializer = TripActivitySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, stop_id):
        trip_activity_id = request.query_params.get('trip_activity_id')
        trip_activity = get_object_or_404(
            TripActivity,
            id=trip_activity_id,
            stop_id=stop_id,
            stop__trip__user=request.user
        )
        trip_activity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ItineraryDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id):
        trip = get_object_or_404(Trip, id=trip_id, user=request.user)
        serializer = TripDetailSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ShareTripView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id):
        trip = get_object_or_404(Trip, id=trip_id, user=request.user)
        return Response({
            "share_uuid": trip.share_uuid,
            "is_public": trip.is_public
        }, status=status.HTTP_200_OK)

    def post(self, request, trip_id):
        trip = get_object_or_404(Trip, id=trip_id, user=request.user)
        is_public = request.data.get('is_public')
        if is_public is not None:
            trip.is_public = bool(is_public)
            trip.save(update_fields=['is_public'])
        return Response({
            "share_uuid": trip.share_uuid,
            "is_public": trip.is_public
        }, status=status.HTTP_200_OK)


class SharedTripDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, share_uuid):
        trip = get_object_or_404(Trip, share_uuid=share_uuid)
        serializer = TripDetailSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CopySharedTripView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, share_uuid):
        original_trip = get_object_or_404(Trip, share_uuid=share_uuid)

        new_trip = Trip.objects.create(
            user=request.user,
            name=original_trip.name,
            description=original_trip.description,
            start_date=original_trip.start_date,
            end_date=original_trip.end_date,
            cover_photo=original_trip.cover_photo,
            is_public=False
        )

        for stop in original_trip.stops.all():
            new_stop = Stop.objects.create(
                trip=new_trip,
                city=stop.city,
                start_date=stop.start_date,
                end_date=stop.end_date,
                order=stop.order
            )
            for trip_activity in stop.trip_activities.all():
                TripActivity.objects.create(
                    stop=new_stop,
                    activity=trip_activity.activity,
                    scheduled_time=trip_activity.scheduled_time,
                    cost_override=trip_activity.cost_override
                )

        serializer = TripDetailSerializer(new_trip)
        return Response(serializer.data, status=status.HTTP_201_CREATED)





