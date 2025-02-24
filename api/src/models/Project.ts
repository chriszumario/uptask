import { Document, model, Schema, Types, type PopulatedDoc } from 'mongoose';
import { Task, type ITask } from './Task';
import type { IUser } from './User';
import { Note } from './Note';

export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}

const ProjectSchema: Schema = new Schema(
    {
        projectName: {
            type: String,
            required: true,
            trim: true,
        },
        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        tasks: [
            {
                type: Types.ObjectId,
                ref: 'Task',
            },
        ],
        manager: {
            type: Types.ObjectId,
            ref: 'User',
        },
        team: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

// Middleware
ProjectSchema.pre('deleteOne', { document: true }, async function () {
    const projectId = this._id;
    if (!projectId) return;

    const tasks = await Task.find({ project: projectId });
    for (const task of tasks) {
        await Note.deleteMany({ task: task.id });
    }

    await Task.deleteMany({ project: projectId });
});

export const Project = model<IProject>('Project', ProjectSchema);
