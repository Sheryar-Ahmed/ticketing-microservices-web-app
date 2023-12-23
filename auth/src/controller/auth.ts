import { Request, Response } from "express";
import { User } from "../model/user";
import jwt from "jsonwebtoken";

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

    const jwtsign = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: jwtsign
    }
    res.status(201).json({
        message: "User registered Successfully",
        user: user
    });
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const userExists = await User.findOne({ email: email });

        if (!userExists) {
            return res.status(404).json({
                message: 'Invalid user or password',
            });
        }

        const isMatch = await User.comparePassword(password, userExists.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid user or password',
            });
        }
        const jwtsign = jwt.sign({
            id: userExists._id,
            email: userExists.email
        }, process.env.JWT_KEY!);

        req.session = {
            jwt: jwtsign
        }
        return res.status(200).json({
            message: 'Login successful',
            userExists
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};



const UpdateUser = async (req: Request, res: Response) => {

};

const currentUser = async (req: Request, res: Response) => {
    try {
        if (!req.session?.jwt) {
            return res.status(404).json({
                currentUser: null
            })
        }
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
        res.status(200).json({
            success: true,
            payload,
        })
    } catch (error) {
        res.status(404).json({ currentUser: null })
    }
};
const logout = async (req: Request, res: Response) => {
    req.session = null;
    res.status(200).json({});
};


export { addUser, loginUser, UpdateUser, logout, currentUser };