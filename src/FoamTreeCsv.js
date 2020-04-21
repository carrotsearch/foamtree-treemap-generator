import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FoamTreePanel from "./FoamTreePanel.js";
import SettingsPanel from "./SettingsPanel.js";
import { useDropzone } from 'react-dropzone'
import { Worksheet2FoamTree } from "./carrotsearch/spreadsheet.js";
import { Welcome } from "./Welcome.js";

import XLSX from "xlsx";
import './FoamTreeCsv.css';

const baseStyle = {
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#ddd',
  borderStyle: 'dashed',
  background: "#fff",
  outline: 'none',
  transition: 'border .24s ease-in-out',
  position: "absolute",
  top: "0.5em",
  bottom: "0.5em",
  left: "0.5em",
  right: "0.5em"
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
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

const FoamTreeCsv = () => {
  const [ dataObject, setDataObject ] = useState({});
  const loadSpreadsheet = buffer => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const parser = Worksheet2FoamTree.parse(sheet);

    const firstMatching = re => parser.getPropertyNames().find(p => re.test(p));
    const weightProperty = firstMatching(/weight/i);
    const colorProperty = firstMatching(/color/i);

    const dataObject = parser.getDataObject();
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
      });

    setDataObject(dataObject);
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) {
      return;
    }
    const file = acceptedFiles[0];
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => loadSpreadsheet(reader.result)
    reader.readAsArrayBuffer(file);
  }, [])
  const {
    getRootProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  // Load some example on start
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      setDataObject({});
      fetch("examples/papio_anubis_anon.xlsx")
          .then(response => response.arrayBuffer())
          .then(loadSpreadsheet);
    }
  }, []);

  return (
      <div {...getRootProps({ style })}>
        <main className="FoamTreeCsv" style={{visibility: !!dataObject.groups ? "visible" : "hidden"}}>
          <div className="visualization">
            <FoamTreePanel dataObject={dataObject} />
          </div>
          <div className="settings">
            <SettingsPanel welcomeClicked={() => setDataObject({})}/>
          </div>
        </main>
        <Welcome visible={!dataObject.groups} />
      </div>
  );
};

export default FoamTreeCsv;
