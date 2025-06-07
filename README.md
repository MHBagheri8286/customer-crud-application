# Customer CRUD Application

A modern, scalable CRUD application built with React, TypeScript, and Tailwind CSS following Domain-Driven Design (DDD) and Test-Driven Development (TDD) principles.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, and Delete customers
- **Advanced Validation**: 
  - Mobile phone number validation using Google LibPhoneNumber
  - Email format validation
  - Bank account number validation
  - Unique customer validation (FirstName + LastName + DateOfBirth)
  - Email uniqueness validation
- **Local Storage**: Persistent data storage in browser
- **Clean Architecture**: Following DDD principles with clear separation of concerns
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive unit tests with Vitest
- **Modern UI**: Responsive design with Tailwind CSS

## 🏗️ Architecture

This application follows Clean Architecture and Domain-Driven Design principles:

```
src/
├── components/          # UI Components (Presentation Layer)
│   ├── ui components    # Reusable UI components
│   └── customer/        # Customer-specific components
├── domain/              # Domain Layer (Business Logic)
│   ├── entities/        # Business entities
│   ├── repositories/    # Repository interfaces
|   ├── models           # Domain models
│   └── services/        # Domain services
├── infrastructure/      # Infrastructure Layer        
│   └── storage/         # Local storage implementation
├── utils/               # Application Utilities
├── hooks/               # Custom React hooks
└── tests/               # Test files
```

## 📋 Customer Model

```typescript
Customer {
  id: string (UUID)
  firstName: string
  lastName: string
  dateOfBirth: string (YYYY-MM-DD)
  phoneNumber: string (mobile only)
  email: string (unique)
  bankAccountNumber: string
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Technology Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling and validation
- **Yup** - Schema validation
- **Google LibPhoneNumber** - Phone number validation
- **Vitest** - Testing framework
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start the development server**
```bash
npm run dev
```

3. **Open your browser**
Navigate to `http://localhost:3000`

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier

# Testing
npm run test            # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage report
```

## 🧪 Testing Strategy

The application follows Test-Driven Development (TDD) with comprehensive unit tests:

- **Domain Tests**: Business logic and entity validation
- **Infrastructure Tests**: Repository and validation service tests
- **Application Tests**: Use case testing
- **Component Tests**: React component testing with React Testing Library

Run tests:
```bash
npm run test
```

## 🔐 Validation Rules

### Phone Number
- Must be a valid mobile number
- Uses Google LibPhoneNumber for validation
- International format supported (+1234567890)

### Email
- Must be valid email format
- Must be unique across all customers

### Bank Account Number
- Only numeric characters allowed

### Customer Uniqueness
- Combination of FirstName + LastName + DateOfBirth must be unique
- Case-insensitive comparison

### Age Validation
- Customers Age must be entered

## 🏗️ Development Practices

### Clean Architecture
- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External concerns (storage, validation)
- **Presentation Layer**: React components and UI logic

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting with strict rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Clear commit message format

### Testing
- **Unit Tests**: Domain logic and components
- **Integration Tests**: Use case testing
- **Mocking**: External dependencies properly mocked

## 🔄 Data Flow

1. **User Interaction** → UI Component
2. **Component** → Custom Hook (useCustomers)
3. **Hook** → Use Case (Application Layer)
4. **Use Case** → Repository & Validation Service
5. **Repository** → Local Storage

## 🗂️ Local Storage Schema

Data is stored in localStorage with the key `customers`:

```json
{
  "customers": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "phoneNumber": "+1234567890",
      "email": "john.doe@example.com",
      "bankAccountNumber": "12345678",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🐛 Error Handling

The application implements comprehensive error handling:

- **Validation Errors**: Field-specific error messages
- **Business Rule Violations**: Clear user feedback
- **Form Errors**: React Hook Form validation feedback

## 🚀 Deployment

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.`