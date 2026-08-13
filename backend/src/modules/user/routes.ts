import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { registerUser, loginUser, logoutUser } from "./controller";
import { loginSchema, registerSchema } from "./schema";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.post("/logout", logoutUser);

export default authRouter;
