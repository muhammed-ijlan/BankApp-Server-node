const express = require("express");
const app = express();
const dataServices = require("./services/data.service");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// app.use(jwtMiddleware);

//middleware
const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const data = jwt.verify(token, "This is super secret");
    req.currentAcno = data.currentAcno;
    next();
  } catch {
    res.status(401).json({
      status: false,
      message: "Please Log in",
    });
  }
};

//register
app.post("/register", (req, res) => {
  dataServices
    .register(req.body.uname, req.body.acno, req.body.password)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//login
app.post("/login", (req, res) => {
  dataServices.login(req.body.acno, req.body.pswd).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//depost
app.post("/deposit", jwtMiddleware, (req, res) => {
  dataServices
    .deposit(req.body.acno, req.body.pswd, req.body.amt)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//withdraw
app.post("/withdraw", jwtMiddleware, (req, res) => {
  dataServices
    .withdraw(req, req.body.acno, req.body.pswd, req.body.amt)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//transactions
app.post("/transaction", jwtMiddleware, (req, res) => {
  dataServices.transaction(req.body.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//on delete
app.delete("/onDelete/:acno", jwtMiddleware, (req, res) => {
  dataServices.deleteAcc(req.params.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
