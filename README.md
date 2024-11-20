# prisma-rest
Generate rest apis from your Prisma schema

# Architecture
As the main target for this project is to generate rest apis from a Prisma schema, the project is divided into multiple
prisma generators each with a specific purpose, in addition to the generators, there are also some packages that contain
logic that is shared between the generators.

### Shared Packages
* `@germanamz/prisma-rest-toolbox`: A shared package that contains reusable functions and types, these are used by
generators to simplify and standardize code.
* `@germanamz/prisma-rest-marshal`: A shared package that provides an abstraction on top of Prisma DMMF to simplify unique fields, models 
and enums handling throughout generators (WIP).

### Generators
* `@germanamz/prisma-generator-zod`: A reusable Prisma generator that created Zod schemas based on the Prisma schema,
these include write and filter schemas.
* `@germanamz/prisma-generator-crud-services`: A reusable Prisma generator that creates CRUD services as an interface
between the Prisma client and the communication layer (express, fastify, etc).
* `@germanamz/prisma-generator-hono`: A reusable Prisma generator that creates a Hono API, uses the Zod schemas to
validate and sanitize user input, and the CRUD services for the interaction with Prisma.
* `@germanamz/prisma-generator-express`: (planned, not yet started)

# Development
Prerequisites:
* Node.js 20 or higher
* pnpm 9.11.0 or higher
* 