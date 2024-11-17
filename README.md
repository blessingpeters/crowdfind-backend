# crowdfind-backend

### CrowdFind allows users to view, search for, and indicate interest in events

# API Documentation

Welcome to the Crowd Find API documentation. This API allows users to register, authenticate, view events, indicate interest in events, and retrieve events they are interested in.
The API follows RESTful principles and uses JSON for data interchange.

- base_url: https://crowdfind-backend.onrender.com

### Return Codes

| Status Code | Description           |
| :---------- | :-------------------- |
| 200         | OK                    |
| 201         | CREATED               |
| 400         | BAD REQUEST           |
| 401         | UNAUTHORIZED          |
| 404         | NOT FOUND             |
| 500         | INTERNAL SERVER ERROR |

## Authentication

### 1. Register User

Register a new user to access authenticated routes.

- Endpoint: `/api/auth/register`

- Method: `POST`

- URL: `base_url/api/auth/register`

- Headers:
  `Content-Type: application/json`

#### Request Body:

```JSON
    { "name": "John Doe", "email": "john.doe@example.com", "password": "Password123!"}
```

#### Successful Response:

```JSON
    { "message": "User registered successfully. Please check your email to verify your account."}
```

#### Error Response:

```JSON
   400 Bad Request: Invalid input fields or email already exists.
```

### 2. Email Verification

Verifies the user's email using a verification token sent via email.

- Endpoint: `/auth/verify-email`

- Method: `GET`

- URL: `base_url/api/auth/verify-email?token=your_verification_token`

- Headers:
  `Content-Type: application/json`

#### Successful Response:

```JSON
{
  "message": "Email verified successfully. You can now log in."
}
```

#### Error Response:

```JSON
  400 Bad Request: Invalid or missing token.
```

### 3. Login User

Authenticate a user and obtain a JWT token for authorized requests.

- Endpoint: `/api/auth/login`

- Method: `POST`

- URL: `base_url/api/auth/login`

- Headers:
  `Content-Type: application/json`

#### Request Body:

```JSON
{ "email": "john.doe@example.com", "password": "Password123!"}
```

#### Successful Response:

```JSON
{
    "token": "<your_token_here>"
}
```

#### Error Response:

```JSON
  400 Bad Request: Invalid email or password.
```

### 4. Forgot Password

Sends a password reset link to the user's email.

- Endpoint: `/auth/forgot-password`

- Method: `POST`

- URL: `base_url/api/auth/forgot-password`

- Headers:
  `Content-Type: application/json`

#### Request Body:

```JSON
{ "email": "john.doe@example.com"}
```

#### Successful Response:

```JSON
{
  "message": "Password reset OTP sent to your email."
}
```

#### Error Response:

```JSON
  400 Bad Request: Email not found or invalid.
```

### 5. Reset Password

Resets the user's password using a token.

- Endpoint: `/auth/reset-password`

- Method: `POST`

- URL: `base_url/api/auth/reset-password`

- Headers:
  `Content-Type: application/json`

#### Request Body:

```JSON
{
  "otp": "123456",
  "newPassword": "new_secure_password"
}
```

#### Successful Response:

```JSON
{
  "message": "Password has been reset successfully."
}
```

#### Error Response:

```JSON
  400 Bad Request: Invalid or expired token, or password is too weak.
```

## Events

### 1. Create Event: For Admin

Admin-only endpoint to create a new event.

- Endpoint: `/api/event/create`

- Method: `POST`

- URL: `base_url/api/event/create`

- Headers:
  `Content-Type: application/json`

#### Request Body:

```JSON
{
  "title": "Python for Beginners",
  "hostname": "CodeLab Academy",
  "description": "A beginner-friendly introduction to Python, focusing on real-world applications and hands-on exercises.",
  "date": "2024-10-30T17:00:00Z",
  "img": "https://res.cloudinary.com/dpoitpphx/image/upload/v1729675549/Python_for_Beginners_qi0spd.jpg",
  "tags": [
    "Programming",
    "Python",
    "Coding"
  ]
}
```

#### Sample Response:

```JSON
"message": "Event created successfully",
"event": {
    "title": "Outdoor Art and Music Festival",
    "hostname": "Port Harcourt Arts Collective",
    "description": "A lively outdoor festival celebrating local art and music, with performances, exhibitions, and workshops.",
    "date": "2024-10-26T15:00:00.000Z",
    "img": "https://res.cloudinary.com/dpoitpphx/image/upload/v1729675537/Outdoor_Art_and_Music_Festival_cmoyuq.jpg",
    "tags": [
        "Art",
        "Music",
        "Festival"
    ],
    "_id": "67197cfce2af323b505b954d",
    "attendees": [],
    "createdAt": "2024-10-23T22:47:24.964Z",
    "updatedAt": "2024-10-23T22:47:24.964Z",
    "__v": 0
}
```

### 2. Get All Events

Retrieve a list of all events.

- Endpoint: `api/event/`

- Method: `GET`

- URL: `base_url/api/event/`

- Headers: `(None required)`

#### Sample Response:

```JSON
[
   {
    "_id": "671941a31ba408056896c21a",
    "title": "Building Mobile Apps with Flutter",
    "description": "A hands-on workshop on building cross-platform mobile apps using Flutter, covering both beginner and intermediate techniques.",
    "hostname": "DevMaster Academy",
    "date": "2024-11-06T13:00:00.000Z",
    "img": "https://res.cloudinary.com/dpoitpphx/image/upload/v1729675537/Building_Mobile_Apps_with_Flutter_rgua77.jpg",
    "tags": [
      "Mobile Development",
      "Flutter",
      "App Design"
    ],
    "attendees": [
      {
        "name": "John Doe2",
        "numberOfAttendees": 10
      },
      {
        "numberOfAttendees": 4
      }
    ],
    "createdAt": "2024-10-23T18:34:11.860Z",
    "updatedAt": "2024-10-23T22:04:52.538Z",
    "__v": 2,
    "totalAttendees": 14
  },
  {
    "_id": "671942181ba408056896c21c",
    "title": "Python for Beginners",
    "description": "A beginner-friendly introduction to Python, focusing on real-world applications and hands-on exercises.",
    "hostname": "CodeLab Academy",
    "date": "2024-10-30T17:00:00.000Z",
    "img": "https://res.cloudinary.com/dpoitpphx/image/upload/v1729675549/Python_for_Beginners_qi0spd.jpg",
    "tags": [
      "Programming",
      "Python",
      "Coding"
    ],
    "attendees": [
      {
        "numberOfAttendees": 3
      }
    ],
    "createdAt": "2024-10-23T18:36:08.661Z",
    "updatedAt": "2024-10-23T19:24:27.245Z",
    "__v": 1,
    "totalAttendees": 3
  }
]
```

### 3. Indicate Interest in an Event

Allow a user to express interest in a specific event.

- Endpoint: `/event/{eventId}/interest`

- Method: `POST`

- URL: `base_url/api/event/:eventId/interest`

- Headers:
  `Content-Type: application/json`

`Authorization: <your_token_here>`

##### Path Parameters:

eventId: ID of the event to show interest in (e.g., 671793d96f5288a0eb35c0cc)
eg: POST 'https://crowdfind-backend.onrender.com/api/event/671793d96f5288a0eb35c0cc/interest' \

#### Request Body:

```JSON
{
  "numberOfAttendees": 4
}
```

#### Sample Response:

```JSON
{ "message": "Event has been Booked Successfully"}
```

### 5. Save Event
Saves an event to the user's list of saved events without indicating interest.

- Method: `POST`

- URL: `base_url/api/auth/save-event/:eventId`

- Headers:
`Authorization: <your_token_here>`

#### Sample Response:
```JSON
{
  "message": "Event saved successfully."
}
```

## User
### 1. Get User Profile

Retrieves the user's profile information.

- Endpoint: `/api/auth/profile`
- Method: `GET`
- URL: `base_url/api/auth/profile`
- Headers:
  `Content-Type: application/json`
  `Authorization: <your_token_here>`

#### Sample Response:

```JSON
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St, Anytown, USA",
  "profilePicture": "https://res.cloudinary.com/your_cloud_name/image/upload/v1699999999/profile_pictures/user123.png",
  "isVerified": true,
  "interestedEvents": [],
  "totalInterestedEvents": 0
}
```

#### Error Response:

```JSON
  401 Unauthorized: Invalid or missing token.
```

### 2. Update User Profile

Admin-only endpoint to create a new event.

- Endpoint: `/api/auth/profile`
- Method: `PUT`
- URL: `base_url/api/auth/profile`
- Headers:
  `Content-Type: application/json`
  `Authorization: <your_token_here>`

#### Request Body:

```JSON
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "address": "456 New St, Newtown, USA"
}
```

#### Sample Response:

```JSON
{
  "message": "Profile updated successfully."
}
```

#### Error Response:

```JSON
  400 Bad Request: Email already in use by another account.
```

### 3. Upload Profile Picture

Uploads a profile picture to Cloudinary.

- Endpoint: `/api/auth/profile/picture`
- Method: `POST`
- URL: `base_url/api/auth/profile/picture`
- Headers:
  `Content-Type: application/json`
  `Authorization: <your_token_here>`

#### Request Body: Form-data

```
  Key: profilePicture
  Type: File (Choose an image file)
```

#### Sample Response:

```JSON
{
"message": "Profile picture updated successfully.",
"profilePicture": "https://res.cloudinary.com/your_cloud_name/image/upload/v1699999999/profile_pictures/user123.png"
}
```

#### Error Response:

```JSON
  400 Bad Request: No file uploaded or invalid file type.
```

### 4. User's Interested Events
Retrieve all events in which the authenticated user has expressed interest.

- Method: `GET`

- URL: `base_url/api/auth/interested-events`

- Headers:
`Authorization: <your_token_here>`

#### Sample Response:
```JSON
[
  {
    "event": {
      "_id": "671942181ba408056896c21c",
      "title": "Python for Beginners",
      "description": "A beginner-friendly introduction to Python, focusing on real-world applications and hands-on exercises.",
      "hostname": "CodeLab Academy",
      "date": "2024-10-30T17:00:00.000Z",
      "img": "https://res.cloudinary.com/dpoitpphx/image/upload/v1729675549/Python_for_Beginners_qi0spd.jpg",
      "tags": [
        "Programming",
        "Python",
        "Coding"
      ]
    },
    "numberOfAttendees": 3,
    "_id": "67194d6bdd9a28fec1a91a35"
  },
  {
    "event": {
      "_id": "671941a31ba408056896c21a",
      "title": "Building Mobile Apps with Flutter",
      "description": "A hands-on workshop on building cross-platform mobile apps using Flutter, covering both beginner and intermediate techniques.",
      "hostname": "DevMaster Academy",
      "date": "2024-11-06T13:00:00.000Z",
      "img": "https://res.cloudinary.com/dpoitpphx/image/upload/v1729675537/Building_Mobile_Apps_with_Flutter_rgua77.jpg",
      "tags": [
        "Mobile Development",
        "Flutter",
        "App Design"
      ]
    },
    "numberOfAttendees": 4,
    "_id": "67197304c381f1ceb2ca925b"
  }
]
```


### 5. User's Save Event
Saves an event to the user's list of saved events without indicating interest.

- Endpoint: `/api/auth/saved-events`
- Method: `GET`
- URL: `base_url/api/auth/saved-events`
- Headers:
`Authorization: <your_token_here>`

#### Sample Response:
```JSON
{
  "message": "Retrieved saved events successfully.",
  "savedEvents": [
    {
      "_id": "64f12345a21bcd1234567890",
      "title": "Art Exhibition",
      "hostname": "Gallery XYZ",
      "description": "An exclusive art exhibition showcasing contemporary pieces.",
      "date": "2024-12-15T12:00:00Z",
      "img": "https://example.com/art-exhibition.jpg",
      "tags": ["art", "exhibition"]
    },
    {
      "_id": "64f67890a21bcd1234567890",
      "title": "Tech Conference 2024",
      "hostname": "Tech Innovators",
      "description": "A conference for technology enthusiasts and professionals.",
      "date": "2025-01-10T09:00:00Z",
      "img": "https://example.com/tech-conference.jpg",
      "tags": ["tech", "conference"]
    }
  ]
}
```
#### Sample Response If No Events Are Saved:
```JSON
{
    "message": "Retrieved saved events successfully.",
    "savedEvents": []
}
```