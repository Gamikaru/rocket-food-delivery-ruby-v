# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

---

**What is SQL?**
SQL is a programming language for managing relational databases. It allows users to create, modify, and query data stored in RDBMS.

**What is the main difference between SQLite and MySQL?**
SQLite is serverless and embedded within applications, suitable for smaller-scale use. MySQL is a client-server system designed for larger applications with multiple concurrent connections.

**What are Primary and Foreign Keys?**
- Primary keys: Uniquely identify records in a table, ensuring data integrity.
- Foreign keys: Establish relationships between tables by referencing the primary key of another table.

**What are the different relationship types in a relational database?**
- One-to-One (1:1) Relationship: Each record in one table is associated with exactly one record in another table.
- One-to-Many (1:N) Relationship: A record in one table can be associated with multiple records in another table, but each record in the second table can only be associated with one record in the first table.
- Many-to-Many (N:N) Relationship: Multiple records in one table can be associated with multiple records in another table through a junction or join table.

---

**Many-to-One Relationships:**
- employees table and users table:
  - Explanation:
    - The employees table has a column user_id that is a foreign key referencing the id column in the users table. 
    - This relationship indicates that many employees can belong to a single user (as indicated by the foreign key user_id in the employees table).

- customers table and users table:
  - Explanation:
    - The customers table has a column user_id that is a foreign key referencing the id column in the users table.
    - This relationship indicates that many customers can belong to a single user (as indicated by the foreign key user_id in the customers table).
    
- restaurants table and users table:
  - Explanation: 
    - The restaurants table has a column user_id that is a foreign key referencing the id column in the users table. 
    - This relationship indicates that many restaurants can belong to a single user (as indicated by the foreign key user_id in the restaurants table).

**One-to-One Relationships:**
- employees table and addresses table:
  - Explanation: 
    - The employees table has a column address_id that is a foreign key referencing the id column in the addresses table. 
    - This relationship indicates that each employee can have only one address (as indicated by the unique constraint on address_id in the employees table).

- customers table and addresses table:
  - Explanation: 
    - The customers table has a column address_id that is a foreign key referencing the id column in the addresses table.
    - This relationship indicates that each customer can have only one address (as indicated by the unique constraint on address_id in the customers table).
    
- restaurants table and addresses table:
  - Explanation: 
    - The restaurants table has a column address_id that is a foreign key referencing the id column in the addresses table.
    - This relationship indicates that each restaurant can have only one address (as indicated by the unique constraint on address_id in the restaurants table).

**Many-to-Many Relationships:**
- orders table and products table:
  - Explanation: 
    - The orders table has a column restaurant_id that is a foreign key referencing the id column in the restaurants table.
    - The orders table also has a column customer_id that is a foreign key referencing the id column in the customers table. This relationship indicates that each order can be associated with multiple products, and each product can be associated with multiple orders.
    
- orders table and order_statuses table:
  - Explanation:
    - The orders table has a column order_status_id that is a foreign key referencing the id column in the order_statuses table.
    - This relationship indicates that multiple orders can share the same order status, but each order status can be associated with multiple orders.
    
- products table and product_orders table:
  - Explanation:
    - The product_orders table has a column product_id that is a foreign key referencing the id column in the products table.
    - The product_orders table also has a column order_id that is a foreign key referencing the id column in the orders table.
    - This relationship indicates that each product can appear in multiple product orders, and each product order can contain multiple products.
    
- products table and restaurants table:
  - Explanation:
    - The products table has a column restaurant_id that is a foreign key referencing the id column in the restaurants table.
    - This relationship indicates that multiple products can belong to a single restaurant, and each restaurant can have multiple products.