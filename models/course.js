import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 320,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        content: {
            type: {},
            minlength: 200,
        },
        video: {},
        free_preview: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 320,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        content: {
            type: {},
            minlength: 200,
        },
        answer: {
            type: String, // Tipo de datos de la respuesta (puedes ajustarlo según tus necesidades)
            required: true,
        },
        options: {
            type: [String], // Tipo de datos de las opciones de respuesta (puedes ajustarlo según tus necesidades)
            required: true,
        },
    },
    { timestamps: true }
);


const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 320,
            required: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: {},
            minlength: 200,
            required: true,
        },
        price: {
            type: Number,
            default: 9.99,
        },
        image: {},
        category: String,
        published: {
            type: Boolean,
            default: false,
        },
        paid: {
            type: Boolean,
            default: true,
        },
        instructor: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        lessons: [lessonSchema],
        questions: [questionSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
