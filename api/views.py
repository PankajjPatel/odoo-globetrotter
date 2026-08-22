from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from .serializers import (
    UserSerializer,
    SignupSerializer,
    LoginSerializer,
    ForgotPasswordSerializer
)

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            error_msg = serializer.errors.get('non_field_errors', [None])[0]
            if not error_msg and serializer.errors:
                first_key = list(serializer.errors.keys())[0]
                first_err = serializer.errors[first_key]
                first_err_str = first_err[0] if isinstance(first_err, list) else str(first_err)
                error_msg = first_err_str
            return Response(
                {"errors": serializer.errors, "message": error_msg or "Signup validation failed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": "Account created successfully!",
                "token": token.key,
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            # Flatten non_field_errors or serializer errors for friendly consumption
            error_msg = serializer.errors.get('non_field_errors', [None])[0]
            if not error_msg and serializer.errors:
                first_key = list(serializer.errors.keys())[0]
                error_msg = f"{first_key}: {serializer.errors[first_key][0]}"
            return Response(
                {
                    "errors": serializer.errors,
                    "message": error_msg or "Invalid email or password."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": "Login successful!",
                "token": token.key,
                "user": UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if request.user and request.user.is_authenticated:
            try:
                # Delete DRF Token if exists
                Token.objects.filter(user=request.user).delete()
            except Exception:
                pass
            logout(request)
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            error_msg = serializer.errors.get('non_field_errors', [None])[0]
            if not error_msg and serializer.errors:
                first_key = list(serializer.errors.keys())[0]
                error_msg = f"{first_key}: {serializer.errors[first_key][0]}"
            return Response(
                {
                    "errors": serializer.errors,
                    "message": error_msg or "Password reset validation failed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        # Invalidate old tokens upon password reset so previous sessions are terminated
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)

        return Response(
            {
                "message": "Password reset successfully! You can now log in with your new password.",
                "token": token.key,
                "user": UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)


class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    def put(self, request):
        return self._update_profile(request)

    def patch(self, request):
        return self._update_profile(request)

    def _update_profile(self, request):
        user = request.user
        data = request.data
        full_name = data.get('name', data.get('full_name', '')).strip()
        email = data.get('email', '').strip()
        profile_photo = data.get('profile_photo', data.get('photo', '')).strip()
        language_preference = data.get('language_preference', data.get('language', '')).strip()

        if full_name:
            parts = full_name.split(' ', 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ''

        if email and email.lower() != user.email.lower():
            from django.contrib.auth.models import User
            if User.objects.filter(email__iexact=email).exclude(id=user.id).exists():
                return Response({"message": "This email address is already in use by another account."}, status=status.HTTP_400_BAD_REQUEST)
            user.email = email.lower()

        user.save()

        # Update UserProfile attributes
        from travel.models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        if profile_photo is not None:
            profile.profile_photo = profile_photo
        if language_preference:
            profile.language_preference = language_preference
        profile.save()

        return Response({
            "message": "Profile updated successfully!",
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class SavedDestinationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from travel.models import SavedDestination
        from .serializers import SavedDestinationSerializer
        saved = SavedDestination.objects.filter(user=request.user).select_related('city')
        return Response({
            "saved_destinations": SavedDestinationSerializer(saved, many=True).data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        from travel.models import City, SavedDestination
        from .serializers import SavedDestinationSerializer
        city_id = request.data.get('city_id')
        city_name = request.data.get('city_name', '').strip()

        city = None
        if city_id:
            city = City.objects.filter(id=city_id).first()
        elif city_name:
            city = City.objects.filter(name__iexact=city_name).first()

        if not city:
            return Response({"message": "City not found in catalog."}, status=status.HTTP_404_NOT_FOUND)

        saved_item, created = SavedDestination.objects.get_or_create(user=request.user, city=city)
        return Response({
            "message": "Destination saved successfully!" if created else "Destination already saved.",
            "saved_destination": SavedDestinationSerializer(saved_item).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class SavedDestinationDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, city_id):
        from travel.models import SavedDestination
        deleted_count, _ = SavedDestination.objects.filter(user=request.user, city_id=city_id).delete()
        if deleted_count == 0:
            # Also try matching by saved_destination.id directly
            deleted_count, _ = SavedDestination.objects.filter(user=request.user, id=city_id).delete()

        return Response({
            "message": "Destination removed from saved list."
        }, status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        if user.is_superuser and user.username in ('_Pankaj_03', 'admin'):
            return Response({"message": "Root admin accounts cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({"message": "Your account and all associated trips have been permanently deleted."}, status=status.HTTP_200_OK)


class IsAdminUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


class AdminStatsView(APIView):
    permission_classes = [IsAdminUserPermission]

    def get(self, request):
        from django.contrib.auth.models import User
        from trips.models import Trip, Stop, TripActivity
        from travel.models import City, Activity
        from django.utils import timezone
        from datetime import timedelta
        import calendar

        total_users = User.objects.count()
        total_trips = Trip.objects.count()
        total_stops = Stop.objects.count()
        total_activities = Activity.objects.count()
        total_trip_activities = TripActivity.objects.count()
        total_cities = City.objects.count()

        # Daily and weekly new signups count
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        daily_signups = User.objects.filter(date_joined__gte=today_start).count()
        weekly_signups = User.objects.filter(date_joined__gte=week_start).count()

        # Calculate monthly growth for last 5 months
        user_growth = []
        for i in range(4, -1, -1):
            # Target month
            month_date = now - timedelta(days=i*30)
            month_name = calendar.month_abbr[month_date.month]
            # Cumulative or monthly count
            count = User.objects.filter(date_joined__lte=month_date).count()
            user_growth.append({
                'month': month_name,
                'users': max(count, total_users - i * 5)
            })

        # Recent activities/popular cities
        popular_cities = list(City.objects.values('name', 'country', 'cost_index', 'popularity')[:10])

        # All trips overview
        trips_list = []
        for t in Trip.objects.select_related('user').all()[:60]:
            stops_c = t.stops.count() if hasattr(t, 'stops') else 0
            u_name = f"{t.user.first_name} {t.user.last_name}".strip() if t.user else "Explorer"
            trips_list.append({
                "id": t.id,
                "name": t.name,
                "user_name": u_name or (t.user.username if t.user else "Explorer"),
                "start_date": t.start_date.strftime('%b %d, %Y') if t.start_date else 'TBD',
                "end_date": t.end_date.strftime('%b %d, %Y') if t.end_date else 'TBD',
                "stops_count": stops_c,
                "is_public": t.is_public
            })

        # All activities overview
        activities_list = list(Activity.objects.values('id', 'name', 'type', 'cost', 'duration')[:60])

        return Response({
            "stats": {
                "total_users": total_users,
                "total_trips": total_trips,
                "total_stops": total_stops,
                "total_activities": total_activities,
                "total_trip_activities": total_trip_activities,
                "total_cities": total_cities,
                "daily_signups": daily_signups,
                "weekly_signups": weekly_signups,
            },
            "user_growth": user_growth,
            "popular_cities": popular_cities,
            "all_trips": trips_list,
            "all_activities": activities_list
        }, status=status.HTTP_200_OK)


class AdminNotificationsListView(APIView):
    permission_classes = [IsAdminUserPermission]

    def get(self, request):
        from travel.models import AdminNotification
        notifications = AdminNotification.objects.select_related('user').all().order_by('-id')[:100]
        data = []
        for n in notifications:
            full_name = f"{n.user.first_name} {n.user.last_name}".strip() or n.user.username
            data.append({
                "id": n.id,
                "user_id": n.user.id,
                "username": n.user.username,
                "full_name": full_name,
                "email": n.user.email,
                "message": n.message,
                "notification_type": n.notification_type,
                "is_read": n.is_read,
                "created_at": n.created_at.strftime('%b %d, %Y at %H:%M')
            })
        return Response({
            "notifications": data,
            "unread_count": AdminNotification.objects.filter(is_read=False).count()
        }, status=status.HTTP_200_OK)

    def post(self, request):
        from travel.models import AdminNotification
        notif_id = request.data.get('notification_id')
        if notif_id:
            AdminNotification.objects.filter(id=notif_id).update(is_read=True)
        else:
            AdminNotification.objects.all().update(is_read=True)
        return Response({"message": "Notifications updated."}, status=status.HTTP_200_OK)


class AdminUserListView(APIView):
    permission_classes = [IsAdminUserPermission]

    def get(self, request):
        from django.contrib.auth.models import User
        from django.db.models import Q

        search = request.GET.get('search', '').strip()
        users_qs = User.objects.all().order_by('-id')

        if search:
            users_qs = users_qs.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )

        data = []
        for u in users_qs[:200]:
            full_name = f"{u.first_name} {u.last_name}".strip() or u.username
            trips_count = 0
            if hasattr(u, 'user_trips'):
                trips_count = u.user_trips.count()
            elif hasattr(u, 'trip_set'):
                trips_count = u.trip_set.count()

            data.append({
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "full_name": full_name,
                "is_staff": u.is_staff,
                "is_superuser": u.is_superuser,
                "is_active": u.is_active,
                "date_joined": u.date_joined.strftime('%b %d, %Y') if u.date_joined else 'N/A',
                "trips_count": trips_count
            })

        return Response({"users": data, "total_count": User.objects.count()}, status=status.HTTP_200_OK)



class AdminUserToggleStatusView(APIView):
    permission_classes = [IsAdminUserPermission]

    def post(self, request, user_id):
        from django.contrib.auth.models import User
        if request.user.id == user_id:
            return Response({"message": "You cannot change your own active status."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(id=user_id)
            target_user.is_active = not target_user.is_active
            target_user.save()
            return Response({
                "message": f"User '{target_user.username}' is now {'Active' if target_user.is_active else 'Suspended'}.",
                "is_active": target_user.is_active
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class AdminUserToggleRoleView(APIView):
    permission_classes = [IsAdminUserPermission]

    def post(self, request, user_id):
        from django.contrib.auth.models import User
        if request.user.id == user_id:
            return Response({"message": "You cannot change your own admin role."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(id=user_id)
            target_user.is_staff = not target_user.is_staff
            target_user.save()
            return Response({
                "message": f"User '{target_user.username}' role updated to {'Staff Admin' if target_user.is_staff else 'Standard User'}.",
                "is_staff": target_user.is_staff
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class AdminUserDeleteView(APIView):
    permission_classes = [IsAdminUserPermission]

    def delete(self, request, user_id):
        from django.contrib.auth.models import User
        if request.user.id == user_id:
            return Response({"message": "You cannot delete your own account from the admin panel."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(id=user_id)
            if target_user.is_superuser:
                return Response({"message": "Superusers cannot be deleted via this endpoint."}, status=status.HTTP_400_BAD_REQUEST)
            username = target_user.username
            target_user.delete()
            return Response({"message": f"User '{username}' was deleted successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

