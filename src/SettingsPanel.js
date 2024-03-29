import React from 'react';
import Settings from "./carrotsearch/ui/settings/Settings.js";
import { view } from "react-easy-state";
import { settingsStore } from "./stores.js";
import { ButtonLink } from "./carrotsearch/ui/ButtonLink.js";
import { FormGroup } from "@blueprintjs/core";

const storeGetter = (setting) => settingsStore[setting.id];
const storeSetter = (setting, value) => settingsStore[setting.id] = value;

const settings = {
  id: "root",
  settings: [
    {
      id: "layout",
      type: "group",
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
        },
        {
          id: "showPathInTitleBar",
          type: "boolean",
          label: "Show hierarchy path on hover"
        }
      ]
    }
  ]
};

const SettingsPanel = view(({ welcomeClicked, exportJsonClicked, exportJsonPClicked }) => (
    <>
      <h3>Spreadsheet 🡒 FoamTree</h3>

      <p>
        To visualize a new spreadsheet, drag and drop it to this window. For more information about
        the required format, go back to
        the <ButtonLink onClick={e => { e.preventDefault(); welcomeClicked() }}>welcome screen</ButtonLink>.
      </p>

      <hr/>

      <Settings settings={settings} get={storeGetter} set={storeSetter}/>

      <hr/>

      <div className="Settings">
        <FormGroup label="Export as" inline={true}>
          <div style={{ lineHeight: "30px"}}>
            <ButtonLink onClick={e => { e.preventDefault(); exportJsonClicked() }}>FoamTree JSON (*.json)</ButtonLink>
            <ButtonLink onClick={e => { e.preventDefault(); exportJsonPClicked() }}>FoamTree JSON-P (*.js)</ButtonLink>
          </div>
        </FormGroup>
      </div>
    </>
));

SettingsPanel.propTypes = {

};

export default SettingsPanel;