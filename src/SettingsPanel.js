import React from 'react';
import Settings from "./carrotsearch/ui/settings/Settings.js";
import { view } from "react-easy-state";
import { settingsStore } from "./stores.js";

const storeGetter = (setting) => settingsStore[setting.id];
const storeSetter = (setting, value) => {
  return settingsStore[setting.id] = value;
};

const settings = {
  id: "root",
  settings: [
    {
      id: "layout",
      type: "group",
      label: "Layout",
      settings: [
        {
          id: "stacking",
          type: "enum",
          ui: "radio",
          label: "Stacking",
          options: [
            { label: "Flattened", value: "flattened" },
            { label: "Hierarchical", value: "hierarchical" }
          ]
        }
      ]
    }
  ]
};

const SettingsPanel = view(props => (
    <Settings settings={settings} get={storeGetter} set={storeSetter}/>
));

SettingsPanel.propTypes = {

};

export default SettingsPanel;