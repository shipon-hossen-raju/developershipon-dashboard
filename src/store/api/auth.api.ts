import { ApiResponse, AuthUser, LoginCredentials } from "@/types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation<
      ApiResponse<{ user: AuthUser; token: string }>,
      LoginCredentials
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Auth"],
    }),
    logout: b.mutation<ApiResponse<null>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    getMe: b.query<ApiResponse<AuthUser>, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
