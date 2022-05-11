// database

const { urlencoded } = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");

const database = {
  1000: {
    acno: 1000,
    uname: "Leo",
    password: 1000,
    balance: 5000,
    transaction: [],
  },
  1001: {
    acno: 1001,
    uname: "Ram",
    password: 1001,
    balance: 8000,
    transaction: [],
  },
  1002: {
    acno: 1002,
    uname: "Neer",
    password: 1002,
    balance: 6000,
    transaction: [],
  },
};

//register//
const register = (uname, acno, password) => {
  return db.User.findOne({
    acno,
  }).then((user) => {
    if (user) {
      return {
        statusCode: 401,
        status: false,
        message: "Account number already exists.. Please login",
      };
    } else {
      const newUser = new db.User({
        acno,
        uname,
        password,
        balance: 0,
        transaction: [],
      });
      newUser.save();
      return {
        statusCode: 200,
        status: true,
        message: "Successfully registered",
      };
    }
  });
};

//login

const login = (acno, pswd) => {
  return db.User.findOne({ acno, password: pswd }).then((user) => {
    if (user) {
      currentUser = user.uname;
      currentAcno = acno;

      // jwt
      const token = jwt.sign(
        {
          currentAcno: acno,
        },
        "This is super secret"
      );

      return {
        statusCode: 200,
        status: true,
        message: "successfully Login ",
        token: token,
        currentAcno,
        currentUser,
      };
    } else {
      return {
        statusCode: 422,
        status: false,
        message: "Invalid Credentials !",
      };
    }
  });
};

//deposit

const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt);

  return db.User.findOne({ acno, password: pswd }).then((user) => {
    if (user) {
      user.balance += amount;

      user.transaction.push({
        type: "CREDIT",
        amount: amount,
      });
      user.save();
      return {
        statusCode: 200,
        status: true,
        message: `${amt} successfully credited, new balance is ${user.balance}`,
      };
    } else {
      return {
        statusCode: 422,
        status: false,
        message: "Invalid Credentials !",
      };
    }
  });
};

//withdraw
const withdraw = (req, acno, pswd, amt) => {
  var amount = parseInt(amt);

  return db.User.findOne({ acno, password: pswd }).then((user) => {
    if (req.currentAcno != acno) {
      return {
        statusCode: 401,
        status: false,
        message: "operation denied",
      };
    }

    if (user) {
      if (user.balance > amount) {
        user.balance -= amount;

        user.transaction.push({
          type: "DEBIT",
          amount: amount,
        });
        user.save();
        return {
          statusCode: 200,
          status: true,
          message: `${amt} succcessfully debited.. new balancce is ${user.balance} `,
        };
      } else {
        return {
          statusCode: 401,
          status: false,
          message: "insufficient balance",
        };
      }
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Invalid Credentials",
      };
    }
  });
};

//transactions
const transaction = (acno) => {
  return db.User.findOne({ acno }).then((user) => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "User does not exist",
      };
    }
  });
};

//delete acno
const deleteAcc = (acno) => {
  return db.User.deleteOne({ acno }).then((user) => {
    if (!user) {
      return {
        statusCode: 401,
        status: false,
        message: "Operation denied!!",
      };
    } else {
      return {
        statusCode: 200,
        status: true,
        message: `Account number ${acno} deleted successfully`,
      };
    }
  });
};

module.exports = { register, login, deposit, withdraw, transaction, deleteAcc };
