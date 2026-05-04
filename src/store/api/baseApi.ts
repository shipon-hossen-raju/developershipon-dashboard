import config from "@/config";
import { apiTagsTypes } from "@/constants/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AppRootState } from "..";

const BASE_URL = config.fullApiURL;

console.log("BASE_URL", BASE_URL);

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AppRootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: Object.values(apiTagsTypes),
  endpoints: () => ({}),
});
