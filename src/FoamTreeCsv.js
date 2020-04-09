import React, { useEffect, useState } from 'react';
import './FoamTreeCsv.css';
import { FoamTree } from "./carrotsearch/foamtree/FoamTree.js";
import XLSX from "xlsx";
import { Worksheet2FoamTree } from "./carrotsearch/spreadsheet.js";

const forEachDescendant = (parent, cb) => {
  if (parent && parent.groups) {
    parent.groups.forEach(g => {
      forEachDescendant(g, cb);
      cb(g, parent);
    });
  }
};

const grey = "hsla(0, 0%, 90%, 0.8)";

const FoamTreeCsv = () => {
  const foamtreeOptions = {
    rolloutDuration: 0,
    pullbackDuration: 0,
    stacking: "flattened",
    descriptionGroupMaxHeight: 0.1,
    groupLabelVerticalPadding: 0.2,
    groupBorderWidth: 2.0,
    groupInsetWidth: 4.0,

    onModelChanging: data => {
      forEachDescendant(data, (g, p) => {
        if (g["protein abundance"]) {
          g.weight = g["protein abundance"];
        } else {
          g.open = true;
        }
        p.weight = (p.weight || 0) + g.weight;
      });
    },
    groupColorDecorator: (opts, props, vars) => {
      const group = props.group;
      let r = group.ratio;
      if (r) {
        const h = r === 1 ? 50 : r < 1 ? 0 : 110;
        const l = r < 1 ? r * 95 : r > 1 ? 95 / r : 70;
        vars.groupColor = `hsla(${h}, 80%, ${(l).toFixed(2)}%, 1.0)`;
      } else {
        vars.groupColor = grey;
      }
    }
  };

  const [ dataObject, setDataObject ] = useState({});
  useEffect(() => {
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
      <main className="FoamTreeFromSpreadsheet">
        <div className="visualization">
          <FoamTree dataObject={dataObject} options={foamtreeOptions}/>
        </div>
        <div className="settings">
        </div>
      </main>
  );
};

export default FoamTreeCsv;
