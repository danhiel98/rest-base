const { response, request } = require("express");

const userGET = (req = request, res = response) => {
  const { name, email, start = 1 } = req.query;

  res.json({
    msg: "GET api - controller",
    name,
    email,
    start,
  });
};

const userPOST = (req, res = response) => {
  const { name, age } = req.body;

  res.json({
    msg: "POST api - controller",
    name,
    age,
  });
};

const userPUT = (req, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "PUT api - controller",
    id,
  });
};

const userPATCH = (req, res = response) => {
  res.json({
    msg: "PATCH api - controller",
  });
};

const userDELETE = (req, res = response) => {
  res.json({
    msg: "DELETE api - controller",
  });
};

module.exports = {
  userGET,
  userPOST,
  userPUT,
  userPATCH,
  userDELETE,
};
