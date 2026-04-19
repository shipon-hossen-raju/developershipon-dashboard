const {
  VITE_ENV,
  VITE_BACKEND_LOCAL_URL,
  VITE_BACKEND_LIVE_URL,
  VITE_API_VERSION,
} = import.meta.env;

const isDevelopment = VITE_ENV === "DEVELOPMENT";

const BASE_URL = isDevelopment ? VITE_BACKEND_LOCAL_URL : VITE_BACKEND_LIVE_URL;

const config = {
  env: VITE_ENV,
  apiVersion: VITE_API_VERSION,
  baseURL: BASE_URL,
  fullApiURL: `${BASE_URL}/${VITE_API_VERSION}`,
};

console.log("config", config);

export default config;
export type Config = typeof config;
