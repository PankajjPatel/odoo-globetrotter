from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Case, When, Value, IntegerField
from .models import City, Activity
from .serializers import CitySerializer, ActivitySerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CitySearchView(APIView):
    """
    City Search API View
    GET /api/cities/
    
    Query Parameters:
      - search / q: filter by city name, country, or region (case-insensitive)
      - country: filter by country name
      - region: filter by region name
      - sort_by / ordering: 'popularity', '-popularity', 'cost_index', '-cost_index', 'name', '-name'
      - page, page_size: pagination controls
      - paginate: set to 'false' to disable pagination and return full list
    """

    def get(self, request, *args, **kwargs):
        try:
            queryset = City.objects.all()

            # Name / General search filter (search or q)
            search_query = (request.query_params.get('search') or request.query_params.get('q') or '').strip()
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

            # Sorting logic
            sort_by = (request.query_params.get('sort_by') or request.query_params.get('ordering') or '').strip().lower()
            if sort_by in ('popularity', '-popularity'):
                popularity_order = Case(
                    When(popularity__iexact='Very High', then=Value(1)),
                    When(popularity__iexact='High', then=Value(2)),
                    When(popularity__iexact='Medium', then=Value(3)),
                    When(popularity__iexact='Low', then=Value(4)),
                    default=Value(5),
                    output_field=IntegerField()
                )
                if sort_by == '-popularity':
                    queryset = queryset.annotate(pop_rank=popularity_order).order_by('-pop_rank', 'name')
                else:
                    queryset = queryset.annotate(pop_rank=popularity_order).order_by('pop_rank', 'name')

            elif sort_by in ('cost_index', '-cost_index', 'cost', '-cost'):
                cost_order = Case(
                    When(cost_index='$', then=Value(1)),
                    When(cost_index='$$', then=Value(2)),
                    When(cost_index='$$$', then=Value(3)),
                    When(cost_index='$$$$', then=Value(4)),
                    When(cost_index='$$$$$', then=Value(5)),
                    default=Value(3),
                    output_field=IntegerField()
                )
                if sort_by in ('-cost_index', '-cost'):
                    queryset = queryset.annotate(cost_rank=cost_order).order_by('-cost_rank', 'name')
                else:
                    queryset = queryset.annotate(cost_rank=cost_order).order_by('cost_rank', 'name')

            elif sort_by == '-name':
                queryset = queryset.order_by('-name')
            elif sort_by == 'name':
                queryset = queryset.order_by('name')

            # Check if pagination is explicitly turned off
            paginate_param = request.query_params.get('paginate', 'true').strip().lower()
            if paginate_param == 'false':
                serializer = CitySerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            paginator = StandardResultsSetPagination()
            page_obj = paginator.paginate_queryset(queryset, request, view=self)
            if page_obj is not None:
                serializer = CitySerializer(page_obj, many=True)
                return paginator.get_paginated_response(serializer.data)

            serializer = CitySerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ActivitySearchView(APIView):
    """
    Activity Search API View
    GET /api/activities/
    
    Query Parameters:
      - city: filter by city ID or city name
      - type / category: filter by type (e.g. Sightseeing, Food, Adventure, History, Culture)
      - min_cost: minimum cost filter
      - max_cost: maximum cost filter
      - duration: filter by duration substring
      - search / q: general text search on name or description
      - sort_by / ordering: 'cost', '-cost', 'name', '-name'
      - page, page_size: pagination controls
      - paginate: set to 'false' to disable pagination
    """

    def get(self, request, *args, **kwargs):
        try:
            # Query optimization: select_related('city')
            queryset = Activity.objects.select_related('city').all()

            # City filter (ID or Name)
            city_param = request.query_params.get('city', '').strip()
            if city_param:
                if city_param.isdigit():
                    queryset = queryset.filter(city_id=int(city_param))
                else:
                    queryset = queryset.filter(city__name__icontains=city_param)

            # Type / Category filter
            type_param = (request.query_params.get('type') or request.query_params.get('category') or '').strip()
            if type_param:
                queryset = queryset.filter(type__icontains=type_param)

            # Min & Max cost filters
            min_cost = request.query_params.get('min_cost', '').strip()
            if min_cost:
                try:
                    queryset = queryset.filter(cost__gte=float(min_cost))
                except ValueError:
                    pass

            max_cost = request.query_params.get('max_cost', '').strip()
            if max_cost:
                try:
                    queryset = queryset.filter(cost__lte=float(max_cost))
                except ValueError:
                    pass

            # Duration filter
            duration_param = request.query_params.get('duration', '').strip()
            if duration_param:
                queryset = queryset.filter(duration__icontains=duration_param)

            # Search query (name or description)
            search_query = (request.query_params.get('search') or request.query_params.get('q') or '').strip()
            if search_query:
                queryset = queryset.filter(
                    Q(name__icontains=search_query) |
                    Q(description__icontains=search_query) |
                    Q(type__icontains=search_query)
                )

            # Sorting
            sort_by = (request.query_params.get('sort_by') or request.query_params.get('ordering') or '').strip().lower()
            if sort_by == 'cost':
                queryset = queryset.order_by('cost', 'name')
            elif sort_by == '-cost':
                queryset = queryset.order_by('-cost', 'name')
            elif sort_by == '-name':
                queryset = queryset.order_by('-name')
            elif sort_by == 'name':
                queryset = queryset.order_by('name')

            # Pagination
            paginate_param = request.query_params.get('paginate', 'true').strip().lower()
            if paginate_param == 'false':
                serializer = ActivitySerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

            paginator = StandardResultsSetPagination()
            page_obj = paginator.paginate_queryset(queryset, request, view=self)
            if page_obj is not None:
                serializer = ActivitySerializer(page_obj, many=True)
                return paginator.get_paginated_response(serializer.data)

            serializer = ActivitySerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
