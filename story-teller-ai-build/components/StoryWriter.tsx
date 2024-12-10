"use client";

import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";

import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { Frame } from "@gptscript-ai/gptscript";

const storiesPath = "public/stories";

function StoryWriter() {
    const [story, setStory] = useState<string>("");
    const [pages, setPages] = useState<number>();
    const [progress, setProgress] = useState("");
    const [runstarted, setRunstarted] = useState<boolean>(false);
    const [runFinished, setRunFinished] = useState<boolean | null>(null);
    const [currentTool, setCurrentTool] = useState("");
    const [events, setEvents] = useState<Frame[]>([]);


    async function runScript() {
        setRunstarted(true);
        setRunFinished(false);

        const response = await fetch("/api/run-script", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ story, pages, path: storiesPath})
                });

            if (response.ok && response.body) {
                //handle streams data part from API
            ///.....

                console.log("streaming started");
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                handleStream(reader, decoder);
            }else {
                setRunFinished(true);
                setRunstarted(false);
                console.log("Failed to start streaming");
            }
    }

  async function handleStream(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder){
    while(true){
        const {done, value} = await reader.read();

        if (done) break; // break out of infinite loop when done reading
            
        const chunk = decoder.decode(value, { stream: true });
        //decoder is used to decode the Uint8Array into a string.
        //stream: true is used to decode the stream of chunks into a single string
        //we split chunks into events by splitting it by the events : keyword
        const eventData = chunk
        .split("\n\n")
        .filter((line) => line.startsWith("event: "))
        .map((line) => line.replace(/^event: /, ""));

        //Explanation: parse the JSON data and update the state with the new data
        eventData.forEach(data => {
            try {
                const parsedData = JSON.parse(data);
                console.log(parsedData);

                if(parsedData.type === "callProgress"){
                    setProgress(
                        parsedData.output[parsedData.output.length - 1].content
                    )
                setCurrentTool(parsedData.tool?.description || "");
                }else if(parsedData.type === "callStart"){
                    setCurrentTool(parsedData.tool?.description || "");
                }else if(parsedData.type === "runFinish"){
                    setRunFinished(true);
                    setRunstarted(false);
                }else {
                    setEvents((prevEvents) => [...prevEvents, parsedData])
                }
            }catch(error){
                console.error("Failed to parse JSON", error)
            }
        })
    }
  }

  return (
    <div className="flex flex-col m-5 mt-0">
        <section className="flex-1 flex flex-col border border-purple-300 rounded-md p-10 space-y-2">
            <Textarea 
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Write a story about a robot and a human who become friends..."
                className="flex-1 text-black"
            />
            <Select onValueChange={value => setPages(parseInt(value))}>
                <SelectTrigger >
                    <SelectValue placeholder="how many pages should story be ?"></SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full">
                    {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={String(i + 1)}>
                        {i + 1}
                        </SelectItem>
                    ))}
                </SelectContent>

            </Select>
            <Button disabled={!story || !pages || runstarted} onClick={runScript} className="w-full" size="lg">Generate Story</Button>
        </section>
        <section className="flex-1 pb-5 mt-5">
            <div className="flex flex-col-reverse w-full space-y-2 bg-gray-600 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto">
                
                <div>

                    {runFinished === null && (
                        <>
                            <p className="animate-pulse mr-5">I m waiting for you to start the story generation ....</p>
                            <br />
                        </>
                    )}



                    <span className="mr-5">{">>"}</span>
                    {progress}
                    {/* progress */}
                </div>     

                {/*Current tool*/}
                {currentTool && (
                    <div className="py-10">
                        <span className="mr-5">{"---[Current Tool]---"}</span>
                        {currentTool}
                    </div>
                )}

                {/* Rendering events... */}
                {runstarted && (
                    <div>
                        <span className="mr-5 animate-in">{"---[AI story teller started]---"}</span>
                        <br />
                    </div>
                )}
            </div>
        </section>
    </div>
    
  )
}

export default StoryWriter
