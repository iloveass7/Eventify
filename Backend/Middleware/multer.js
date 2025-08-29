// Middleware/multer.js
import multer from "multer";

// Accept common image types only
const IMAGE_MIME = /^(image\/jpeg|image\/jpg|image\/png|image\/webp|image\/gif|image\/svg\+xml)$/i;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (IMAGE_MIME.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp, gif, svg) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 20,                 // up to 20 files per request (for gallery)
  },
});

export default upload;

// Optional convenience exports (use if you like):
// router.post('/create', uploadSingleImage, ...)
// router.post('/:id/gallery', uploadGalleryPhotos(20), ...)
export const uploadSingleImage = upload.single("image");
export const uploadGalleryPhotos = (max = 20) => upload.array("photos", max);
