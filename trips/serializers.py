from rest_framework import serializers
from .models import Trip, Stop, City, Activity, TripActivity


class TripListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id',
            'name',
            'start_date',
            'end_date',
            'cover_photo',
            'is_public',
            'created_at',
        ]


class TripCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'cover_photo',
            'is_public',
        ]

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if self.instance:
            if start_date is None:
                start_date = self.instance.start_date
            if end_date is None:
                end_date = self.instance.end_date

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                "End date must be greater than or equal to start date."
            )

        return attrs


# TripDetailSerializer moved to the end of the file to prevent NameError on StopSerializer


class CityMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'country']


class ActivityMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name', 'type', 'cost', 'duration_hours']


class TripActivitySerializer(serializers.ModelSerializer):
    activity_detail = ActivityMiniSerializer(source="activity", read_only=True)

    class Meta:
        model = TripActivity
        fields = [
            'id',
            'stop',
            'activity',
            'activity_detail',
            'scheduled_time',
            'cost_override',
        ]
        extra_kwargs = {
            'stop': {'write_only': True}
        }


class StopSerializer(serializers.ModelSerializer):
    city_detail = CityMiniSerializer(source="city", read_only=True)
    activities = TripActivitySerializer(source="trip_activities", many=True, read_only=True)

    class Meta:
        model = Stop
        fields = [
            'id',
            'trip',
            'city',
            'city_detail',
            'start_date',
            'end_date',
            'order',
            'activities',
        ]
        extra_kwargs = {
            'trip': {'write_only': True}
        }

    def validate(self, attrs):
        trip = attrs.get('trip')
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if self.instance:
            if not trip:
                trip = self.instance.trip
            if not start_date:
                start_date = self.instance.start_date
            if not end_date:
                end_date = self.instance.end_date

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError("Stop end date must be greater than or equal to start date.")

        if trip:
            if start_date and start_date < trip.start_date:
                raise serializers.ValidationError("Stop start date must be within the trip dates.")
            if end_date and end_date > trip.end_date:
                raise serializers.ValidationError("Stop end date must be within the trip dates.")

        return attrs



class TripDetailSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = [
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'cover_photo',
            'is_public',
            'share_uuid',
            'stops',
        ]
