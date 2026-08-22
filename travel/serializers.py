from rest_framework import serializers
from .models import City


class CitySerializer(serializers.ModelSerializer):
    costIndex = serializers.CharField(source='cost_index', read_only=True)
    image_url = serializers.CharField(source='image', read_only=True)

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
            'created_at',
            'updated_at'
        ]
