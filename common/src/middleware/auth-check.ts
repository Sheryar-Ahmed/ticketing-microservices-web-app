import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the user interface with id and email properties
interface UserPayload {
    id: string;
    email: string;
    iat: number;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log('JWT in session:', req.session?.jwt);

        
        if (!req.session?.jwt) {
            return res.status(409).json({
                success: false,
                message: 'Unauthorized Access'
            });
        }

        const decodedData = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!
        ) as UserPayload;

        req.currentUser = decodedData;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

export { isAuthenticated };
