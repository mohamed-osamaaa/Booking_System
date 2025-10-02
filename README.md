# Booking_System

A service booking system built with **NestJS**, **GraphQL**, **TypeORM**, and **MySQL**. The system allows users to register, log in, browse available services, chat with owners, and make bookings.

## Features

### Authentication & Authorization

- JWT-based authentication with role-based access control.
- Supports `Owner` and `User` roles.

### Users

- Register and log in using email.
- Access and manage personal bookings.
- Send and receive real-time messages with service owners.

### Services

- Owners can create and delete services.
- Each service includes a title, description, price, and images (uploaded via Cloudinary).
- Users can view and book services.

### Booking

- Users can book services.
- Owners can approve or reject bookings.
- Booking statuses: `pending`, `confirmed`, `rejected`.

### Messaging (Real-Time Chat)

- Real-time chat system between users and owners.
- Implemented using **Socket.IO**.
- Messages are persisted using a dedicated messages resource.

### Email Notifications

- Automated email notifications for booking status updates using Gmail SMTP.

### Caching & Security

- **Redis Caching**: Implemented Redis to enhance performance by caching frequently accessed data and reducing unnecessary database queries.

- **Request Throttling**: Applied request rate limiting using `@nestjs/throttler` to prevent abuse and brute-force attacks by restricting the number of requests per user/IP.

- **Secure HTTP Headers**: Utilized `helmet` middleware to set various HTTP headers, helping to protect the app against well-known web vulnerabilities.

- **Global Input Validation & Sanitization**: Used NestJS's `ValidationPipe` globally with:

  ```ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  ```

  This ensures only explicitly defined fields in DTOs are accepted, preventing injection attacks and reducing attack surfaces.

- **SQL Injection Prevention**: Adopted TypeORM, which uses parameterized queries internally, offering protection against SQL injection by design.

## Tech Stack

- **Backend**: NestJS, GraphQL, TypeORM
- **Database**: MySQL
- **File Upload**: Cloudinary
- **Cache**: Redis
- **Email**: Nodemailer with Gmail
- **Real-Time Communication**: Socket.IO

## Installation

### Clone the Repository

```bash
git clone https://github.com/mohamed-osamaaa/Booking_System.git
cd Booking_System
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=Booking_System

ACCESS_TOKEN_SECRET_KEY=your_secret_key_here

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

PORT=5080

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

> ⚠️ **Security Note:** Keep your `.env` file private and never commit it to version control.

### Run Migrations

```bash
npm run typeorm migration:run
```

### Start the Application

```bash
npm run start:dev
```

### Access GraphQL Playground

```
http://localhost:5080/graphql
```

## Folder Structure (src)

- `database/` – Database migrations and data source setup
- `users/` – User entity and profile logic
- `services/` – Service management
- `booking/` – Booking logic and status workflows
- `messages/` – Real-time chat and message persistence
- `utility/` – Custom decorators, guards, middlewares, interceptors, etc.

## Author

**Mohamed Osama**
GitHub: [mohamed-osamaaa](https://github.com/mohamed-osamaaa)
