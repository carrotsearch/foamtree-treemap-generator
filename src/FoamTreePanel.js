import React, { useEffect, useState } from 'react';
import XLSX from "xlsx";
import { Worksheet2FoamTree } from "./carrotsearch/spreadsheet.js";
import { FoamTree } from "./carrotsearch/foamtree/FoamTree.js";
import { settingsStore } from "./stores.js";
import { view } from "react-easy-state";

const forEachDescendant = (parent, cb) => {
  if (parent && parent.groups) {
    parent.groups.forEach(g => {
      forEachDescendant(g, cb);
      cb(g, parent);
    });
  }
};

const grey = "hsla(0, 0%, 90%, 0.8)";
const buildOptions = (stacking) => ({
  rolloutDuration: 0,
  pullbackDuration: 0,
  stacking: stacking.split("-")[0],
  descriptionGroupType: stacking.split("-")[1],
  descriptionGroupSize: 0.01,
  descriptionGroupMaxHeight: 0.1,
  groupLabelVerticalPadding: 0.2,
  groupBorderWidth: 2.0,
  groupInsetWidth: 4.0,

  onModelChanging: data => {
    forEachDescendant(data, (g, p) => {
      if (g["protein abundance"]) {
        g.weight = g["protein abundance"];
        let r = g.ratio;
        const h = r === 1 ? 50 : r < 1 ? 0 : 110;
        const l = r < 1 ? r * 95 : r > 1 ? 95 / r : 70;
        g.groupColor = `hsla(${h}, 80%, ${(l).toFixed(2)}%, 1.0)`;
      }
      p.weight = (p.weight || 0) + g.weight;
    });
  },
  groupColorDecorator: (opts, props, vars) => {
    const group = props.group;
    let c = group.groupColor;
    if (c) {
      vars.groupColor = c;
    } else {
      vars.groupColor = grey;
    }
  }
});

const FoamTreePanel = view(() => {
  const [ dataObject, setDataObject ] = useState({});
  useEffect(() => {
    setDataObject({});
    fetch("examples/papio_anubis_anon.ods")
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const workbook = XLSX.read(buffer, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const parser = Worksheet2FoamTree.parse(sheet);
          setDataObject(parser.getDataObject());
        });
  }, []);

  return (
      <FoamTree dataObject={dataObject} options={buildOptions(settingsStore.stacking)}/>
  );
});


FoamTreePanel.propTypes = {};

export default FoamTreePanel;