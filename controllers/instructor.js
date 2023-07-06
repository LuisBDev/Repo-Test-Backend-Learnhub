// Importamos los modelos 'User' y 'Course' desde los archivos correspondientes.
import User from "../models/user";
import Course from "../models/course";

// Función para convertir a un usuario en instructor.
export const makeInstructor = async (req, res) => {
    try {
        // Buscamos al usuario actual por su ID y esperamos la ejecución de la consulta.
        const user = await User.findById(req.user._id).exec();

        // Filtramos los roles actuales del usuario para eliminar el rol de "Subscriber".
        const updatedRoles = user.role.filter(role => role !== "Subscriber");

        // Agregamos el rol de "Instructor" al arreglo de roles del usuario.
        updatedRoles.push("Instructor");

        // Actualizamos el atributo 'role' del usuario con los nuevos roles.
        user.role = updatedRoles;

        // Guardamos los cambios en la base de datos y esperamos a que la operación se complete.
        const statusUpdated = await user.save();

        // Respondemos con el estado actualizado del usuario en formato JSON.
        res.json(statusUpdated);
    } catch (err) {
        // En caso de algún error, lo mostramos en la consola para fines de depuración.
        console.log(err);
    }
};

// Función para obtener el estado de la cuenta del usuario actual.
export const getAccountStatus = async (req, res) => {
    try {
        // Buscamos al usuario actual por su ID y esperamos la ejecución de la consulta.
        const user = await User.findById(req.user._id).exec();

        // Respondemos con los datos del usuario en formato JSON.
        res.json(user);
    } catch (err) {
        // En caso de algún error, lo mostramos en la consola para fines de depuración.
        console.log(err);
    }
};

// Función para verificar si el usuario actual es un instructor.
export const currentInstructor = async (req, res) => {
    try {
        // Buscamos al usuario actual por su ID, excluyendo el atributo 'password', y esperamos la ejecución de la consulta.
        let user = await User.findById(req.user._id).select("-password").exec();

        // Verificamos si el usuario tiene el rol de "Instructor".
        if (!user.role.includes("Instructor")) {
            // Si no es instructor, respondemos con un código de estado 403 (Prohibido).
            return res.sendStatus(403);
        } else {
            // Si es instructor, respondemos con un objeto JSON indicando que está bien.
            res.json({ ok: true });
        }
    } catch (err) {
        // En caso de algún error, lo mostramos en la consola para fines de depuración.
        console.log(err);
    }
};

// Función para obtener los cursos asociados a un instructor específico.
export const instructorCourses = async (req, res) => {
    try {
        // Buscamos los cursos cuyo instructor corresponda al ID del usuario actual, ordenados por fecha de creación descendente.
        const courses = await Course.find({ instructor: req.user._id })
            .sort({ createdAt: -1 })
            .exec();

        // Respondemos con la lista de cursos encontrados en formato JSON.
        res.json(courses);
    } catch (err) {
        // En caso de algún error, lo mostramos en la consola para fines de depuración.
        console.log(err);
    }
};
