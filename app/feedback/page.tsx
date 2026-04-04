import { Metadata } from "next"
import FeedbackPage from "./FeedbackPage"

export const metadata: Metadata = {
  title: "Feedback — HeinerDevelops",
  description:
    "Report bugs, request features, or ask questions about Image Studio Pro and RAG Chatbot.",
}

export default function Page() {
  return <FeedbackPage />
}
