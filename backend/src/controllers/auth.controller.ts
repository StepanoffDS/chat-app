import { Request, Response } from 'express';

const signup = (req: Request, res: Response) => {
  res.send('signup');
};

const login = (req: Request, res: Response) => {
  res.send('login');
};

const logout = (req: Request, res: Response) => {
  res.send('logout');
};

export default { signup, login, logout };
