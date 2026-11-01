# Library API Documentation

Base URL: `https://api.library.com/v1`

## Endpoints

### 1. List All Books
- **Method:** `GET`
- **Path:** `/books`
- **Description:** Retrieves a list of all books in the library inventory.
- **Request Body:** None
- **Success Status Code:** `200 OK`

### 2. Get One Book
- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Retrieves details for a single book specified by its ID.
- **Request Body:** None
- **Success Status Code:** `200 OK`

### 3. Create a Book
- **Method:** `POST`
- **Path:** `/books`
- **Description:** Adds a new book to the library catalog.
- **Request Body Example:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publishedYear": 2008
  }