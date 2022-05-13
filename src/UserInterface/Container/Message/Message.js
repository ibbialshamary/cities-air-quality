import React from "react";
import Container from "../Container";
import "./Message.scss";

const Message = (props) => {
  return (
    <Container>
      <div className={`container__message ${props.classes}`}>
        <h1>{props.heading}</h1>
        <p className="message-summary">{props.summary}</p>
      </div>
    </Container>
  );
};

export default Message;
