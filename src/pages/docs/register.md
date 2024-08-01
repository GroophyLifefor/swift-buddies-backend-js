### POST /api/register

The POST /api/register endpoint is used to register a user. The request should include a JSON payload with the keys registerType and accessToken.

#### Request Body

- Body
- - registerType: 'google' || 'apple' && Required
- - accessToken: String && Required

#### Response

- Status: 200
    
- Content-Type: application/json
    
- Response
- - type: 'new' || 'existing'
- - token: String


#### cURL

- Request script
```cmd
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"registerType": "google", "accessToken": "your_access_token_here"}' -s | jq .  
```

- Response body:
```json
{
  "token": "your_new_token",
  "type": "new"
}
```