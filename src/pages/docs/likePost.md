### POST /api/likePost

This endpoint allows the user to like a post by sending a POST request to the specified URL.

#### Request Body

- Body
- - token: String && Required
- - post_uid: String && Required

#### Response

- Status: 200
    
- Content-Type: application/json
    
- Response
- - action: 'liked' || 'unliked'


#### cURL

- Request script
```cmd
curl -X POST https://swiftbuddies.vercel.app/api/likePost -H "Content-Type: application/json" -d '{"token": "your_token", "post_uid": "05eabbf9-3459-49c1-b739-38db6d278172"}' -s | jq .  
```

- Response body:
```json
{
    "action": "liked"
}
```