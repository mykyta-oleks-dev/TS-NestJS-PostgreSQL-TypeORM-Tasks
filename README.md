# Tasks NestJS API

## Description

A backend NestJS application for own tasks management with Authentication, Authorization and RBAC

## Technologies used

- TypeScript - a high-level, multi-paradigm programming language.

- Node.JS - free, open-source, cross-platform JavaScript runtime environment.

- npm - package manager for the JavaScript programming language maintained by npm, Inc., a subsidiary of GitHub.

- NestJS - "A progressive Node.js framework for building efficient, reliable and scalable server-side applications".

- PostgreSQL - a free and open-source relational database management system.

- Docker - an open platform for developing, shipping, and running applications in containers.

- TypeORM - "an ORM that can run in Node.js, Browser, Cordova, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES2021)".

- Jest - "a delightful JavaScript Testing Framework with a focus on simplicity".

## Installation

The client app uses `npm` as the package manager.

To install project dependancies:

```bash
npm install
```

## Running the project

To run the project locally, the PostgreSQL server on port 5432 has to be deployed (either directly or in docker container - see `docker-compose.yml`)

Apply migrations with the next npm script (builds the app):

```bash
npm run migration:run
```

Changes to database (modified `*.entity.ts` files or created new) are to be saved in the new migrations with a short and descriptive name:

```bash
npm run migration:generate src/migrations/{{NameOfMigration}}
```

To run app in development mode:

```bash
npm run start:dev
```

To build app:

```bash
npm run build
```

Built app can be started with:

```bash
npm run start:prod
```

## Features

- Authentication: Create a new user with unique email, log in and handle the resulting JWT from log in body in shape of: `{ accessToken: string }`

- Tasks: Create requests at `/tasks` route (see `tasks/tasks.controller.ts` for all routes) to create new task, read all or one, update and delete tasks. You can access only your own tasks.

- Task labels: With creation of tasks, you can specify their labels, that will be automatically saved in the distinct database table. Updating the task allows to set new labels. Addition or removal of tasks are possible with separate `/tasks/:id/labels` routes.

- RBAC: Current iteration of system creates users with `user` role, possible roles being `user` and `admin` (not possible to set by self). In the future detailed `admin` specific routes will be available beside test `/auth/admin`.
