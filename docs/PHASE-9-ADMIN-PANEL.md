# Phase 9: Admin Panel - Complete Implementation Guide

## Overview

Phase 9 implements a comprehensive admin panel with role-based access control, dashboard analytics, user management, order management, product management, and inventory tracking.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel                               │
│   - Dashboard Analytics                                      │
│   - User Management                                          │
│   - Order Management                                         │
│   - Product & Inventory Management                           │
└──────────────────┬──────────────────────────────────────────┘
                   │ REST API (Protected Routes)
                   │ Role-Based Access Control
                   ▼
┌──────────────────────────────────────────────────────────────┐
│        Backend (Fastify + Prisma)                            │
│  - Admin Middleware (Role Verification)                      │
│  - Admin Controller (15+ endpoints)                          │
│  - Admin Services (Dashboard, Users, Analytics)              │
│  - Database (PostgreSQL + Prisma ORM)                        │
└──────────────────────────────────────────────────────────────┘
```

## Features Implemented

### ✅ 1. Role-Based Access Control

**User Roles:**
- `SUPER_ADMIN` - Full system access, can manage all users including admins
- `ADMIN` - Can manage managers and customers, full order/product access
- `MANAGER` - Can manage customers and operations, limited system access
- `CUSTOMER` - Regular user (no admin access)

**Role Hierarchy:**
```
SUPER_ADMIN (Level 4)
    ↓
ADMIN (Level 3)
    ↓
MANAGER (Level 2)
    ↓
CUSTOMER (Level 1)
```

**Database Schema Updates:**
```prisma
enum Role {
  CUSTOMER
  ADMIN
  MANAGER
  SUPER_ADMIN
}

model User {
  // ... existing fields
  isActive      Boolean  @default(true)
  lastLogin     DateTime?
  inventoryLogs InventoryLog[]
}

model InventoryLog {
  id          String        @id @default(uuid())
  productId   String
  userId      String
  type        InventoryType
  quantity    Int
  previousQty Int
  newQty      Int
  reason      String?
  notes       String?
  createdAt   DateTime      @default(now())
}

enum InventoryType {
  PURCHASE
  SALE
  RETURN
  ADJUSTMENT
  DAMAGED
  EXPIRED
  RESTOCK
}
```

### ✅ 2. Admin Middleware

**Location:** `src/middleware/admin.middleware.ts`

**Key Functions:**
- `requireAuth()` - Verify JWT authentication
- `requireAdmin(role)` - Verify minimum admin role
- `requireManagerRole` - Manager level access
- `requireAdminRole` - Admin level access
- `requireSuperAdmin` - Super admin only access
- `hasRole(userRole, requiredRole)` - Check role hierarchy
- `canManageUser(currentRole, targetRole)` - Permission check

**Usage Example:**
```typescript
fastify.get('/admin/dashboard', {
  onRequest: [requireManagerRole],
}, handler);

fastify.put('/admin/users/:id/role', {
  onRequest: [requireAdminRole], // Only admins can change roles
}, handler);
```

### ✅ 3. Dashboard Analytics

**Overview Stats:**
- Total users (customers only)
- Total orders
- Total products (active)
- Total revenue (paid orders)
- Recent orders (last 24 hours)
- Low stock products (< 10 items)
- Pending orders count

**Revenue Analytics:**
- Daily revenue tracking
- Period-based analytics (week/month/year)
- Revenue charts data
- Trend analysis

**Product Analytics:**
- Top selling products
- Total quantity sold
- Order count per product
- Current stock levels

**Customer Analytics:**
- New customers (last 30 days)
- Returning customers (2+ orders)
- Active customers (ordered in last 30 days)
- Customer lifetime value

**Order Analytics:**
- Order status breakdown
- Recent orders with details
- Order processing metrics

### ✅ 4. User Management

**Features:**
- List all users with pagination
- Search users by email/name
- Filter by role and status
- View user details and history
- Update user roles (permission-based)
- Toggle user active/inactive status
- View user statistics (orders, spending, reviews)

**Endpoints:**
- `GET /api/admin/users` - List users with filters
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/role` - Update user role (Admin+)
- `PATCH /api/admin/users/:id/status` - Toggle user status (Admin+)

**Permission Rules:**
- Super admins can manage anyone
- Admins can manage managers and customers
- Managers can only manage customers
- Cannot manage users with equal or higher role

### ✅ 5. Order Management

**Features:**
- List all orders with pagination
- Search orders by order number or user email
- Filter by status
- View order details with items
- Update order status
- Add tracking numbers
- Add internal notes
- Automatic timestamp updates

**Order Statuses:**
- `PENDING` - Order received
- `CONFIRMED` - Order confirmed
- `PROCESSING` - Being prepared
- `SHIPPED` - On the way (sets shippedAt)
- `DELIVERED` - Delivered (sets deliveredAt)
- `CANCELLED` - Cancelled

**Endpoints:**
- `GET /api/admin/orders` - List orders with filters
- `PATCH /api/admin/orders/:id/status` - Update order status

### ✅ 6. Product Management

**Features:**
- List all products with pagination
- Search by name or SKU
- Filter by category
- View product details
- Update stock quantities
- Track inventory changes
- View inventory history logs

**Endpoints:**
- `GET /api/admin/products` - List products with filters
- `PATCH /api/admin/products/:id/stock` - Update stock
- `GET /api/admin/products/:id/inventory-logs` - View history

### ✅ 7. Inventory Tracking

**Features:**
- Full audit trail of stock changes
- Automatic logging on stock updates
- Track user who made changes
- Support for multiple operation types
- Reason and notes fields
- Historical stock levels

**Inventory Types:**
- `PURCHASE` - Stock purchased from supplier
- `SALE` - Sold to customer
- `RETURN` - Customer return
- `ADJUSTMENT` - Manual adjustment
- `DAMAGED` - Damaged goods
- `EXPIRED` - Expired items
- `RESTOCK` - Restocking operation

**Stock Update Example:**
```typescript
{
  "quantity": 50,     // Positive for add, negative for reduce
  "type": "PURCHASE",
  "reason": "Received shipment from supplier",
  "notes": "Invoice #12345"
}
```

### ✅ 8. Low Stock Alerts

**Features:**
- Automatic detection of low stock products
- Configurable threshold (default: 10 items)
- Sort by stock level (lowest first)
- Quick view of product details
- Integration with dashboard

## API Endpoints

All endpoints are prefixed with `/api/admin/` and require authentication + appropriate role.

### Dashboard

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/overview` | Manager+ | Overview statistics |
| GET | `/dashboard/revenue?period=month` | Manager+ | Revenue data |
| GET | `/dashboard/top-products?limit=10` | Manager+ | Top selling products |
| GET | `/dashboard/recent-orders?limit=10` | Manager+ | Recent orders |
| GET | `/dashboard/low-stock` | Manager+ | Low stock alerts |

### Users

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/users?page=1&limit=20` | Manager+ | List users |
| GET | `/users?search=john&role=CUSTOMER` | Manager+ | Search/filter users |
| GET | `/users/:id` | Manager+ | User details |
| PUT | `/users/:id/role` | Admin+ | Update user role |
| PATCH | `/users/:id/status` | Admin+ | Toggle user status |

### Orders

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/orders?page=1&limit=20` | Manager+ | List orders |
| GET | `/orders?status=PENDING` | Manager+ | Filter by status |
| GET | `/orders?search=ORD-123` | Manager+ | Search orders |
| PATCH | `/orders/:id/status` | Manager+ | Update order status |

### Products

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/products?page=1&limit=20` | Manager+ | List products |
| GET | `/products?category=protein` | Manager+ | Filter by category |
| GET | `/products?search=whey` | Manager+ | Search products |
| PATCH | `/products/:id/stock` | Manager+ | Update stock |
| GET | `/products/:id/inventory-logs` | Manager+ | View history |

## Request/Response Examples

### 1. Get Dashboard Overview

**Request:**
```http
GET /api/admin/dashboard/overview
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalOrders": 3450,
    "totalProducts": 45,
    "totalRevenue": 125000.50,
    "recentOrders": 23,
    "lowStockProducts": 5,
    "pendingOrders": 12
  }
}
```

### 2. List Users with Pagination

**Request:**
```http
GET /api/admin/users?page=1&limit=20&role=CUSTOMER&search=john
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T10:30:00Z",
      "_count": {
        "orders": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### 3. Update Order Status

**Request:**
```http
PATCH /api/admin/orders/{orderId}/status
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "status": "SHIPPED",
  "trackingNumber": "1Z999AA10123456784",
  "notes": "Shipped via UPS"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-12345",
    "status": "SHIPPED",
    "trackingNumber": "1Z999AA10123456784",
    "shippedAt": "2024-01-15T14:30:00Z",
    "notes": "Shipped via UPS"
  }
}
```

### 4. Update Product Stock

**Request:**
```http
PATCH /api/admin/products/{productId}/stock
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "quantity": 50,
  "type": "PURCHASE",
  "reason": "Received shipment from supplier",
  "notes": "Invoice #12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Premium Protein Powder",
    "sku": "PROTEIN-001",
    "stockQuantity": 150,
    "inStock": true
  }
}
```

### 5. Get User Details

**Request:**
```http
GET /api/admin/users/{userId}
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-12345",
        "total": 99.99,
        "status": "DELIVERED",
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ],
    "stats": {
      "totalOrders": 5,
      "totalSpent": 499.95,
      "totalReviews": 3
    }
  }
}
```

## Security Features

### 1. Role-Based Access Control (RBAC)
- Hierarchical permission system
- Endpoint-level protection
- Role verification on every request

### 2. Permission Checks
- User management respects role hierarchy
- Cannot modify users with equal/higher roles
- Action-specific permissions (e.g., role changes require Admin+)

### 3. Audit Trail
- All inventory changes logged with user ID
- Order status changes tracked
- User role changes logged

### 4. Input Validation
- All inputs sanitized
- Type checking on all endpoints
- Pagination limits enforced

## Error Handling

### Authentication Errors
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Permission Errors
```json
{
  "success": false,
  "message": "Insufficient permissions. Admin access required."
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Invalid input data",
  "error": "Quantity must be a positive number"
}
```

## Database Migrations

After updating the schema, run:
```bash
cd apps/backend
npx prisma migrate dev --name add_admin_roles_and_inventory
npx prisma generate
```

## Testing Admin Features

### 1. Create Admin User
```typescript
// Using Prisma Studio or direct database access
await prisma.user.update({
  where: { email: 'admin@example.com' },
  data: { role: 'SUPER_ADMIN' }
});
```

### 2. Test Authentication
```bash
# Login as admin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Use returned token for admin endpoints
export TOKEN="your_jwt_token_here"

# Test admin endpoint
curl http://localhost:4000/api/admin/dashboard/overview \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Test Role Permissions
```bash
# Try accessing with different roles
# Manager should work:
curl http://localhost:4000/api/admin/dashboard/overview \
  -H "Authorization: Bearer $MANAGER_TOKEN"

# Customer should fail:
curl http://localhost:4000/api/admin/dashboard/overview \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

## Best Practices

### 1. Role Assignment
- Start with MANAGER role for new admin users
- Only assign ADMIN role to trusted personnel
- Reserve SUPER_ADMIN for system administrators
- Regularly audit user roles

### 2. Inventory Management
- Always provide reason for stock adjustments
- Use appropriate inventory types
- Review inventory logs regularly
- Set up low stock alerts

### 3. Order Management
- Update order status promptly
- Add tracking numbers when available
- Use notes for internal communication
- Monitor pending orders daily

### 4. User Management
- Verify user identity before role changes
- Document reason for status changes
- Monitor admin user activity
- Implement IP whitelisting for super admins (future)

### 5. Security
- Rotate admin passwords regularly
- Enable 2FA for admin accounts (future)
- Log all admin actions
- Review access logs weekly

## Troubleshooting

### Issue: "Authentication required"
**Solution:**
- Ensure JWT token is valid
- Check token expiration
- Verify Authorization header format: `Bearer {token}`

### Issue: "Insufficient permissions"
**Solution:**
- Check user role in database
- Verify role hierarchy
- Ensure endpoint requires correct role level

### Issue: Stock update fails
**Solution:**
- Verify product exists
- Check quantity is valid number
- Ensure inventory type is valid enum value

### Issue: Cannot update user role
**Solution:**
- Verify current user has sufficient permissions
- Check target user role (cannot manage equal/higher roles)
- Ensure new role is valid enum value

## Future Enhancements

- [ ] Bulk operations (bulk order updates, bulk stock updates)
- [ ] Export functionality (orders, users, inventory to CSV/Excel)
- [ ] Advanced analytics (cohort analysis, LTV calculations)
- [ ] Activity log/audit trail dashboard
- [ ] Email notifications for low stock
- [ ] Automated reordering system
- [ ] Admin API rate limiting
- [ ] Two-factor authentication for admins
- [ ] IP whitelisting for super admins
- [ ] Custom reports builder

## Support Resources

- **API Documentation**: See this document
- **Database Schema**: `prisma/schema.prisma`
- **Middleware Code**: `src/middleware/admin.middleware.ts`
- **Controller**: `src/controllers/admin.controller.ts`
- **Services**: `src/services/admin-*.service.ts`

---

**Phase 9 Status**: ✅ **COMPLETED**

All admin panel features have been implemented with role-based access control, comprehensive analytics, and full management capabilities.
