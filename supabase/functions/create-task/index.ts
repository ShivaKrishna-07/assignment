// @ts-nocheck

import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();
    const { application_id, task_type, due_at } = body;

    if (!application_id || !task_type || !due_at) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing fields" }),
        { status: 400 }
      );
    }

    const allowed = ["call", "email", "review"];
    if (!allowed.includes(task_type)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid task_type" }),
        { status: 400 }
      );
    }

    const dueDate = new Date(due_at);
    if (isNaN(dueDate.getTime()) || dueDate <= new Date()) {
      return new Response(
        JSON.stringify({ success: false, error: "due_at must be in the future" }),
        { status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        related_id: application_id,
        type: task_type,
        due_at: dueDate.toISOString()
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ success: false, error: "Insert failed" }),
        { status: 500 }
      );
    }

    await supabase.channel("task.created").send({
      type: "broadcast",
      event: "task.created",
      payload: { task_id: data.id },
    });

    return new Response(
      JSON.stringify({ success: true, task_id: data.id }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500 }
    );
  }
});
