# IPTN Blog - API Architecture Documentation

This document provides a comprehensive overview of the API architecture used in the IPTN Blog project, detailing the patterns and structure from backend repository implementation to frontend consumption.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Structure](#backend-structure)
   - [Repository Pattern](#repository-pattern)
   - [Service Layer](#service-layer)
   - [API Routes](#api-routes)
3. [Frontend Integration](#frontend-integration)
   - [HTTP Client](#http-client)
   - [React Query Integration](#react-query-integration)
   - [Mutations and Queries](#mutations-and-queries)
4. [Project Structure](#project-structure)
5. [Health Check System](#health-check-system)

## Architecture Overview

The IPTN Blog follows a clean, modular architecture that separates concerns across multiple layers:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Client Pages   │────▶│   React Query   │────▶│   API Routes    │────▶│    Services     │
│  & Components   │     │      Hooks      │     │                 │     │                 │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                                                                                 │
                                                                                 ▼
                                                                        ┌─────────────────┐
                                                                        │                 │
                                                                        │  Repositories   │
                                                                        │                 │
                                                                        └─────────────────┘
                                                                                 │
                                                                                 ▼
                                                                        ┌─────────────────┐
                                                                        │                 │
                                                                        │   Data Store    │
                                                                        │                 │
                                                                        └─────────────────┘
```

This architecture promotes:
- **Separation of concerns**: Each layer has a specific responsibility
- **Testability**: Isolated components are easier to test
- **Maintainability**: Changes in one layer don't necessarily affect others
- **Scalability**: New features can be added without disrupting existing functionality

## Backend Structure

### Repository Pattern

Repositories are responsible for direct data access and manipulation. They encapsulate the logic required to access data sources.

**Key characteristics:**
- Handle CRUD operations
- Implement data filtering and querying logic
- Return domain models (not database entities)
- Handle database-specific error handling

**Example (SiteConfigRepository):**
```typescript
export class SiteConfigRepository {
  private readonly siteConfiguration = prisma.siteConfiguration

  async getSiteConfiguration(): Promise<SiteConfigurationDTO | null> {
    // Data access logic here
  }

  async checkSiteContentHealth(): Promise<SiteHealthReport | ApiCustomError | null> {
    // Complex health check implementation
  }

  // Other repository methods...
}
```

### Service Layer

Services orchestrate the work of multiple repositories and implement business logic. They act as an intermediary between the API routes and repositories.

**Key characteristics:**
- Coordinate operations across multiple repositories
- Implement business rules and validations
- Return DTOs or error objects
- Handle service-level error handling

**Example (SiteConfigService):**
```typescript
export class SiteConfigService implements ISiteConfigService {
  constructor(
    private readonly siteConfigRepository: SiteConfigRepository = new SiteConfigRepository()
  ) {}

  async checkSiteContentHealth(): Promise<SiteHealthReport | ApiCustomError | null> {
    return this.siteConfigRepository.checkSiteContentHealth()
  }

  // Other service methods...
}
```

### API Routes

API routes handle HTTP requests, validate inputs, and return appropriate responses. They use services to process the requests.

**Key characteristics:**
- Map HTTP methods to functionality
- Handle request validation
- Format responses
- Implement authentication/authorization checks
- Handle API-level error handling

**Example (Site Config Route):**
```typescript
// GET /api/site-config
export async function GET(request: NextRequest) {
  try {
    const siteConfigRepository = new SiteConfigService()
    const siteConfig = await siteConfigRepository.getSiteConfig()

    return NextResponse.json(siteConfig)
  } catch (error) {
    logger.error('Error retrieving site configuration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Frontend Integration

### HTTP Client

A custom HTTP client built on top of Axios handles all API requests. It provides consistent error handling, request formatting, and response parsing.

**Key features:**
- Centralized configuration
- Error handling via hooks
- Type-safe responses
- Request/response interceptors

```typescript
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### React Query Integration

The application uses React Query (TanStack Query) for data fetching, caching, and state management.

**Custom query hooks:**
- `useAppQuery`: For standard GET requests
- `useAppQueryWithPaginationAndParams`: For GET requests with pagination and query parameters
- `useAppMutation`: For POST, PUT, PATCH, and DELETE requests

```typescript
export function useAppQuery<TData, TError, TQueryKey>(
  config: QueryConfig<TQueryKey, TData>
): UseQueryResult<TData, TError> {
  // Query implementation
}
```

### Mutations and Queries

Feature-specific mutations and queries are organized by domain and encapsulated in dedicated files.

**Example (Site Config Mutations):**
```typescript
export function useHealthCheck() {
  const queryClient = useQueryClient()

  return useAppMutation<SiteHealthReport, unknown, void>({
    apiRoute: routes.siteConfig.healthCheck,
    method: 'POST',
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SiteConfigQueryKey.SITE_CONFIG] })
      // Success handling
    },
  })
}
```

## Project Structure

The project follows a modular structure organized by feature domains:

```
src/
├── app/
│   ├── api/               # General API routes (e.g., auth)
│   ├── (server)/
│   │   ├── api/           # Routed API endpoints
│   │   │   ├── site-config/
│   │   │   ├── news/
│   │   │   └── users/
│   │   │
│   │   └── modules/       # Backend business logic
│   │       ├── site-configurations/
│   │       ├── news/
│   │       └── user/
│   │
│   └── (client)/
│       ├── (public)/      # Public-facing pages
│       └── (admin)/       # Admin-only pages
│
├── network/
│   ├── client.constructor.ts  # HTTP client setup
│   ├── route.ts               # API route definitions
│   ├── http-service/          # Feature-specific API interactions
│   │   ├── site-config.mutations.ts
│   │   ├── news.mutations.ts
│   │   └── user.mutations.ts
│   │
│   └── query-keys/            # React Query key definitions
│
└── hooks/                     # Shared React hooks
```

## Health Check System

The project includes a sophisticated health check system to monitor content freshness and availability. The implementation demonstrates the clean architecture principles in action:

1. **Repository Layer**: Implements detailed content health checks with specific criteria
2. **Service Layer**: Orchestrates the health check process
3. **API Routes**: Exposes health check endpoints
4. **Frontend Integration**: Provides UI for triggering and displaying health check results

Key files involved:
- `site-config.repository.ts`: Contains `checkHomePageContentHealth` and related methods
- `site-config.service.ts`: Exposes `checkSiteContentHealth`
- `health-check/route.ts`: Provides the API endpoint
- `site-config.mutations.ts`: Implements the `useHealthCheck` hook for frontend use

This health check system ensures content meets defined criteria for freshness, quantity, and availability across different sections of the site.

## Conclusion

The IPTN Blog architecture follows industry best practices for building maintainable, scalable Next.js applications. By separating concerns across multiple layers and using modern technologies like React Query for state management, the application achieves a clean, maintainable structure that supports ongoing development and feature additions.
