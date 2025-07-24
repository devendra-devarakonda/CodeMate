# Chatgpt
using For the Chatgpt Help


  const runCode = async () => {
  setIsRunning(true);
  setOutput("Running...");
  setShowOutput(true);

  try {
    const plainSource = code; // ✅ No btoa
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        language_id: languageToJudge0[language],
        source_code: plainSource, // ✅ Send raw text
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "92acded17fmsh083e87fa31ea40fp1beebfjsn305e5475f870",
          "X-RapidAPI-Host": "judge029.p.rapidapi.com",
        },
      }
    );

    const token = response.data.token;
    const result = await pollResult(token);
    setOutput(result);
  } catch (error) {
    setOutput("❌ Error while running code");
    console.error(error);
  } finally {
    setIsRunning(false);
  }
};


  const pollResult = async (token) => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": "92acded17fmsh083e87fa31ea40fp1beebfjsn305e5475f870",
              "X-RapidAPI-Host": "judge029.p.rapidapi.com",
            },
          }
        );

        if (res.data.status.id >= 3) {
          clearInterval(interval);
          const outputText =
            res.data.stdout ||
            res.data.stderr ||
            res.data.compile_output ||
            "No output";

          resolve(outputText); // ✅ No decoding
        }
      } catch (error) {
        clearInterval(interval);
        resolve("❌ Error while fetching result");
      }
    }, 1000);
  });
};





 <div className="flex flex-1 overflow-hidden">
        
        {/* Chat Section with Sticky Input */}
        <div className="flex w-[350px] flex-col flex-1 h-full border-r border-white/10">
          <ChatBox />
        </div>

        {/* Fixed Width Code Editor */}
        <div className="w-[650px] bg-[#101928] border-l border-white/10 overflow-y-auto">
          <CodeEditor />
        </div>
      </div>