// Importamos la librería AWS desde el módulo "aws-sdk"
import AWS from "aws-sdk";

// Importamos la función "nanoid" desde el módulo "nanoid"
import { nanoid } from "nanoid";

// Importamos la función "slugify" desde el módulo "slugify"
import slugify from "slugify";

// Importamos la función "readFileSync" desde el módulo "fs"
import { readFileSync } from "fs";

// Importamos el modelo "User" desde el archivo "../models/user"
import User from "../models/user";

// Importamos el modelo "Course" desde el archivo "../models/course"
import Course from "../models/course";

// Importamos el modelo "Completed" desde el archivo "../models/completed"
import Completed from "../models/completed";

// Importamos el modelo "CompletedQuestion" desde el archivo "../models/completedQuestion"
import CompletedQuestion from "../models/completedQuestion";

// Configuración de AWS que contiene las credenciales y la región
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // ID de clave de acceso de AWS proporcionado en el entorno
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Clave de acceso secreta de AWS proporcionada en el entorno
    region: process.env.AWS_REGION, // Región de AWS proporcionada en el entorno
    apiVersion: process.env.AWS_API_VERSION, // Versión de la API de AWS proporcionada en el entorno
};

// Creación de una nueva instancia de AWS S3 utilizando la configuración previamente definida
const S3 = new AWS.S3(awsConfig);


export const uploadImage = async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).send("No image");

        const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64"); //NOSONAR

        const type = image.split(";")[0].split("/")[1];

        const params = {
            Bucket: "learnhub-bucket",
            Key: `${nanoid()}.${type}`,
            Body: base64Data,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${type}`,
        };

        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }
            console.log(data);
            res.send(data);
        });
    } catch (err) {
        console.log(err);
    }
};

export const removeImage = async (req, res) => {
    try {
        const { image } = req.body;
        const params = {
            Bucket: image.Bucket,
            Key: image.Key,
        };

        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            }
            res.send({ ok: true });
        });
    } catch (err) {
        console.log(err);
    }
};

export const create = async (req, res) => {
    try {
        const alreadyExist = await Course.findOne({
            slug: slugify(req.body.name.toLowerCase()),
        });
        if (alreadyExist) return res.status(400).send("Title is taken");

        const course = await new Course({
            slug: slugify(req.body.name),
            instructor: req.user._id,
            ...req.body,
        }).save();

        res.json(course);
    } catch (err) {
        console.log(err);
        return res.status(400).send("La creación de curso falló.");
    }
};

export const read = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug })
            .populate("instructor", "_id name")
            .exec();
        res.json(course);
    } catch (err) {
        console.log(err);
    }
};

export const uploadVideo = async (req, res) => {
    try {
        if (req.user._id != req.params.instructorId) {
            return res.status(400).send("No autorizado");
        }

        const { video } = req.files;
        if (!video) return res.status(400).send("No hay video");

        const params = {
            Bucket: "learnhub-bucket",
            Key: `${nanoid()}.${video.type.split("/")[1]}`,
            Body: readFileSync(video.path),
            ACL: "public-read",
            ContentType: video.type,
        };

        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            }
            console.log(data);
            res.send(data);
        });
    } catch (err) {
        console.log(err);
    }
};

export const removeVideo = async (req, res) => {
    try {
        if (req.user._id != req.params.instructorId) {
            return res.status(400).send("No autorizado");
        }

        const { Bucket, Key } = req.body;

        const params = {
            Bucket,
            Key,
        };

        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            }
            console.log(data);
            res.send({ ok: true });
        });
    } catch (err) {
        console.log(err);
    }
};

export const addLesson = async (req, res) => {
    try {
        const { slug, instructorId } = req.params;
        const { title, content, video } = req.body;

        if (req.user._id != instructorId) {
            return res.status(400).send("No autorizado");
        }

        const updated = await Course.findOneAndUpdate({ slug }, { $push: { lessons: { title, content, video, slug: slugify(title) } } }, { new: true }).populate("instructor", "_id name").exec(); // NOSONAR
        res.json(updated);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error al agregar la lección");
    }
};


export const addQuestion = async (req, res) => {
    try {
        const { slug, instructorId } = req.params;
        const { title, content, answer, options } = req.body;
        if (req.user._id != instructorId) {
            return res.status(400).send("No autorizado");
        }

        const updated = await Course.findOneAndUpdate({ slug },
            { $push: { questions: { title, content, answer, options, slug: slugify(title) } } },
            { new: true }).populate("instructor", "_id name").exec(); // NOSONAR
        res.json(updated);

    }
    catch (err) {
        console.log(err);
        return res.status(400).send("Error al agregar la pregunta");
    }
};


export const update = async (req, res) => {
    try {
        const { slug } = req.params;
        const course = await Course.findOne({ slug }).exec();
        if (req.user._id != course.instructor) {
            return res.status(400).send("No autorizado");
        }

        const updated = await Course.findOneAndUpdate({ slug }, req.body, {
            new: true,
        }).exec();

        res.json(updated);
    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
};

export const removeLesson = async (req, res) => {
    const { slug, lessonId } = req.params;
    const course = await Course.findOne({ slug }).exec();
    if (req.user._id != course.instructor) {
        return res.status(400).send("No autorizado");
    }

    await Course.findByIdAndUpdate(course._id, { $pull: { lessons: { _id: lessonId } } }).exec();


    res.json({ ok: true });
};

export const updateLesson = async (req, res) => {
    try {
        const { slug } = req.params;
        const { _id, title, content, video, free_preview } = req.body;
        const course = await Course.findOne({ slug }).select("instructor").exec();

        if (course.instructor._id != req.user._id) {
            return res.status(400).send("No autorizado");
        }

        const updated = await Course.updateOne({ "lessons._id": _id }, { $set: { "lessons.$.title": title, "lessons.$.content": content, "lessons.$.video": video, "lessons.$.free_preview": free_preview } }, { new: true }).exec(); // NOSONAR
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error al actualizar la lección");
    }
};

export const publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).select("instructor").exec();

        if (course.instructor._id != req.user._id) {
            return res.status(400).send("No autorizado");
        }

        const updated = await Course.findByIdAndUpdate(
            courseId,
            { published: true },
            { new: true }
        ).exec();
        res.json(updated);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error al publicar el curso");
    }
};

export const unpublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).select("instructor").exec();

        if (course.instructor._id != req.user._id) {
            return res.status(400).send("No autorizado");
        }

        const updated = await Course.findByIdAndUpdate(
            courseId,
            { published: false },
            { new: true }
        ).exec();
        res.json(updated);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error al despublicar el curso");
    }
};

export const courses = async (req, res) => {
    const all = await Course.find({ published: true })
        .populate("instructor", "_id name")
        .exec();
    res.json(all);
};

export const checkEnrollment = async (req, res) => {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id).exec();
    let ids = [];
    let length = user.courses ? user.courses.length : 0;

    for (let i = 0; i < length; i++) {
        ids.push(user.courses[i].toString());
    }
    res.json({
        status: ids.includes(courseId),
        course: await Course.findById(courseId).exec(),
    });
};

export const freeEnrollment = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).exec();
        if (course.paid) return;

        const result = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { courses: course._id },
            },
            { new: true }
        ).exec();
        console.log(result);
        res.json({
            message: `Te has matriculado al curso de ${course.name}`,
            course,
        });
    } catch (err) {
        console.log("Error al crear la matrícula gratuita", err);
        return res.status(400).send("Error al crear la matrícula");
    }
};

export const paidEnrollment = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).exec();
        const result = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { courses: course._id },
            },
            { new: true }
        ).exec();
        console.log(result);
        res.json({
            message: `Te has matriculado al curso de ${course.name}`,
            course,
        });
    } catch (err) {
        console.log("Error al crear la matrícula pagada", err);
        return res.status(400).send("Error al crear la matrícula");
    }
};



export const userCourses = async (req, res) => {
    const user = await User.findById(req.user._id).exec();
    const courses = await Course.find({ _id: { $in: user.courses } })
        .populate("instructor", "_id name")
        .exec();
    res.json(courses);
};

export const markCompleted = async (req, res) => {
    const { courseId, lessonId } = req.body;
    console.log("Course ID: ", courseId);
    console.log("Lesson ID: ", lessonId);

    const existing = await Completed.findOne({ user: req.user._id, course: courseId }).exec(); // NOSONAR

    if (existing) {
        const updated = await Completed.findOneAndUpdate({ user: req.user._id, course: courseId }, { $addToSet: { lessons: lessonId } }).exec(); // NOSONAR

        console.log(updated);
        res.json({ ok: true });
    }
    else {
        const created = await new Completed({
            user: req.user._id,
            course: courseId,
            lessons: lessonId,
        }).save();
        console.log(created);
        res.json({ ok: true });

    }
};

export const markCompletedQuestion = async (req, res) => {

    const { courseId, questionId } = req.body;
    console.log("Course ID: ", courseId);
    console.log("Question ID: ", questionId);

    const existing = await CompletedQuestion.findOne({ user: req.user._id, course: courseId }).exec(); // NOSONAR
    if (existing) {
        const updated = await CompletedQuestion.findOneAndUpdate({ user: req.user._id, course: courseId }, { $addToSet: { questions: questionId } }).exec(); // NOSONAR
        console.log(updated);
        res.json({ ok: true });

    }
    else {
        const created = await new CompletedQuestion({
            user: req.user._id,
            course: courseId,
            questions: questionId,
        }).save();
        console.log(created);
        res.json({ ok: true });

    }
};



export const listCompleted = async (req, res) => {

    try {
        const list = await Completed.findOne({ user: req.user._id, course: req.body.courseId }).exec(); // NOSONAR
        list && res.json(list.lessons);
    }
    catch (err) {
        console.log(err);
    }

};

export const listCompletedQuestion = async (req, res) => {
    try {
        const list = await CompletedQuestion.findOne({ user: req.user._id, course: req.body.courseId }).exec(); // NOSONAR
        list && res.json(list.questions);

    }
    catch (err) {
        console.log(err);
    }
};


export const markIncomplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;
        const updated = await Completed.findOneAndUpdate({ user: req.user._id, course: courseId }, { $pull: { lessons: lessonId } }).exec(); // NOSONAR
        console.log(updated);
        res.json({ ok: true });

    }
    catch (err) {
        console.log(err);
    }
};
