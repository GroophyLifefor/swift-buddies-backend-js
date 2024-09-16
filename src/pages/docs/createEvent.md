### POST /api/createEvent

This endpoint allows you to create a new event.

#### Request Body

- Header
- - Authorization: String && Required `means token`

- Body
- - category: String && Required
- - name: String && Required
- - description: String && Required
- - startDate: String && Required
- - dueDate: String && Required
- - latitude: String && Required
- - longitude: String && Required

#### Response

- Status: 200
    
- Content-Type: application/json
    
- Response
- - uid: String


#### cURL

- Request script
```cmd
curl -X POST https://swiftbuddies.vercel.app/api/createEvent -H "Content-Type: application/json" -d '{"token":"1dcdbd20-44c3-41ff-a825-a4e54eb278cb","category": "event","name": "Tech inovation meetup","description": "Tech inovation meetup.","startDate": "2024-08-03T09:00:00Z","dueDate": "2024-08-03T17:00:00Z","latitude": 41.8781,"longitude": -87.6298}' -s | jq .  
```

- Response body:
```json
{
  "uid": "b64670cc-f3f7-4019-a2de-a8bf0019925f"
}
```