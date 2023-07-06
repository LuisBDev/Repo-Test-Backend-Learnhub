// Importación del paquete mongoose para trabajar con MongoDB
import mongoose from "mongoose";

// Extracción del objeto Schema y ObjectId de mongoose
const { Schema } = mongoose;
const { ObjectId } = Schema;

// Definición del esquema de usuario utilizando la clase Schema de mongoose
const userSchema = new Schema(
    {
        // Campo "name" de tipo String, se utiliza para almacenar el nombre del usuario
        name: {
            type: String,
            trim: true,         // Se eliminan los espacios en blanco al inicio y final del texto
            required: true,    // El campo es obligatorio, no se puede dejar vacío
        },
        // Campo "email" de tipo String, se utiliza para almacenar el correo electrónico del usuario
        email: {
            type: String,
            trim: true,         // Se eliminan los espacios en blanco al inicio y final del texto
            required: true,    // El campo es obligatorio, no se puede dejar vacío
            unique: true,      // El valor del campo debe ser único, no puede repetirse en otros documentos
        },
        // Campo "password" de tipo String, se utiliza para almacenar la contraseña del usuario
        password: {
            type: String,
            required: true,    // El campo es obligatorio, no se puede dejar vacío
            min: 6,             // La longitud mínima de la contraseña es de 6 caracteres
            max: 64,            // La longitud máxima de la contraseña es de 64 caracteres
        },
        // Campo "picture" de tipo String, se utiliza para almacenar la URL de la imagen de perfil del usuario
        picture: {
            type: String,
            default: "/avatar.png",  // Valor por defecto si no se proporciona ninguna imagen
        },
        // Campo "role" de tipo Array de Strings, se utiliza para almacenar los roles del usuario
        role: {
            type: [String],
            default: ["Subscriber"], // Valor por defecto si no se especifica ningún rol
            enum: ["Subscriber", "Instructor", "Admin"], // Los roles solo pueden tomar estos valores
        },
        // Campo "passwordResetCode" de tipo String, se utiliza para almacenar un código de restablecimiento de contraseña
        passwordResetCode: {
            data: String,
            default: "",        // Valor por defecto si no hay ningún código de restablecimiento
        },
        // Campo "courses" de tipo Array de ObjectId, se utiliza para almacenar los cursos asociados al usuario
        courses: [{ type: ObjectId, ref: "Course" }], // "Course" es el nombre de la colección referenciada
    },
    { timestamps: true }    // Opción para agregar campos de fecha de creación y actualización automáticamente
);

// Exportación del modelo de usuario definido mediante el esquema
export default mongoose.model("User", userSchema);
