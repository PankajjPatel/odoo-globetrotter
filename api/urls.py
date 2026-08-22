from django.urls import path
from .views import (
    SignupView,
    LoginView,
    LogoutView,
    ForgotPasswordView,
    CurrentUserView
)

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='api-signup'),
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/logout/', LogoutView.as_view(), name='api-logout'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='api-forgot-password'),
    path('auth/me/', CurrentUserView.as_view(), name='api-me'),
]
