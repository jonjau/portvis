import React, { useState } from "react";
import { Button } from "react-bootstrap";

function PasswordShowHide(props) {
  const [hidden, setHidden] = useState(true);
  // const [password, setPassword] = useState(props.password)
  const {password, setPassword} = props;

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShow = () => setHidden(!hidden);

  return (
    <div>
      <input
        // make it look Bootstrappy
        className="form-control"
        type={hidden ? "password" : "text"}
        value={password}
        onChange={handlePasswordChange}
      />
      <Button onClick={toggleShow}>Show / Hide</Button>
    </div>
  );
}

export default PasswordShowHide;
