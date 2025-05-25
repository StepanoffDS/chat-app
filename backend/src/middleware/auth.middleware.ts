import User from '@models/user.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (typeof decoded !== 'object' || !('userId' in decoded)) {
      return res.status(401).json({ message: 'Something went wrong' });
    }

    const user = await User.findById(decoded.userId!).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    (req as any).user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { protectRoute };
