# Multi-Tenant SaaS Project Management Platform


A production-style SaaS backend built using Spring Boot that allows multiple companies to manage projects, tasks, teams, and collaboration securely using tenant isolation.



## 🚀 Features


### Authentication & Security

- JWT based authentication
- Spring Security
- BCrypt password encryption
- Role Based Access Control
- Stateless authentication


### Multi Tenancy

- Company/Tenant registration
- Tenant isolated users
- Secure data separation


### Project Management

- Create projects
- Assign team members
- Track project ownership


### Task Management

- Create tasks
- Assign tasks
- Update status
- Priority management
- Due dates


### Collaboration

- Task comments
- File attachments
- Activity history tracking
- User notifications


### Production Features

- Global exception handling
- DTO architecture
- Input validation
- Pagination and sorting
- Environment profiles
- Swagger API documentation
- Docker containerization



---


## 🛠 Tech Stack


Backend:

- Java 22
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL


Authentication:

- JWT
- BCrypt


Tools:

- Docker
- Docker Compose
- Swagger/OpenAPI
- Maven



---


## Architecture


```
Client

  |

Spring Security

  |

JWT Filter

  |

Controllers

  |

Services

  |

Repositories

  |

PostgreSQL
```


---


## Database Architecture


```
Tenant

  |
  |
 Users

  |
  |
 Projects

  |
  |
 Tasks

  |
  |-----------------
  |        |        |
Comments Files Activities


Notifications
```



---


## Run Using Docker


Clone repository:


```bash
git clone <repo-url>
```


Start application:


```bash
docker compose up
```


Services:


```
Backend:
localhost:8080


PostgreSQL:
localhost:5432
```



---


## API Documentation


After starting backend:


```
http://localhost:8080/swagger-ui/index.html
```



---


## Authentication Flow


```
User Login

    |

JWT Generated

    |

Client sends token

    |

JwtFilter validates

    |

SecurityContext created

    |

Protected API access
```



---


## Important APIs


Authentication


```
POST /api/auth/login
```


Tenant


```
POST /api/tenants/register
```


Projects


```
POST /api/projects

GET /api/projects
```


Tasks


```
POST /api/tasks

GET /api/tasks/my
```


Notifications


```
GET /api/notification
```



---


## Future Improvements


- React frontend
- Cloud deployment
- Email notifications
- Advanced analytics
- CI/CD pipeline

