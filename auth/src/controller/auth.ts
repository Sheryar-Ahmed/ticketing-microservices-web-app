import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";

const addUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Something is missing",
        })
    }
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