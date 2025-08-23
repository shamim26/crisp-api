const DB_NAME: string = "crisp";
const apiVersion: string = "/api/v1";

// Validate JWT secrets are loaded
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET as string;

if (!ACCESS_TOKEN) {
  throw new Error("ACCESS_TOKEN_SECRET environment variable is required");
}

if (!REFRESH_TOKEN) {
  throw new Error("REFRESH_TOKEN_SECRET environment variable is required");
}

export { DB_NAME, apiVersion, ACCESS_TOKEN, REFRESH_TOKEN };
