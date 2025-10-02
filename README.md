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
