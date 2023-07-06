// Importamos el módulo 'express' para utilizar su funcionalidad.
import express from "express";

// Importamos el middleware 'requireSignin' desde otro archivo ('../middlewares').
import { requireSignin } from "../middlewares";

// Creamos una nueva instancia de Router para manejar nuestras rutas.
const router = express.Router();

// Importamos los controladores para realizar las acciones asociadas a cada ruta.
import {
    register,            // Controlador para el registro de usuarios.
    login,               // Controlador para el inicio de sesión de usuarios.
    logout,              // Controlador para el cierre de sesión de usuarios.
    currentUser,         // Controlador para obtener los datos del usuario actualmente autenticado.
    forgotPassword,      // Controlador para el proceso de recuperación de contraseña.
    resetPassword,       // Controlador para el proceso de restablecimiento de contraseña.
} from "../controllers/auth";
// NOSONAR_START (Comentario especial, tal vez relacionado con el análisis de código estático)

// Definimos las rutas asociadas a cada controlador utilizando los métodos HTTP adecuados.

// Ruta para registrar un nuevo usuario. Utiliza el método POST para enviar los datos del usuario.
router.post("/register", register);

// Ruta para iniciar sesión. Utiliza el método POST para enviar las credenciales de inicio de sesión.
router.post("/login", login);

// Ruta para cerrar sesión. Utiliza el método GET para realizar la acción.
router.get("/logout", logout);

// Ruta para obtener los datos del usuario actualmente autenticado. Requiere autenticación mediante 'requireSignin' middleware.
router.get("/current-user", requireSignin, currentUser);

// Ruta para solicitar un correo electrónico de recuperación de contraseña. Utiliza el método POST para enviar el correo.
router.post("/forgot-password", forgotPassword);

// Ruta para restablecer la contraseña. Utiliza el método POST para enviar los datos del restablecimiento.
router.post("/reset-password", resetPassword);

// NOSONAR_END (Comentario especial, tal vez relacionado con el análisis de código estático)

// Exportamos el enrutador para que pueda ser utilizado por otras partes de la aplicación.
module.exports = router;
