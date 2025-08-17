import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { generateLesson } from "../utils/api";
import { useAuth0 } from '@auth0/auth0-react';

/* ---------------- helper parsers ---------------- */

const splitIntoChunks = (rawText) =>
  rawText
    .split(/\n-{3,}\n/) // split on lines containing --- (3 or more dashes)
    .map((s) => s.trim())
    .filter(Boolean);

const tryParseJSONFromString = (str) => {
  const match = str.match(/\{[\s\S]*\}$/m) || str.match(/\{[\s\S]*?\}/m);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const parseRawTextToBlocks = (rawText) => {
  // If backend returned a stringified JSON with { blocks: [...] }, parse and return blocks
  try {
    const parsed = JSON.parse(rawText);
    if (parsed && Array.isArray(parsed.blocks)) return parsed.blocks;
  } catch (err) {
    // not JSON -> continue with heuristic parsing
  }

  const chunks = splitIntoChunks(rawText);

  const blocks = chunks.map((chunk) => {
    const parsed = tryParseJSONFromString(chunk);
    if (parsed && parsed.type) return parsed;

    const codeFenceMatch = chunk.match(/```(?:([^\n`]+)\n)?([\s\S]*?)```/);
    if (codeFenceMatch) {
      const language = (codeFenceMatch[1] || "").trim();
      const codeText = codeFenceMatch[2] || "";
      return { type: "code", language, text: codeText };
    }

    const headingMatch = chunk.match(/^(#{1,6})\s*(.+)/m);
    if (headingMatch) return { type: "heading", text: headingMatch[2].trim() };

    const cleaned = chunk.replace(/^\s*[-*]\s+/gm, "").trim();
    return { type: "paragraph", text: cleaned };
  });

  return blocks;
};

/* ---------------- LessonPage component ---------------- */

const LessonPage = () => {
  const { moduleIdx, lessonIdx } = useParams();
  const location = useLocation();
  const { course } = location.state || {};

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonData, setLessonData] = useState(null); // holds parsed blocks array (and user selections)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getAccessTokenSilently } = useAuth0();

  // Fetch/parse logic
  useEffect(() => {
    if (!course) return;

    const fetchAndParse = async () => {
      try {
        setError(null);
        setLoading(true);

        const mIdx = Number(moduleIdx);
        const lIdx = Number(lessonIdx);

        if (!Array.isArray(course.modules) || !course.modules[mIdx]) {
          throw new Error("Module not found in course data");
        }
        const module = course.modules[mIdx];
        if (!Array.isArray(module.lessons) || !module.lessons[lIdx]) {
          throw new Error("Lesson not found in module");
        }
        const lesson = module.lessons[lIdx];
        setLessonTitle(lesson.title || "");

        // If lesson.content already exists and looks structured:
        if (lesson.content && Array.isArray(lesson.content) && lesson.content.length > 0) {
          const looksStructured = lesson.content.every((b) => b && typeof b.type === "string");
          if (looksStructured) {
            // initialize local state with deep-ish copy so we can add .selected safely
            setLessonData(lesson.content.map((b) => ({ ...b })));
            setLoading(false);
            return;
          }

          // If content nested like lesson.content[0].message.content[0].text (string blob)
          const first = lesson.content[0];
          if (first && first.message && Array.isArray(first.message.content) && first.message.content[0]) {
            const maybeText = first.message.content[0].text;
            if (typeof maybeText === "string" && maybeText.trim().length > 0) {
              const blocks = parseRawTextToBlocks(maybeText);
              setLessonData(blocks);
              setLoading(false);
              return;
            }
          }
        }

        // If missing, fetch from API and parse the returned data
        const data = await generateLesson(course.title, course.modules[mIdx].title, lesson.title, getAccessTokenSilently);

        if (data && data.lesson) {
          const content = data.lesson.content;

          // Case A: content already an array of blocks
          if (Array.isArray(content) && content.length > 0 && content[0].type) {
            setLessonData(content.map((b) => ({ ...b })));
            setLoading(false);
            return;
          }

          // Case B: nested message content with a string blob
          if (Array.isArray(content) && content[0] && content[0].message && Array.isArray(content[0].message.content)) {
            const mc = content[0].message.content[0];
            const maybeText = mc && mc.text;
            if (typeof maybeText === "string") {
              const blocks = parseRawTextToBlocks(maybeText);
              setLessonData(blocks);
              setLoading(false);
              return;
            }
          }

          // Case C: content is an actual JSON string
          if (typeof content === "string") {
            const blocks = parseRawTextToBlocks(content);
            setLessonData(blocks);
            setLoading(false);
            return;
          }
        }

        throw new Error("Unexpected lesson content format from API");
      } catch (err) {
        console.error("Error fetching/parsing lesson:", err);
        setError(err.message || "Failed to load lesson");
        setLessonData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParse();
  }, [course, moduleIdx, lessonIdx]);

  /* ---------- renderBlock defined inside component so it can set state ---------- */
  const renderBlock = (block, idx) => {
    if (!block) return null;

    switch (block.type) {
      case "heading":
        return (
          <h3 key={idx} style={{ marginTop: "1.2em", fontWeight: 700 }}>
            {block.text}
          </h3>
        );

      case "paragraph":
        return (
          <p key={idx} style={{ margin: "0.6em 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {block.text}
          </p>
        );

      case "code":
        return (
          <pre
            key={idx}
            style={{
              background: "#f6f8fa",
              padding: "1em",
              borderRadius: 6,
              overflowX: "auto",
              marginTop: "0.8em",
            }}
          >
            <code style={{ fontFamily: "monospace", whiteSpace: "pre" }}>{block.text}</code>
          </pre>
        );

      case "video": {
        let videoUrl = block.url || "";
        try {
          if (videoUrl.includes("youtube.com/watch")) {
            const videoId = new URL(videoUrl).searchParams.get("v");
            if (videoId) videoUrl = `https://www.youtube.com/embed/${videoId}`;
          } else if (videoUrl.includes("youtu.be/")) {
            const parts = videoUrl.split("youtu.be/");
            if (parts[1]) {
              const vid = parts[1].split(/[?&]/)[0];
              videoUrl = `https://www.youtube.com/embed/${vid}`;
            }
          }
        } catch (e) {
          // ignore URL parsing errors
        }

        // Use normalized videoUrl as src (fallback to original if not transformed)
        const src = videoUrl || block.url || "";

        return (
          <div key={idx} style={{ margin: "1em 0" }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                title={`video-${idx}`}
                src={src}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            </div>
          </div>
        );
      }

      case "mcq": {
        // We rely on lessonData state for selected value, not mutating original block
        const current = lessonData && lessonData[idx] ? lessonData[idx] : block;
        const options = current.options || [];
        const selected = typeof current.selected !== "undefined" ? current.selected : null;
        const answerIndex = typeof current.answer !== "undefined" ? current.answer : null;

        return (
          <div
            key={idx}
            style={{
              marginTop: "1em",
              padding: "0.75em",
              border: "1px solid #e6e6e6",
              borderRadius: 6,
            }}
          >
            <p style={{ marginBottom: "0.5em" }}>
              <strong>Quiz:</strong> {current.question}
            </p>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              {options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = answerIndex === i;

                let bg = "#fff";
                let border = "1px solid #ccc";
                if (isSelected) {
                  // show green if correct, red if wrong
                  bg = isCorrect ? "#e6ffed" : "#ffeef0";
                  border = isCorrect ? "1px solid #7cd39a" : "1px solid #f1a0a0";
                }

                return (
                  <button
                    key={i}
                    onClick={() => {
                      // Update lessonData immutably
                      setLessonData((prev) => {
                        if (!Array.isArray(prev)) return prev;
                        const copy = prev.map((b) => ({ ...b }));
                        copy[idx] = { ...copy[idx], selected: i };
                        return copy;
                      });
                    }}
                    style={{
                      textAlign: "left",
                      padding: "0.5em 0.6em",
                      borderRadius: 6,
                      cursor: "pointer",
                      background: bg,
                      border,
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback shown only after user selects */}
            {selected !== null && selected !== undefined && (
              <p style={{ marginTop: "0.5em", color: selected === answerIndex ? "green" : "red" }}>
                {selected === answerIndex ? "✅ Correct!" : "❌ Wrong! Try again."}
              </p>
            )}
          </div>
        );
      }

      default:
        return (
          <div key={idx} style={{ margin: "0.6em 0", whiteSpace: "pre-wrap" }}>
            {block.text ? block.text : null}
          </div>
        );
    }
  };

  /* ---------------- render guards ---------------- */

  if (!course) {
    return (
      <div style={{ padding: "1em" }}>
        <h2>Lesson Not Found</h2>
        <p>This lesson cannot be loaded directly. Please access it from the course page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "1em" }}>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1em" }}>
        <h2>{lessonTitle || "Lesson"}</h2>
        <p style={{ color: "crimson" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.25em 1.5em" }}>
      <h2 style={{ marginBottom: "0.6em" }}>{lessonTitle}</h2>

      <div>
        {Array.isArray(lessonData) && lessonData.length > 0 ? (
          lessonData.map((block, idx) => renderBlock(block, idx))
        ) : (
          <p style={{ color: "#666" }}>No content yet</p>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
