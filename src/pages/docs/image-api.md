# Image API Documentation

## Upload Image
- **Endpoint**: POST /api/uploadImage
- **Authentication**: Required (Bearer token)
- **Request Body**:
  ```json
  {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "isPrivate": false
  }
  ```
- **Response**: 
  ```json
  {
    "uid": "image-uid-here"
  }
  ```

## Get Image
- **Endpoint**: GET /api/getImage
- **Authentication**: Required (Bearer token)
- **Query Parameters**: 
  - uid: Image UID
- **Response**:
  ```json
  {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
  ```

## Usage with Posts
When creating a post, you should:
1. Upload each image separately using the uploadImage endpoint
2. Collect the returned image UIDs
3. Include the image UIDs in the createPost request 