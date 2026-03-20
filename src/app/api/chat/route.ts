import { NextRequest, NextResponse } from "next/server";
import { getClaudeClient } from "@/lib/claude";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DAILY_MESSAGE_LIMIT = 50;

const LANDING_PAGE_SYSTEM_PROMPT = `You are the Nextera Labs AI assistant on our website. You help prospective students and parents learn about Nextera Labs.

Key facts about Nextera Labs:
- India's most intensive 6-week AI & full-stack bootcamp for high schoolers (Class 11-12)
- Students build real AI-powered products and launch them
- Small cohorts (max 30 students) for personalized attention
- Pricing: ₹4,999 for the full 6-week program
- Selection process: Apply online → Review → Video call → Acceptance
- Curriculum: HTML/CSS/JS → React/Next.js → Supabase → AI APIs → Final project launch
- Founded by young builders who believe high schoolers can build real products
- 100% online, weekend sessions, plus async support

Your tone: warm, direct, like a helpful friend. Keep answers to 3 sentences max unless explaining a process in detail. Always end your response with a question to keep the conversation going.`;

function buildStudentSystemPrompt(profile: {
  full_name: string;
  current_week?: number;
  current_project?: string;
  rank?: number;
  streak_days?: number;
  class?: string;
  city?: string;
}) {
  return `You are the Nextera Labs AI Tutor — a patient, encouraging, and technically sharp mentor for high school students learning to build AI-powered web apps.

STUDENT CONTEXT:
- Name: ${profile.full_name}
- Current Week: ${profile.current_week ?? 1} of 6
- Current Project: ${profile.current_project ?? "Not started yet"}
- Rank: ${profile.rank ?? "Unranked"}
- Streak: ${profile.streak_days ?? 0} days
- Class: ${profile.class ?? "N/A"}
- City: ${profile.city ?? "N/A"}

CURRICULUM (6 weeks):
Week 1 — Foundations: HTML, CSS, JavaScript basics. Project: Personal portfolio site.
Week 2 — React & Components: JSX, props, state, hooks, component patterns. Project: Interactive dashboard.
Week 3 — Next.js & Routing: App Router, SSR, API routes, layouts. Project: Multi-page app.
Week 4 — Backend & Database: Supabase setup, CRUD operations, auth, RLS policies. Project: Full-stack app with auth.
Week 5 — AI Integration: Anthropic Claude API, prompt engineering, streaming responses. Project: AI-powered feature.
Week 6 — Launch Week: Polish, deploy, present. Final project: Complete AI-powered product launch.

TEACHING PHILOSOPHY:
- Meet the student where they are. If they are in Week 1, do not reference Week 4 concepts.
- Use analogies and real-world examples that resonate with Indian high schoolers.
- Break complex concepts into small, digestible steps.
- Celebrate progress, no matter how small.
- When a student is stuck, ask guiding questions before giving the answer.
- Always provide working code examples when relevant.
- Use Indian English spellings and cultural references where appropriate.

RESTRICTIONS:
- Never write entire projects or assignments for students. Guide them to build it themselves.
- Never share answers to assessments or quizzes.
- Stay within the scope of web development, AI, and the Nextera curriculum.
- If asked about topics outside scope, gently redirect.
- Never disparage other programs or platforms.
- Keep responses concise but thorough. Use markdown for code blocks.

TECHNICAL SKILLS YOU CAN HELP WITH:
HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), TypeScript, React 19, Next.js 15 (App Router), Supabase (Auth, Database, Storage, RLS), Anthropic Claude API, Git & GitHub, Vercel deployment, responsive design, accessibility basics.

Address the student by their first name. Be encouraging but honest. If they are doing great, tell them. If their code has issues, explain why kindly and help them fix it.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, studentId } = body as {
      messages: Array<{ role: string; content: string }>;
      studentId?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    let systemPrompt = LANDING_PAGE_SYSTEM_PROMPT;

    if (studentId) {
      // Rate limiting: check daily message count
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("chat_sessions")
        .select("*", { count: "exact", head: true })
        .eq("student_id", studentId)
        .gte("created_at", today.toISOString());

      if (count !== null && count >= DAILY_MESSAGE_LIMIT) {
        return NextResponse.json(
          {
            error: `Daily message limit of ${DAILY_MESSAGE_LIMIT} reached. Come back tomorrow!`,
          },
          { status: 429 }
        );
      }

      // Fetch student profile for context
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, current_week, current_project, rank, streak_days, class, city"
        )
        .eq("id", studentId)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "Student profile not found" },
          { status: 404 }
        );
      }

      systemPrompt = buildStudentSystemPrompt(profile);
    }

    const claude = getClaudeClient();

    const anthropicMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const stream = await claude.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
      stream: true,
    });

    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullResponse += text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();

          // After stream completes, save to chat_sessions
          if (studentId) {
            const lastUserMessage =
              messages.filter((m) => m.role === "user").pop()?.content ?? "";

            await supabase.from("chat_sessions").insert({
              student_id: studentId,
              user_message: lastUserMessage,
              assistant_message: fullResponse,
              message_count: messages.length + 1,
            });
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
