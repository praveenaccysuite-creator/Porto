import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";

import {
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { ApiError } from "../utils/ApiErrors.js";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const FIELDNAME_FOLDER_MAP = {
  profileImage: "profile",
  document: "documents",
  collageImage: "education",
  minorProject: "minor-projects",
  majorProject: "major-projects",
  aboutImage: "aboutSection",
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(
    file.originalname
  ).toLowerCase();

  if (file.mimetype.startsWith("image/")) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new ApiError(
          400,
          "Only JPG PNG WEBP allowed"
        )
      );
    }
  }

  if (file.fieldname === "document") {
    if (
      file.mimetype !== "application/pdf" ||
      ext !== ".pdf"
    ) {
      return cb(
        new ApiError(400, "Only PDF allowed")
      );
    }
  }

  cb(null, true);
};

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,

    contentType:
      multerS3.AUTO_CONTENT_TYPE,

    metadata(req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
      });
    },

    key(req, file, cb) {
      const folder =
        FIELDNAME_FOLDER_MAP[
          file.fieldname
        ] || "uploads";

      const fileName =
        `${Date.now()}-${file.originalname}`;

      cb(
        null,
        `${folder}/${fileName}`
      );
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter,
});

export const deleteFromS3 = async (
  fileUrl
) => {
  if (!fileUrl) return;

  try {
    const url = new URL(fileUrl);

    const key = decodeURIComponent(
      url.pathname.substring(1)
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket:
          process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error(
      "Delete failed:",
      error
    );
  }
};

export const handleMulterError = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          err.message
        )
      );
  }

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(err);
  }

  next(err);
};