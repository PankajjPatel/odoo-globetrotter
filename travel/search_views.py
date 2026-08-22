from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import City
from .serializers import CitySerializer


class CitySearchView(APIView):
    """
    City Search API View
    GET /api/cities/
    
    Query Parameters:
      - search: filter by city name, country, or region (case-insensitive, partial match)
      - country: filter by country name (case-insensitive)
      - region: filter by region name (case-insensitive)
    """

    def get(self, request, *args, **kwargs):
        try:
            queryset = City.objects.all()

            # Name / General search filter
            search_query = request.query_params.get('search', '').strip()
            if search_query:
                queryset = queryset.filter(
                    Q(name__icontains=search_query) |
                    Q(country__icontains=search_query) |
                    Q(region__icontains=search_query)
                )

            # Country filter
            country_filter = request.query_params.get('country', '').strip()
            if country_filter:
                queryset = queryset.filter(country__icontains=country_filter)

            # Region filter
            region_filter = request.query_params.get('region', '').strip()
            if region_filter:
                queryset = queryset.filter(region__icontains=region_filter)

            serializer = CitySerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle error gracefully according to project conventions
            return Response([], status=status.HTTP_200_OK)
