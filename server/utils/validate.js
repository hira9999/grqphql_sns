const validateRegisterInput = (userName, password, confirmPassword, email) => {
  const errors = {};
  if (userName.trim() === "") {
    errors.userName = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  } else {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(regex) === null) {
      errors.email = "You have entered an invalid email address!";
    }
  }
  if (password.trim() === "") {
    errors.password = "password must not be empty";
  } else if (password === confirmPassword) {
    errors.password = "password must match";
  }

  return {
    errors,
    // TODO
    valid: Object.keys(errors),
  };
};

const validateLoginInput = (userName, password) => {
  const errors = {};
  if (userName.trim() === "") {
    errors.userName = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors),
  };
};

export { validateRegisterInput, validateLoginInput };
