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
            return Response(
                {"errors": serializer.errors, "message": "Signup validation failed."},
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
