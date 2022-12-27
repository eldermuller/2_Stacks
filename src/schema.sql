CREATE DATABASE socialmedia;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SELECT uuid_generate_v4();

CREATE TABLE IF NOT EXISTS users(
  id uuid primary key,
  email text NOT NULL unique,
  password text NOT NULL,
  username text unique,
  profile_pic text NULL,
  biography text NULL
);

CREATE TABLE IF NOT EXISTS posts(
  id integer primary key,
  user_id uuid NOT NULL,
  body text NOT NULL,
  post_id integer NULL,
  FOREIGN KEY (user_id) references users(id),
  FOREIGN KEY (post_id) references posts(id)
);

CREATE TABLE IF NOT EXISTS likes(
  id integer primary key,
  user_id uuid NOT NULL,
  post_id integer NOT NULL,
  FOREIGN KEY (user_id) references users(id),
  FOREIGN KEY (post_id) references posts(id)
);

CREATE TABLE IF NOT EXISTS follow(
  follower_id uuid NOT NULL,
  followed_id uuid NOT NULL,
  FOREIGN KEY (follower_id) references users(id),
  FOREIGN KEY (followed_id) references users(id)
);