# Groceries Project Entity Relationship Diagram

## Database Schema

### Tables

#### Users
- `id` (PK, Integer)
- `username` (String, Unique)
- `email` (String, Unique)
- `password_hash` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Products
- `id` (PK, Integer)
- `name` (String)
- `description` (Text)
- `price` (Decimal)
- `category` (String)
- `in_stock` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### ShoppingLists
- `id` (PK, Integer)
- `user_id` (FK → Users.id)
- `name` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### ListItems
- `id` (PK, Integer)
- `list_id` (FK → ShoppingLists.id)
- `product_id` (FK → Products.id)
- `quantity` (Integer)
- `purchased` (Boolean, default=False)

## Relationships
- One `User` can have many `ShoppingLists` (One-to-Many)
- One `ShoppingList` can have many `ListItems` (One-to-Many)
- One `Product` can be in many `ListItems` (One-to-Many)

## Diagram
```
erDiagram
    USERS ||--o{ SHOPPING_LISTS : "has"
    SHOPPING_LISTS ||--o{ LIST_ITEMS : "contains"
    PRODUCTS ||--o{ LIST_ITEMS : "referenced_in"
    
    USERS {
        int id PK
        string username
        string email
        string password_hash
        datetime created_at
        datetime updated_at
    }
    
    SHOPPING_LISTS {
        int id PK
        int user_id FK
        string name
        datetime created_at
        datetime updated_at
    }
    
    PRODUCTS {
        int id PK
        string name
        text description
        decimal price
        string category
        boolean in_stock
        datetime created_at
        datetime updated_at
    }
    
    LIST_ITEMS {
        int id PK
        int list_id FK
        int product_id FK
        int quantity
        boolean purchased
    }
    ```