"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task } from "@/types/database";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchTodayTasks(): Promise<Task[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .gte("due_at", start.toISOString())
    .lte("due_at", end.toISOString())
    .order("due_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

async function markTaskComplete(taskId: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status: "completed" })
    .eq("id", taskId);

  if (error) {
    throw new Error(error.message);
  }
}

export default function TodayPage() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: fetchTodayTasks,
  });

  const markCompleteMutation = useMutation({
    mutationFn: markTaskComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "today"] });
    },
  });

  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);

  const handleMarkComplete = (taskId: string) => {
    setUpdatingTaskId(taskId);
    markCompleteMutation.mutate(taskId, {
      onSettled: () => setUpdatingTaskId(null),
    });
  };

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Tasks Due Today</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading tasks</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tasks Due Today</h1>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No tasks due today.</p>
          <p className="text-sm text-gray-500 mt-2">Check back later or add new tasks.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Application ID</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  {task.title ?? "No title"}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {task.related_id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  {new Date(task.due_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </TableCell>

                <TableCell>
                  {task.status === "completed" ? (
                    <span className="text-green-600 font-medium">Done</span>
                  ) : (
                    <Button
                      size="sm"
                      disabled={updatingTaskId === task.id}
                      onClick={() => handleMarkComplete(task.id)}
                    >
                      {updatingTaskId === task.id ? "Updating..." : "Mark Complete"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {markCompleteMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">
            Failed to update task: {markCompleteMutation.error.message}
          </p>
        </div>
      )}
    </div>
  );
}
