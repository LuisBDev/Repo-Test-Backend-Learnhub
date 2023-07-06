import express from "express";
import { requireSignin } from "../middlewares";


const router = express.Router();

// controllers
import {
    register,
    login,
    logout,
    currentUser,
    forgotPassword,
    resetPassword,
} from "../controllers/auth";
// NOSONAR_START




router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);





// NOSONAR_END
module.exports = router;
