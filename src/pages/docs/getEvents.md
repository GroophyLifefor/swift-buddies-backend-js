### GET /api/getEvents

This endpoint retrieves a list of events.

#### Request Body

- Body
- - token: String && Required
- - query: String && **Optional**
- - fromCategory: String && **Optional**

#### Response

- Status: 200
    
- Content-Type: application/json
    
- Response
- - count: Number
- - events: Object[] (Look at the cURL response)


#### cURL

- Request script
```cmd
curl -X GET http://localhost:3000/api/getEvents -H "Content-Type: application/json" -d '{"token": "your_token"}' -s | jq .  
```

- Response body:
```json
{
  "count": 12,
  "events": [
    {
      "_id": "66ab3e0c3a04a89a63d6a943",
      "uid": "d80f9e52-bcb8-4325-b876-ee0419de0378",
      "owner_uid": "6d2ef973-ea0c-4f59-85d4-574f21b523b2",
      "category": "hackathon",
      "name": "Global Hackathon",
      "description": "A 48-hour coding competition.",
      "startDate": "2024-08-01T08:00:00Z",
      "dueDate": "2024-08-03T08:00:00Z",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "__v": 0
    },
    ... (11 more content)
  ]
}
```

- Request script (with just query)
```cmd
curl -X GET http://localhost:3000/api/getEvents -H "Content-Type: application/json" -d '{"token": "your_token", "query": "webinar"}' -s | jq .  
```

- Response body:
```json
{
  "count": 1,
  "events": [
    {
      "_id": "66ab3e073a04a89a63d6a940",
      "uid": "d12977a3-dc4b-4c83-827a-02f6300f5fb2",
      "owner_uid": "6d2ef973-ea0c-4f59-85d4-574f21b523b2",
      "category": "webinar",
      "name": "Web Development Webinar",
      "description": "An online webinar about modern web development techniques.",
      "startDate": "2024-08-05T14:00:00Z",
      "dueDate": "2024-08-05T16:00:00Z",
      "latitude": 51.5074,
      "longitude": -0.1278,
      "__v": 0
    }
  ]
}
```

- Request script (with just fromCategory)
```cmd
curl -X GET http://localhost:3000/api/getEvents -H "Content-Type: application/json" -d '{"token": "your_token", "fromCategory": "networking"}' -s | jq .  
```

- Response body:
```json
{
    "count": 1,
    "events": [
        {
            "_id": "66ab3e103a04a89a63d6a946",
            "uid": "47849e92-de84-4e64-b163-0e1b482671ee",
            "owner_uid": "6d2ef973-ea0c-4f59-85d4-574f21b523b2",
            "category": "networking",
            "name": "Tech Networking Event",
            "description": "An event to network with professionals in the tech industry.",
            "startDate": "2024-08-04T18:00:00Z",
            "dueDate": "2024-08-04T21:00:00Z",
            "latitude": 35.6895,
            "longitude": 139.6917,
            "__v": 0
        }
    ]
}
```

- Request script (with query and fromCategory)
```cmd
curl -X GET https://swiftbuddies.vercel.app/api/getEvents -H "Content-Type: application/json" -d '{"token": "your_token", "query": "tech", "fromCategory": "networking" }' -s | jq .  
```

- Response body:
```json
{
    "count": 1,
    "events": [
        {
            "_id": "66ab3e103a04a89a63d6a946",
            "uid": "47849e92-de84-4e64-b163-0e1b482671ee",
            "owner_uid": "6d2ef973-ea0c-4f59-85d4-574f21b523b2",
            "category": "networking",
            "name": "Tech Networking Event",
            "description": "An event to network with professionals in the tech industry.",
            "startDate": "2024-08-04T18:00:00Z",
            "dueDate": "2024-08-04T21:00:00Z",
            "latitude": 35.6895,
            "longitude": 139.6917,
            "__v": 0
        }
    ]
}
```