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
    updateProfile: b.mutation<ApiResponse<AuthUser>, FormData>({
      query: (body) => ({ url: "/auth/profile", method: "PUT", body }),
      invalidatesTags: ["Auth"],
    }),
    changePassword: b.mutation<ApiResponse<null>, FormData>({
      query: (body) => ({ url: "/auth/password", method: "PUT", body }),
    }),
    forgotPassword: b.mutation<ApiResponse<null>, FormData>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: b.mutation<ApiResponse<null>, FormData>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
