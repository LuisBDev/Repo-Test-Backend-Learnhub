// Importar el módulo express-jwt para manejar la autenticación basada en JSON Web Tokens (JWT)
import expressJwt from "express-jwt";

// Importar los modelos User y Course desde las rutas especificadas
import User from "../models/user";
import Course from "../models/course";

// Middleware para requerir que el usuario esté autenticado mediante JWT
export const requireSignin = expressJwt({
    getToken: (req, res) => req.cookies.token, // Obtener el token JWT desde las cookies de la solicitud
    secret: process.env.JWT_SECRET, // Utilizar la clave secreta definida en el entorno para verificar el token
    algorithms: ["HS256"], // Especificar los algoritmos permitidos para la firma del token
});

// Middleware para verificar si el usuario es un instructor
export const isInstructor = async (req, res, next) => {
    try {
        // Buscar el usuario en la base de datos mediante su ID extraído del token JWT
        const user = await User.findById(req.user._id).exec();

        // Verificar si el rol del usuario incluye "Instructor"
        if (!user.role.includes("Instructor")) {
            // Si no es instructor, responder con estado 403 (Prohibido)
            return res.sendStatus(403);
        } else {
            // Si es instructor, continuar con el siguiente middleware
            next();
        }
    } catch (err) {
        // En caso de error, imprimirlo en la consola para fines de depuración
        console.log(err);
    }
};

// Middleware para verificar si el usuario está inscrito en un curso específico
export const isEnrolled = async (req, res, next) => {
    try {
        // Buscar el usuario en la base de datos mediante su ID extraído del token JWT
        const user = await User.findById(req.user._id).exec();

        // Buscar el curso en la base de datos mediante el slug proporcionado en los parámetros de la solicitud
        const course = await Course.findOne({ slug: req.params.slug }).exec();

        // Crear un array de IDs de cursos a partir de los IDs almacenados en el usuario
        let ids = [];
        user.courses.forEach((courseId) => {
            ids.push(courseId.toString());
        });

        // Verificar si el ID del curso se encuentra en el array de IDs de cursos del usuario
        if (!ids.includes(course._id.toString())) {
            // Si no está inscrito, responder con estado 403 (Prohibido)
            res.sendStatus(403);
        } else {
            // Si está inscrito, continuar con el siguiente middleware
            next();
        }
    } catch (err) {
        // En caso de error, imprimirlo en la consola para fines de depuración
        console.log(err);
    }
};
