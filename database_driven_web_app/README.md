Todo Application

This is a Next.js project bootstrapped with create-next-app.
Overview

This Todo application is built using the PERN stack (PostgreSQL, Express, React, Node.js). It allows users to manage their tasks with features like adding, editing, deleting, and marking tasks as complete. The app also includes due dates for tasks.
Getting Started
Prerequisites

    Node.js
    PostgreSQL
    Next.js

Setup

    Clone the repository:

    bash

git clone <repository-url>
cd <repository-directory>

Install dependencies:

bash

npm install
# or
yarn install

Configure environment variables:

Create a .env file in the root directory and add the following environment variables:

env

DATABASE_USER=<your-database-user>
DATABASE_HOST=<your-database-host>
DATABASE_NAME=<your-database-name>
DATABASE_PASSWORD=<your-database-password>
DATABASE_PORT=<your-database-port>

Set up the database:

Create the tasks table in your PostgreSQL database:

sql

    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      is_complete BOOLEAN DEFAULT false,
      due_date DATE
    );

Running the Development Server

Run the development server:

bash

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.
API Routes

The application uses the following API routes to interact with the database:

    GET /api/tasks: Fetch all tasks
    POST /api/tasks: Add a new task
    DELETE /api/tasks?id=<task-id>: Delete a task by ID
    PUT /api/tasks?id=<task-id>: Update a task by ID

Folder Structure

    src/
        app/
            Tasks.tsx: The main component for managing tasks
            globals.css: Global CSS styles, including Tailwind CSS imports
        pages/
            index.tsx: The main page that includes the Tasks component
            api/
                tasks.js: The API route handling task operations
        types/
            Task.ts: Type definitions for tasks

Styling

This project uses Tailwind CSS for styling. Ensure you have the following configuration in tailwind.config.js:

javascript

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure these paths are correct
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

Tailwind CSS Setup

Ensure your CSS file (e.g., globals.css) includes the Tailwind CSS imports:

css

@tailwind base;
@tailwind components;
@tailwind utilities;

Learn More

To learn more about Next.js, take a look at the following resources:

    Next.js Documentation - learn about Next.js features and API.
    Learn Next.js - an interactive Next.js tutorial.

You can check out the Next.js GitHub repository - your feedback and contributions are welcome!
Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.
