import express from 'express';
import mapRoutes from './routes/mapRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api', mapRoutes);
app.use('/api', bookingRoutes);
app.use(errorHandler);

export default app;