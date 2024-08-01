### POST /api/createPost

This endpoint allows the user to create a new post.

#### Request Body

- Body
- - token: String && Required
- - content: String && Required

#### Response

- Status: 200
    
- Content-Type: application/json
    
- Response
- - uid: String


#### cURL

- Request script
```cmd
curl -X POST http://localhost:3000/api/createPost -H "Content-Type: application/json" -d '{"token": "your_token", "content": "I love SwiftBuddies"}' -s | jq .  
```

- Response body:
```json
{
  "uid": "05eabbf9-3459-49c1-b739-38db6d278172"
}
```