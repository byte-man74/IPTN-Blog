import axiosInstance from "./axios";


interface ServerGetConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

export const createServerAxiosInstance = async (
  url: string,
  config?: ServerGetConfig
) => {
  try {
    if (!url) throw new Error('URL is required');

    const response = await axiosInstance.get(`${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      params: config?.params,
    });

    return response;
  } catch (error) {
    console.error('Server GET request failed:', error);
    throw error;
  }
};
