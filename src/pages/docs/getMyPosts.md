### GET /api/getMyPosts

This endpoint retrieves the posts associated with the user's account.

#### Request Body

- Header
- - Authorization: String && Required `means token`

- Body
- - None

#### Response

- Status: 200
    
- Content-Type: application/json
    
- Response
- - feed: Object[] (Look at the cURL response)


#### cURL

- Request script
```cmd
curl -X GET https://swiftbuddies.vercel.app/api/getMyPosts -H "Content-Type: application/json" -d '{"token": "your_token"}' -s | jq .  
```

- Response body:
```json
{
  "feed": [
    {
      "user": {
        "name": "Doğukaan Kılıçarslan",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocK77gqVed23kSUOBt88oAx-2860IQS1z6DA82VuucpYv6o4mA=s96-c"
      },
      "post": {
        "uid": "05eabbf9-3459-49c1-b739-38db6d278172",
        "sharedDate": "2024-08-01T08:16:35.077Z",
        "content": "I love SwiftBuddies",
        "images": [],
        "likeCount": 0,
        "likers": [],
        "commentCount": 0,
        "comments": [],
        "hashtags": []
      }
    },
    ... (9 more content)
  ]
}
```