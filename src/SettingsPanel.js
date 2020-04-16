import React from 'react';
import Settings from "./carrotsearch/ui/settings/Settings.js";
import { view } from "react-easy-state";
import { settingsStore } from "./stores.js";

const storeGetter = (setting) => settingsStore[setting.id];
const storeSetter = (setting, value) => settingsStore[setting.id] = value;

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
            { label: "Flattened, description at the top", value: "flattened-stab" },
            { label: "Flattened, floating description", value: "flattened-floating" },
            { label: "Hierarchical", value: "hierarchical" },
          ]
        },
        {
          id: "layout",
          type: "enum",
          ui: "radio",
          label: "Layout",
          options: [
            { label: "Polygonal", value: "relaxed" },
            { label: "Rectangular", value: "squarified" },
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