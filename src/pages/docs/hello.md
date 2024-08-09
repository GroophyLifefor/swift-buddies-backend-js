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
curl -X GET https://swiftbuddies.vercel.app/api/hello -s | jq .  
```

- Response body:
```json
{
  "message": "Welcome to Swiftbuddies api service."
}
```