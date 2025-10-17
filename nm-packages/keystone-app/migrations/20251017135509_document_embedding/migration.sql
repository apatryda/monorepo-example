-- Add an example vector embedding table.

CREATE TABLE "DocumentEmbedding" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  embedding VECTOR(4) -- use 4 for demo purposes; real-world values are much bigger
);
