import User from "../models/user";
import Course from "../models/course";


export const makeInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).exec();
        const updatedRoles = user.role.filter(role => role !== "Subscriber");
        updatedRoles.push("Instructor");
        user.role = updatedRoles;
        const statusUpdated = await user.save();
        res.json(statusUpdated);
    } catch (err) {
        console.log(err);
    }
};

export const getAccountStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).exec();
        res.json(user);
    } catch (err) {
        console.log(err);
    }
};

export const currentInstructor = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select("-password").exec();
        if (!user.role.includes("Instructor")) {
            return res.sendStatus(403);
        } else {
            res.json({ ok: true });
        }
    } catch (err) {
        console.log(err);
    }
};

export const instructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
            .sort({ createdAt: -1 })
            .exec();
        res.json(courses);
    } catch (err) {
        console.log(err);
    }
};
