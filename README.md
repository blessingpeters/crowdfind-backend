# crowdfind-backend
### CrowdFind  allows users to view, search for, and indicate interest in events


# API Documentation
Welcome to the Crowd Find API documentation. This API allows users to register, authenticate, view events, indicate interest in events, and retrieve events they are interested in.
The API follows RESTful principles and uses JSON for data interchange.

- base_url: https://crowdfind-backend.onrender.com

###  Return Codes
| Status Code | Description |
| :--- | :--- |
| 200 | OK |
| 201 | CREATED |
| 400 | BAD REQUEST |
| 401 | UNAUTHORIZED |
| 404 | NOT FOUND |
| 500 | INTERNAL SERVER ERROR |

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
    { "message": "User registered successfully"}
```


### 2. Login User
Authenticate a user and obtain a JWT token for authorized requests.

- Endpoint: `/api/auth/login`

- Method: `POST`

-  URL: `base_url/api/auth/login`

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
{
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
  "_id": "671942181ba408056896c21c",
  "attendees": [],
  "createdAt": "2024-10-23T18:36:08.661Z",
  "updatedAt": "2024-10-23T18:36:08.661Z",
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

