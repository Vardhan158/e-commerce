import express from 'express';
import crypto from 'crypto';

const router = express.Router();

/**
 * GET /api/upload/sign
 * Returns a signature and timestamp for performing signed uploads to Cloudinary.
 * Requires CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET and CLOUDINARY_CLOUD_NAME in env.
 */
router.get('/sign', (req, res) => {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    return res.status(500).json({ success: false, message: 'Cloudinary not configured on server' });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // Minimal signature using timestamp only. If you add other params, include them in the string.
  const toSign = `timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');

  res.json({ success: true, signature, timestamp, api_key: apiKey, cloud_name: cloudName, upload_url: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload` });
});

export default router;
