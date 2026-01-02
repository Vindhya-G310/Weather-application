import React from "react";

const CardLayout = (props) => {
  return (
    <div className={`card-container ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
};

export default CardLayout;
