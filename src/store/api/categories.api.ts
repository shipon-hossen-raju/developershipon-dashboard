import { ApiResponse, Categories, CategoryFormData } from "@/types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getCategories: b.query<ApiResponse<Categories[]>, void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    createCategories: b.mutation<ApiResponse<Categories>, CategoryFormData>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Categories", "Dashboard"],
    }),
    updateCategories: b.mutation<
      ApiResponse<Categories>,
      { id: string; data: Partial<CategoryFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategories: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories", "Dashboard"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoriesMutation,
  useUpdateCategoriesMutation,
  useDeleteCategoriesMutation,
} = authApi;
