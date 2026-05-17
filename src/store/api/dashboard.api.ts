import { ApiResponse, DashboardStats } from "@/types";
import { baseApi } from "./baseApi";

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getDashboardStats: b.query<ApiResponse<DashboardStats>, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
