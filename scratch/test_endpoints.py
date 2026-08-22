import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Token {token}"
    
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {"error": err_body}

def test_all():
    print("--- 1. Testing Signup API ---")
    test_email = "test_traveler_99@globetrotter.com"
    signup_payload = {
        "name": "Arjun Traveler",
        "email": test_email,
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    status, res = make_request("/auth/signup/", method="POST", data=signup_payload)
    print(f"Signup Status: {status}")
    if status == 201:
        token = res.get("token")
        print(f"User created with Token: {token[:8]}...")
    elif status == 400 and "already exists" in str(res):
        print("User already exists, proceeding to Login...")
    else:
        print(f"Signup Result: {res}")

    print("\n--- 2. Testing Login API ---")
    login_payload = {
        "email": test_email,
        "password": "Password123!"
    }
    status, res = make_request("/auth/login/", method="POST", data=login_payload)
    print(f"Login Status: {status}")
    token = res.get("token")
    print(f"Login Token Received: {token}")

    print("\n--- 3. Testing GET & PUT Profile API ---")
    status, res = make_request("/auth/profile/", method="GET", token=token)
    print(f"GET Profile Status: {status}, Language: {res.get('user', {}).get('language_preference')}")

    profile_update = {
        "name": "Arjun Explorer Updated",
        "email": test_email,
        "profile_photo": "https://images.unsplash.com/photo-test",
        "language_preference": "hi"
    }
    status, res = make_request("/auth/profile/", method="PUT", data=profile_update, token=token)
    print(f"PUT Profile Status: {status}, Updated Name: {res.get('user', {}).get('full_name')}, Lang: {res.get('user', {}).get('language_preference')}")

    print("\n--- 4. Testing Saved Destinations API ---")
    status, res = make_request("/saved-destinations/", method="POST", data={"city_name": "Goa"}, token=token)
    print(f"Save Destination Status: {status}, Msg: {res.get('message')}")

    status, res = make_request("/saved-destinations/", method="GET", token=token)
    print(f"GET Saved Destinations Status: {status}, Count: {len(res.get('saved_destinations', []))}")

    print("\n--- 5. Testing Forgot Password API ---")
    forgot_payload = {
        "email": test_email,
        "new_password": "NewPassword999!",
        "confirm_password": "NewPassword999!"
    }
    status, res = make_request("/auth/forgot-password/", method="POST", data=forgot_payload)
    print(f"Forgot Password Status: {status}, Msg: {res.get('message')}")

    print("\n--- 6. Testing Login with New Password ---")
    status, res = make_request("/auth/login/", method="POST", data={"email": test_email, "password": "NewPassword999!"})
    print(f"Login with New Password Status: {status}")
    new_token = res.get("token")

    print("\n--- 7. Testing Admin Analytics API (with root admin token) ---")
    # Login root admin
    status, admin_res = make_request("/auth/login/", method="POST", data={"email": "pankaj@globetrotter.com", "password": "adminpassword123"})
    if status == 200:
        admin_token = admin_res.get("token")
        status, stats_res = make_request("/admin/stats/", method="GET", token=admin_token)
        print(f"Admin Stats Status: {status}, Users Count: {stats_res.get('stats', {}).get('total_users')}")

    print("\n--- 8. Testing Delete Account API ---")
    status, res = make_request("/auth/delete-account/", method="DELETE", token=new_token)
    print(f"Delete Account Status: {status}, Msg: {res.get('message')}")

    print("\nALL BACKEND API TESTS COMPLETED!")

if __name__ == "__main__":
    test_all()
