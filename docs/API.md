# Groceries Project API Documentation

## Base URL
`https://api.groceries-project.com/v1/`

## Authentication
All endpoints require JWT authentication unless noted otherwise.

## Endpoints

### Users
- `POST /users/register` - Register a new user
  - Request body: `{ "username": "string", "email": "string", "password": "string" }`
  
- `POST /users/login` - Authenticate user
  - Request body: `{ "username": "string", "password": "string" }`
  - Returns: JWT token

- `GET /users/profile` - Get current user profile
  - Returns: `{ "id": "int", "username": "string", "email": "string" }`

### Products
- `GET /products` - List all products
  - Query params: `category`, `search`, `limit`, `offset`
  - Returns: Paginated list of products

- `GET /products/{id}` - Get product details
  - Returns: `{ "id": "int", "name": "string", "description": "string", "price": "float", "category": "string", "in_stock": "boolean" }`

- `POST /products` - Create new product (Admin only)
  - Request body: Product details

### Shopping Lists
- `GET /lists` - Get user's shopping lists
  - Returns: Array of shopping lists

- `POST /lists` - Create new shopping list
  - Request body: `{ "name": "string", "items": [{"product_id": "int", "quantity": "int"}] }`

- `GET /lists/{id}` - Get shopping list details
  - Returns: Shopping list with items

## Error Responses
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error