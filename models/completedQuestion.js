// Importamos la librería de mongoose para interactuar con la base de datos MongoDB.
import mongoose from "mongoose";

// Desestructuramos el objeto 'ObjectId' de la clase Schema de mongoose para utilizarlo más adelante.
const { ObjectId } = mongoose.Schema;

// Creamos un esquema llamado 'completedQuestionSchema' usando la clase 'Schema' de mongoose.
const completedQuestionSchema = new mongoose.Schema(
    {
        // Definimos el campo 'user' en el esquema como un ObjectId que se refiere al modelo 'User'.
        user: {
            type: ObjectId,
            ref: 'User',
        },
        // Definimos el campo 'course' en el esquema como un ObjectId que se refiere al modelo 'Course'.
        course: {
            type: ObjectId,
            ref: 'Course',
        },
        // Definimos el campo 'questions' en el esquema como un array de ObjectId que se refieren al modelo 'Question'.
        questions: [{
            type: ObjectId,
            ref: 'Question',
        }],
    },
    // Agregamos opciones al esquema, en este caso, 'timestamps: true' para registrar automáticamente las fechas de creación y modificación.
    { timestamps: true }
);

// Exportamos el modelo 'CompletedQuestion', que utilizará el esquema 'completedQuestionSchema'.
export default mongoose.model('CompletedQuestion', completedQuestionSchema);
