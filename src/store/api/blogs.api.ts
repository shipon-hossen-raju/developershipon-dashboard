import { ApiResponse, Blog, BlogFormData } from "@/types";
import { baseApi } from "./baseApi";

// ─── Blogs ────────────────────────────────────────────────────────────────────
export const blogsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getBlogs: b.query<ApiResponse<Blog[]>, void>({
      query: () => "/blogs",
      providesTags: ["Blogs"],
    }),
    createBlog: b.mutation<ApiResponse<Blog>, BlogFormData>({
      query: (body) => ({ url: "/blogs", method: "POST", body }),
      invalidatesTags: ["Blogs", "Dashboard"],
    }),
    updateBlog: b.mutation<
      ApiResponse<Blog>,
      { id: string; data: Partial<BlogFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),
    deleteBlog: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/blogs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Blogs", "Dashboard"],
    }),
    toggleBlogPublished: b.mutation<ApiResponse<Blog>, string>({
      query: (id) => ({ url: `/blogs/${id}/publish`, method: "PATCH" }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useToggleBlogPublishedMutation,
} = blogsApi;
