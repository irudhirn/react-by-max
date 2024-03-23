import { useState } from "react";
import Input from "./Input";
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation";
import useInput from "../hooks/useInput";

export default function StateLogin() {
  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError
  } = useInput("", (value) => isEmail(value) && isNotEmpty(value));
  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError
  } = useInput("", (value) => hasMinLength(value, 6));

  // const emailIsInvalid = didEdit.email && !isEmail(enteredValues.email) && !isNotEmpty(enteredValues.email);
  // const passwordIsInvalid = didEdit.password && !hasMinLength(enteredValues.password, 6);

  function handleSubmit(e){
    e.preventDefault();

    if(emailHasError || passwordHasError){
      return;
    }

    console.log({ emailValue, passwordValue });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <Input
          label="Email"
          id="email"
          type="email"
          name="email"
          onBlur={handleEmailBlur}
          value={emailValue}
          onChange={handleEmailChange}
          error={emailHasError && "Email is Invalid"}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          name="password"
          onBlur={handlePasswordBlur}
          value={passwordValue}
          onChange={handlePasswordChange}
          error={passwordHasError && "Password is short"}
        />
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}


/*

import { useState } from "react";
import Input from "./Input";
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation";

export default function StateLogin() {
  const [enteredValues, setEnteredValues] = useState({ email: "", password: "" });

  const [didEdit, setDidEdit] = useState({ email: false, password: false });

  // Validating input on every keystroke
  // const emailIsInvalid = enteredValues.email !== "" && !enteredValues.email.includes("@");

  // Validating input on lost focus
  // const emailIsInvalid = didEdit.email && !enteredValues.email.includes("@");
  // const passwordIsInvalid = didEdit.password && !enteredValues.password.length < 6;
  const emailIsInvalid = didEdit.email && !isEmail(enteredValues.email) && !isNotEmpty(enteredValues.email);
  const passwordIsInvalid = didEdit.password && !hasMinLength(enteredValues.password, 6);

  function handleSubmit(e){
    e.preventDefault();
  }

  const handleInputChange = (name, value) => {
    setEnteredValues((prev) => ({ ...prev, [name]: value }));

    // Validating input on lost focus
    setDidEdit((prev) => ({ ...prev, [name]: false }));
  }

  // Validating input on lost focus
  const handleInputBlur = (name) => setDidEdit((prev) => ({ ...prev, [name]: true }));

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <Input
          label="Email"
          id="email"
          type="email"
          name="email"
          onBlur={(e) => handleInputBlur(e.target.name)}
          value={enteredValues.email}
          onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          error={emailIsInvalid && "Email is Invalid"}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          name="password"
          onBlur={(e) => handleInputBlur(e.target.name)}
          value={enteredValues.password}
          onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          error={passwordIsInvalid && "Password is short"}
        />
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}

*/

/*

<div className="control no-margin">
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    name="email"
    onBlur={(e) => handleInputBlur(e.target.name)}
    value={enteredValues.email}
    onChange={(e) => handleInputChange(e.target.name, e.target.value)}
  />
  {emailIsInvalid && <div className="control-error"><p>Please enter a valid email address.</p></div>}
</div>

<div className="control no-margin">
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    name="password"
    onBlur={(e) => handleInputBlur(e.target.name)}
    value={enteredValues.password}
    onChange={(e) => handleInputChange(e.target.name, e.target.value)}
  />
</div>

*/