const db = require("../config/db");

exports.createUser = (name, email, password, address) => {
  return db.execute(
    "INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)",
    [name, email, password, address]
  );
};

exports.findUserByEmail = (email) => {
  return db.execute("SELECT * FROM users WHERE email = ?", [email]);
};
