
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string | null;
  created_at: string;
};

export type Application = {
  id: string;
  lead_id: string;
  status: "submitted" | "under_review" | "interview" | "accepted" | "rejected";
  submitted_at: string;
  notes: string | null;
  payment_status?: "unpaid" | "pending" | "paid";
};

export type Task = {
  id: string;
  related_id: string;
  type: "call" | "email" | "review";
  title: string | null;
  due_at: string;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
};

export type PaymentRequest = {
  id: string;
  application_id: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  created_at: string;
  completed_at: string | null;
};
