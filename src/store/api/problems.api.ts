import { apiTagsTypes } from "@/constants/constant";
import { ApiResponse, Problem, ProblemFormData } from "@/types";
import { baseApi } from "./baseApi";

// ─── Problems ─────────────────────────────────────────────────────────────────
export const problemsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getProblems: b.query<ApiResponse<Problem[]>, void>({
      query: () => "/problems",
      providesTags: [apiTagsTypes.Problems],
    }),
    createProblem: b.mutation<ApiResponse<Problem>, ProblemFormData>({
      query: (body) => ({ url: "/problems", method: "POST", body }),
      invalidatesTags: [apiTagsTypes.Problems, apiTagsTypes.Dashboard],
    }),
    updateProblem: b.mutation<
      ApiResponse<Problem>,
      { id: string; data: Partial<ProblemFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/problems/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [apiTagsTypes.Problems],
    }),
    deleteProblem: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/problems/${id}`, method: "DELETE" }),
      invalidatesTags: [apiTagsTypes.Problems, apiTagsTypes.Dashboard],
    }),
  }),
});

export const {
  useGetProblemsQuery,
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
} = problemsApi;
