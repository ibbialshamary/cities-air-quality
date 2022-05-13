import React from "react";
import Container from "../../UserInterface/Container/Container";
import "./Introduction.scss";

const Introduction = () => {
  return (
    <Container classes="center-x margin-t-lg">
      <div className="container__heading white">
        <h1 className="bold">Compare your Air</h1>
      </div>
      <div className="container__summary">
        <p className="white medium margin-b-sm">
          Compare the air quality between cities in the UK.
        </p>
        <p className="white medium margin-b-md">
          Select cities to compare using the search tool below.
        </p>
      </div>
    </Container>
  );
};

export default Introduction;
