# Restaurant Management System - Backend Foundation (Phase 1)

This is the backend foundation for a production-ready **Restaurant Management System** built with Node.js, Express, and TypeScript.

---

## 📂 Folder Structure

```text
server/
│
├── src/
│   ├── config/          # Configurations (e.g. database, third-party APIs)
│   ├── constants/       # Global constants and HTTP codes
│   ├── controllers/     # Controller handlers (business log logic routing)
│   ├── middleware/      # Express custom middlewares (validation, auth, logging)
│   ├── models/          # Database models schemas (Mongoose)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic / Service layer
│   ├── validators/      # Request body validators
│   ├── utils/           # Helper utility functions
│   ├── types/           # Custom TypeScript types and interfaces
│   ├── socket/          # Socket.io event handlers
│   ├── jobs/            # Background cron jobs / tasks
│   ├── app.ts           # Express Application configuration and middlewares
│   └── server.ts        # Server listener and graceful shutdown
│
├── tests/               # Unit, integration, and e2e tests
├── package.json         # NPM packages and configuration
├── tsconfig.json        # TypeScript compiler options
├── .env                 # Environment variables file (local development)
├── .env.example         # Template for environment variables
├── .gitignore           # Ignored git files and directories
├── .prettierrc          # Prettier formatting configuration
├── .eslintrc            # ESLint rules and style specifications
└── README.md            # Project documentation (this file)
```

---

## 📄 Explanation of Created Files

### 🔧 Configuration Files
- **`package.json`**: Manages node packages, metadata, and scripts (`dev`, `build`, `start`, `lint`, `format`).
- **`tsconfig.json`**: Configures TypeScript in strict mode, targeting `ES2022` with CommonJS module loading for absolute safety and compatibility on standard Node backend runtimes.
- **`.eslintrc`**: ESLint configuration setting up TypeScript parser and plugins alongside automatic Prettier rule enforcement.
- **`.prettierrc`**: Prettier formatting rule settings (semi-colons, single quotes, double spaces, and standard LF endings).
- **`.env.example` & `.env`**: Configuration settings for runtime environment variables (`PORT`, `NODE_ENV`, `CORS_ORIGIN`).
- **`.gitignore`**: Excludes system-specific files, compiler output files (`dist`), environment variables (`.env`), and packages (`node_modules`) from source control.

### 💻 Source Files
- **`src/app.ts`**: Initializes the Express application. Applies standard middlewares (`helmet` for security, `cors` for cross-origin access, `express.json` & `express.urlencoded` for request parsing, and `morgan` for server logging). Hosts the `/api/v1/health` check endpoint, 404 handler, and global error handling middleware.
- **`src/server.ts`**: Configures environment loading (`dotenv`), validates configurations, instantiates the Express application server, captures unhandled promise rejections / uncaught exceptions, and implements clean graceful shutdowns for `SIGINT` and `SIGTERM` signals.

---

## 📦 Installed Packages

### Production Dependencies
- **`express`**: Fast, unopinionated, minimalist web framework.
- **`dotenv`**: Zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **`cors`**: Express middleware to enable Cross-Origin Resource Sharing.
- **`helmet`**: Enhances API security by setting various HTTP headers.
- **`morgan`**: HTTP request logger middleware for node.js.

### Development Dependencies
- **`typescript`**: Strict syntactical superset of JavaScript adding static typing.
- **`@types/...`** (`node`, `express`, `cors`, `morgan`): High quality TypeScript type definitions for standard libraries.
- **`tsx`**: Modern, fast tool for running TypeScript files directly without a manual compilation step.
- **`nodemon`**: Monitor tool restarting Node application automatically upon file updates.
- **`eslint`**: Standard code linter.
- **`prettier`**: Code formatter.
- **`eslint-config-prettier` & `eslint-plugin-prettier`**: Formats files with Prettier rules within ESLint environment.
- **`@typescript-eslint/parser` & `@typescript-eslint/eslint-plugin`**: ESLint extension for checking TypeScript code.
- **`rimraf`**: Cross-platform file deletion command (used for cleaning compiler output folders).

---

## 🚀 Running Scripts

The following npm scripts are defined:

- **`npm run dev`**: Starts Nodemon using `tsx` to run the compiler directly with hot-reloading:
  ```bash
  npm run dev
  ```
- **`npm run build`**: Cleans compiler output and compiles TypeScript files into the `dist/` directory:
  ```bash
  npm run build
  ```
- **`npm run start`**: Runs the compiled JavaScript application:
  ```bash
  npm run start
  ```
- **`npm run lint`**: Checks codebase files for code styling and standard lint rules:
  ```bash
  npm run lint
  ```
  ```bash
  npm run format
  ```

---

## 🧪 Testing

We use Jest and Supertest for testing.

- **`npm run test`**: Runs the entire test suite.
- **`npm run test:watch`**: Runs tests in watch mode for development.
- **`npm run test:coverage`**: Runs tests and generates a coverage report.

---

## 🐳 Docker & CI/CD

This project is fully containerized and uses GitHub Actions for Continuous Integration.

### Running with Docker Compose
Start the backend, MongoDB, and Redis locally:
```bash
docker-compose up --build
```

### API Documentation (Swagger)
Once the server is running (either locally or via Docker), you can view the interactive OpenAPI 3.0 documentation by navigating to:
```
http://localhost:5000/api-docs
```

