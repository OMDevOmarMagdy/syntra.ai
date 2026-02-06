/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: Password123
 *     responses:
 *       200:
 *         description: User registered successfully. Please verify your email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error (missing fields, passwords don't match, invalid email)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: john@example.com
 *             password: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Account is disabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */

  /**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out current user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */

 /**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify user email address
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Redirect to GitHub OAuth login
 *     tags:
 *       - Authentication
 *     description: Initiates GitHub OAuth flow. User will be redirected to GitHub login page.
 *     responses:
 *       302:
 *         description: Redirect to GitHub OAuth authorization page
 */


//  * @swagger
//  * /auth/github/callback:
//  *   get:
//  *     summary: GitHub OAuth callback (internal)
//  *     tags:
//  *       - Authentication
//  *     description: Callback endpoint for GitHub OAuth. Automatically called by GitHub after user authorization.
//  *     parameters:
//  *       - in: query
//  *         name: code
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Authorization code from GitHub
//  *       - in: query
//  *         name: state
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: State parameter for CSRF protection
//  *     responses:
//  *       302:
//  *         description: Redirect to frontend with JWT token in query string
//  *         headers:
//  *           Location:
//  *             schema:
//  *               type: string
//  *               example: http://localhost:3000/auth/success?token=eyJhbGc...
//  *       401:
//  *         description: GitHub authentication failed
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'



//  * @swagger
//  * /auth/github/failure:
//  *   get:
//  *     summary: GitHub authentication failure
//  *     tags:
//  *       - Authentication
//  *     description: Redirect target when GitHub OAuth fails
//  *     responses:
//  *       401:
//  *         description: GitHub authentication failed
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *       500:
//  *         description: Server error


/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized. Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */


//  * @swagger
//  * /auth/change-password:
//  *   post:
//  *     summary: Change user password
//  *     tags:
//  *       - Authentication
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/ChangePasswordRequest'
//  *           example:
//  *             currentPassword: OldPassword123
//  *             newPassword: NewPassword456
//  *             confirmPassword: NewPassword456
//  *     responses:
//  *       200:
//  *         description: Password changed successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *       400:
//  *         description: Validation error (passwords don't match, weak password, etc.)
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *       401:
//  *         description: Current password is incorrect or not authorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *       500:
//  *         description: Server error

