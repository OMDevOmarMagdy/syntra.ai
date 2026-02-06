/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags:
 *       - Password Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *           example:
 *             email: john@example.com
 *     responses:
 *       200:
 *         description: Reset email sent (or user not found - same response for security)
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
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error or email service failure
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with valid token
 *     tags:
 *       - Password Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *               - passwordConfirm
 *             properties:
 *               token:
 *                 type: string
 *                 description: Reset token from email link
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: New password (must contain uppercase, lowercase, numbers)
 *               passwordConfirm:
 *                 type: string
 *                 minLength: 6
 *                 description: Confirm new password (must match)
 *           example:
 *             token: abc123def456...
 *             password: NewPassword123
 *             passwordConfirm: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid token, expired token, or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 */
