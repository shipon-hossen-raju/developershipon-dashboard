import { ApiResponse, Skill, SkillFormData } from "@/types";
import { baseApi } from "./baseApi";
import { apiTagsTypes } from "@/constants/constant";

// ─── Skills ───────────────────────────────────────────────────────────────────
export const skillsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getSkills: b.query<ApiResponse<Skill[]>, void>({
      query: () => "/skills",
      providesTags: [apiTagsTypes.Skills],
    }),
    createSkill: b.mutation<ApiResponse<Skill>, SkillFormData>({
      query: (body) => ({ url: "/skills", method: "POST", body }),
      invalidatesTags: [apiTagsTypes.Skills, apiTagsTypes.Dashboard],
    }),
    updateSkill: b.mutation<
      ApiResponse<Skill>,
      { id: string; data: Partial<SkillFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/skills/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [apiTagsTypes.Skills],
    }),
    deleteSkill: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/skills/${id}`, method: "DELETE" }),
      invalidatesTags: [apiTagsTypes.Skills, apiTagsTypes.Dashboard],
    }),
  }),
});

export const {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillsApi;
