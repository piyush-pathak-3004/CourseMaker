import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ModuleSchema = new Schema({
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
    }, { timestamps: true }
);

const Module = model('Module', ModuleSchema);
export default Module;