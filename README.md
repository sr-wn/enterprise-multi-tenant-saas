# Multi-Tenant SaaS Project Management Platform

A full-stack, production-style SaaS platform that lets multiple companies (tenants)
manage projects, tasks, teams, and collaboration securely with strict tenant isolation.

The platform consists of a **Spring Boot** backend and a **React** frontend, both
containerized via Docker Compose.

---

## 🚀 Features

### Authentication & Security
- JWT-based authentication (`jjwt`)
- Spring Security with a stateless security context
- BCrypt password hashing
- Role-Based Access Control (RBAC)
- Per-tenant data isolation enforced at the service layer

### Multi-Tenancy
- Company / tenant registration and self-service creation
- Tenant-scoped users, projects, and tasks
- Secure data separation between tenants

### Project Management
- Create / read / update / delete projects
- Assign and organize projects per tenant
- View project-level task lists

### Task Management
- Create, assign, update, and delete tasks
- Status updates and priority management
- Due dates and ownership tracking
- Per-task activity history

### Collaboration
- Task comments
- File attachments (uploaded via Cloudinary)
- Activity history tracking
- User notifications (with unread counts)

### Support
- In-app support tickets raised by users
- Tenant-wide ticket visibility and resolution

### Production Features
- Global exception handling
- DTO-based architecture with mappers
- Input validation (Bean Validation)
- Pagination and sorting
- Environment profiles (`dev` / `prod`)
- Swagger / OpenAPI documentation (`springdoc-openapi`)
- Docker & Docker Compose containerization

---

## 🛠 Tech Stack

### Backend
- Java 21
- Spring Boot 3.5.x
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL 17
- JWT (`jjwt` 0.11.5)
- SpringDoc OpenAPI 2.8.9
- Cloudinary (file uploads)
- Lombok
- Maven

### Frontend
- React 19
- Vite 8
- React Router 7
- Tailwind CSS v4
- Axios
- JWT decode

### Infrastructure & Tooling
- Docker / Docker Compose
- Swagger UI
- ESLint

---

## 📁 Project Structure

```
Multi-Tenant/
├── backend/            # Spring Boot REST API
│   ├── src/main/java/com/srawan/backend/
│   │   ├── auth/           # Login + JWT helpers
│   │   ├── config/         # Security & app configuration
│   │   ├── controller/     # REST controllers
│   │   ├── dto/            # Request/response DTOs
│   │   ├── entity/         # JPA entities
│   │   ├── enums/          # Enumerations (role, status, priority...)
│   │   ├── exception/      # Global exception handling
│   │   ├── Filter/         # JWT authentication filter
│   │   ├── mapper/         # Entity <-> DTO mappers
│   │   ├── repository/     # Spring Data repositories
│   │   └── service/        # Business logic
│   ├── Dockerfile
│   └── pom.xml
├── frontend/           # React + Vite SPA
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Shared UI components
│   │   ├── context/       # Auth context
│   │   ├── layouts/       # App shell (navbar, sidebar)
│   │   ├── pages/         # Dashboard, Projects, Tasks, Users...
│   │   ├── routes/        # Route definitions
│   │   └── services/      # API service layer
│   └── package.json
└── docker-compose.yml  # Postgres + backend services
```

---

## 🗄️ Data Model

```
Tenant
  ├── Users
  ├── Projects
  │     └── Tasks
  │           ├── Comments
  │           ├── Attachments
  │           ├── Activity
  │           └── (assigned to) Users
  ├── Notifications
  └── SupportTickets
```

### Entities
`Tenant`, `User`, `Project`, `Task`, `TaskComment`, `TaskAttachment`,
`TaskActivity`, `Notification`, `SupportTicket`.

---

## 🐳 Run with Docker

```bash
# From the repository root
docker compose up --build
```

### Services
| Service    | URL / Port            |
|------------|-----------------------|
| Backend    | `http://localhost:8080` |
| PostgreSQL | `localhost:5432`      |
| API Docs   | `http://localhost:8080/swagger-ui/index.html` |

> Default database credentials are defined in `docker-compose.yml`
> (`POSTGRES_DB=multitenant`, `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=root`).

---

## 💻 Local Development (without Docker)

### Backend

Requirements: Java 21 and Maven.

```bash
cd backend

# Configure secrets in backend/.env (git-ignored), then run:
pwsh ./run.ps1
```

`run.ps1` loads the environment variables from `backend/.env` (database URL,
`JWT_SECRET`, `JWT_EXPIRATION`, Cloudinary keys) and starts the application.

The backend listens on `http://localhost:8080`.

### Frontend

Requirements: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173` (Vite default).

```bash
npm run build     # production build (output: dist/)
npm run lint      # lint with ESLint
npm run preview   # preview the production build
```

---

## 🔌 API Reference

Base path: `http://localhost:8080/api`

### Authentication
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| POST   | `/api/auth/login`   | Authenticate user  |

### Tenants
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | `/api/tenants/register`   | Register a new tenant    |
| POST   | `/api/tenants`            | Create a tenant          |
| GET    | `/api/tenants`            | List all tenants         |
| GET    | `/api/tenants/{id}`       | Get tenant by id         |
| PUT    | `/api/tenants/{id}`       | Update a tenant          |
| DELETE | `/api/tenants/dissolve`   | Dissolve current tenant  |

### Users
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | `/api/users`     | Create a user      |
| GET    | `/api/users`     | List users (paged)|
| DELETE | `/api/users/{id}`| Delete a user      |

### Projects
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/projects`             | Create a project         |
| GET    | `/api/projects`             | List projects (paged)    |
| GET    | `/api/projects/{id}`        | Get project by id        |
| GET    | `/api/projects/{id}/tasks`  | List project tasks (paged)|
| DELETE | `/api/projects/{id}`        | Delete a project         |

### Tasks
| Method | Endpoint                      | Description                |
|--------|-------------------------------|----------------------------|
| POST   | `/api/tasks`                  | Create a task              |
| GET    | `/api/tasks`                  | List all tasks (paged)     |
| GET    | `/api/tasks/my`               | List my tasks (paged)      |
| PUT    | `/api/tasks/{id}`             | Update a task              |
| PATCH  | `/api/tasks/{id}/status`      | Update task status         |
| DELETE | `/api/tasks/{id}`             | Delete a task              |
| GET    | `/api/tasks/{id}/activity`    | Get task activity history  |

### Task Comments
| Method | Endpoint                          | Description          |
|--------|-----------------------------------|----------------------|
| POST   | `/api/tasks/{id}/comments`        | Add a comment        |
| GET    | `/api/tasks/{id}/comments`        | List comments        |

### Task Attachments
| Method | Endpoint                           | Description        |
|--------|------------------------------------|--------------------|
| POST   | `/api/tasks/{id}/attachments`      | Upload a file      |
| GET    | `/api/tasks/{id}/attachments`      | List attachments   |

### Notifications
| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| GET    | `/api/notifications`      | List my notifications (paged)|
| GET    | `/api/notifications/count`| Unread notification count  |
| POST   | `/api/notifications/{id}` | Mark notification as read  |

### Support Tickets
| Method | Endpoint                       | Description               |
|--------|--------------------------------|---------------------------|
| POST   | `/api/support-tickets`         | Raise a support ticket    |
| GET    | `/api/support-tickets/mine`    | List my tickets           |
| GET    | `/api/support-tickets`         | List tenant tickets       |
| POST   | `/api/support-tickets/{id}/resolve` | Resolve a ticket     |

### Dashboard & Health
| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| GET    | `/api/dashboard`   | Aggregated dashboard  |
| GET    | `/actuator/health` or `/health` | Health check  |

> A full, interactive API reference is available via Swagger UI at
> `http://localhost:8080/swagger-ui/index.html` when the backend is running.

---

## 🔐 Authentication Flow

```
User Login
    |
JWT Generated
    |
Client stores token (localStorage / AuthContext)
    |
Client sends token in Authorization header
    |
JwtFilter validates
    |
SecurityContext established
    |
Protected API access (tenant-scoped)
```

---

## 🚧 Future Improvements

- Cloud deployment (Kubernetes / managed Postgres)
- Email notifications
- Advanced analytics and reporting
- CI/CD pipeline
- Refresh-token rotation
- Audit logging and rate limiting
