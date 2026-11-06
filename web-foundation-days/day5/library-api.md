# Library Management API Documentation

## Endpoints

### 1. Get All Books
* **Method:** `GET`
* **Path:** `/api/books`
* **Description:** Retrieves a list of all books in the library system.
* **Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Software Engineering",
    "available": true
  }
]
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Software Engineering",
    "available": true
  }
]
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Software Engineering",
  "available": true
}
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "Software Engineering"
}
{
  "id": 2,
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "Software Engineering",
  "available": true
}
{
  "title": "Clean Code (2nd Edition)",
  "author": "Robert C. Martin",
  "genre": "Software Engineering",
  "available": false
}
{
  "id": 1,
  "title": "Clean Code (2nd Edition)",
  "author": "Robert C. Martin",
  "genre": "Software Engineering",
  "available": false
}
{
  "error": "Bad Request",
  "message": "Missing required field: title"
}
{
  "error": "Not Found",
  "message": "Book with ID 9999 was not found."
}

