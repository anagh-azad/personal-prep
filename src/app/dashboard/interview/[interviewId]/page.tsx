"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

type interviewDataType = {
  id: number;
  jsonMockResp: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  createdBy: string;
  createdAt: string | null;
  mockId: string;
};

function Interview() {
  const params = useParams();
  const interviewId = params.interviewId.toString();

  const [interviewData, setInterviewData] = useState<interviewDataType>();
  // let interviewData: interviewDataType = {
  //   id: -1,
  //   jsonMockResp: "",
  //   jobPosition: "",
  //   jobDesc: "",
  //   jobExperience: "",
  //   createdBy: "",
  //   mockId: "",
  //   createdAt: ""
  // };
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    setInterviewData(result[0]);
    //interviewData = result[0];
  };

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Start your Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5 ">
          <div className="p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job Role/Job Position</strong> :{" "}
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech stack</strong> :{" "}
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience</strong> :{" "}
              {interviewData?.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Instructions</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              Enable Web Camera and Microphone to start your Ai Generated Mock
              Interview. The interview consists of 5 questions and after the
              interview has been completed you will get your result.
            </h2>
            <h2 className="mt-1 text-yellow-500">
              NOTE: We never record your video and you can disable webcam
              anytime you want.
            </h2>
          </div>
        </div>

        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                className="w-full"
                variant="ghost"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Camera and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Button>Start Interview</Button>
      </div>
    </div>
  );
}

export default Interview;
