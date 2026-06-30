import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import config from './config';
import { requestLogger } from './middleware/logger.middleware';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';

const app: Express = express();

// 1. Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
    credentials: true,
  }),
);

// 2. Rate Limiting (Applied globally to all endpoints)
app.use(rateLimiter);

// 3. HTTP Request Logging (Morgan -> Winston)
app.use(requestLogger);

// 4. Response Compression
app.use(compression());

import { handleWebhook } from './controllers/payment.controller';

// 5. Payload Body Parsers
// Mount Stripe webhook before express.json so it gets the raw buffer
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Cookie Parser
app.use(cookieParser(config.cookieSecret));

// 7. Health Check Endpoint
/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Check API health
 *     description: Returns the status of the API server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Health check passed
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: UP
 *                     environment:
 *                       type: string
 *                       example: development
 *                     timestamp:
 *                       type: string
 *                       example: 2026-06-29T14:30:00.000Z
 *                     uptime:
 *                       type: string
 *                       example: 45.67s
 */
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Health check passed',
    data: {
      status: 'UP',
      environment: config.env,
      timestamp: new Date().toISOString(),
      uptime: `${process.uptime().toFixed(2)}s`,
    },
  });
});

// 8. API Documentation (Swagger)
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 9. API Routes
import apiRoutes from './routes';
app.use('/api/v1', apiRoutes);

// 8. 404 Route Handler (Catch-all for undefined routes)
app.use(notFoundHandler);

// 9. Global Error Handling Middleware (Must be registered last)
app.use(errorHandler);

export default app;
