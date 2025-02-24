import type { Request, Response } from 'express';

import { Note, type INote } from '../models/Note';

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body;

        const note = new Note();
        note.content = content;
        note.createdBy = req.user?.id;
        note.task = req.task.id;

        req.task.notes.push(note.id);
        try {
            await Promise.allSettled([req.task.save(), note.save()]);
            res.status(201).json({
                message: 'Nota creada exitosamente',
            });
        } catch (error) {
            console.error('Error creating note:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id });
            res.json(notes);
        } catch (error) {
            console.error('Error retrieving notes:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };

    static deleteNote = async (req: Request, res: Response) => {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);

        if (!note) {
            const error = new Error('Nota no encontrada');
            return res.status(404).json({ message: error.message });
        }

        if (note.createdBy.toString() !== req.user?.id.toString()) {
            const error = new Error('Acción no válida');
            return res.status(401).json({ message: error.message });
        }

        req.task.notes = req.task.notes.filter(
            (note) => note.toString() !== noteId.toString()
        );

        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.json({
                message: 'Nota eliminada exitosamente',
            });
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).json({
                message: 'Error Interno del Servidor',
            });
        }
    };
}
