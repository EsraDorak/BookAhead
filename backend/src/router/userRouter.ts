import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  verifyEmail,
} from "../Controllers/userController";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser); // Geschützte Route
router.get("/", getUsers);
router.post("/verify-email", verifyEmail);

export default router;