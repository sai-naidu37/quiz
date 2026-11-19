import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true,
});

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? "Something went wrong.";
  return "Something went wrong.";
};
