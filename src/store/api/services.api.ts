import { ApiResponse, Service, ServiceFormData } from "@/types";
import { baseApi } from "./baseApi";

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getServices: b.query<ApiResponse<Service[]>, void>({
      query: () => "/services",
      providesTags: ["Services"],
    }),
    createService: b.mutation<ApiResponse<Service>, ServiceFormData>({
      query: (body) => ({ url: "/services", method: "POST", body }),
      invalidatesTags: ["Services", "Dashboard"],
    }),
    updateService: b.mutation<
      ApiResponse<Service>,
      { id: string; data: Partial<ServiceFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),
    deleteService: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
      invalidatesTags: ["Services", "Dashboard"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
