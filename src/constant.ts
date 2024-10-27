const DB_NAME: string = "crisp";
const apiVersion: string = "/api/v1";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET as string;

export { DB_NAME, apiVersion, ACCESS_TOKEN, REFRESH_TOKEN };
