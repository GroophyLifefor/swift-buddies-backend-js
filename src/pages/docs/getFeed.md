### GET /api/getFeed

This endpoint retrieves the feed data.

#### Request Body

- Header
- - Authorization: String && Required `means token`

- Query
- - range: "{value}-{value}" && Required

#### Response

- Status: 200
    
- Content-Type: application/json
    
- Response
- - feed: Object[] (Look at the cURL response)


#### cURL

- Request script
```cmd
curl -X GET "https://swiftbuddies.vercel.app/api/getFeed?token=your_token&range=0-2" -s | jq .
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
        "uid": "43efdcf4-248e-4f75-a6e0-4f2f8afe850b",
        "sharedDate": "2024-07-30T08:09:39.197Z",
        "content": "Hello my #event be awesome!!13",
        "images": [],
        "likeCount": 1,
        "likers": [
          {
            "name": "Doğukaan Kılıçarslan",
            "picture": "https://lh3.googleusercontent.com/a/ACg8ocK77gqVed23kSUOBt88oAx-2860IQS1z6DA82VuucpYv6o4mA=s96-c"
          }
        ],
        "commentCount": 0,
        "comments": [],
        "hashtags": [
          "#event"
        ]
      }
    },
    {
      "user": {
        "name": "Doğukaan Kılıçarslan",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocK77gqVed23kSUOBt88oAx-2860IQS1z6DA82VuucpYv6o4mA=s96-c"
      },
      "post": {
        "uid": "1e19acb3-63e6-424c-a08c-bd649fbf5767",
        "sharedDate": "2024-07-30T08:09:37.447Z",
        "content": "Hello my #event be awesome!!12",
        "images": [],
        "likeCount": 0,
        "likers": [],
        "commentCount": 0,
        "comments": [],
        "hashtags": [
          "#event"
        ]
      }
    }
  ]
}
```