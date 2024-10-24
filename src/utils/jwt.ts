import jwt from "jsonwebtoken";
import { jwtSecret } from "../constant";

const createJwt = (payload, secret, expiresIn = "30m") => {
  try {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload. Must be a non-empty object.");
    }
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    return null;
  }
};

const verifyJwt = (token: string, secret = jwtSecret) => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid token. Must be a non-empty string.");
    }
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
};

export { createJwt, verifyJwt };
