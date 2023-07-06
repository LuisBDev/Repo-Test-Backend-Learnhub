// Importación del módulo mongoose
import mongoose from "mongoose";

// Extracción de la función ObjectId del módulo mongoose.Schema
const { ObjectId } = mongoose.Schema;

// Definición del esquema para las lecciones del curso
const lessonSchema = new mongoose.Schema(
    {
        // Título de la lección
        title: {
            type: String,
            trim: true, // Se eliminarán espacios en blanco al principio y al final del título
            minlength: 3, // Longitud mínima permitida para el título (3 caracteres)
            maxlength: 320, // Longitud máxima permitida para el título (320 caracteres)
            required: true, // El título es obligatorio
        },
        // Slug de la lección, será una versión en minúsculas del título
        slug: {
            type: String,
            lowercase: true, // Se convertirá a minúsculas automáticamente
        },
        // Contenido de la lección (puede ser de cualquier tipo)
        content: {
            type: {}, // Tipo de dato flexible, cualquier tipo de dato es válido
            minlength: 200, // Longitud mínima permitida para el contenido (200 caracteres)
        },
        // Video asociado a la lección (puede ser de cualquier tipo)
        video: {},
        // Indica si la lección es una vista previa gratuita
        free_preview: {
            type: Boolean,
            default: false, // Por defecto, una lección no es una vista previa gratuita
        },
    },
    { timestamps: true } // Se agregan campos de timestamp automáticamente (createdAt, updatedAt)
);

// Definición del esquema para las preguntas del curso
const questionSchema = new mongoose.Schema(
    {
        // Título de la pregunta
        title: {
            type: String,
            trim: true, // Se eliminarán espacios en blanco al principio y al final del título
            minlength: 3, // Longitud mínima permitida para el título (3 caracteres)
            maxlength: 320, // Longitud máxima permitida para el título (320 caracteres)
            required: true, // El título de la pregunta es obligatorio
        },
        // Slug de la pregunta, será una versión en minúsculas del título
        slug: {
            type: String,
            lowercase: true, // Se convertirá a minúsculas automáticamente
        },
        // Contenido de la pregunta (puede ser de cualquier tipo)
        content: {
            type: {}, // Tipo de dato flexible, cualquier tipo de dato es válido
            minlength: 200, // Longitud mínima permitida para el contenido (200 caracteres)
        },
        // Respuesta de la pregunta
        answer: {
            type: String, // Tipo de dato para la respuesta (cadena de texto)
            required: true, // La respuesta es obligatoria
        },
        // Opciones de respuesta para la pregunta (arreglo de cadenas de texto)
        options: {
            type: [String], // Tipo de dato para las opciones de respuesta (arreglo de cadenas)
            required: true, // Las opciones de respuesta son obligatorias
        },
    },
    { timestamps: true } // Se agregan campos de timestamp automáticamente (createdAt, updatedAt)
);

// Definición del esquema para los cursos
const courseSchema = new mongoose.Schema(
    {
        // Nombre del curso
        name: {
            type: String,
            trim: true, // Se eliminarán espacios en blanco al principio y al final del nombre
            minlength: 3, // Longitud mínima permitida para el nombre del curso (3 caracteres)
            maxlength: 320, // Longitud máxima permitida para el nombre del curso (320 caracteres)
            required: true, // El nombre del curso es obligatorio
        },
        // Slug del curso, será una versión en minúsculas del nombre del curso
        slug: {
            type: String,
            lowercase: true, // Se convertirá a minúsculas automáticamente
        },
        // Descripción del curso (puede ser de cualquier tipo)
        description: {
            type: {}, // Tipo de dato flexible, cualquier tipo de dato es válido
            minlength: 200, // Longitud mínima permitida para la descripción (200 caracteres)
            required: true, // La descripción del curso es obligatoria
        },
        // Precio del curso (número)
        price: {
            type: Number, // Tipo de dato para el precio (número)
            default: 9.99, // Precio por defecto si no se especifica uno
        },
        // Imagen asociada al curso (puede ser de cualquier tipo)
        image: {},
        // Categoría del curso (cadena de texto)
        category: String,
        // Indica si el curso ha sido publicado
        published: {
            type: Boolean,
            default: false, // Por defecto, el curso no está publicado
        },
        // Indica si el curso es de pago
        paid: {
            type: Boolean,
            default: true, // Por defecto, el curso es de pago
        },
        // Identificador del instructor del curso (relación con el modelo User)
        instructor: {
            type: ObjectId,
            ref: "User", // Referencia al modelo User para establecer la relación
            required: true, // El instructor del curso es obligatorio
        },
        // Lista de lecciones asociadas al curso (arreglo de objetos con el esquema lessonSchema)
        lessons: [lessonSchema],
        // Lista de preguntas asociadas al curso (arreglo de objetos con el esquema questionSchema)
        questions: [questionSchema],
    },
    { timestamps: true } // Se agregan campos de timestamp automáticamente (createdAt, updatedAt)
);

// Exportación del modelo "Course" basado en el esquema courseSchema
export default mongoose.model("Course", courseSchema);
