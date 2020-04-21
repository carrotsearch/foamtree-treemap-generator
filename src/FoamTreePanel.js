import React from 'react';
import { FoamTree } from "./carrotsearch/foamtree/FoamTree.js";
import { settingsStore } from "./stores.js";
import { view } from "react-easy-state";

const buildOptions = ({ stacking, layout }) => {
  return ({
    rolloutDuration: 0,
    pullbackDuration: 0,
    layout: layout,
    stacking: stacking.split("-")[0],
    descriptionGroupType: stacking.split("-")[1],
    descriptionGroupSize: 0.01,
    descriptionGroupMaxHeight: 0.1,
    groupLabelVerticalPadding: 0.2,
    groupBorderWidth: 1.0,
    groupInsetWidth: 2.0,
    groupSelectionOutlineWidth: 1.5,
    groupBorderRadius: 0.1,
    groupLabelFontFamily: "Raleway, sans-serif",
    groupLabelFontWeight: "bold",
    groupLabelMinFontSize: 0,

    groupColorDecorator: (opts, props, vars) => {
      vars.groupColor = props.group.color;
    },

    titleBarDecorator: (opts, props, vars) => {
      if (!settingsStore.showPathInTitleBar) {
        return;
      }

      const path = [];
      let g = props.group;
      while (g) {
        if (g.label) {
          path.push(g.label);
        }
        g = g.parent;
      }
      path.reverse();

      vars.titleBarText = path.join(" 🡒 ");
      vars.titleBarShown = true;
    }
  });
};

const FoamTreePanel = view(({ dataObject }) => {
  return (
      <FoamTree dataObject={dataObject} options={buildOptions(settingsStore)} />
  );
});

FoamTreePanel.propTypes = {};

export default FoamTreePanel;