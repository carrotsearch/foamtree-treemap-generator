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
    groupBorderWidth: 2.0,
    groupInsetWidth: 4.0,
    groupLabelFontFamily: "Raleway, sans-serif",
    groupLabelFontWeight: "bold",

    groupColorDecorator: (opts, props, vars) => {
      vars.groupColor = props.group.color;
    }
  });
};

const FoamTreePanel = view(({ dataObject }) => {
  return (
      <FoamTree dataObject={dataObject} options={buildOptions(settingsStore)}/>
  );
});

FoamTreePanel.propTypes = {};

export default FoamTreePanel;