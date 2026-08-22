from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AuthAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = '/api/auth/signup/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'
        self.forgot_url = '/api/auth/forgot-password/'
        self.me_url = '/api/auth/me/'

    def test_signup_success(self):
        data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['email'], 'jane@example.com')
        self.assertEqual(response.data['user']['full_name'], 'Jane Doe')
        # Check user in DB
        self.assertTrue(User.objects.filter(email='jane@example.com').exists())

    def test_signup_invalid_email(self):
        data = {
            "name": "Jane Doe",
            "email": "not-an-email",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('errors', response.data)
        self.assertIn('email', response.data['errors'])

    def test_signup_password_mismatch(self):
        data = {
            "name": "Jane Doe",
            "email": "jane2@example.com",
            "password": "Password123!",
            "confirm_password": "MismatchPassword"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data['errors'])

    def test_signup_duplicate_email(self):
        User.objects.create_user(
            username="existing_user",
            email="existing@example.com",
            password="Password123!"
        )
        data = {
            "name": "Existing Person",
            "email": "existing@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!"
        }
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data['errors'])

    def test_login_success(self):
        user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="MySecretPassword123"
        )
        data = {
            "email": "testuser@example.com",
            "password": "MySecretPassword123"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['email'], 'testuser@example.com')

    def test_login_invalid_credentials(self):
        User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="MySecretPassword123"
        )
        data = {
            "email": "testuser@example.com",
            "password": "WrongPassword"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data)

    def test_login_nonexistent_user(self):
        data = {
            "email": "nobody@example.com",
            "password": "AnyPassword123"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_forgot_password_success(self):
        user = User.objects.create_user(
            username="resetuser",
            email="reset@example.com",
            password="OldPassword123"
        )
        data = {
            "email": "reset@example.com",
            "new_password": "NewSecretPassword123",
            "confirm_password": "NewSecretPassword123"
        }
        response = self.client.post(self.forgot_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify login works with new password
        login_data = {
            "email": "reset@example.com",
            "password": "NewSecretPassword123"
        }
        login_resp = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)

    def test_forgot_password_nonexistent_email(self):
        data = {
            "email": "ghost@example.com",
            "new_password": "NewSecretPassword123",
            "confirm_password": "NewSecretPassword123"
        }
        response = self.client.post(self.forgot_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data['errors'])

    def test_current_user_and_logout(self):
        user = User.objects.create_user(
            username="me_user",
            email="me@example.com",
            password="Password123!"
        )
        # Login
        login_resp = self.client.post(self.login_url, {"email": "me@example.com", "password": "Password123!"}, format='json')
        token = login_resp.data['token']

        # Access me endpoint with token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        me_resp = self.client.get(self.me_url)
        self.assertEqual(me_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(me_resp.data['user']['email'], 'me@example.com')

        # Logout
        logout_resp = self.client.post(self.logout_url)
        self.assertEqual(logout_resp.status_code, status.HTTP_200_OK)
