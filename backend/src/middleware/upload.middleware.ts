import multer from "multer";
import path from "path";
// import cloudinary from "../config/cloudinary";

// Custom storage engine for Cloud Storage
// const cloudStorageEngine: multer.StorageEngine = {
//   _handleFile(req, file, cb) {
//     const result = cloudinary.uploader.upload_stream(
//       { folder: "videos", resource_type: "auto" },
//       (err, result) => {
//         const resultObj: Partial<Express.Multer.File> = {
//           ...file,
//           path: result?.secure_url,
//         };

//         if (err) {
//           cb(err, {});
//         } else {
//           cb(null, resultObj);
//         }
//       },
//     );

//     file.stream.pipe(result);

//     file.stream.on("error", (error) => {
//       cb(error);
//     });
//   },

//   _removeFile(req, file, cb) {
//     // Delete the file from Cloud Storage if needed
//     // const gcsFile = bucket.file(file.path || `uploads/${file.filename}`);
//     // gcsFile
//     //   .delete()
//     //   .then(() => cb())
//     //   .catch(cb);
//   },
// };

// export const uploadVideoFiles = multer({
//   storage: cloudStorageEngine,
//   // limits: { fileSize: 500 * 1024 * 1024 },
// }).fields([
//   { name: "video", maxCount: 1 },
//   { name: "thumbnail", maxCount: 1 },
// ]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, path.join(__dirname, "../../uploads/videos"));
    } else if (file.fieldname === "thumbnail") {
      cb(null, path.join(__dirname, "../../uploads/thumbnails"));
    } else {
      cb(null, path.join(__dirname, "../../uploads"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// export const uploadVideoFiles = multer({
//   storage,
//   limits: { fileSize: 500 * 1024 * 1024 },
// }).fields([
//   { name: "video", maxCount: 1 },
//   { name: "thumbnail", maxCount: 1 },
// ]);
