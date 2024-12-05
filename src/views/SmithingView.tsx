import React from "react";
import { useViewStore } from "../core/view.store";

const SmithingView: React.FC = () => {
  const setView = useViewStore((state) => state.setView);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smithing View</h1>
    </div>
  );
};

export default SmithingView;
