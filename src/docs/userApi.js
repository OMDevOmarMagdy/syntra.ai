/**
 * @swagger
 * /user/upload-profile-photo:
 *   post:
 *     summary: Upload or update user profile photo
 *     description: Uploads a profile photo to Cloudinary and updates the user's avatar. If a previous photo exists, it will be replaced.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The profile photo image file (JPEG, PNG, etc.)
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile photo updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User UUID
 *                     avatar:
 *                       type: string
 *                       description: Cloudinary URL of the uploaded photo
 *                     imageUrl:
 *                       type: string
 *                       description: Cloudinary URL of the uploaded photo
 *       400:
 *         description: No image file provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No image file provided
 *       401:
 *         description: Not authorized. Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Upload failed
 */
