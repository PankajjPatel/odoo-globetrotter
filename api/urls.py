from django.urls import path
from .views import (
    SignupView,
    LoginView,
    LogoutView,
    ForgotPasswordView,
    CurrentUserView,
    ProfileUpdateView,
    SavedDestinationsView,
    SavedDestinationDetailView,
    DeleteAccountView,
    AdminStatsView,
    AdminNotificationsListView,
    AdminUserListView,
    AdminUserToggleStatusView,
    AdminUserToggleRoleView,
    AdminUserDeleteView,
)

urlpatterns = [
    # Auth & Profile
    path('auth/signup/', SignupView.as_view(), name='api-signup'),
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/logout/', LogoutView.as_view(), name='api-logout'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='api-forgot-password'),
    path('auth/me/', CurrentUserView.as_view(), name='api-me'),
    path('auth/profile/', ProfileUpdateView.as_view(), name='api-profile-update'),
    path('auth/delete-account/', DeleteAccountView.as_view(), name='api-delete-account'),

    # Saved Destinations
    path('saved-destinations/', SavedDestinationsView.as_view(), name='api-saved-destinations'),
    path('saved-destinations/<int:city_id>/', SavedDestinationDetailView.as_view(), name='api-saved-destination-detail'),

    # Admin Management & Live Notifications
    path('admin/stats/', AdminStatsView.as_view(), name='api-admin-stats'),
    path('admin/notifications/', AdminNotificationsListView.as_view(), name='api-admin-notifications'),
    path('admin/users/', AdminUserListView.as_view(), name='api-admin-users'),
    path('admin/users/<int:user_id>/toggle-status/', AdminUserToggleStatusView.as_view(), name='api-admin-toggle-status'),
    path('admin/users/<int:user_id>/toggle-role/', AdminUserToggleRoleView.as_view(), name='api-admin-toggle-role'),
    path('admin/users/<int:user_id>/', AdminUserDeleteView.as_view(), name='api-admin-delete-user'),
]


