const errorCatch = (req, res, next) => {
  const err = { status: 404, msg: "Not found" };
  next(err);
};

const customErrorCatch = (err, req, res, next) => {
  if (err.status) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else next(err);
};

const psqlErrorCatch = (err, req, res, next) => {
  const psqlCodes = {
    "22P02": { msg: "Invalid data type", status: 400 },
    "23503": { msg: "Not found", status: 404 },
    "42703": { msg: "Invalid query", status: 400 },
    "23505": { msg: "Username already exists", status: 403 },
    "42P01": { msg: "Table does not exist", status: 404 }
  };
  if (psqlCodes.hasOwnProperty(err.code))
    res
      .status(psqlCodes[err.code].status)
      .send({ msg: psqlCodes[err.code].msg });
  else next(err);
};

const serverErrorCatch = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: err });
};

module.exports = {
  errorCatch,
  customErrorCatch,
  psqlErrorCatch,
  serverErrorCatch
};
