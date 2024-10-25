const DB_NAME: string = "crisp";
const apiVersion: string = "/api/v1";
const jwtSecret: string = process.env.JWT_SECRET as string;

export { DB_NAME, apiVersion, jwtSecret };
