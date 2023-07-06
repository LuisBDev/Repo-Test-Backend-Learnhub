// Importamos la librería mongoose para interactuar con MongoDB
import mongoose from "mongoose";

// Obtenemos el objeto ObjectId desde la propiedad Schema de mongoose
const { ObjectId } = mongoose.Schema;

// Definimos el esquema para el modelo "Completed"
const completedSchema = new mongoose.Schema(
    {
        // Campo "user": hace referencia al modelo "User" mediante el ObjectId
        user: {
            type: ObjectId,
            ref: 'User', // "ref" especifica a qué modelo hace referencia (User en este caso)
        },
        // Campo "course": hace referencia al modelo "Course" mediante el ObjectId
        course: {
            type: ObjectId,
            ref: 'Course', // "ref" especifica a qué modelo hace referencia (Course en este caso)
        },
        // Campo "lessons": es un arreglo de ObjectId que hace referencia al modelo "Lesson"
        lessons: [{
            type: ObjectId,
            ref: 'Lesson', // "ref" especifica a qué modelo hace referencia (Lesson en este caso)
        }],
    },
    { timestamps: true } // Se incluye un objeto con timestamps para agregar automáticamente los campos "createdAt" y "updatedAt"
);

// Exportamos el modelo "Completed" creado a partir del esquema definido
export default mongoose.model('Completed', completedSchema);
