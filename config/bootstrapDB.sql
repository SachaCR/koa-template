-- Create table here

DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id integer NOT NULL,
  todo_priority integer NOT NULL,
  title varchar(255) NOT NULL,
  done boolean NOT NULL DEFAULT FALSE,
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone
  CONSTRAINT pk_todos PRIMARY KEY (id)
);
