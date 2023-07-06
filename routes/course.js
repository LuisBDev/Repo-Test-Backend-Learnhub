// Importamos los módulos necesarios
import express from "express"; // Importamos el módulo express para crear el enrutador
import formidable from "express-formidable"; // Importamos el módulo formidable para manejar formularios

// Creamos el enrutador
const router = express.Router(); // Creamos una instancia de enrutador de express

// Importamos los middlewares necesarios
import { requireSignin, isInstructor, isEnrolled } from "../middlewares"; // Importamos middlewares personalizados

// Importamos los controladores necesarios
import {
    uploadImage,
    removeImage,
    create,
    read,
    uploadVideo,
    removeVideo,
    addLesson,
    addQuestion,
    update,
    removeLesson,
    updateLesson,
    publishCourse,
    unpublishCourse,
    courses,
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    userCourses,
    markCompleted,
    listCompleted,
    markIncomplete,
    markCompletedQuestion,
    listCompletedQuestion
} from "../controllers/course"; // Importamos controladores para las rutas

// Definición de las rutas y sus respectivas funciones controladoras

// Rutas públicas de consulta de cursos
router.get("/courses", courses); // Obtiene la lista de cursos

// Rutas relacionadas con la imagen del curso
router.post("/course/upload-image", uploadImage); // Sube una imagen para el curso
router.post("/course/remove-image", removeImage); // Elimina la imagen del curso

// Rutas para crear y modificar un curso
router.post("/course", requireSignin, isInstructor, create); // Crea un nuevo curso (Requiere autenticación y permiso de instructor)
router.put("/course/:slug", requireSignin, update); // Actualiza un curso existente (Requiere autenticación y permiso de instructor)
router.get("/course/:slug", read); // Obtiene información detallada de un curso

// Rutas relacionadas con la subida y eliminación de videos del curso
router.post(
    "/course/video-upload/:instructorId",
    requireSignin,
    formidable(),
    uploadVideo
); // Sube un video para el curso (Requiere autenticación, permiso de instructor y utiliza el módulo formidable para manejar el formulario)
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo); // Elimina un video del curso (Requiere autenticación y permiso de instructor)

// Rutas para publicar o despublicar un curso
router.put("/course/publish/:courseId", requireSignin, publishCourse); // Publica un curso (Requiere autenticación)
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse); // Despublica un curso (Requiere autenticación)

// Rutas para agregar lecciones y preguntas a un curso
router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson); // Agrega una lección a un curso (Requiere autenticación y permiso de instructor)
router.post("/course/question/:slug/:instructorId", requireSignin, addQuestion); // Agrega una pregunta a un curso (Requiere autenticación y permiso de instructor)

// Rutas para actualizar y eliminar lecciones de un curso
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson); // Actualiza una lección existente de un curso (Requiere autenticación y permiso de instructor)
router.put("/course/:slug/:lessonId", requireSignin, removeLesson); // Elimina una lección de un curso (Requiere autenticación y permiso de instructor)

// Ruta para verificar si un usuario está inscrito en un curso
router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment); // Verifica la inscripción de un usuario en un curso (Requiere autenticación)

// Rutas para inscribirse en un curso (gratuito o de pago)
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment); // Realiza una inscripción gratuita en un curso (Requiere autenticación)
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment); // Realiza una inscripción de pago en un curso (Requiere autenticación)

// Rutas relacionadas con los cursos del usuario
router.get("/user-courses", requireSignin, userCourses); // Obtiene la lista de cursos del usuario (Requiere autenticación)
router.get("/user/course/:slug", requireSignin, isEnrolled, read); // Obtiene información detallada de un curso al que el usuario está inscrito (Requiere autenticación y estar inscrito)

// Rutas para marcar lecciones y preguntas como completadas
router.post("/mark-completed", requireSignin, markCompleted); // Marca una lección como completada (Requiere autenticación)
router.post("/list-completed", requireSignin, listCompleted); // Lista las lecciones completadas de un usuario (Requiere autenticación)
router.post("/mark-incomplete", requireSignin, markIncomplete); // Marca una lección como incompleta (Requiere autenticación)

router.post("/mark-completed-question", requireSignin, markCompletedQuestion); // Marca una pregunta como completada (Requiere autenticación)
router.post("/list-completed-question", requireSignin, listCompletedQuestion); // Lista las preguntas completadas de un usuario (Requiere autenticación)

// Exportamos el enrutador para usarlo en otros archivos
module.exports = router;
