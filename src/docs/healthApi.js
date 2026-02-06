/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Health Check
 *     tags:
 *       - Health
 *     description: Check if the API is running and responding
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-11-27T10:30:00.000Z
 */
