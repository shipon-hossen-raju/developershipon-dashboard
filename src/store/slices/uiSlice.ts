import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: (localStorage.getItem('dash-theme') as 'light' | 'dark') || 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('dash-theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('dash-theme', action.payload);
      document.documentElement.classList.toggle('dark', action.payload === 'dark');
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
