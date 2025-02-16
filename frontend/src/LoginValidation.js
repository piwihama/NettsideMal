function validation(values) {
  let errors = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email) {
    errors.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Email didn't match";
  }

  if (!values.password) {
    errors.password = "Password should not be empty";
  } 

  return errors;
}

export default validation;
