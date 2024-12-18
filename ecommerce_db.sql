ALTER TABLE users
ADD COLUMN password VARCHAR(255),
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';

ALTER TABLE products
ADD COLUMN product_id SERIAL PRIMARY KEY,
ADD COLUMN name VARCHAR(255),
ADD COLUMN description TEXT,
ADD COLUMN price DECIMAL(10, 2),
ADD COLUMN stock INTEGER,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE carts
ADD COLUMN cart_id SERIAL PRIMARY KEY,
ADD COLUMN user_id INTEGER REFERENCES users(user_id),
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE cart_items
ADD COLUMN cart_item_id SERIAL PRIMARY KEY,
ADD COLUMN cart_id INTEGER REFERENCES carts(cart_id),
ADD COLUMN product_id INTEGER REFERENCES products(product_id),
ADD COLUMN quantity INTEGER;

ALTER TABLE orders
ADD COLUMN order_id SERIAL PRIMARY KEY,
ADD COLUMN user_id INTEGER REFERENCES users(user_id),
ADD COLUMN total_price DECIMAL(10, 2),
ADD COLUMN status VARCHAR(50),
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE order_items
ADD COLUMN order_item_id SERIAL PRIMARY KEY,
ADD COLUMN order_id INTEGER REFERENCES orders(order_id),
ADD COLUMN product_id INTEGER REFERENCES products(product_id),
ADD COLUMN quantity INTEGER,
ADD COLUMN price DECIMAL(10, 2);


INSERT INTO users (username, email, password, created_at) 
VALUES ('john_doe', 'john@example.com', 'securepassword', NOW());

INSERT INTO products (name, description, price, stock, created_at) 
VALUES ('Laptop', 'A high-performance laptop', 999.99, 10, NOW());


INSERT INTO carts (user_id, created_at) 
VALUES (1, NOW());

INSERT INTO cart_items (cart_id, product_id, quantity) 
VALUES (1, 1, 2);


INSERT INTO orders (user_id, total_price, status, created_at) 
VALUES (1, 1999.98, 'pending', NOW());


INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES (1, 1, 2, 999.99);



ALTER TABLE users
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
ADD COLUMN salt VARCHAR(255),
ADD COLUMN hashed_password VARCHAR(255);

ALTER TABLE users
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

INSERT INTO users (username, email, hashed_password, created_at) 
VALUES ('David_lee', 'davidlee@example.com', '<hashed_password>', NOW());


ALTER TABLE users
DROP COLUMN password;

UPDATE users
SET hashed_password = 'hashed_securepassword', salt = 'random_salt'
WHERE email = 'john@example.com';

ALTER TABLE orders ADD COLUMN cart_id integer;

ALTER TABLE orders ADD CONSTRAINT orders_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES carts(cart_id);


