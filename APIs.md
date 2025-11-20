# Diamond Inventory API Documentation

This document provides comprehensive documentation for all API endpoints in the Diamond Inventory system.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via JWT token stored in HTTP-only cookies. The token is automatically included in requests when using the same domain.

For manual token usage:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "count": 10
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## Health Check

### GET /api/health
Check API status and health.

**Authentication:** None required

**Query Parameters:** None

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Diamond Inventory API is running",
  "timestamp": "2025-01-26T10:30:00.000Z",
  "environment": "development"
}
```

---

## User Authentication Endpoints

### POST /api/users/register
Register a new user account (sends OTP to email).

**Authentication:** None required

**Query Parameters:** None

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to email. Please verify to complete registration."
}
```

### POST /api/users/verify-otp
Verify OTP and complete user registration.

**Authentication:** None required

**Query Parameters:** None

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration complete. You are now logged in.",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "APPROVED",
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  }
}
```

### POST /api/users/login
Login user with email and password.

**Authentication:** None required

**Query Parameters:** None

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "APPROVED",
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  }
}
```

### POST /api/users/logout
Logout current user (clears authentication cookie).

**Authentication:** Required

**Query Parameters:** None

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### POST /api/users/otp
Send OTP to user's email for verification purposes.

**Authentication:** None required

**Query Parameters:** None

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

---

## User Profile Management Endpoints

### GET /api/users/profile
Get current user's profile information.

**Authentication:** Required

**Query Parameters:** None

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "APPROVED",
      "customerData": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+1234567890",
        "countryCode": "+1",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "postalCode": "10001",
          "country": "USA"
        },
        "businessInfo": {
          "companyName": "ABC Corp",
          "businessType": "Retailer",
          "vatNumber": "VAT123456",
          "websiteUrl": "https://example.com"
        },
        "submittedAt": "2025-01-26T10:30:00.000Z"
      },
      "quotations": [
        {
          "quotationId": "550e8400-e29b-41d4-a716-446655440000",
          "carat": 1.5,
          "noOfPieces": 10,
          "quotePrice": 15000,
          "status": "PENDING",
          "submittedAt": "2025-01-26T10:30:00.000Z"
        }
      ],
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  }
}
```

### POST /api/users/customer-data
Submit customer KYC data for approval.

**Authentication:** Required (User role only, not Admin)

**Query Parameters:** None

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "countryCode": "+1",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "businessInfo": {
    "companyName": "ABC Corp",
    "businessType": "Retailer",
    "vatNumber": "VAT123456",
    "websiteUrl": "https://example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer data submitted successfully.",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "PENDING",
      "customerData": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+1234567890",
        "countryCode": "+1",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "postalCode": "10001",
          "country": "USA"
        },
        "businessInfo": {
          "companyName": "ABC Corp",
          "businessType": "Retailer",
          "vatNumber": "VAT123456",
          "websiteUrl": "https://example.com"
        },
        "submittedAt": "2025-01-26T10:30:00.000Z"
      }
    }
  }
}
```

### PUT /api/users/update-email
Update user's email address with OTP verification.

**Authentication:** Required

**Query Parameters:** None

**Request Body:**
```json
{
  "newEmail": "newemail@example.com",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "newemail@example.com",
      "role": "USER",
      "status": "APPROVED"
    }
  }
}
```

**Notes:**
- You must first call `/api/users/otp` with your current email to receive OTP
- OTP expires in 5 minutes
- New email must not already exist in the system

### PUT /api/users/update-password
Update user's password with OTP verification.

**Authentication:** Required

**Query Parameters:** None

**Request Body:**
```json
{
  "newPassword": "newsecurepassword123",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Notes:**
- You must first call `/api/users/otp` with your email to receive OTP
- OTP expires in 5 minutes
- New password must be at least 6 characters long

---

## User Management Endpoints (Admin Only)

### GET /api/users
Get all users with pagination.

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `sortBy` (string, optional) - Field to sort by (default: 'createdAt')
- `sortOrder` (string, optional) - Sort order: 'asc' or 'desc' (default: 'desc')

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "APPROVED",
      "customerData": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+1234567890",
        "countryCode": "+1",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "postalCode": "10001",
          "country": "USA"
        },
        "businessInfo": {
          "companyName": "ABC Corp",
          "businessType": "Retailer",
          "vatNumber": "VAT123456"
        },
        "submittedAt": "2025-01-26T10:30:00.000Z"
      },
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 50,
    "recordsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET /api/users/search
Search users with filters (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page
- `username` (string, optional) - Filter by username
- `email` (string, optional) - Filter by email
- `role` (string, optional) - Filter by role (USER, ADMIN)
- `status` (string, optional) - Filter by status (PENDING, APPROVED, REJECTED)

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Users search completed successfully",
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "APPROVED",
      "customerData": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+1234567890",
        "countryCode": "+1",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "postalCode": "10001",
          "country": "USA"
        },
        "businessInfo": {
          "companyName": "ABC Corp",
          "businessType": "Retailer",
          "vatNumber": "VAT123456"
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 25,
    "recordsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### POST /api/users/create
Create a new user (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:** None

**Request Body:**
```json
{
  "username": "new_user",
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "USER",
  "status": "PENDING"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "new_user_id",
    "username": "new_user",
    "email": "newuser@example.com",
    "role": "USER",
    "status": "PENDING"
  }
}
```

### DELETE /api/users/:id
Delete a user (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:** None

**Path Parameters:**
- `id` (string, required) - User ID

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### POST /api/users/:id/approve-customer-data
Approve user's customer data (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:** None

**Path Parameters:**
- `id` (string, required) - User ID

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Customer data approved successfully",
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "APPROVED",
    "customerData": {
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "countryCode": "+1",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA"
      },
      "businessInfo": {
        "companyName": "ABC Corp",
        "businessType": "Retailer",
        "vatNumber": "VAT123456"
      },
      "submittedAt": "2025-01-26T10:30:00.000Z"
    }
  }
}
```

### POST /api/users/:id/reject-customer-data
Reject user's customer data (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:** None

**Path Parameters:**
- `id` (string, required) - User ID

**Request Body:**
```json
{
  "reason": "Incomplete documentation provided"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer data rejected successfully",
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "REJECTED",
    "customerData": {
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "countryCode": "+1",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA"
      },
      "businessInfo": {
        "companyName": "ABC Corp",
        "businessType": "Retailer",
        "vatNumber": "VAT123456"
      },
      "submittedAt": "2025-01-26T10:30:00.000Z",
      "rejectionReason": "Incomplete documentation provided"
    }
  }
}
```

---

## Diamond Endpoints

### GET /api/diamonds
Get all diamonds with pagination.

**Authentication:** None required

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `sortBy` (string, optional) - Field to sort by (default: 'createdAt')
- `sortOrder` (string, optional) - Sort order: 'asc' or 'desc' (default: 'desc')

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Diamonds fetched successfully",
  "data": [
    {
      "_id": "diamond_id",
      "color": "D",
      "clarity": "FL",
      "cut": "Excellent",
      "carat": 1.5,
      "price": 10000,
      "certificateNumber": "GIA123456",
      "shape": "Round",
      "polish": "Excellent",
      "symmetry": "Excellent",
      "fluorescence": "None",
      "measurements": {
        "length": 7.5,
        "width": 7.5,
        "depth": 4.5
      },
      "table": 57,
      "totalDepth": 61.5,
      "discount": 5,
      "rapList": 12000,
      "isAvailable": true,
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 50,
    "recordsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET /api/diamonds/all
Get all diamonds without pagination.

**Authentication:** None required

**Query Parameters:**
- `sortBy` (string, optional) - Field to sort by (default: 'createdAt')
- `sortOrder` (string, optional) - Sort order: 'asc' or 'desc' (default: 'desc')

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "All diamonds fetched successfully",
  "data": [
    {
      "_id": "diamond_id",
      "color": "D",
      "clarity": "FL",
      "cut": "Excellent",
      "carat": 1.5,
      "price": 10000,
      "certificateNumber": "GIA123456",
      "shape": "Round",
      "polish": "Excellent",
      "symmetry": "Excellent",
      "fluorescence": "None",
      "measurements": {
        "length": 7.5,
        "width": 7.5,
        "depth": 4.5
      },
      "table": 57,
      "totalDepth": 61.5,
      "discount": 5,
      "rapList": 12000,
      "isAvailable": true,
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  ],
  "totalRecords": 500
}
```

### GET /api/diamonds/search
Search diamonds with advanced filters.

**Authentication:** None required

**Query Parameters:**
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page
- `sortBy` (string, optional) - Field to sort by
- `sortOrder` (string, optional) - Sort order
- `color` (string/array, optional) - Diamond color (D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z)
- `clarity` (string/array, optional) - Diamond clarity (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, SI3, I1, I2, I3)
- `cut` (string/array, optional) - Diamond cut quality
- `polish` (string/array, optional) - Polish quality
- `symmetry` (string/array, optional) - Symmetry quality
- `fluorescence` (string/array, optional) - Fluorescence level
- `shape` (string, optional) - Diamond shape
- `notShape` (string, optional) - Exclude specific shape
- `priceMin` (number, optional) - Minimum price
- `priceMax` (number, optional) - Maximum price
- `caratMin` (number, optional) - Minimum carat weight
- `caratMax` (number, optional) - Maximum carat weight
- `tableMin` (number, optional) - Minimum table percentage
- `tableMax` (number, optional) - Maximum table percentage
- `totalDepthMin` (number, optional) - Minimum total depth percentage
- `totalDepthMax` (number, optional) - Maximum total depth percentage
- `discountMin` (number, optional) - Minimum discount percentage
- `discountMax` (number, optional) - Maximum discount percentage
- `rapListMin` (number, optional) - Minimum rap list price
- `rapListMax` (number, optional) - Maximum rap list price
- `lengthMin` (number, optional) - Minimum length
- `lengthMax` (number, optional) - Maximum length
- `widthMin` (number, optional) - Minimum width
- `widthMax` (number, optional) - Maximum width
- `depthMin` (number, optional) - Minimum depth
- `depthMax` (number, optional) - Maximum depth
- `isAvailable` (boolean, optional) - Availability status
- `searchTerm` (string, optional) - Search in certificate number

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Diamond search completed successfully",
  "data": [
    {
      "_id": "diamond_id",
      "color": "D",
      "clarity": "FL",
      "cut": "Excellent",
      "carat": 1.5,
      "price": 10000,
      "certificateNumber": "GIA123456",
      "shape": "Round",
      "polish": "Excellent",
      "symmetry": "Excellent",
      "fluorescence": "None",
      "measurements": {
        "length": 7.5,
        "width": 7.5,
        "depth": 4.5
      },
      "table": 57,
      "totalDepth": 61.5,
      "discount": 5,
      "rapList": 12000,
      "isAvailable": true,
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 25,
    "recordsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET /api/diamonds/filter-options
Get available filter options for UI dropdowns.

**Authentication:** None required

**Query Parameters:** None

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Filter options fetched successfully",
  "data": {
    "colors": ["D", "E", "F", "G", "H", "I", "J", "K"],
    "clarities": ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2"],
    "cuts": ["Excellent", "Very Good", "Good"],
    "shapes": ["Round", "Princess", "Emerald", "Asscher"],
    "polish": ["Excellent", "Very Good", "Good"],
    "symmetry": ["Excellent", "Very Good", "Good"],
    "fluorescence": ["None", "Faint", "Medium", "Strong"]
  }
}
```

### POST /api/diamonds/create
Create a new diamond with enhanced validation.

**Authentication:** None required (but may require admin in production)

**Query Parameters:** None

**Request Body:**
```json
{
  "color": "D",
  "clarity": "FL",
  "cut": "Excellent",
  "carat": 1.5,
  "price": 10000,
  "certificateNumber": "GIA123456",
  "shape": "Round",
  "polish": "Excellent",
  "symmetry": "Excellent",
  "fluorescence": "None",
  "measurements": {
    "length": 7.5,
    "width": 7.5,
    "depth": 4.5
  },
  "table": 57,
  "totalDepth": 61.5,
  "discount": 5,
  "rapList": 12000,
  "isAvailable": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Diamond created successfully",
  "data": {
    "_id": "new_diamond_id",
    "color": "D",
    "clarity": "FL",
    "cut": "Excellent",
    "carat": 1.5,
    "price": 10000,
    "certificateNumber": "GIA123456",
    "shape": "Round",
    "polish": "Excellent",
    "symmetry": "Excellent",
    "fluorescence": "None",
    "measurements": {
      "length": 7.5,
      "width": 7.5,
      "depth": 4.5
    },
    "table": 57,
    "totalDepth": 61.5,
    "discount": 5,
    "rapList": 12000,
    "isAvailable": true,
    "createdAt": "2025-01-26T10:30:00.000Z"
  }
}
```

### POST /api/diamonds/bulk-create
Create multiple diamonds in bulk.

**Authentication:** None required (but may require admin in production)

**Query Parameters:** None

**Request Body:**
```json
[
  {
    "color": "D",
    "clarity": "FL",
    "cut": "Excellent",
    "carat": 1.5,
    "price": 10000,
    "certificateNumber": "GIA123456",
    "shape": "Round",
    "polish": "Excellent",
    "symmetry": "Excellent",
    "fluorescence": "None",
    "measurements": {
      "length": 7.5,
      "width": 7.5,
      "depth": 4.5
    },
    "table": 57,
    "totalDepth": 61.5,
    "discount": 5,
    "rapList": 12000,
    "isAvailable": true
  },
  {
    "color": "E",
    "clarity": "IF",
    "cut": "Very Good",
    "carat": 2.0,
    "price": 15000,
    "certificateNumber": "GIA789012",
    "shape": "Princess",
    "polish": "Very Good",
    "symmetry": "Very Good",
    "fluorescence": "Faint",
    "measurements": {
      "length": 8.0,
      "width": 8.0,
      "depth": 5.0
    },
    "table": 60,
    "totalDepth": 62.5,
    "discount": 8,
    "rapList": 18000,
    "isAvailable": true
  }
]
```

**Response:**
```json
{
  "success": true,
  "message": "2 diamonds created successfully",
  "data": [
    {
      "_id": "diamond_id_1",
      "color": "D",
      "clarity": "FL",
      "cut": "Excellent",
      "carat": 1.5,
      "price": 10000,
      "certificateNumber": "GIA123456",
      "shape": "Round",
      "polish": "Excellent",
      "symmetry": "Excellent",
      "fluorescence": "None",
      "measurements": {
        "length": 7.5,
        "width": 7.5,
        "depth": 4.5
      },
      "table": 57,
      "totalDepth": 61.5,
      "discount": 5,
      "rapList": 12000,
      "isAvailable": true,
      "createdAt": "2025-01-26T10:30:00.000Z"
    },
    {
      "_id": "diamond_id_2",
      "color": "E",
      "clarity": "IF",
      "cut": "Very Good",
      "carat": 2.0,
      "price": 15000,
      "certificateNumber": "GIA789012",
      "shape": "Princess",
      "polish": "Very Good",
      "symmetry": "Very Good",
      "fluorescence": "Faint",
      "measurements": {
        "length": 8.0,
        "width": 8.0,
        "depth": 5.0
      },
      "table": 60,
      "totalDepth": 62.5,
      "discount": 8,
      "rapList": 18000,
      "isAvailable": true,
      "createdAt": "2025-01-26T10:30:00.000Z"
    }
  ],
  "count": 2
}
```

### PUT /api/diamonds/:id
Update a diamond by ID.

**Authentication:** May require admin authentication

**Query Parameters:** None

**Path Parameters:**
- `id` (string, required) - Diamond ID

**Request Body:**
```json
{
  "price": 12000,
  "discount": 10,
  "isAvailable": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Diamond updated successfully",
  "data": {
    "_id": "diamond_id",
    "color": "D",
    "clarity": "FL",
    "cut": "Excellent",
    "carat": 1.5,
    "price": 12000,
    "certificateNumber": "GIA123456",
    "shape": "Round",
    "polish": "Excellent",
    "symmetry": "Excellent",
    "fluorescence": "None",
    "measurements": {
      "length": 7.5,
      "width": 7.5,
      "depth": 4.5
    },
    "table": 57,
    "totalDepth": 61.5,
    "discount": 10,
    "rapList": 12000,
    "isAvailable": false,
    "createdAt": "2025-01-26T10:30:00.000Z",
    "updatedAt": "2025-01-26T11:00:00.000Z"
  }
}
```

### DELETE /api/diamonds/:id
Delete a diamond by ID.

**Authentication:** May require admin authentication

**Query Parameters:** None

**Path Parameters:**
- `id` (string, required) - Diamond ID

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Diamond deleted successfully"
}
```

---

## Quotation Management Endpoints

### POST /api/quotations
Submit a quotation or array of quotations (User only).

**Authentication:** Required (User role, Admin cannot submit)

**Query Parameters:** None

**Request Body (Single Quotation):**
```json
{
  "carat": 1.5,
  "noOfPieces": 10,
  "quotePrice": 15000
}
```

**Request Body (Multiple Quotations):**
```json
[
  {
    "carat": 1.5,
    "noOfPieces": 10,
    "quotePrice": 15000
  },
  {
    "carat": 2.0,
    "noOfPieces": 5,
    "quotePrice": 25000
  }
]
```

**Response (Success):**
```json
{
  "message": "Quotation submitted successfully",
  "quotation": {
    "quotationId": "QUO-1643184000000-ABC123",
    "carat": 1.5,
    "noOfPieces": 10,
    "quotePrice": 15000,
    "status": "PENDING",
    "submittedAt": "2025-01-26T10:30:00.000Z"
  }
}
```

**Response (Partial Success):**
```json
{
  "message": "Some quotations submitted successfully",
  "quotation": [
    {
      "quotationId": "QUO-1643184000000-ABC123",
      "carat": 1.5,
      "noOfPieces": 10,
      "quotePrice": 15000,
      "status": "PENDING",
      "submittedAt": "2025-01-26T10:30:00.000Z"
    }
  ],
  "duplicates": [
    {
      "index": 1,
      "quotation": {
        "carat": 2.0,
        "noOfPieces": 5,
        "quotePrice": 25000
      }
    }
  ],
  "errors": [
    {
      "index": 2,
      "quotation": {
        "carat": -1,
        "noOfPieces": 0,
        "quotePrice": 0
      },
      "error": "Invalid carat value"
    }
  ],
  "partialSuccess": true
}
```

### GET /api/quotations
Get all users with quotations or specific user quotations (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:**
- `userId` (string, optional) - Get quotations for specific user

**Request Body:** None

**Response (All Users with Quotations):**
```json
{
  "message": "Users with quotations retrieved successfully",
  "data": {
    "users": [
      {
        "userId": "user_id",
        "username": "john_doe",
        "email": "john@example.com",
        "quotationCount": 3,
        "quotations": [
          {
            "quotationId": "QUO-1643184000000-ABC123",
            "carat": 1.5,
            "noOfPieces": 10,
            "quotePrice": 15000,
            "status": "PENDING",
            "submittedAt": "2025-01-26T10:30:00.000Z"
          }
        ]
      }
    ],
    "summary": {
      "totalUsers": 10,
      "totalQuotations": 25
    }
  }
}
```

**Response (Specific User Quotations):**
```json
{
  "message": "User quotations retrieved successfully",
  "data": {
    "userId": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "quotations": [
      {
        "quotationId": "QUO-1643184000000-ABC123",
        "carat": 1.5,
        "noOfPieces": 10,
        "quotePrice": 15000,
        "status": "PENDING",
        "submittedAt": "2025-01-26T10:30:00.000Z"
      }
    ]
  }
}
```

### GET /api/quotations/:quotationId
Get specific quotation details (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:** None

**Path Parameters:**
- `quotationId` (string, required) - Quotation ID

**Request Body:** None

**Response:**
```json
{
  "message": "Quotation details retrieved successfully",
  "quotation": {
    "quotationId": "QUO-1643184000000-ABC123",
    "carat": 1.5,
    "noOfPieces": 10,
    "quotePrice": 15000,
    "status": "PENDING",
    "submittedAt": "2025-01-26T10:30:00.000Z"
  }
}
```

### POST /api/quotations/:quotationId/approve
Approve a quotation (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:** None

**Path Parameters:**
- `quotationId` (string, required) - Quotation ID

**Request Body:** None

**Response:**
```json
{
  "message": "Quotation approved successfully",
  "quotation": {
    "quotationId": "QUO-1643184000000-ABC123",
    "carat": 1.5,
    "noOfPieces": 10,
    "quotePrice": 15000,
    "status": "APPROVED",
    "submittedAt": "2025-01-26T10:30:00.000Z",
    "approvedAt": "2025-01-26T11:00:00.000Z"
  }
}
```

### POST /api/quotations/:quotationId/reject
Reject a quotation (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:** None

**Path Parameters:**
- `quotationId` (string, required) - Quotation ID

**Request Body:**
```json
{
  "reason": "Price too high for current market conditions"
}
```

**Response:**
```json
{
  "message": "Quotation rejected successfully",
  "quotation": {
    "quotationId": "QUO-1643184000000-ABC123",
    "carat": 1.5,
    "noOfPieces": 10,
    "quotePrice": 15000,
    "status": "REJECTED",
    "submittedAt": "2025-01-26T10:30:00.000Z",
    "rejectedAt": "2025-01-26T11:00:00.000Z",
    "rejectionReason": "Price too high for current market conditions"
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 207 | Multi-Status (partial success) |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

Some endpoints have rate limiting applied:

- **Search endpoints**: 50 requests per 15 minutes
- **Create diamond**: 10 requests per minute  
- **Bulk create**: 5 requests per 5 minutes
- **Update/Delete**: 20 requests per minute
- **OTP endpoints**: 3 requests per 5 minutes per email

---

## Data Types and Enums

### Diamond Color
`D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`

### Diamond Clarity
`FL`, `IF`, `VVS1`, `VVS2`, `VS1`, `VS2`, `SI1`, `SI2`, `SI3`, `I1`, `I2`, `I3`

### Diamond Cut/Polish/Symmetry
`Excellent`, `Very Good`, `Good`, `Fair`, `Poor`

### Diamond Fluorescence
`None`, `Faint`, `Medium`, `Strong`, `Very Strong`

### Diamond Shapes
`Round`, `Princess`, `Emerald`, `Asscher`, `Cushion`, `Marquise`, `Oval`, `Radiant`, `Pear`, `Heart`

### User Role
`USER`, `ADMIN`

### User Status
`PENDING`, `APPROVED`, `REJECTED`

### Quotation Status
`PENDING`, `APPROVED`, `REJECTED`

---

## Notes

1. All endpoints return consistent JSON responses with `success`, `message`, and `data` fields.
2. Pagination is available on list endpoints with `page`, `limit`, `totalPages`, `totalRecords`, etc.
3. Date fields are returned in ISO 8601 format.
4. Authentication is handled via HTTP-only cookies for security.
5. Admin-only endpoints require both authentication and admin role verification.
6. Rate limiting is applied to prevent abuse of the API.
7. OTP codes expire after 5 minutes for security purposes.
8. All monetary values are assumed to be in USD unless specified otherwise.
9. Certificate numbers must be unique across all diamonds.
10. User quotations are stored with UUID-based quotation IDs for uniqueness.