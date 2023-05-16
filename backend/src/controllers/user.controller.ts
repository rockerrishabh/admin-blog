import { Request, Response } from "express";

const registerUser = (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;
};

export { registerUser };
