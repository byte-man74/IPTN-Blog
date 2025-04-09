const dev = {
    API_URL: process.env.NEXT_PUBLIC_API_URL_DEV,
  };

  const prod = {
    API_URL: process.env.NEXT_PUBLIC_API_URL_PROD,
  };

  const getEnv = () => {
    switch (process.env.NODE_ENV) {
      case 'development':
        return dev;
      case 'production':
        return prod;
      default:
        return dev;
    }
  };

  export const env = getEnv();

  console.log('env API_URL', String(env.API_URL ?? '').replace(/[a-zA-Z]/g, '-'));

  export const API_URL = env.API_URL;
