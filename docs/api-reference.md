# 🌐 API Reference Documentation

## Overview
আমার হাদিস application এর comprehensive API documentation। সব endpoints RESTful design pattern follow করে এবং JSON format ব্যবহার করে।

## 🔐 Authentication
সব protected endpoints এ Supabase JWT token প্রয়োজন।

```typescript
// Headers for authenticated requests
{
  "Authorization": "Bearer <supabase_jwt_token>",
  "Content-Type": "application/json"
}
```

## 📚 Hadith Endpoints

### GET /api/hadith/daily
আজকের দৈনিক হাদিস retrieve করে।

**Request:**
```http
GET /api/hadith/daily
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "hadith_number": "১",
      "text_arabic": "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
      "text_bangla": "নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল",
      "text_english": "Actions are but by intention",
      "narrator": "উমর ইবনুল খাত্তাব (রা.)",
      "book": {
        "name_bangla": "সহীহ বুখারী",
        "name_arabic": "صحيح البخاري"
      },
      "category": {
        "name_bangla": "ঈমান ও আকীদা",
        "icon": "🕌",
        "color": "#10B981"
      },
      "is_read": false,
      "is_favorited": false,
      "user_rating": null
    }
  ]
}
```

### GET /api/hadith/search
হাদিস search করার জন্য।

**Request:**
```http
GET /api/hadith/search?q=নামাজ&category=prayer&book=bukhari&page=1&limit=10
```

**Query Parameters:**
- `q` (string): Search query
- `category` (string): Category filter
- `book` (string): Book filter
- `difficulty` (string): beginner|intermediate|advanced
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "hadith": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    },
    "filters": {
      "categories": [...],
      "books": [...],
      "difficulties": [...]
    }
  }
}
```

### POST /api/hadith/rate
হাদিস rating দেওয়ার জন্য।

**Request:**
```http
POST /api/hadith/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "hadith_id": "uuid",
  "translation_quality": 5,
  "explanation_quality": 4,
  "overall_rating": 5,
  "comment": "চমৎকার অনুবাদ"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted successfully"
}
```

### POST /api/hadith/favorite
হাদিস favorite/unfavorite করার জন্য।

**Request:**
```http
POST /api/hadith/favorite
Authorization: Bearer <token>
Content-Type: application/json

{
  "hadith_id": "uuid",
  "is_favorited": true
}
```

### POST /api/hadith/mark-read
হাদিস পড়া হিসেবে mark করার জন্য।

**Request:**
```http
POST /api/hadith/mark-read
Authorization: Bearer <token>
Content-Type: application/json

{
  "hadith_id": "uuid"
}
```

## 👤 User Endpoints

### GET /api/user/profile
User profile information।

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "username": "johndoe",
    "avatar_url": "https://...",
    "role": "user",
    "streak_count": 15,
    "total_hadith_read": 150,
    "points": 1250,
    "level": 3,
    "preferred_language": "bn",
    "notification_settings": {...},
    "privacy_settings": {...}
  }
}
```

### PUT /api/user/profile
User profile update করার জন্য।

**Request:**
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Updated Name",
  "bio": "Islamic knowledge seeker",
  "location": "Dhaka, Bangladesh",
  "preferred_language": "bn"
}
```

### GET /api/user/progress
User এর progress statistics।

**Query Parameters:**
- `period` (string): daily|weekly|monthly|yearly
- `start_date` (string): YYYY-MM-DD format
- `end_date` (string): YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": {
    "current_streak": 15,
    "longest_streak": 25,
    "total_hadith_read": 150,
    "total_time_spent": 1200,
    "level": 3,
    "points": 1250,
    "achievements_count": 8,
    "daily_progress": [
      {
        "date": "2024-01-01",
        "hadith_read_count": 3,
        "time_spent_minutes": 15,
        "streak_maintained": true
      }
    ],
    "weekly_summary": {
      "total_hadith_read": 21,
      "average_daily": 3,
      "streak_days": 7,
      "completed_days": 7
    }
  }
}
```

### GET /api/user/achievements
User এর unlocked achievements।

**Response:**
```json
{
  "success": true,
  "data": {
    "unlocked": [
      {
        "id": "uuid",
        "name_bangla": "প্রথম পদক্ষেপ",
        "description_bangla": "প্রথম হাদিস পড়েছেন",
        "icon": "🎯",
        "badge_color": "#10B981",
        "points_reward": 10,
        "earned_at": "2024-01-01T00:00:00Z"
      }
    ],
    "available": [
      {
        "id": "uuid",
        "name_bangla": "নিয়মিত পাঠক",
        "description_bangla": "৭ দিন ধারাবাহিক হাদিস পড়ুন",
        "progress": {
          "current": 5,
          "required": 7
        }
      }
    ]
  }
}
```

### GET /api/user/favorites
User এর favorite hadith list।

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [...],
    "collections": [
      {
        "id": "uuid",
        "name": "নামাজের হাদিস",
        "description": "নামাজ সংক্রান্ত হাদিস সংগ্রহ",
        "hadith_count": 15,
        "is_public": false
      }
    ]
  }
}
```

## 📊 Analytics Endpoints

### GET /api/analytics/dashboard
Admin dashboard analytics।

**Authorization:** Admin role required

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1000,
      "active_today": 150,
      "new_this_week": 25
    },
    "hadith": {
      "total": 5000,
      "verified": 4800,
      "pending": 200
    },
    "engagement": {
      "daily_reads": 450,
      "favorites_added": 75,
      "contributions": 5
    },
    "popular_content": [...]
  }
}
```

## 🔔 Notification Endpoints

### GET /api/notifications
User notifications।

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "achievement",
      "title": "নতুন অর্জন!",
      "message": "আপনি 'নিয়মিত পাঠক' ব্যাজ অর্জন করেছেন",
      "data": {
        "achievement_id": "uuid"
      },
      "is_read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PUT /api/notifications/:id/read
Notification read হিসেবে mark করা।

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

## 📧 Email Endpoints

### POST /api/email/welcome
Welcome email send করা (internal use)।

**Request:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

### POST /api/email/daily-hadith
Daily hadith email send করা।

**Request:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "hadithList": [...]
}
```

## 🤝 Community Endpoints

### POST /api/contributions/submit
নতুন hadith contribution submit করা।

**Request:**
```http
POST /api/contributions/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "hadith_data": {
    "text_arabic": "...",
    "text_bangla": "...",
    "narrator": "...",
    "reference": "...",
    "category_id": "uuid",
    "book_id": "uuid"
  }
}
```

### GET /api/contributions/pending
Pending contributions (Moderator only)।

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "contributor": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "hadith_data": {...},
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### PUT /api/contributions/:id/review
Contribution review করা (Moderator only)।

**Request:**
```json
{
  "status": "approved", // approved|rejected
  "review_notes": "Excellent contribution"
}
```

## 🕌 Prayer Times Endpoints

### GET /api/prayer-times
Prayer times for location।

**Query Parameters:**
- `lat` (number): Latitude
- `lng` (number): Longitude
- `date` (string): YYYY-MM-DD format (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "fajr": "05:30",
    "dhuhr": "12:15",
    "asr": "15:45",
    "maghrib": "18:00",
    "isha": "19:30",
    "date": "2024-01-01",
    "location": "Dhaka, Bangladesh"
  }
}
```

## ❌ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## 🔄 Rate Limiting

### Limits per endpoint:
- **Authentication:** 5 requests/minute
- **Search:** 30 requests/minute
- **General API:** 100 requests/minute
- **Admin API:** 200 requests/minute

### Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📝 Request/Response Examples

### Complete Hadith Object
```json
{
  "id": "uuid",
  "hadith_number": "১",
  "book": {
    "id": "uuid",
    "name_bangla": "সহীহ বুখারী",
    "name_arabic": "صحيح البخاري",
    "name_english": "Sahih al-Bukhari"
  },
  "category": {
    "id": "uuid",
    "name_bangla": "ঈমান ও আকীদা",
    "name_arabic": "الإيمان والعقيدة",
    "name_english": "Faith and Belief",
    "icon": "🕌",
    "color": "#10B981"
  },
  "chapter_bangla": "ওহীর সূচনা",
  "chapter_arabic": "بدء الوحي",
  "text_arabic": "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
  "text_bangla": "নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল",
  "text_english": "Actions are but by intention",
  "narrator": "উমর ইবনুল খাত্তাব (রা.)",
  "grade": "সহীহ",
  "reference": "সহীহ বুখারী, হাদিস নং ১",
  "explanation": "এই হাদিসটি ইসলামের মৌলিক নীতিমালার একটি...",
  "difficulty_level": "beginner",
  "view_count": 1250,
  "like_count": 95,
  "share_count": 25,
  "is_featured": true,
  "user_interaction": {
    "is_read": true,
    "is_favorited": false,
    "is_memorized": false,
    "rating": 5,
    "notes": "খুবই গুরুত্বপূর্ণ হাদিস",
    "read_at": "2024-01-01T10:30:00Z"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

এই API documentation সব major endpoints cover করে এবং real-world usage examples প্রদান করে।
