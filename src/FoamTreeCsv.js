import React from 'react';
import './FoamTreeCsv.css';
import FoamTreePanel from "./FoamTreePanel.js";
import SettingsPanel from "./SettingsPanel.js";

const FoamTreeCsv = () => {
  return (
      <main className="FoamTreeCsv">
        <div className="visualization">
          <FoamTreePanel />
        </div>
        <div className="settings">
          <SettingsPanel/>
        </div>
      </main>
  );
};

export default FoamTreeCsv;
