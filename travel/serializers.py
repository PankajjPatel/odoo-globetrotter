from rest_framework import serializers
from .models import City, Activity


class ActivitySerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    city_country = serializers.CharField(source='city.country', read_only=True)
    category = serializers.CharField(source='type', read_only=True)
    image_url = serializers.CharField(source='image', read_only=True)

    class Meta:
        model = Activity
        fields = [
            'id',
            'name',
            'city',
            'city_name',
            'city_country',
            'type',
            'category',
            'cost',
            'duration',
            'description',
            'image',
            'image_url',
            'created_at',
            'updated_at'
        ]


class CitySerializer(serializers.ModelSerializer):
    costIndex = serializers.CharField(source='cost_index', read_only=True)
    image_url = serializers.CharField(source='image', read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)

    class Meta:
        model = City
        fields = [
            'id',
            'name',
            'country',
            'region',
            'cost_index',
            'costIndex',
            'popularity',
            'description',
            'image',
            'image_url',
            'activities',
            'created_at',
            'updated_at'
        ]
