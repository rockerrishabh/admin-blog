import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { prisma } from "../db/prisma";

const secret = process.env.JWT_SECRET || "secret";

const registerUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;
  try {
    if (name && email && password) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
      } else {
        const hashedPassword: string = await argon2.hash(password, {
          hashLength: 32,
        });
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        if (!newUser) {
          res.status(403).json({ message: "Error while saving user" });
        } else {
          res.status(201).json({ message: "User created successfully" });
        }
      }
    } else {
      res.status(400).json({ message: "Something went wring" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    if (email && password) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!existingUser) {
        res.status(400).json({ message: "User not registered" });
      } else {
        const verifyPassword = await argon2.verify(
          existingUser.password,
          password
        );
        if (!verifyPassword) {
          res.status(403).json({ message: "Password not verified" });
        } else {
          const payload = {
            id: existingUser.id,
          };
          const refreshToken = jwt.sign(payload, secret, {
            expiresIn: "24h",
          });

          res
            .cookie("jwt", refreshToken, {
              httpOnly: true,
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 24 hours
            })
            .status(200)
            .json({ message: "User logged in successfully" });
        }
      }
    } else {
      res.status(400).json({ message: "Something went wring" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { registerUser, loginUser };
