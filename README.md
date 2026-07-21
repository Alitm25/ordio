# Ordio

> Modern business management platform built with Next.js and TypeScript.


## About

Ordio is a modern business management platform designed to simplify daily operations for small and medium-sized businesses.
It provides a clean dashboard for managing customers, products, orders, and business data in one place.
The project is currently in the MVP stage and is actively being developed with scalability and maintainability in mind.


## Features

- Secure authentication
- Dashboard overview
- Customer management
- Product management
- Order management
- Form validation with Zod
- Responsive interface
- Modern UI built with Tailwind CSS & SHADCN
- MongoDB database integration
- Server state management using TanStack Query


## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- MongoDB
- Mongoose
- TanStack Query
- Tailwind CSS
- Zod
- React Hook Form  
- JWT Authentication


## Architrecture

The project follows a feature-based architecture to improve scalability and maintainability.
Each feature encapsulates its own components, services, hooks, and validation logic while shared utilities remain isolated inside dedicated directories.


# Project Structure

```text
src/
├── app/            # Next.js App Router
├── components/     # Shared UI components
├── features/       # Feature modules
├── hooks/          # Custom React hooks
├── lib/            # Shared libraries
├── models/         # Mongoose models
├── providers/      # Global providers
├── services/       # Business logic & API calls
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Screenshots
Coming soon...


## Getting Started

```bash
git clone https://github.com/Alitm25/ordio.git

cd ordio

npm install

npm run dev
```

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key
```

## Roadmap

- [x] Authentication
- [x] Customer Management
- [x] Product Management
- [x] Order Management
- [x] Dashboard
- [ ] UI updates
- [ ] Home Page (Landing page)
- [ ] Multi-Item Orders
- [ ] CSV Exports
- [ ] Notifications
- [ ] Inventory Management
- [ ] Change Email in settings
- [ ] Details Page for Each Order


## Contributing

Contributions, ideas, and feedback are always welcome.
Feel free to open an issue or submit a pull request.


## Licence
MIT License







