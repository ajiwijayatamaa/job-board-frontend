import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

export interface TestAnswerDetail {
  id: number;
  testResultId: number;
  questionId: number;
  selectedAnswer: string;
  question: {
    id: number;
    questionText: string;
    correctAnswer: string;
    options: {
      id: number;
      optionText: string;
      isCorrect: boolean;
    }[];
  };
}

export interface AnswersByResultResponse {
  id: number;
  userId: number;
  preSelectionTestId: number;
  score: number;
  isPassed: boolean;
  createdAt: string;
  user: {
    id: number;
    fullName: string | null;
    email: string;
    profilePhoto: string | null;
  };
  answers: TestAnswerDetail[];
}

const useGetAnswersByResult = (testResultId: number) => {
  return useQuery({
    queryKey: ["answers-by-result", testResultId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnswersByResultResponse>(
        `/admin/pre-selection-tests/results/${testResultId}/answers`,
      );
      return data;
    },
    enabled: !!testResultId,
  });
};

export default useGetAnswersByResult;
