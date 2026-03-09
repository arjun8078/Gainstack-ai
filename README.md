# 🏋️ GainStack AI

AI-powered fitness tracking platform built with MEAN stack (MongoDB, Express, Angular, Node.js)

## 🚀 Features

### ✅ Completed
- **Authentication System**
  - JWT-based authentication with bcrypt password hashing
  - HTTP interceptors for automatic token injection
  - Functional route guards (AuthGuard, GuestGuard)
  - Angular Signals for reactive state management
  - Token expiration validation with auto-logout

### 🔨 In Development
- **Workout Tracking**
  - CRUD operations for workout sessions
  - Exercise library with pre-defined exercises
  - Personal record tracking
  - Progress analytics

### 📋 Planned
- **Nutrition Tracking**
  - Meal logging with macro tracking
  - Daily nutrition summaries
  - Food database integration

- **AI Integration**
  - OpenAI GPT-4 powered workout recommendations
  - Personalized meal planning
  - Progress analysis and insights

- **Real-time Features**
  - Live workout timer via WebSockets
  - Real-time progress updates

- **Analytics Dashboard**
  - Chart.js visualizations
  - Workout frequency tracking
  - Progress trends

## 🛠️ Tech Stack

**Frontend:**
- Angular 19 (Signals, Standalone Components)
- TypeScript 5
- RxJS 7
- Angular Material
- Chart.js (planned)

**Backend:**
- Node.js 20
- Express.js 4
- MongoDB 7 with Mongoose
- JWT authentication
- bcrypt

**DevOps (Planned):**
- Docker
- GitHub Actions CI/CD
- Azure/AWS deployment

## 📦 Installation

### Prerequisites
- Node.js 20+
- MongoDB 7+
- Angular CLI 19+

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

Navigate to `http://localhost:4200`

## 🏗️ Architecture

### Database Design
- **Hybrid Approach**: Embedded documents + Denormalized aggregations
- **Workouts Collection**: Embedded exercises and sets for fast reads
- **Personal Records Collection**: Pre-computed best performances
- **Exercise Templates**: Reference data for exercise library

### Authentication Flow
- JWT tokens with 7-day expiration
- HTTP interceptor adds tokens to all requests
- Route guards protect private routes
- Angular Signals manage auth state

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register  - Create new user
POST   /api/auth/login     - Login user
GET    /api/auth/me        - Get current user (protected)
```

### Workouts (In Development)
```
POST   /api/workouts       - Create workout
GET    /api/workouts       - Get user workouts
GET    /api/workouts/:id   - Get single workout
PUT    /api/workouts/:id   - Update workout
DELETE /api/workouts/:id   - Delete workout
```

## 🎯 Project Goals

This project demonstrates:
- Full-stack development with modern MEAN stack
- Secure authentication implementation
- RESTful API design
- State management with Angular Signals
- MongoDB schema design for nested data
- Preparation for AI integration
- Production-ready code patterns

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📝 License

MIT

## 👤 Author

[Your Name]
- LinkedIn: [Your LinkedIn]
- Portfolio: [Your Website]
- Email: [Your Email]

---

**Building in public. Learning every day.** 🚀