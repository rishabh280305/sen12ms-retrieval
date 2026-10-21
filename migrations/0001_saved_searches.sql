CREATE SCHEMA IF NOT EXISTS sen12ms;
CREATE TABLE IF NOT EXISTS sen12ms.saved_searches (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id text NOT NULL,
  query_tile text NOT NULL,
  modality text NOT NULL CHECK (modality IN ('sar', 'optical')),
  top_k integer NOT NULL CHECK (top_k BETWEEN 1 AND 20),
  created_at timestamptz NOT NULL DEFAULT now()
);
