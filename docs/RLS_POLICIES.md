# Row Level Security (RLS) – LearnLynk Technical Test


## 1. Enable RLS on `leads`

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select_policy"
ON leads
FOR SELECT
USING (
  auth.jwt()->>'role' = 'admin'
  OR owner_id = auth.uid()
  OR EXISTS (
      SELECT 1
      FROM user_teams ut
      WHERE ut.user_id = auth.uid()
        AND ut.team_id = leads.team_id
  )
);

CREATE POLICY "leads_insert_policy"
ON leads
FOR INSERT
WITH CHECK (
  auth.jwt()->>'role' IN ('admin', 'counselor')
);
```