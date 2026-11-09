#!/usr/bin/env python3
"""
Backend verification test for Beauty & Care Losone API
Tests:
1. Backend started without KeyError and without crash
2. Admin login with credentials from test_credentials.md
3. At least one authenticated endpoint works
4. Database counts verification
"""

import os
import sys
import requests
from pymongo import MongoClient

# Backend URL (internal)
BACKEND_URL = "http://localhost:8001/api"

# Admin credentials from test_credentials.md
ADMIN_EMAIL = "susana@beautycare-losone.ch"
ADMIN_PASSWORD = "Estetica2026@"

# Expected database counts
EXPECTED_COUNTS = {
    "event_rsvps": 2,
    "login_attempts": 1,
    "quiz_leads": 5,
    "settings": 1,
    "stats_events": 215
}

def test_backend_health():
    """Test 1: Verify backend is running"""
    print("\n=== TEST 1: Backend Health Check ===")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running and responding")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

def test_admin_login():
    """Test 2: Admin login with credentials from test_credentials.md"""
    print("\n=== TEST 2: Admin Login ===")
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "email" in data:
                print("✅ Admin login successful")
                print(f"   Email: {data['email']}")
                print(f"   Token received: {data['token'][:20]}...")
                return data["token"]
            else:
                print(f"❌ Login response missing token or email: {data}")
                return None
        else:
            print(f"❌ Login failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Admin login test failed: {e}")
        return None

def test_authenticated_endpoint(token):
    """Test 3: Test authenticated endpoint (GET /api/quiz-leads)"""
    print("\n=== TEST 3: Authenticated Endpoint (GET /api/quiz-leads) ===")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BACKEND_URL}/quiz-leads", headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Authenticated endpoint working")
            print(f"   Total leads: {data.get('totale', 0)}")
            print(f"   Leads count: {len(data.get('leads', []))}")
            return True
        else:
            print(f"❌ Authenticated endpoint failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Authenticated endpoint test failed: {e}")
        return False

def test_another_authenticated_endpoint(token):
    """Test additional authenticated endpoint (GET /api/event-rsvps)"""
    print("\n=== TEST 3b: Another Authenticated Endpoint (GET /api/event-rsvps) ===")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BACKEND_URL}/event-rsvps", headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Event RSVPs endpoint working")
            print(f"   Total RSVPs: {data.get('totale_iscrizioni', 0)}")
            print(f"   Total people: {data.get('totale_persone', 0)}")
            return True
        else:
            print(f"❌ Event RSVPs endpoint failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Event RSVPs endpoint test failed: {e}")
        return False

def test_database_counts():
    """Test 4: Verify database counts"""
    print("\n=== TEST 4: Database Counts Verification ===")
    try:
        # Connect to MongoDB
        mongo_url = "mongodb://localhost:27017"
        db_name = "test_database"
        client = MongoClient(mongo_url)
        db = client[db_name]
        
        print(f"Connected to database: {db_name}")
        
        all_passed = True
        actual_counts = {}
        
        for collection_name, expected_count in EXPECTED_COUNTS.items():
            actual_count = db[collection_name].count_documents({})
            actual_counts[collection_name] = actual_count
            
            if actual_count == expected_count:
                print(f"✅ {collection_name}: {actual_count} (expected: {expected_count})")
            else:
                print(f"❌ {collection_name}: {actual_count} (expected: {expected_count})")
                all_passed = False
        
        client.close()
        
        if all_passed:
            print("\n✅ All database counts match expected values")
        else:
            print("\n❌ Some database counts do not match")
        
        return all_passed, actual_counts
    except Exception as e:
        print(f"❌ Database counts verification failed: {e}")
        return False, {}

def main():
    print("=" * 70)
    print("BACKEND VERIFICATION TEST")
    print("=" * 70)
    
    results = {
        "backend_health": False,
        "admin_login": False,
        "authenticated_endpoint": False,
        "database_counts": False
    }
    
    # Test 1: Backend health
    results["backend_health"] = test_backend_health()
    
    if not results["backend_health"]:
        print("\n❌ CRITICAL: Backend is not running. Cannot proceed with other tests.")
        sys.exit(1)
    
    # Test 2: Admin login
    token = test_admin_login()
    results["admin_login"] = token is not None
    
    if not results["admin_login"]:
        print("\n❌ CRITICAL: Admin login failed. Cannot test authenticated endpoints.")
    else:
        # Test 3: Authenticated endpoints
        results["authenticated_endpoint"] = test_authenticated_endpoint(token)
        test_another_authenticated_endpoint(token)  # Additional test
    
    # Test 4: Database counts
    db_counts_passed, actual_counts = test_database_counts()
    results["database_counts"] = db_counts_passed
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    all_passed = all(results.values())
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print("=" * 70)
    
    if all_passed:
        print("\n✅ ALL TESTS PASSED")
        print("\nVerification complete:")
        print("(1) ✅ Backend started without KeyError and without crash")
        print("(2) ✅ Admin login successful with credentials from test_credentials.md")
        print("(3) ✅ Authenticated endpoints working correctly")
        print("(4) ✅ Database counts verified:")
        for collection, count in actual_counts.items():
            print(f"    - {collection}: {count}")
        sys.exit(0)
    else:
        print("\n❌ SOME TESTS FAILED")
        sys.exit(1)

if __name__ == "__main__":
    main()
