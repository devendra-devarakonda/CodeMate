import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  FaChevronUp,
  FaChevronDown,
  FaRobot,
  FaSave,
  FaMagic,
  FaDownload,
} from "react-icons/fa";
import * as monaco from "monaco-editor";
import socket from "../../utils/socket";
import { databases } from "../../appwrite";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const languageOptions = ["javascript", "python", "c", "cpp", "java"];
const DATABASE_ID = "6879da24000386d570a5";
const COLLECTION_ID = "6879dc8d0038a1e52698";

const CodeEditor = ({ currentUser = "User" }) => {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState(""); // ✅ user input field
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const editorRef = useRef(null);
  const cursorDecorationsRef = useRef({});
  const userColorsRef = useRef({});
  const saveTimeoutRef = useRef(null);
  const hasCreatedRef = useRef(false);
  const isRemoteUpdateRef = useRef(false);

  const colorList = ["red", "green", "yellow", "blue", "purple"];

  useEffect(() => {
    if (!roomId) return;

    const loadCode = async () => {
      try {
        const res = await databases.getDocument(DATABASE_ID, COLLECTION_ID, roomId);
        setCode(res.CodeContent || "// Start coding...");
        setLanguage(res.language || "javascript");
      } catch (err) {
        if (err.code === 404) {
          try {
            await databases.createDocument(DATABASE_ID, COLLECTION_ID, roomId, {
              CodeContent: code,
              language,
              roomId,
            });
            hasCreatedRef.current = true;
          } catch (createErr) {
            console.error("❌ Failed to create doc:", createErr);
          }
        } else {
          console.error("❌ Load error:", err);
        }
      }
    };

    loadCode();
  }, [roomId]);

  useEffect(() => {
    return () => {
      if (hasCreatedRef.current) {
        databases
          .deleteDocument(DATABASE_ID, COLLECTION_ID, roomId)
          .then(() => console.log("🧹 Deleted"))
          .catch((err) => console.error("❌ Delete failed:", err));
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", { roomId, user: currentUser });
    console.log("🧠 Joined room:", roomId);

    const handleCodeChange = ({ code: newCode, user }) => {
      console.log("📥 Received code-change from", user);

      if (!editorRef.current) {
        console.warn("⚠️ Editor not mounted yet.");
        return;
      }

      const editor = editorRef.current;
      const currentCode = editor.getValue();

      if (newCode === currentCode) return;

      isRemoteUpdateRef.current = true;

      editor.executeEdits(null, [
        {
          range: editor.getModel().getFullModelRange(),
          text: newCode,
          forceMoveMarkers: true,
        },
      ]);

      editor.setPosition({ lineNumber: 1, column: 1 });
      editor.focus();

      setCode(newCode);
      setActiveUser(user);
      setTimeout(() => setActiveUser(null), 2000);
    };

    socket.on("code-change", handleCodeChange);
    socket.on("cursor-change", ({ position, user }) => {
      updateUserCursor(user, position);
    });
    socket.on("language-update", ({ language: newLang }) => {
      setLanguage(newLang);
    });

    return () => {
      socket.off("code-change", handleCodeChange);
      socket.off("cursor-change");
      socket.off("language-update");
    };
  }, [roomId, currentUser]);

  const updateUserCursor = (user, position) => {
    if (!editorRef.current || !position) return;

    if (!userColorsRef.current[user]) {
      const index = Object.keys(userColorsRef.current).length % colorList.length;
      userColorsRef.current[user] = colorList[index];
    }

    const color = userColorsRef.current[user];
    const range = new monaco.Range(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column
    );

    const decorations = [
      {
        range,
        options: {
          className: "user-cursor",
          afterContentClassName: `cursor-label-${color}`,
        },
      },
    ];

    const oldDecorations = cursorDecorationsRef.current[user] || [];
    const newDecorations = editorRef.current.deltaDecorations(oldDecorations, decorations);
    cursorDecorationsRef.current[user] = newDecorations;
  };

  const throttledSaveToFirestore = (newCode) => {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, roomId, {
          CodeContent: newCode,
          language,
        });
      } catch (err) {
        console.error("❌ Failed to save code:", err);
      }
    }, 3000);
  };

  const handleEditorChange = (value) => {
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    setCode(value);
    throttledSaveToFirestore(value);

    socket.emit("code-change", {
      roomId,
      code: value,
      user: currentUser,
      cursor: editorRef.current?.getPosition(),
    });
  };

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    socket.emit("language-change", { roomId, language: lang, user: currentUser });
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, roomId, { language: lang });
    } catch (err) {
      console.error("❌ Failed to update language:", err);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    setShowOutput(true);

    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version: "*",
        files: [{ name: `main.${language}`, content: code }],
        stdin: input, // ✅ add user input here
      });

      const { stdout, stderr, compile_output } = response.data.run;

      setOutput(
        stdout ||
        stderr ||
        compile_output ||
        "⚠️ No output received. Please check your code."
      );
    } catch (err) {
      console.error("❌ Error with Piston API:", err);
      setOutput("❌ Error while running code. Try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleManualSave = async () => {
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, roomId, {
        CodeContent: code,
        language,
      });
      toast.success("💾 Code saved successfully!");
    } catch (err) {
      console.error("❌ Manual save failed:", err);
      toast.error("❌ Save failed");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${language}`;
    link.click();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0f172a] text-white">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0f172a]">
        <h2 className="text-xl font-semibold">👨‍💻 Code Editor</h2>
        <div className="flex items-center gap-2">
          <select
            className="bg-white/10 text-white border border-white/20 px-2 py-1 rounded-md"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <button onClick={handleManualSave} className="px-3 py-1 rounded-md bg-blue-600">
            <FaSave className="inline-block mr-1" /> Save
          </button>
          <button onClick={handleDownload} className="px-3 py-1 rounded-md bg-yellow-600">
            <FaDownload className="inline-block mr-1" /> Download
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
          >
            {isRunning ? "Running..." : "Run ▶️"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onMount={(editor) => {
            editorRef.current = editor;
            editor.onDidChangeCursorPosition((e) => {
              socket.emit("cursor-change", {
                roomId,
                position: e.position,
                user: currentUser,
              });
            });
          }}
          onChange={handleEditorChange}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />

        {activeUser && (
          <div className="absolute top-4 left-4 bg-cyan-700 text-white px-3 py-1 rounded-md shadow-lg animate-pulse z-20">
            ✍️ {activeUser} is editing...
          </div>
        )}

        {showOutput && (
          <div
            className={`absolute left-0 right-0 bottom-4 bg-black text-green-400 transition-all duration-300 overflow-y-auto border-t border-white/10 z-10 shadow-2xl ${expanded ? "h-full" : "h-[30%]"
              }`}
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="absolute right-2 top-2 bg-white/10 hover:bg-white/20 p-1 rounded-full"
            >
              {expanded ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            <div className="p-4 pt-8">
              <h3 className="text-white font-semibold mb-2">📤 Output:</h3>
              <pre className="whitespace-pre-wrap text-sm">{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
