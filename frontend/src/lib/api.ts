import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://quiz-mteg.onrender.com"
      : "http://localhost:4000"),
  withCredentials: true,
});

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (!error.response) return "Cannot reach the QuizMaster API. Check the backend service and API URL.";
    return "The request failed. Please try again.";
  }
  return "Something went wrong.";
};
