import type { Request, Response, NextFunction } from 'express';
import { Project, type IProject } from '../models/Project';

declare global {
    namespace Express {
        interface Request {
            project: IProject;
        }
    }
}

export async function projectExists(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error('Proyecto no encontrado');
            return res
                .status(404)
                .json({ success: false, message: error.message });
        }
        req.project = project;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'There was an error' });
    }
}
