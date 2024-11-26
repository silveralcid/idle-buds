import React from "react";
import { useViewStore } from "../core/view.state";

const MiningView: React.FC = () => {
  const setView = useViewStore((state) => state.setView);

  const goBack = () => {
    setView("DefaultView"); // Example for switching views
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Mining View</h1>
      <p>This is where mining happens!</p>
      <button className="btn btn-primary mt-4" onClick={goBack}>
        Go Back
      </button>
    </div>
  );
};

export default MiningView;
