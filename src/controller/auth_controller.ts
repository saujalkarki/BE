import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User, { UserRole } from "../model/user_model";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      userName,
      userEmail,
      userPassword,
      userContact,
      role,
    } = req.body;

    if (!userName || !userEmail || !userPassword || !userContact) {
      res.status(400).json({
        success: false,
        message: "Please send all the required data.",
      });
      return;
    }

    const normalizedEmail = userEmail.toLowerCase().trim();

    const existingUser = await User.findOne({
      userEmail: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const selectedRole = role || UserRole.ADMIN;

    if (!Object.values(UserRole).includes(selectedRole)) {
      res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
      return;
    }

    const saltRounds = 12;

    const hashedPassword = await bcrypt.hash(
      userPassword,
      saltRounds
    );

    const user = await User.create({
      userName: userName.trim(),
      userEmail: normalizedEmail,
      userPassword: hashedPassword,
      userContact: userContact.trim(),
      role: selectedRole,
      approved: false,
    });
    
const userResponse  = user.toObject();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Register User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userEmail, userPassword } = req.body;

    // Validate input
    if (!userEmail || !userPassword) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user and explicitly include password
    const user = await User.findOne({
      userEmail: userEmail.toLowerCase(),
    }).select("+userPassword");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Compare password
    const isPasswordMatched = await bcrypt.compare(
      userPassword,
      user.userPassword
    );

    if (!isPasswordMatched) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Optional approval check
    if (!user.approved) {
      res.status(403).json({
        success: false,
        message: "Your account has not been approved yet",
      });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());

    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,
      refreshToken,

      user: {
        id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        userContact: user.userContact,
        role: user.role,
        approved: user.approved,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};