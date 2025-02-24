import type { Request, Response, NextFunction } from 'express';
import { Task, type ITask } from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}

export async function taskExists(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            return res
                .status(404)
                .json({ success: false, message: error.message });
        }
        req.task = task;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'There was an error' });
    }
}

export function taskBelongsToProject(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(400).json({ success: false, message: error.message });
    }
    next();
}

export function hasAuthorization(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.user?.id.toString() !== req.project.manager?.toString()) {
        const error = new Error('Acción no válida');
        return res.status(400).json({ success: false, message: error.message });
    }
    next();
}
