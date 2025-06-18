import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './backend/routes/auth.js';
import simulationRoutes from './backend/routes/Simulation.js';
import userRoutes from './backend/routes/User.js';
import errorHandler from './backend/middleware/errorHandler.js';
import { connectDB } from './backend/config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

async function startServer() {
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Dynamically import the Swagger JSON
const swaggerDocument = (await import('./swagger/swagger.json', {
  assert: { type: 'json' }
})).default;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();