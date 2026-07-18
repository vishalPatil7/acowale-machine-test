-- Acowale feedback schema. Idempotent so migrate.js can run it repeatedly.

CREATE TABLE IF NOT EXISTS feedback (
  id          BIGSERIAL   PRIMARY KEY,
  email       TEXT,
  category    TEXT        NOT NULL,
  rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes that back the list filters and analytics grouping.
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_category   ON feedback (category);
