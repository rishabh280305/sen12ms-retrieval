CREATE TABLE IF NOT EXISTS sen12ms.annotations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id text NOT NULL,
  tile_id text NOT NULL,
  label text NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tile_id)
);
