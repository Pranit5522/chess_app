import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma"
import { createUser, findUserByEmail, findUserByUsername } from "./service";

export const registerUser = async (req: Request, res: Response) => {
    let { email, username, password } = req.body;

    const user = await findUserByEmail(email);
    if (user) {
        return res.status(401).json({ message: "Email already exists" });
    }

    const existingUsername = await findUserByUsername(username);

    if (existingUsername) {
        return res.status(401).json({ message: "Username already exists" });
    }

    const newUser = await createUser({ email, username, password });

    return res.json({
        success: true,
        message: "User registered successfully",
        user: {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
        }
    });
};

export const loginUser = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return res.status(401).json({ message: "Email doesnt exist" });
    }

    if (user.password) {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } else {
        // Outh users
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        path: "/",
        maxAge: 60 * 60 * 1000,
    });

    res.cookie("loggedIn", "1", {
        httpOnly: false,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        path: "/",
        maxAge: 60 * 60 * 1000,
    });

    return res.json({
        success: true,
        message: "Login successful",
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        }
    });
};

export const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("loggedIn", { path: "/" });
    return res.json({ success: true, message: "Logged out" });
};