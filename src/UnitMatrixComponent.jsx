import React from "react";
import CardLayout from "./Components/UI/CardLayout";
import SunMini from "./assets/images/sun-mini.svg";

const UnitMatrixComponent = ({ label, value, unit }) => {
  return (
    <CardLayout className="unit-metrix-main-div flex-items-start">
      <img src={SunMini} alt="" style={{ padding: "2px" }} />
      <div>
        <p className="label-18 uppercase">{label}</p>
        <p className="label-18 font-30">
          {value ?? "N/A"}
          {unit ?? ""}
        </p>
      </div>
    </CardLayout>
  );
};

export default UnitMatrixComponent;
