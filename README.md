# 🖥 Portfolio Dashboard

Admin dashboard to manage all portfolio content — built with React + Redux Toolkit + RTK Query.

## 🚀 Quick Start

```bash
npm install
npm run dev   # runs on http://localhost:3001
```

## 🔑 Login

Use your backend admin credentials. The API base URL is configured in `.env`:
```
VITE_API_URL=https://developershipon-backend.vercel.app/api/v1
```

## 📁 Project Structure

```
src/
├── App.tsx                    # Routes + auth guards
├── main.tsx                   # Entry point
├── index.css                  # Tailwind + utility classes
├── types/index.ts             # All TypeScript types
├── hooks/redux.ts             # Typed useAppDispatch / useAppSelector
│
├── store/
│   ├── index.ts               # Redux store configuration
│   ├── slices/
│   │   ├── authSlice.ts       # Auth state (user, token, isAuthenticated)
│   │   └── uiSlice.ts         # Sidebar open/close, theme toggle
│   └── api/
│       ├── baseApi.ts         # RTK Query base with auth header
│       └── endpoints.ts       # All API endpoints + exported hooks
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx  # Sidebar + Topbar + main outlet
│   │   ├── Sidebar.tsx          # Collapsible nav sidebar
│   │   └── Topbar.tsx           # Page title + theme + bell
│   ├── ui/
│   │   ├── index.tsx            # Modal, Badge, StatCard, EmptyState, PageHeader, Spinner, Skeleton...
│   │   └── DataTable.tsx        # Reusable sortable, searchable, paginated table
│   └── forms/
│       └── index.tsx            # FormField, Input, Textarea, Select, TagInput, Switch
│
└── pages/
    ├── LoginPage.tsx
    ├── DashboardHome.tsx        # Stats + charts overview
    ├── ProjectsPage.tsx         # CRUD + featured toggle
    ├── ExperiencesPage.tsx      # CRUD
    ├── ServicesPage.tsx         # CRUD
    ├── BlogsPage.tsx            # CRUD + publish toggle
    ├── EventsPage.tsx           # CRUD + highlight
    ├── ProblemsPage.tsx         # CRUD + code snippet
    ├── SkillsPage.tsx           # CRUD + visual bars + range slider
    ├── MessagesPage.tsx         # View + mark read + delete
    └── HireRequestsPage.tsx     # Status management + view detail
```

## 🌐 Backend API Endpoints Used

| Feature         | Endpoint                                  |
|-----------------|-------------------------------------------|
| Login           | `POST /auth/login`                        |
| Logout          | `POST /auth/logout`                       |
| Me              | `GET /auth/me`                            |
| Dashboard Stats | `GET /dashboard/stats`                    |
| Projects        | `GET/POST/PUT/DELETE /projects`           |
| Experiences     | `GET/POST/PUT/DELETE /experiences`        |
| Services        | `GET/POST/PUT/DELETE /services`           |
| Blogs           | `GET/POST/PUT/DELETE /blogs`              |
| Events          | `GET/POST/PUT/DELETE /events`             |
| Problems        | `GET/POST/PUT/DELETE /problems`           |
| Skills          | `GET/POST/PUT/DELETE /skills`             |
| Messages        | `GET /contact/contact-us`                 |
| Hire Requests   | `GET /contact/your-hiring`               |

## 🎨 Customization

**Theme Colors** — edit `tailwind.config.js`:
```js
primary: '#198f51',  // change to your brand color
```

**API Base URL** — edit `.env`:
```
VITE_API_URL=https://your-api.com/api/v1
```

**Add a new page:**
1. Create `src/pages/NewPage.tsx`
2. Add API endpoint in `src/store/api/endpoints.ts`
3. Add route in `src/App.tsx`
4. Add nav item in `src/components/layout/Sidebar.tsx`

## 🏗 Build for Production

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, or any static host
```
