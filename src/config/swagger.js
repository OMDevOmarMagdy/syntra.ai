// Swagger/OpenAPI configuration and setup

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Syntra.AI API',
      version: '1.0.0',
      description: 'Complete authentication API with GitHub OAuth and JWT',
      contact: {
        name: 'API Support',
        email: 'support@syntra.ai',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development Server',
      },
      // {
      //   url: 'https://api.syntra.ai/v1',
      //   description: 'Production Server',
      // },
      {
        url: 'https://syntraai-production.up.railway.app/api/v1',
        description: 'Railway Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User MongoDB ID' },
            name: { type: 'string', description: 'User full name' },
            email: { type: 'string', format: 'email', description: 'User email address' },
            avatar: { type: 'string', nullable: true, description: 'User avatar URL' },
            role: { type: 'string', enum: ['user', 'admin'], description: 'User role' },
            githubId: { type: 'string', nullable: true, description: 'GitHub user ID' },
            isActive: { type: 'boolean', description: 'Account active status' },
            emailVerified: { type: 'boolean', description: 'Email verification status' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'passwordConfirm'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Must contain uppercase, lowercase, and numbers',
            },
            passwordConfirm: { type: 'string', minLength: 6, description: 'Must match password' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword', 'confirmPassword'],
          properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 6 },
            confirmPassword: { type: 'string', minLength: 6 },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            token: { type: 'string', description: 'JWT token' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/docs/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
