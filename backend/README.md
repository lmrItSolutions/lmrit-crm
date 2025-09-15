# CRM Backend API

A comprehensive Node.js backend for the CRM system with Aria dialer integration, built with Express.js and MongoDB.

## 🚀 Features

- **Authentication & Authorization** - JWT-based authentication with role-based access control
- **Lead Management** - Complete CRUD operations for leads with filtering and pagination
- **Client Management** - Full client lifecycle management
- **Activity Tracking** - Track all activities and interactions
- **Call Logs** - Comprehensive call logging with Aria dialer integration
- **Team Management** - User and team management with permissions
- **WhatsApp Integration** - WhatsApp messaging capabilities
- **Aria Dialer Integration** - Secure dialer integration with number masking
- **Security** - Rate limiting, CORS, helmet, and input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit the .env file with your configuration
   ```

4. **Environment Variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/crm_system
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Aria API Configuration
   ARIA_API_URL=https://your-aria-api-url.com
   ARIA_API_KEY=your-aria-api-key
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5174
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "agent"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile

#### PUT /api/auth/profile
Update user profile

### Lead Management

#### GET /api/leads
Get all leads with filtering
```
Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10, max: 100)
- status: Filter by status (New, Contacted, Qualified, Lost, Converted)
- search: Search in name, email, company
- assignedTo: Filter by assigned user ID
```

#### POST /api/leads
Create new lead
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9712345678",
  "company": "Tech Solutions Inc",
  "status": "New",
  "source": "Website",
  "value": 50000,
  "assignedTo": "user_id_here",
  "description": "Interested in our services"
}
```

#### GET /api/leads/:id
Get single lead

#### PUT /api/leads/:id
Update lead

#### DELETE /api/leads/:id
Delete lead (soft delete)

### Client Management

#### GET /api/clients
Get all clients with filtering

#### POST /api/clients
Create new client
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "+91 9876543210",
  "company": "Digital Marketing Co",
  "industry": "Technology",
  "status": "Active",
  "assignedTo": "user_id_here"
}
```

### Aria Dialer Integration

#### POST /api/aria/login
Login to Aria dialer
```json
{
  "username": "aria_username",
  "password": "aria_password"
}
```

#### POST /api/aria/dial
Dial a number
```json
{
  "phoneNumber": "+91 9712345678",
  "leadId": "lead_id_here"
}
```

#### GET /api/aria/call-status/:callId
Get call status

#### POST /api/aria/end-call/:callId
End a call

#### GET /api/aria/call-logs
Get call logs for current user

### Activity Management

#### GET /api/activities
Get all activities

#### POST /api/activities
Create new activity
```json
{
  "type": "Call",
  "title": "Follow-up call",
  "description": "Call to discuss proposal",
  "relatedTo": {
    "type": "Lead",
    "id": "lead_id_here"
  },
  "assignedTo": "user_id_here",
  "priority": "High",
  "dueDate": "2024-01-15T10:00:00Z"
}
```

### Team Management

#### GET /api/teams
Get all team members (Admin/Manager only)

#### PUT /api/teams/:id
Update team member (Admin only)

#### DELETE /api/teams/:id
Delete team member (Admin only)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🎯 Roles and Permissions

- **Admin**: Full access to all features
- **Manager**: Access to team management and reports
- **Agent**: Basic CRM operations (leads, clients, activities)

## 📊 Database Models

### User
- Authentication and profile information
- Role-based permissions
- Aria dialer integration

### Lead
- Lead information and status
- Assignment and tracking
- Notes and activities

### Client
- Client information and status
- Contact details and company info
- Deals and notes

### Activity
- Activity tracking and management
- Related entities (leads, clients, deals)
- Status and priority management

### CallLog
- Call history and recordings
- Aria dialer integration
- Call outcomes and notes

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Granular permissions
- **Input Validation** - Express-validator for all inputs
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Password Hashing** - bcrypt for password security

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/crm_system |
| JWT_SECRET | JWT secret key | Required |
| JWT_EXPIRE | JWT expiration | 7d |
| ARIA_API_URL | Aria API base URL | Required |
| ARIA_API_KEY | Aria API key | Required |
| CORS_ORIGIN | CORS allowed origin | http://localhost:5174 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team. 