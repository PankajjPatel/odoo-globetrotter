import os
import sys
import json
from pathlib import Path

# Setup Django environment
base_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(base_dir))

# Add venv if needed
win_venv = base_dir / 'venv' / 'Lib' / 'site-packages'
if win_venv.exists():
    sys.path.insert(0, str(win_venv))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'globetrotter.settings')
import django
django.setup()

from django.test import Client

client = Client()

test_cases = [
    ("1. All cities", "/api/cities/", 10),
    ("2. Full search (jaipur)", "/api/cities/?search=jaipur", 1),
    ("3. Partial search (jaip)", "/api/cities/?search=jaip", 1),
    ("4. Country filter (India)", "/api/cities/?country=India", 10),
    ("5. Region filter (North India)", "/api/cities/?region=North%20India", 6),
    ("6. Combined filters", "/api/cities/?search=jaip&country=India&region=North%20India", 1),
    ("7. Empty / Non-matching search", "/api/cities/?search=xyzabc", 0),
]

print("=" * 60)
print("CITY SEARCH API VERIFICATION")
print("=" * 60)

all_passed = True

for title, url, expected_count in test_cases:
    response = client.get(url)
    status_code = response.status_code
    data = json.loads(response.content)
    actual_count = len(data) if isinstance(data, list) else -1
    
    passed = (status_code == 200) and (actual_count == expected_count)
    if not passed:
        all_passed = False
    
    status_str = "PASS" if passed else "FAIL"
    print(f"[{status_str}] {title}")
    print(f"       URL: {url}")
    print(f"       Status: {status_code} | Expected Count: {expected_count} | Actual Count: {actual_count}")
    if actual_count > 0 and actual_count <= 2:
        print(f"       Sample Result: {data[0]['name']}, {data[0]['country']} (Region: {data[0]['region']})")
    print("-" * 60)

if all_passed:
    print("\nALL CITY SEARCH API TESTS PASSED SUCCESSFULLY!")
else:
    print("\nSOME TESTS FAILED!")
