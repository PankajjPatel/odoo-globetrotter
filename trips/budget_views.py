from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from .models import Trip, Stop, TripActivity


class TripBudgetView(APIView):
    """
    Trip Budget Calculation API View
    GET /api/trips/<int:trip_id>/budget/
    GET /api/budget/trip/<int:trip_id>/
    
    Query Parameters:
      - target_budget / total_budget: Optional custom budget limit (float)
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, trip_id, *args, **kwargs):
        # Query optimization using select_related and prefetch_related
        trip = get_object_or_404(
            Trip.objects.prefetch_related(
                Prefetch(
                    'stops',
                    queryset=Stop.objects.select_related('city').prefetch_related(
                        Prefetch('trip_activities', queryset=TripActivity.objects.select_related('activity'))
                    ).order_by('order')
                )
            ),
            id=trip_id
        )

        # Calculate trip duration in days
        start_date = trip.start_date
        end_date = trip.end_date
        total_days = max(1, (end_date - start_date).days + 1)

        # Build date map for daily spending breakdown
        daily_spending = {}
        for i in range(total_days):
            current_day = start_date + timedelta(days=i)
            day_str = current_day.strftime('%b %d')
            daily_spending[day_str] = 0.0

        # Category costs accumulation
        category_costs = {
            'Transport': 0.0,
            'Accommodation': 0.0,
            'Food': 0.0,
            'Activities': 0.0,
            'Sightseeing': 0.0,
            'Other': 0.0,
        }

        total_spent = 0.0
        itemized_expenses = []

        for stop in trip.stops.all():
            stop_activities = stop.trip_activities.all()

            for ta in stop_activities:
                act = ta.activity
                cost = float(ta.cost_override) if ta.cost_override is not None else float(act.cost)
                total_spent += cost

                # Determine category
                act_type = (act.type or 'Sightseeing').title()
                if any(k in act_type for k in ['Food', 'Drink', 'Meal', 'Dining']):
                    cat_key = 'Food'
                elif any(k in act_type for k in ['Stay', 'Hotel', 'Accommodat', 'Resort']):
                    cat_key = 'Accommodation'
                elif any(k in act_type for k in ['Transport', 'Flight', 'Taxi', 'Cab', 'Train', 'Car', 'Bus']):
                    cat_key = 'Transport'
                elif any(k in act_type for k in ['Sightseeing', 'View', 'Monument']):
                    cat_key = 'Sightseeing'
                elif any(k in act_type for k in ['Adventure', 'Culture', 'History', 'Shopping', 'Activity']):
                    cat_key = 'Activities'
                else:
                    cat_key = 'Other'

                category_costs[cat_key] += cost

                # Attribute cost to day
                day_index = (stop.start_date - start_date).days
                if 0 <= day_index < total_days:
                    target_day_str = (start_date + timedelta(days=day_index)).strftime('%b %d')
                    if target_day_str in daily_spending:
                        daily_spending[target_day_str] += cost

                itemized_expenses.append({
                    'id': ta.id,
                    'stop_id': stop.id,
                    'city_name': stop.city.name if stop.city else '',
                    'activity_name': act.name,
                    'category': cat_key,
                    'cost': round(cost, 2),
                    'scheduled_time': str(ta.scheduled_time) if ta.scheduled_time else None
                })

        # Calculate budget metrics
        custom_budget = request.query_params.get('total_budget') or request.query_params.get('target_budget')
        if custom_budget:
            try:
                total_budget = float(custom_budget)
            except ValueError:
                total_budget = max(5000.0, round(total_spent * 1.25, 2))
        else:
            total_budget = max(5000.0, round(total_spent * 1.25, 2)) if total_spent > 0 else 5000.0

        remaining_budget = round(total_budget - total_spent, 2)
        average_cost_per_day = round(total_spent / total_days, 2)
        daily_budget_target = round(total_budget / total_days, 2)

        # Overbudget Alert Logic
        overbudget_days = []
        is_overbudget = total_spent > total_budget

        expenses_by_day = []
        for day_str, day_spent in daily_spending.items():
            day_spent_round = round(day_spent, 2)
            day_is_high = day_spent_round > daily_budget_target
            if day_is_high:
                overbudget_days.append({
                    'day': day_str,
                    'spent': day_spent_round,
                    'daily_target': daily_budget_target,
                    'excess': round(day_spent_round - daily_budget_target, 2)
                })

            expenses_by_day.append({
                'day': day_str,
                'spent': day_spent_round,
                'budget': daily_budget_target,
                'is_overbudget': day_is_high
            })

        # Category Breakdown for PieChart
        cat_colors = {
            'Transport': '#e63946',
            'Accommodation': '#f77f00',
            'Food': '#fcbf49',
            'Activities': '#2a9d8f',
            'Sightseeing': '#003049',
            'Other': '#4a4e69'
        }

        expenses_by_category = []
        for cat_name, amt in category_costs.items():
            if amt > 0 or len(itemized_expenses) == 0:
                expenses_by_category.append({
                    'name': cat_name,
                    'value': round(amt, 2),
                    'color': cat_colors.get(cat_name, '#4a4e69')
                })

        alert_message = None
        if is_overbudget:
            alert_message = f"Warning: Total estimated cost (₹{round(total_spent, 2)}) exceeds total budget limit (₹{round(total_budget, 2)})."
        elif len(overbudget_days) > 0:
            alert_message = f"Alert: {len(overbudget_days)} day(s) exceed the average daily budget of ₹{daily_budget_target}."

        return Response({
            'trip_id': trip.id,
            'trip_name': trip.name,
            'total_days': total_days,
            'budget_summary': {
                'total_budget': round(total_budget, 2),
                'total_spent': round(total_spent, 2),
                'remaining': remaining_budget,
                'average_cost_per_day': average_cost_per_day,
                'daily_budget_target': daily_budget_target,
            },
            'overbudget_alert': {
                'is_overbudget': is_overbudget,
                'has_high_spending_days': len(overbudget_days) > 0,
                'overbudget_days_count': len(overbudget_days),
                'overbudget_days': overbudget_days,
                'message': alert_message
            },
            'expenses_by_category': expenses_by_category,
            'expenses_by_day': expenses_by_day,
            'itemized_expenses': itemized_expenses
        }, status=status.HTTP_200_OK)
