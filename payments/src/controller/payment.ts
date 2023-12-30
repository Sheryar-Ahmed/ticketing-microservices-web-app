import { Request, Response } from "express"


const createCharge = async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    if (!token || !orderId) {
        return res.status(400).json({
            success: false,
            message: "Token or orderId cannot be empty",
        })
    }

    res.status(201).json({
        success: true,
    })
}


export { createCharge };