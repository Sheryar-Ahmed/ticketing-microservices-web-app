import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the user interface with id and email properties
interface User {
    _id: string;
    email: string;
    __v: BigInteger;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        res.status(409).json({
            success: false,
            message: 'Unauthorized Acess'
        });
    }

    try {
        const decodedData = jwt.verify(
            req.session?.jwt,
            process.env.JWT_KEY!
        ) as JwtPayload;

        // Assuming that the decodedData has the required properties
        // You may need to adjust this based on the actual structure of JwtPayload
        const currentUser: User = {
            _id: decodedData._id as string,
            email: decodedData.email as string,
            __v: decodedData.__v as BigInteger,
        };

        req.currentUser = currentUser;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

export { isAuthenticated };
