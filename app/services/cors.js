const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    allowedOrigins.includes(origin) || !origin
      ? callback(null, true)
      : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

module.exports = { corsOptions, allowedOrigins };
