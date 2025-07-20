CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category ENUM('Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Salary', 'Other Income', 'Others') NOT NULL,
    date DATETIME NOT NULL,
    description VARCHAR(255),
    is_debit BOOLEAN NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);
