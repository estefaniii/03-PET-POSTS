# 🐾 Pet Posts API

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Neon-00C4B4?style=for-the-badge&logo=neon&logoColor=white" alt="Neon">
</div>

A complete TypeScript-based pet adoption platform API featuring user authentication, pet post management, and secure content moderation system.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **🐕 Pet Post Management**: Create, update, and manage pet adoption posts
- **👥 User Management**: Complete user registration, profile management, and email validation
- **🛡️ Content Moderation**: Admin approval system for pet posts with approve/reject functionality
- **🔒 Security**: Password hashing, input validation, and middleware protection
- **📧 Email Integration**: Automatic email validation for user accounts
- **🎯 Role-Based Access**: Different permissions for users and administrators

## 🛠️ Technologies Used

- **Backend**: TypeScript, Node.js, Express.js
- **Database**: PostgreSQL with TypeORM (hosted on Neon)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, Helmet, CORS, Rate limiting
- **Email**: Nodemailer for account validation
- **Validation**: Zod for input validation and environment variable validation

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pet-posts-api.git
cd pet-posts-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Neon PostgreSQL)
DATABASE_HOST=ep-xxxxxx.us-east-1.aws.neon.tech
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database

# JWT Configuration
JWT_KEY=your-secret-jwt-key
JWT_EXPIRE_IN=3h

# Email Configuration
MAILER_SERVICE=gmail
MAILER_EMAIL=your-email@gmail.com
MAILER_SECRET_KEY=your-app-password
SEND_MAIL=true
```

5. Start the development server:

```bash
npm run start:dev
```

## 🔍 API Endpoints

### Authentication

- `POST /api/v1/users/register` - User registration with email validation
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/validate-account/:token` - Validate email account

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Pet Posts

- `GET /api/v1/petposts` - Get all pet posts
- `GET /api/v1/petposts/:id` - Get pet post by ID
- `POST /api/v1/petposts` - Create pet post (Authenticated users)
- `PATCH /api/v1/petposts/:id` - Update pet post (Owner or Admin)
- `DELETE /api/v1/petposts/:id` - Delete pet post (Owner or Admin)
- `PATCH /api/v1/petposts/:id/approve` - Approve pet post (Admin only)
- `PATCH /api/v1/petposts/:id/reject` - Reject pet post (Admin only)

## 🔍 Code Highlights

```typescript
// Secure pet post creation with user ownership
async execute(data: CreatePetPostDto) {
  const petPost = new PetPost();
  petPost.title = data.title;
  petPost.description = data.description;
  petPost.petType = data.petType;
  petPost.age = data.age;
  petPost.user = this.sessionUser; // Automatically assigned to creator

  await petPost.save();
  return { message: 'Pet post created successfully' };
}
```

```typescript
// JWT Authentication middleware with role-based access
export class AuthMiddleware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    const payload = await JwtAdapter.validateToken(token);

    if (!payload) {
      return res.status(401).json({ message: 'Invalid Token!' });
    }

    const user = await User.findOne({
      where: { id: payload.id, status: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    (req as any).sessionUser = user;
    next();
  }
}
```

```typescript
// Email validation service
private sendLinkToEmailFronValidationAccount = async (email: string) => {
  const token = await JwtAdapter.generateToken({ email }, '300s');
  const link = `http://localhost:3000/api/v1/users/validate-account/${token}`;

  const isSent = await this.emailService.sendEmail({
    to: email,
    subject: 'Validate your account!',
    htmlBody: `<h1>Validate Your Email</h1><p>Click the link below to validate your email:</p><a href="${link}">${link}</a>`,
  });

  if (!isSent) throw CustomError.internalServer('Error sending email');
};
```

## 🗄️ Database Schema

### Users Table

- `id`: Primary key (UUID)
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (ADMIN/USER)
- `status`: Account status (true/false for email validation)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### PetPosts Table

- `id`: Primary key (UUID)
- `title`: Post title
- `description`: Post description
- `petType`: Type of pet (DOG/CAT/OTHER)
- `age`: Pet age
- `status`: Post status (PENDING/APPROVED/REJECTED)
- `user`: Reference to user who created the post
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## 🤝 How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 🔧 Development

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_HOST` - PostgreSQL host (Neon)
- `DATABASE_PORT` - PostgreSQL port
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `DATABASE_NAME` - Database name
- `JWT_KEY` - Secret key for JWT tokens
- `JWT_EXPIRE_IN` - JWT token expiration time
- `MAILER_SERVICE` - Email service provider
- `MAILER_EMAIL` - Email address for sending emails
- `MAILER_SECRET_KEY` - Email service password/app key
- `SEND_MAIL` - Enable/disable email sending

### Project Structure

```
src/
├── app.ts                 # Application entry point
├── config/               # Configuration files
│   ├── bcrypt.adapter.ts # Password hashing
│   ├── envs.ts          # Environment variables
│   └── jwt.adapter.ts   # JWT utilities
├── data/                # Database layer
│   └── postgres/        # PostgreSQL configuration
│       ├── models/      # Database models
│       └── postgres-database.ts
├── domain/              # Business logic layer
│   ├── dtos/           # Data Transfer Objects
│   └── erros/          # Custom error classes
└── presentation/        # API layer
    ├── common/          # Shared middleware and services
    ├── petposts/        # Pet posts endpoints
    └── users/           # User endpoints
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**: Ensure your Neon database is running and credentials are correct
2. **Email Not Sending**: Verify your email service credentials and app passwords
3. **JWT Token Issues**: Check that JWT_KEY is properly set in environment variables

### Debug Mode

Enable detailed logging by setting `NODE_ENV=development` and check the console for detailed error messages.

## 💖 Support My Work

If you find this project useful, consider supporting my development:

[![Support via PayPal](https://img.shields.io/badge/Donate-PayPal-blue?style=for-the-badge&logo=paypal)](https://paypal.me/yourusername)

---

⭐ Feel free to star the repository if you like this project!
