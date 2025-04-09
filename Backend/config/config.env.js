import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || 9999,
  MONGO_URI: process.env.MONGO_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CATEGORY_ID_DEFAULT: process.env.CATEGORY_ID_DEFAULT,
  CLIENT_URL: process.env.CLIENT_URL,

  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_OF_MY: process.env.SMTP_OF_MY,
  SMTP_SECRET: process.env.SMTP_SECRET,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
};

export default env;
