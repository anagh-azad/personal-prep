"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setloading] = useState(false);
  const [jsonResp, setJsonResp] = useState("");

  const { user } = useUser();
  const router = useRouter();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setloading(true);
    console.log(jobDescription, jobPosition, jobExperience);

    const InputPrompt =
      "Job position: " +
      jobPosition +
      ", Job Description: " +
      jobDescription +
      ", Years of Experience: " +
      jobExperience +
      ". Based on this information generate 5 questions and answers in JSON format. Give questions and answers as field in JSON format. Please only give questions and answers in json format. No need to provide any sort of explaination";

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(JSON.parse(MockJsonResp));
    setJsonResp(MockJsonResp);

    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp!,
          jobPosition: jobPosition!,
          jobDesc: jobDescription!,
          jobExperience: jobExperience!,
          createdBy: user?.primaryEmailAddress?.emailAddress!,
          createdAt: moment().format("DD-MM-yyyy")
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID : ", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("Error while inserting data into the database");
    }

    setloading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us about the role you are applying for
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={submitHandler}>
                <div>
                  <h2>
                    Add details about your job position, job description and
                    years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      onChange={(event) => setJobPosition(event.target.value)}
                      required
                    ></Input>
                  </div>
                  <div className="my-3">
                    <label>Job Description/Tech Stack</label>
                    <Textarea
                      placeholder="Ex. React,MongoDB, Nodejs"
                      onChange={(event) =>
                        setJobDescription(event.target.value)
                      }
                      required
                    ></Textarea>
                  </div>
                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 0,1,2,3"
                      type="number"
                      onChange={(event) => setJobExperience(event.target.value)}
                      required
                    ></Input>
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
