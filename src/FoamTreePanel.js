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

    onGroupClick: e => {
      if (e.group.url) {
        window.open(e.group.url, "_blank");
      }
    },

    groupColorDecorator: (opts, props, vars) => {
      vars.groupColor = props.group.color;
    },

    groupLabelDecorator: (opts, props, vars) => {
      if (props.group.url) {
        vars.labelText += "\u00a0\uD83D\uDD17";
      }
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

const forEachDescendant = (parent, cb) => {
  if (parent && parent.groups) {
    parent.groups.forEach(g => {
      forEachDescendant(g, cb);
      cb(g, parent);
    });
  }
};

const grey = "hsla(0, 0%, 90%, 0.8)";

export const prepareDataObject = (propetyNames, dataObject, log) => {
  const firstMatching = re => propetyNames.find(p => re.test(p));
  const weightProperty = firstMatching(/weight/i);
  const colorProperty = firstMatching(/color/i);
  const urlProperty = firstMatching(/url/i);

  forEachDescendant(dataObject, (group, parent) => {
    group.parent = parent;
    if (weightProperty) {
      if (group[weightProperty]) {
        group.weight = group[weightProperty];
      }
      parent.weight = (parent.weight || 0) + group.weight;
    }
    if (colorProperty) {
      const color = group[colorProperty];
      group.color = color ? color : grey;
    }
    if (urlProperty && group[urlProperty]) {
      group.url = group[urlProperty];
    }
  });
  return dataObject;
};

export const FoamTreePanel = view(({ dataObject }) => {
  return (
      <FoamTree dataObject={dataObject} options={buildOptions(settingsStore)} />
  );
});

FoamTreePanel.propTypes = {};