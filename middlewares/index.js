import expressJwt from "express-jwt";
import User from "../models/user";
import Course from "../models/course";

export const requireSignin = expressJwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

export const isInstructor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (!user.role.includes("Instructor")) {
            return res.sendStatus(403);
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};

export const isEnrolled = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        const course = await Course.findOne({ slug: req.params.slug }).exec();

        // Verificar si el id del curso se encuentra en el array de cursos del usuario
        let ids = [];
        user.courses.forEach((courseId) => {
            ids.push(courseId.toString());
        });

        if (!ids.includes(course._id.toString())) {
            res.sendStatus(403);
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};
