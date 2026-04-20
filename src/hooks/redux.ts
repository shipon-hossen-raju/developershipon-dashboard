import { AppDispatch, AppRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: AppRootState) => T) =>
  useSelector(selector);
