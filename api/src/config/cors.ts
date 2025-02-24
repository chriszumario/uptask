import type { CorsOptions } from 'cors';
import { config } from './config';

/**
 * CORS configuration options
 */
export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        if (config.ENVIRONMENT === 'development') {
            console.log(
                'CORS: Request without origin allowed in development mode'
            );
            return callback(null, true);
        }

        if (config.ALLOWED_ORIGINS.includes(origin || '')) {
            return callback(null, true);
        }

        console.log(`CORS error: Origin ${origin || 'unknown'} not allowed`);
        return callback(
            new Error(`CORS error: Origin ${origin || 'unknown'} not allowed`)
        );
    },
};
