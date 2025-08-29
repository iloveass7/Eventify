// Utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/**
 * NOTE:
 * - Your Cloudinary credentials are already loaded via .env and configured elsewhere
 *   (e.g., in app bootstrap with cloudinary.config({...})).
 * - This util assumes that configuration has already been done.
 */

/**
 * Upload a single buffer to Cloudinary via stream.
 * @param {Buffer} fileBuffer - Multer memoryStorage buffer
 * @param {string} folder - e.g. "event_galleries/<eventId>"
 * @param {object} options - Extra Cloudinary options (public_id, context, etc.)
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: true,    // keep original filename (nice for debugging)
        unique_filename: true, // avoid overwrites
        overwrite: false,
        ...options,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Upload multiple files (array of Multer files with .buffer) in parallel.
 * @param {Array<{ buffer: Buffer }>} files
 * @param {string} folder
 * @param {object} options
 * @returns {Promise<Array>}
 */
export const uploadManyToCloudinary = (files, folder, options = {}) => {
  return Promise.all(
    files.map((f) => uploadToCloudinary(f.buffer, folder, options))
  );
};

/**
 * Delete an asset by public_id.
 * @param {string} publicId
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
};

// Optional export in case you need direct access elsewhere.
export { cloudinary };
