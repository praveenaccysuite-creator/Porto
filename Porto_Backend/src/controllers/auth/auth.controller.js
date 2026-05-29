import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { prisma } from "../../../lib/prisma.js";

import redis from "../../../lib/redis.js";

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN", 
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account is disabled");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const istTime = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    : null;

  const token = generateToken(user);

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(200, "Login successful", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLoginAt: istTime,
    }),
  );
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  const isProduction = process.env.NODE_ENV === "production";

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await redis.del(`session:user:${decoded.id}`);
    } catch (err) {}
  }

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Logout successful (session removed)"));
});
export const getUser = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

export const verify_Its_Me = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const redisKey = `session:user:${decoded.id}`;
  const cachedUser = await redis.get(redisKey);

  if (cachedUser) {
    const user = JSON.parse(cachedUser);
    return res.status(200).json(
      new ApiResponse(200, "Authenticated (from Redis)", {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          picture: user.picture,
          lastLoginAt: user.lastLoginAt,
        },
      }),
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      picture: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    throw new ApiError(401, "Not authenticated");
  }

  if (!user.isActive) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    throw new ApiError(403, "Account is disabled");
  }

  const istTime = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    : null;

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    picture: user.picture,
    isActive: user.isActive,
    lastLoginAt: istTime,
  };

  await redis.set(redisKey, JSON.stringify(safeUser), "EX", 1800); // 30 min

  return res.status(200).json(
    new ApiResponse(200, "Authenticated", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        lastLoginAt: istTime,
      },
    }),
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (req.user?.id === userId) {
    throw new ApiError(403, "You cannot delete your own account");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
});
