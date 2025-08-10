import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    creator: { type: String, required: true }, // typically Auth0 `sub`
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    tags: [{ type: String, trim: true }]
    }, { timestamps: true }
);

const Course = model('Course', CourseSchema);
export default Course;
