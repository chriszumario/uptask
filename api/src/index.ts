import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsConfig } from './config/cors';
import { connectDatabase } from './config/db';
import { config } from './config/config';
import authRoutes from './routes/auth.route';
import projectRoutes from './routes/project.route';

const app = express();

const configureMiddlewares = () => {
    app.use(cors(corsConfig));
    app.use(morgan('dev'));
    app.use(express.json());
};

const configureRoutes = () => {
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
};

const startServer = (): void => {
    app.listen(config.PORT, () => {
        console.log(`Server running on ${config.BASE_URL}:${config.PORT}`);
    });
};

const initServer = async () => {
    try {
        await connectDatabase();
        configureMiddlewares();
        configureRoutes();
        startServer();
    } catch (error) {
        console.error('Error initializing server:', error);
    }
};

initServer();
