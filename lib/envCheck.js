const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'STRIPE_SK',
];

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
  if (missing.length > 0) {
    const errorMsg = `[WatchStore Startup Error]: Missing required environment variables: ${missing.join(', ')}. Please check your .env.local file.`;
    if (process.env.NODE_ENV === 'production') {
      console.error(errorMsg);
    } else {
      console.warn(errorMsg);
    }
    return { valid: false, missing };
  }
  return { valid: true };
}

// Automatically invoke on module load
validateEnv();
