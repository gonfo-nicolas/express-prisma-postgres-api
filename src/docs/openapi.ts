export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Express Prisma PostgreSQL API",
    version: "1.0.0",
    description:
      "Mini API example using Express, TypeScript, Prisma, PostgreSQL, Zod, JWT and Vitest.",
  },
  servers: [
    {
      url: "http://127.0.0.1:3000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Posts" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API status",
        responses: {
          "200": {
            description: "API health status",
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@example.com" },
                  password: { type: "string", minLength: 8, example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authenticated user and access token",
          },
          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },
    "/api/v1/users": {
      post: {
        tags: ["Users"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  name: { type: "string", minLength: 2 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created user" },
          "409": { description: "Email already exists" },
        },
      },
      get: {
        tags: ["Users"],
        summary: "List users - admin only",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
        ],
        responses: {
          "200": { description: "Paginated users" },
          "401": { description: "Missing or invalid token" },
          "403": { description: "Insufficient permissions" },
        },
      },
    },
    "/api/v1/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user" },
          "401": { description: "Missing or invalid token" },
        },
      },
    },
    "/api/v1/posts": {
      get: {
        tags: ["Posts"],
        summary: "List posts",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
          { name: "published", in: "query", schema: { type: "boolean" } },
        ],
        responses: {
          "200": { description: "Paginated posts" },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create a post",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content"],
                properties: {
                  title: { type: "string", minLength: 3 },
                  content: { type: "string", minLength: 10 },
                  published: { type: "boolean", default: false },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created post" },
          "401": { description: "Missing or invalid token" },
        },
      },
    },
    "/api/v1/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Get a post by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Post" },
          "404": { description: "Post not found" },
        },
      },
      put: {
        tags: ["Posts"],
        summary: "Update a post",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Updated post" },
          "401": { description: "Missing or invalid token" },
          "403": { description: "Not post owner" },
          "404": { description: "Post not found" },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete a post",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Deleted post" },
          "401": { description: "Missing or invalid token" },
          "403": { description: "Not post owner" },
          "404": { description: "Post not found" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
} satisfies Record<string, unknown>;
