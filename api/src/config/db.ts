import mongoose from 'mongoose';
import { config } from './config';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.DATABASE_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error(
            'Database connection error:',
            error instanceof Error ? error.message : error
        );
        process.exit(1);
    }
};
