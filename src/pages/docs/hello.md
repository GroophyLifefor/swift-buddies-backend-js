### POST /api/hello

This endpoint allows you to send a POST request to retrieve a greeting message.

#### Request Body

\-

#### Response

- Status: 200
    
- Content-Type: application/json
    
- `message` (string): The greeting message returned by the API.


#### cURL

- Request script
```cmd
curl -X GET http://localhost:3000/api/hello -s | jq .  
```

- Response body:
```json
{
  "message": "Welcome to Swiftbuddies api service."
}
```