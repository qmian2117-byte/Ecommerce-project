# AI Agent Instructions for Stack-Course E-Commerce Project

## Project Architecture

This is a full-stack e-commerce project with separated frontend and backend:

- `Frontend/`: React/Tailwind CSS frontend with responsive design
- `backend/`: Express.js REST API with MongoDB

### Key Components

#### Backend (`/backend`)
- **Models** (`/model`): Mongoose schemas for User, Product, Token
- **Controllers** (`/controller`): Business logic for routes
- **Routes** (`/router`): API endpoint definitions
- **Middleware** (`/router/middleware`): Auth, admin checks, file upload
- **Config** (`/config`): Database connection
- **Utilities** (`/utility`): Email sending, etc.

#### Frontend (`/Frontend`)
- **Source** (`/src`): Main application code
- **Components**: Responsive UI using Tailwind CSS
- **Assets** (`/img`): Images and static resources

## Development Patterns

### Authentication
- JWT-based auth using `authcheck` middleware
- Admin routes protected by `checkadmin` middleware
- Token management in `token.js` controller/model

```js
// Example protected route
router.get("/", authcheck, checkadmin, getusers);
```

### Database Operations
- Always use try/catch with proper error responses
- Follow mongoose schema validation
- Use proper MongoDB indexes for performance

```js
// Example model pattern
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, default: "deactive" }
});
```

### API Endpoints
- RESTful routes in `/router`
- Consistent error handling
- File uploads handled by multer middleware

### Frontend Conventions
- Responsive design using Tailwind breakpoints
- Component-based architecture
- Fetch API for backend communication

## Common Commands

1. Start backend server:
```bash
cd backend
npm install
npm start  # Runs on http://localhost:8000
```

2. Start frontend:
```bash
cd Frontend
npm install
npm start  # Runs on http://localhost:3000
```

## Critical Patterns

1. **Error Handling**:
```javascript
try {
  // Operation
  res.status(200).json({ message: "Success", data: result });
} catch (error) {
  res.status(500).json({ message: "Internal server error", error: error.message });
}
```

2. **Authentication Checks**:
```javascript
// Always use authcheck middleware for protected routes
router.put("/:id", authcheck, userupdate);
```

3. **File Upload**:
```javascript
router.post("/create", authcheck, checkadmin, upload.single("productImage"), createProduct);
```

4. **Environment Variables**:
- Required in `.env`:
  - `MONGO_URL`: MongoDB connection string
  - `JWT_SECRET`: JWT signing key
  - `PORT`: Server port (default 8000)

## Integration Points

1. **Frontend-Backend Communication**:
- Backend API at `http://localhost:8000`
- Frontend serves static files from `/uploads`
- CORS enabled for development

2. **Database**:
- MongoDB connection handled in `dbconnection.js`
- Models define data structure
- Indexes on frequently queried fields