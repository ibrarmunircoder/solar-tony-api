import { registerAs } from '@nestjs/config';

export const applicationConfig = registerAs('application', () => ({
  amazonProductAdsApi: {
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
  },
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
}));
