import type {
  ApiResponse,
  Blog,
  BlogFormData,
  ContactMessage,
  DashboardStats,
  EventFormData,
  Experience,
  ExperienceFormData,
  HireRequest,
  PortfolioEvent,
  Problem,
  ProblemFormData,
  Project,
  ProjectFormData,
  Service,
  ServiceFormData,
} from "../../types";
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

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getProjects: b.query<ApiResponse<Project[]>, void>({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    getProject: b.query<ApiResponse<Project>, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Projects", id }],
    }),
    createProject: b.mutation<ApiResponse<Project>, ProjectFormData>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),
    updateProject: b.mutation<
      ApiResponse<Project>,
      { id: string; data: Partial<ProjectFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),
    deleteProject: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),
    toggleProjectFeatured: b.mutation<ApiResponse<Project>, string>({
      query: (id) => ({ url: `/projects/${id}/featured`, method: "PATCH" }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

// ─── Experiences ──────────────────────────────────────────────────────────────
export const experiencesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getExperiences: b.query<ApiResponse<Experience[]>, void>({
      query: () => "/experiences",
      providesTags: ["Experiences"],
    }),
    createExperience: b.mutation<ApiResponse<Experience>, ExperienceFormData>({
      query: (body) => ({ url: "/experiences", method: "POST", body }),
      invalidatesTags: ["Experiences", "Dashboard"],
    }),
    updateExperience: b.mutation<
      ApiResponse<Experience>,
      { id: string; data: Partial<ExperienceFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/experiences/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Experiences"],
    }),
    deleteExperience: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/experiences/${id}`, method: "DELETE" }),
      invalidatesTags: ["Experiences", "Dashboard"],
    }),
  }),
});

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

// ─── Events ───────────────────────────────────────────────────────────────────
export const eventsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getEvents: b.query<ApiResponse<PortfolioEvent[]>, void>({
      query: () => "/events",
      providesTags: ["Events"],
    }),
    createEvent: b.mutation<ApiResponse<PortfolioEvent>, EventFormData>({
      query: (body) => ({ url: "/events", method: "POST", body }),
      invalidatesTags: ["Events", "Dashboard"],
    }),
    updateEvent: b.mutation<
      ApiResponse<PortfolioEvent>,
      { id: string; data: Partial<EventFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/events/${id}`, method: "DELETE" }),
      invalidatesTags: ["Events", "Dashboard"],
    }),
  }),
});

// ─── Messages ─────────────────────────────────────────────────────────────────
export const messagesApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getMessages: b.query<ApiResponse<ContactMessage[]>, void>({
      query: () => "/contact/contact-us",
      providesTags: ["Messages"],
    }),
    markMessageRead: b.mutation<ApiResponse<ContactMessage>, string>({
      query: (id) => ({
        url: `/contact/contact-us/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Messages", "Dashboard"],
    }),
    deleteMessage: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/contact/contact-us/${id}`, method: "DELETE" }),
      invalidatesTags: ["Messages", "Dashboard"],
    }),
  }),
});

// ─── Hire Requests ────────────────────────────────────────────────────────────
export const hireApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getHireRequests: b.query<ApiResponse<HireRequest[]>, void>({
      query: () => "/contact/your-hiring",
      providesTags: ["HireRequests"],
    }),
    updateHireStatus: b.mutation<
      ApiResponse<HireRequest>,
      { id: string; status: HireRequest["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/contact/your-hiring/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["HireRequests", "Dashboard"],
    }),
    deleteHireRequest: b.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/contact/your-hiring/${id}`, method: "DELETE" }),
      invalidatesTags: ["HireRequests", "Dashboard"],
    }),
  }),
});

// ─── Export all hooks ─────────────────────────────────────────────────────────
export const { useGetDashboardStatsQuery } = dashboardApi;
export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useToggleProjectFeaturedMutation,
} = projectsApi;
export const {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experiencesApi;
export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useToggleBlogPublishedMutation,
} = blogsApi;
export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;

export const {
  useGetMessagesQuery,
  useMarkMessageReadMutation,
  useDeleteMessageMutation,
} = messagesApi;
export const {
  useGetHireRequestsQuery,
  useUpdateHireStatusMutation,
  useDeleteHireRequestMutation,
} = hireApi;
