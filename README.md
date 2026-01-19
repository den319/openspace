# 🚗 OpenSpace - Smart Parking & Valet Management System

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white)](https://graphql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

![OpenSpace Banner Image]
*[Add a banner image showing the OpenSpace logo and key features]*

> **OpenSpace** is a comprehensive parking and valet management platform that connects customers, garage operators, managers, and valets through an intuitive digital ecosystem. Experience seamless parking reservations, real-time valet tracking, and efficient garage operations.

## ✨ Features

### 🅿️ Customer Experience
- **Smart Booking System**: Real-time garage availability and instant booking
- **Valet Services**: Request pickup/drop-off services with live tracking
- **3D Garage Visualization**: Interactive 3D maps of parking facilities
- **Payment Integration**: Secure Stripe payments for all transactions
- **Mobile-First Design**: Responsive web application for all devices

### 🏢 Garage Management
- **Multi-Garage Support**: Manage multiple parking facilities
- **Slot Management**: Dynamic slot allocation and pricing
- **Real-time Availability**: Live updates on parking space status
- **Verification System**: Admin-approved garage listings
- **Image Management**: Photo galleries for each garage

### 👥 User Management
- **Role-Based Access**: Separate interfaces for customers, managers, valets, and admins
- **Authentication**: Secure JWT-based authentication with NextAuth.js
- **Profile Management**: User profiles with preferences and history
- **Company Structure**: Hierarchical company and garage management

### 📊 Analytics & Operations
- **Booking Timeline**: Complete audit trail of all parking activities
- **Valet Assignment**: Automated and manual valet service coordination
- **Review System**: Customer feedback and rating system
- **Reporting Dashboard**: Comprehensive analytics for operators

![Features Overview Image]
*[Add a features overview image or diagram showing the main capabilities]*

## 🏗️ Architecture

OpenSpace follows a modern micro-frontend architecture with shared libraries and multiple specialized applications.

```
openspace/
├── apps/
│   ├── api/                 # NestJS GraphQL API Backend
│   ├── web/                 # Customer Web Application (Port 3001)
│   ├── web-admin/           # Admin Management Portal (Port 3004)
│   ├── web-manager/         # Garage Manager Dashboard
│   └── web-valet/           # Valet Mobile Application
├── libs/
│   ├── 3d/                  # Three.js 3D Visualization Library
│   ├── forms/               # Shared Form Components & Validation
│   ├── network/             # GraphQL Client & API Utilities
│   ├── ui/                  # Reusable UI Component Library
│   └── util/                # Utility Functions & Types
└── tools/                   # Development Tools & Scripts
```

![Architecture Diagram Image]
*[Add an architecture diagram showing the relationships between different applications and libraries]*

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **API**: [GraphQL](https://graphql.org/) with Apollo Server
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT with [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Stripe](https://stripe.com/) integration
- **Validation**: [class-validator](https://github.com/typestack/class-validator)

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive design
- **State Management**: React hooks and context
- **3D Graphics**: [Three.js](https://threejs.org/) for garage visualization
- **Icons**: [Tabler Icons](https://tabler-icons.io/)

### Development Tools
- **Monorepo**: [Nx](https://nx.dev/) workspace management
- **TypeScript**: Full type safety across the entire stack
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Testing**: Jest for unit and integration tests

![Tech Stack Image]
*[Add a tech stack visualization or logo collage]*

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Yarn** package manager
- **PostgreSQL** database
- **Docker** (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/openspace.git
   cd openspace
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Copy the example environment files and configure them:

   ```bash
   # API Environment
   cp apps/api/.env.example apps/api/.env

   # Web Applications
   cp apps/web/.env.example apps/web/.env
   cp apps/web-admin/.env.example apps/web-admin/.env
   cp apps/web-manager/.env.example apps/web-manager/.env
   cp apps/web-valet/.env.example apps/web-valet/.env
   ```

   Configure the following key variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Authentication secret
   - `STRIPE_SECRET_KEY`: Stripe payment secret
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID

4. **Set up the database**

   ```bash
   # Navigate to API directory
   cd apps/api

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development servers**

   ```bash
   # From project root
   yarn dev

   # Or start services individually:
   yarn nx serve api          # API server (Port 3000)
   yarn nx serve web          # Customer app (Port 3001)
   yarn nx serve web-admin    # Admin panel (Port 3004)
   yarn nx serve web-manager  # Manager dashboard
   yarn nx serve web-valet    # Valet app
   ```

![Setup Process Image]
*[Add a screenshot or diagram showing the setup process]*

## 📖 Usage

### For Customers

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Find Parking**: Search for available garages in your area
3. **Book a Spot**: Select dates, times, and parking preferences
4. **Request Valet**: Optional valet pickup/drop-off services
5. **Track & Pay**: Monitor your booking and complete payment

### For Garage Managers

1. **Manage Facilities**: Add and configure parking garages
2. **Slot Configuration**: Set up parking spaces with pricing
3. **Monitor Bookings**: View real-time booking activity
4. **Valet Coordination**: Assign valets to customer requests
5. **Analytics**: Review performance metrics and revenue

### For Valets

1. **Mobile App Access**: Dedicated mobile interface
2. **Service Requests**: Receive pickup/drop-off assignments
3. **GPS Tracking**: Real-time location sharing with customers
4. **Status Updates**: Mark services as completed
5. **Earnings Tracking**: Monitor completed services and tips

![User Interface Images]
*[Add screenshots of the different user interfaces - customer app, admin panel, manager dashboard, valet app]*

## 🔧 Development

### Available Scripts

```bash
# Code formatting
yarn format:check    # Check code formatting
yarn format:write    # Auto-format code

# Type checking and linting
yarn tsc            # TypeScript compilation check
yarn lint           # ESLint checking

# Building
yarn build          # Build all applications
yarn nx build api   # Build specific app

# Validation
yarn validate       # Run format, type-check, lint, and build
```

### Project Structure Details

#### API Backend (`apps/api/`)
- **GraphQL Schema**: Auto-generated from Prisma models
- **Resolvers**: Business logic for each entity
- **DTOs**: Input validation and transformation
- **Services**: Database operations and external integrations
- **Guards**: Authentication and authorization

#### Web Applications (`apps/web-*`)
- **Pages**: Next.js app router structure
- **Components**: Reusable UI components from shared libraries
- **Hooks**: Custom React hooks for data fetching
- **Utils**: Helper functions and constants

#### Shared Libraries (`libs/`)
- **UI Library**: Component library with Tailwind styling
- **Forms**: Zod schemas and React Hook Form utilities
- **Network**: GraphQL client with code generation
- **3D**: Three.js utilities for garage visualization
- **Utils**: Common utilities and TypeScript types

![Project Structure Image]
*[Add a detailed project structure diagram or folder tree visualization]*

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries via Prisma
- **XSS Protection**: Sanitized inputs and CSP headers
- **Rate Limiting**: API rate limiting and DDoS protection
- **IP Blocking**: Configurable IP-based access control
- **CAPTCHA Integration**: hCaptcha for bot protection

## 📊 API Documentation

The GraphQL API provides comprehensive documentation accessible at:
- **GraphQL Playground**: `http://localhost:3000/graphql`
- **Swagger UI**: `http://localhost:3000/api` (REST endpoints)

### Key Entities

- **Users**: Customer, Manager, Valet, and Admin accounts
- **Garages**: Parking facilities with slots and pricing
- **Bookings**: Parking reservations with timeline tracking
- **ValetAssignments**: Pickup and drop-off service coordination
- **Reviews**: Customer feedback system
- **Verifications**: Admin approval system for garages

![API Documentation Image]
*[Add a screenshot of the GraphQL playground or API documentation]*

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run API tests specifically
yarn nx test api

# Watch mode for development
yarn test:watch

# Coverage reports
yarn test:cov
```

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] CDN setup for static assets
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual services
docker build -t openspace-api apps/api/
docker build -t openspace-web apps/web/
```

## 🤝 Contributing

We welcome contributions to OpenSpace! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure tests pass
4. **Run validation**: `yarn validate`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure TypeScript strict mode compliance
- Use conventional commit messages

![Contributing Image]
*[Add a diagram or image showing the contribution workflow]*

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS Community** for the excellent framework
- **Prisma Team** for the powerful ORM
- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first styling approach
- **Three.js** for 3D visualization capabilities

## 📞 Support

For support, email support@openspace.com or join our [Discord community](https://discord.gg/openspace).

---

**Built with ❤️ for the future of smart parking**

![OpenSpace Footer Image]
*[Add a footer image or logo]*

---

*Last updated: January 2026*
