import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // todo: Auth when Revolt introduces OAuth2
    
    return next()
}