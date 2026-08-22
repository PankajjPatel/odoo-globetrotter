from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from travel.models import UserProfile, SavedDestination, City
import re

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    language_preference = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'profile_photo', 'language_preference', 'is_staff', 'is_superuser', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined', 'full_name', 'is_staff', 'is_superuser']

    def get_full_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name if name else obj.username

    def get_profile_photo(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.profile_photo or ''
        return ''

    def get_language_preference(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.language_preference or 'en'
        return 'en'


class SavedDestinationSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    country = serializers.CharField(source='city.country', read_only=True)
    cost_index = serializers.CharField(source='city.cost_index', read_only=True)
    popularity = serializers.CharField(source='city.popularity', read_only=True)
    image = serializers.CharField(source='city.image', read_only=True)

    class Meta:
        model = SavedDestination
        fields = ['id', 'city', 'city_name', 'country', 'cost_index', 'popularity', 'image', 'saved_at']



class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=True, trim_whitespace=True)
    email = serializers.EmailField(required=True, trim_whitespace=True)
    password = serializers.CharField(write_only=True, min_length=6, required=True)
    confirm_password = serializers.CharField(write_only=True, min_length=6, required=True)

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip()

    def validate_email(self, value):
        email = value.strip().lower()
        # Regex validation for well-formed email
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            raise serializers.ValidationError("Please provide a valid email address.")
        
        # Check duplicate email
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return email

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        if len(password) < 6:
            raise serializers.ValidationError({"password": "Password must be at least 6 characters long."})

        return attrs

    def create(self, validated_data):
        name = validated_data['name']
        email = validated_data['email']
        password = validated_data['password']

        # Generate unique username from email
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while User.objects.filter(username__iexact=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        name_parts = name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True, trim_whitespace=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        identifier = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        if not identifier or not password:
            raise serializers.ValidationError("Both email/username and password are required.")

        # Try to find user by email (case-insensitive) or username
        user = None
        user_by_email = User.objects.filter(email__iexact=identifier).first()
        if user_by_email:
            user = authenticate(username=user_by_email.username, password=password)
        else:
            user = authenticate(username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email/username or password. Please try again.")

        if not user.is_active:
            raise serializers.ValidationError("This user account is currently disabled.")

        attrs['user'] = user
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, trim_whitespace=True)
    new_password = serializers.CharField(write_only=True, min_length=6, required=True)
    confirm_password = serializers.CharField(write_only=True, min_length=6, required=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if not User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("No account found with this email address.")
        return email

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        if len(new_password) < 6:
            raise serializers.ValidationError({"new_password": "Password must be at least 6 characters long."})

        return attrs

    def save(self):
        email = self.validated_data['email']
        new_password = self.validated_data['new_password']
        user = User.objects.filter(email__iexact=email).first()
        if user:
            user.set_password(new_password)
            user.save()
            return user
        return None
