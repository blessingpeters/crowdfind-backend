# crowfind-backend
### CrowdFind that allows users to view, search for, and indicate interest in events


# API Documentation
Welcome to the Crowd Find API documentation. This API allows users to register, authenticate, view events, indicate interest in events, and retrieve events they are interested in.
The API follows RESTful principles and uses JSON for data interchange.

- base_url: https://crowfind-backend.onrender.com

###  Return Codes
| Status Code | Description |
| :--- | :--- |
| 200 | OK |
| 201 | CREATED |
| 400 | BAD REQUEST` |
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTdlMTNiODBkZDdkYTEzMzc2ZjUyMSIsImlhdCI6MTcyOTYxODU0OSwiZXhwIjoxNzI5NjIyMTQ5fQ.F5qnEIHNLjZ6Eb31AB5pjdQGo6KO-xWpsYW4GANhQpI"
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
"title": "Tech Conference 2024",
"description": "A conference about the latest in technology.",
"date": "2024-11-15T09:00:00Z"
}
```

#### Sample Response:
```JSON
{
"_id": "671793d96f5288a0eb35c0cc", 
"title": "Tech Conference 2024", 
"description": "A conference about the latest in technology.", 
"date": "2024-11-15T09:00:00.000Z", 
"attendees": [],
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
        "_id": "671793d96f5288a0eb35c0cc",
        "title": "Tech Conference 2024",
        "description": "A conference about the latest in technology.",
        "date": "2024-11-15T09:00:00.000Z",
        "attendees": [ { "_id": "user_id_here", "name": "John Doe" } ],
        "v": 1
    }, 
    { 
        "_id": "another_event_id",
        "title": "Art Workshop",
        "description": "A workshop for aspiring artists.",
        "date": "2024-12-01T14:00:00.000Z",
        "attendees": [],
        "v": 0
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
`Authorization: your token`

##### Path Parameters:
eventId: ID of the event to show interest in (e.g., 671793d96f5288a0eb35c0cc)
eg: POST 'https://crowdfind-backend.onrender.com/api/event/671793d96f5288a0eb35c0cc/interest' \

#### Sample Response:
```JSON
{ "message": "Interest noted"}
```



### 4. User's Interested Events
Retrieve all events in which the authenticated user has expressed interest.

- Method: `GET`

- URL: `base_url/api/auth/interested-events`

- Headers:
`Authorization: your token`

#### Sample Response:
```JSON
[
    {
        "_id": "671793d96f5288a0eb35c0cc",
        "title": "Tech Conference 2024",
        "description": "A conference about the latest in technology.",
        "date": "2024-11-15T09:00:00.000Z",
        "attendees": [ { "_id": "user_id_here", "name": "John Doe" } ], "v": 1
    },
    {
        "_id": "671793d96f52889b0eb35c0ad",
        "title": "Art Workshop",
        "description": "A workshop for aspiring artists.",
        "date": "2024-12-01T14:00:00.000Z",
        "attendees": [],
        "v": 0
    }
]
```

