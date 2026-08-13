import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { registerUser, loginUser } from "./controller";
import { loginSchema, registerSchema } from "./schema";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);

export default authRouter;
