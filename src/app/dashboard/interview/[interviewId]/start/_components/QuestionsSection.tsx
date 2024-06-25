import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

type Props = {
  mockInterviewQuestion: any;
  activeQuestionIndex: number;
};

function QuestionsSection({
  mockInterviewQuestion,
  activeQuestionIndex
}: Props) {
  const textToSpeach = (text: any) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Text to Speech is not supported in your browser");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question: any, index: number) => (
              <h2
                className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer
            ${activeQuestionIndex == index && "bg-black text-white"}
            `}
              >
                Question {index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        <Volume2
          className="cursor-pointer"
          onClick={() =>
            textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
        />

        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-2 items-center text-blue-700">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-blue-700 my-2">
            Click on Record Answer when you want to answer the question. At the
            end of the interview we will give you the report along with the
            correct answer so that you can compare your answer with it.
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
