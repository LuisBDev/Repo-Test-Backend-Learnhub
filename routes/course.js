import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middleware
import { requireSignin, isInstructor, isEnrolled } from "../middlewares";

// controllers
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

} from "../controllers/course";

router.get("/courses", courses);
// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", read);
router.post(
    "/course/video-upload/:instructorId",
    requireSignin,
    formidable(),
    uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);


// publicar / despublicar curso
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

// `/api/course/lesson/${slug}/${course.instructor._id}`,
router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.post("/course/question/:slug/:instructorId", requireSignin, addQuestion);

// NOSONAR
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);

router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// matricula
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);


router.get("/user-courses", requireSignin, userCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, read);


//marcar como completado, markCompleted
router.post("/mark-completed", requireSignin, markCompleted);

//list-completed
router.post("/list-completed", requireSignin, listCompleted);

//list-incompleted
router.post("/mark-incomplete", requireSignin, markIncomplete);
// NOSONAR




module.exports = router;
