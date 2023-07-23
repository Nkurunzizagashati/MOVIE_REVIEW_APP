import crypto from "crypto";

const sendError = (res, error, statusCode = 401) => {
  return res.status(statusCode).json({ Error: error });
};

const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);

      const buffString = buff.toString("hex");

      resolve(buffString);
    });
  });
};

export { sendError, generateRandomByte };
