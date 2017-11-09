module.exports = (err) => {
  let output = {
    status: 500,
    messages: []
  };
  switch (err) {
    case "INVALID_PATAMETER":
      output.messages.push({
        err: "INVALID_PATAMETER",
        message: "Invalid parameter.",
        structure: {
          orderinfo: {
            firstName: "String",
            lastName: "String",
            phoneNumber: "String",
            referenceCode: "String"
          }
        }
      });
      break;
    case "RECORD_NOT_FOUND":
      output.status = 404;
      output.messages.push({
        message: 'Record not found.',
        err: err
      });
      break;
    case "COULD_NOT_CONNECT_TO_DB":
      output.messages.push({
        message: 'Could not connect to DB',
        err: err
      });
      break;
  }
  return output;
};
