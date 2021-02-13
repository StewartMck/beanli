DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS customer_information CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'c'
);

CREATE TABLE stores
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(50) UNIQUE NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  image TEXT NOT NULL,
  address TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE menu_items
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  price FLOAT NOT NULL,
  image TEXT,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE
);

CREATE TABLE customer_information
(
  id SERIAL PRIMARY KEY NOT NULL,
  current_beans INTEGER NOT NULL DEFAULT 0,
  lifetime_beans INTEGER NOT NULL DEFAULT 0,
  tier VARCHAR(50) NOT NULL,
  accelerator FLOAT NOT NULL DEFAULT 1,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders
(
  id SERIAL PRIMARY KEY NOT NULL,
  time_created TIMESTAMP NOT NULL,
  total_price FLOAT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items
(
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE
);



