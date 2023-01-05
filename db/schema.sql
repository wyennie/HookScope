DROP DATABASE IF EXISTS requestbin;

CREATE DATABASE requestbin;

\c requestbin;

CREATE TABLE bins (
  id SERIAL PRIMARY KEY,
  created_date TIMESTAMP NOT NULL DEFAULT current_timestamp,
  path_key VARCHAR(5) UNIQUE NOT NULL,
  requests_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  bin_id INTEGER REFERENCES bins(id) ON DELETE CASCADE NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT current_timestamp,
  mongo_id VARCHAR(255) UNIQUE NOT NULL
);