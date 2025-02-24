import type { Request, Response } from 'express';
import { Task } from '../models/Task';

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body);
            const project = req.project;
            task.project = project.id;
            project.tasks.push(task.id);
            await Promise.allSettled([task.save(), project.save()]);
            res.json({
                message: 'Tarea creada correctamente',
            });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate(
                'project'
            );
            res.json(tasks);
        } catch (error) {
            console.error('Error retrieving project tasks:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
                .populate({ path: 'completedBy.user', select: 'id name email' })
                .populate({
                    path: 'notes',
                    populate: { path: 'createdBy', select: 'id name email' },
                });
            res.json(task);
        } catch (error) {
            console.error('Error displaying a task:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static updateTask = async (req: Request, res: Response) => {
        try {
            const task = req.task;
            task.name = req.body.name;
            task.description = req.body.description;
            await task.save();
            res.json({
                message: 'Tarea actualizada exitosamente',
            });
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static deleteTask = async (req: Request, res: Response) => {
        try {
            const project = req.project;
            const task = req.task;
            project.tasks = project.tasks.filter(
                (t) => t?.toString() !== task.id.toString()
            );
            await Promise.allSettled([task.deleteOne(), project.save()]);
            res.json({
                message: 'Proyecto eliminado exitosamente',
            });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user?.id,
                status,
            };
            req.task.completedBy.push(data);
            await req.task.save();
            res.json({
                message: 'Estado de la tarea actualizado',
            });
        } catch (error) {
            console.error('Error updating task status:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };
}
