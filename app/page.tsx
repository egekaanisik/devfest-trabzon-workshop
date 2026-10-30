"use client";
import { useEffect, useRef, useState } from "react";
import { initLlm } from "../lib/llm";

type Llm = {
  generate: (prompt: string) => Promise<string>;
};

export default function Page() {
  const [status, setStatus] = useState("Idle");
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const llmRef = useRef<Llm | null>(null);

  useEffect(() => {
    (async () => {
      setStatus("Loading model...");
      const llm = await initLlm();
      llmRef.current = llm;
      setReady(true);
      setStatus("Ready");
    })();
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || !llmRef.current) return;
    setInput("");
    setResponse("⏳ Generating…");

    try {
      const reply = await llmRef.current.generate(text);
      setResponse(String(reply));
    } catch (err: any) {
      setResponse(`❌ Error: ${err?.message ?? String(err)}`);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-16 grid gap-12">
      <h1 className="text-6xl font-extrabold text-white text-center tracking-tight">
        Web AI Local LLM Demo
      </h1>

      <p className="text-2xl text-center text-neutral-400">{status}</p>

      <div className="rounded-3xl border border-neutral-700 bg-neutral-900 p-12 min-h-[20rem] text-2xl whitespace-pre-wrap text-neutral-100 leading-relaxed">
        {response.trim() || "💡 Try asking: “What is a Service Worker?” or “Explain SSR in simple terms.”"}
      </div>

      <form
        className="flex gap-6 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          className="flex-1 rounded-3xl bg-neutral-800 border border-neutral-700 px-8 py-6 text-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-white/30"
          placeholder={ready ? "Type your question here…" : "Loading model…"}
          disabled={!ready}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-3xl bg-white/20 hover:bg-white/30 border border-white/40 px-10 py-6 text-2xl font-bold text-white transition disabled:opacity-50"
          disabled={!ready}
        >
          Send
        </button>
      </form>
    </main>
  );
}
