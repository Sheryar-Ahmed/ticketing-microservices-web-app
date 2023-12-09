import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../model/user";

const addUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Something is missing",
        })
    }
    const userExists = await User.exists({ email: email });
    if (userExists) {
        return res.status(402).json({
            message: "User Already exists with this email. Try to register with different email."
        });
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).json({
        message: "User registered Successfully",
        user: user
    })

};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Something is missing",
        })
    }
};


const UpdateUser = async (req: Request, res: Response) => {

};

const removeUser = async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({
            message: "Something is missing",
        })
    }
};


export { addUser, loginUser, UpdateUser, removeUser };