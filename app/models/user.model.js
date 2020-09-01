const sql = require("./db.js");

// constructor
const User = function(user) {
  this.email = user.email;
  this.name = user.name;
  this.password = user.password;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    // if any error occured log and return the error
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // else log and return that user creation successful
    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
    // if any error occured log and return the error
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // if the result have any user the return the user
    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }
    //else return user not found with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    // if any error occured log and return the error
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // else return all the users
    console.log("users: ", res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET email = ?, name = ?, password = ? WHERE id = ?",
    [user.email, user.name, user.password, id],
    (err, res) => {
      // if any error occured log and return the error
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      // if affectedRows is 0 then user not found with the given id
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      // else log and return the updated user
      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    // if any error occured log and return the error
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // if affectedRows is 0 then user not found with the given id
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    // else log and return user is deleted
    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

module.exports = User;
