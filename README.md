# Code Hiccups

Code Hiccups is a platform where users can submit coding questions and get answers from the community. Questions are organized by tags for easy browsing, and answers are rated based on the reputation of their contributors. This reputation system ensures that the most reliable responses are highlighted, making it simpler for users to find effective solutions or explore answers to previously asked questions. Unlike the previous Next.js project, this one utilizes Server Actions exclusively, along with the new "useFormState" and "useFormStatus" hooks for streamlined form handling. The middleware file has also been updated to ensure compatibility with Server Actions.

## Technologies Used

- [NextJS](https://nextjs.org/): The React framework for production.
- [Server Actions](https://nextjs.org/docs/api-reference/server-actions): A feature in Next.js that allows you to define server-side functions directly within your components, enabling efficient data fetching and manipulation without needing separate API routes.
- [Prisma](https://www.prisma.io/): A modern ORM for TypeScript and Node.js, making database access easy with type safety and auto-generated queries.
- [TypeScript](https://www.typescriptlang.org/): A powerful and flexible superset of JavaScript, bringing static typing to your projects.
- [PostgreSQL](https://www.postgresql.org/): The World's Most Advanced Open Source Relational Database

## Setup Instructions

1st - Download the project

2nd - Run the following command "npm install" (install dependencies)

3rd - Now create a .env file in the root of your entire project with the following key value pairs: DATABASE_URL, JWT_SECRET, JWT_LIFETIME,
CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET.

4th - Open up your PostgreSQL server and create a database called "code_hiccups". So just copy paste this code in and execute it

CREATE DATABASE code_hiccups;

5th - Type the following command "npm run build" to create production ready application

6th - Type the "npm run start" command to start up the production application

DONE
