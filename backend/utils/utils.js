const handleErrors = (error, res) => {
  let statusCode = 400;
  let message = "";
  console.log(error.name);
  switch (error.name) {
    case "DocumentNotFoundError":
      statusCode = 404;
      message = "NOT FOUND";
      break;
    case "ValidationError":
      statusCode = 400;
      message = "PARAMETERS INVALID";
      break;
    default:
      statusCode = 500;
      message = "SERVER ERROR";
      break;
  }
  res.status(statusCode).send({ status: false, message, error });
};

module.exports = { handleErrors };
