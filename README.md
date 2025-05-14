# BloomBuddy - Plant Care Application

## Overview

BloomBuddy is a meteorological research tool for plant care, built with Next.js, TypeScript, and React. It allows users to manage plants, track their health based on real-time weather data, and visualize historical plant health metrics.

The application leverages the Open-Meteo API to gather weather data and compare it against the expected requirements for each plant, providing users with insights on their plants' well-being.

## Features

- Add, edit, and delete plants
- Store plant metadata (type, weekly water need, expected humidity)
- Automatically evaluate plant health based on local weather conditions
- Select custom date ranges for historical analysis

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes (serverless functions)
- **Runtime**: Bun (for improved performance and developer experience)
- **Data Storage**: Supabase (PostgreSQL)
- **State Management**: TanStack Query
- **Schema Validation**: Zod
- **ORM**: Drizzle
- **Deployment**: Vercel

## Project Structure

```
/bloombuddy
├── app/                      # Next.js application
│   ├── api/                  # API routes
│   │   ├── plants/           # Plant API endpoints
│   │   │   ├── route.ts      # GET (list plants), POST (create plant)
│   │   │   ├── [name]/       # Plant-specific operations
│   │   │   │   ├── route.ts  # GET, PUT, DELETE operations
│   │   │   │   ├── health/   # Plant health data
│   │   │   │   │   └── route.ts # GET plant health metrics
│   ├── components/           # Reusable React components
│   │   ├── ui/               # UI components (buttons, inputs, etc.)
...
rest is just the pages themselves and other typical stuff you would find in a frontend project.
```

## API Endpoints

| Method | Endpoint                    | Description                             |
| ------ | --------------------------- | --------------------------------------- |
| GET    | `/api/plants`               | Retrieve all plants                     |
| POST   | `/api/plants`               | Create a new plant                      |
| GET    | `/api/plants/[name]`        | Get a specific plant by name (not used) |
| PUT    | `/api/plants/[name]`        | Update a specific plant                 |
| DELETE | `/api/plants/[name]`        | Delete a specific plant                 |
| GET    | `/api/plants/[name]/health` | Get health metrics for a plant          |

## Setup Instructions

### Prerequisites

- Bun (latest version)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://postgres.aetrazofhmjnpcdzluxk:bloombuddy123@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"
```

(This db is from Supabase's free tier, created for demo purposes so its okay to have it here.)

Change `config({ path: ".env" });` to `".env.local"` in `db.index.ts` and `drizzle.config.ts`.

### Local Development

1. Install Bun:

   ```bash
   # For macOS, Linux, and WSL
   curl -fsSL https://bun.sh/install | bash

   # For Windows (using PowerShell)
   powershell -c "irm bun.sh/install.ps1 | iex"

   # Using npm
   npm install -g bun
   ```

2. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/bloombuddy.git
   cd bloombuddy
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Start the development server:

   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the necessary environment variables in the Vercel dashboard
3. Deploy the application

## Design Decisions

### Next.js API Routes with Bun Runtime

I chose to use Next.js API routes with Bun as the runtime because:

- Bun provides significantly faster startup times and better performance than Node.js
- The combination offers serverless functions that scale automatically on Vercel
- API routes are AWS lambda functions behind the scenes that eliminates the need for a separate backend service, simplifying the architecture
- Bun's built-in bundler and transpiler improve development experience

### Supabase for Data Storage

Supabase was selected as the data storage solution because:

- It provides a PostgreSQL database that is very easy to setup
- It has nice TypeScript support and integration with Next.js

### Drizzle ORM

Drizzle ORM was chosen for database interactions because:

- It's a TypeScript-first ORM with great type safety
- It's lightweight and performant compared to other ORMs
- It offers a simple, intuitive API for database operations
- It integrates well with PostgreSQL and Supabase

### TanStack Query (React Query)

TanStack Query was implemented for state management and data fetching because:

- It provides powerful caching and automatic refetching capabilities
- It reduces boilerplate code compared to traditional state management solutions
- It has automatic cache invalidation that runs upon a mutation that affects a data with a specific "key""
- It has built-in loading and error states to streamline UI development

### Zod for Schema Validation

Zod was used for schema validation because:

- It provides runtime type safety that complements TypeScript's static type checking
- It has a declarative API that makes complex validations easy to implement
- It enables automatic type inference to maintain consistency between validation schemas and TypeScript types

## Future Improvements

- Add user authentication to support multiple users
- Add search and filtering functionality for plant management
- Implement pagination for better performance with large plant collections
- Improve UX by adding bulk operations
