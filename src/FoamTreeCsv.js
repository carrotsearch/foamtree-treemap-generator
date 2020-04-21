import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FoamTreePanel from "./FoamTreePanel.js";
import SettingsPanel from "./SettingsPanel.js";
import { useDropzone } from 'react-dropzone'
import { Worksheet2FoamTree } from "./carrotsearch/spreadsheet.js";
import { Welcome } from "./Welcome.js";
import { OperationLog } from "./OperationLog.js";

import { logStore } from "./stores.js";

import XLSX from "xlsx";
import './FoamTreeCsv.css';
import { ButtonLink } from "./carrotsearch/ui/ButtonLink.js";

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
  const loadSpreadsheet = (buffer, fileName) => {
    logStore.entries.push({ message: `Parsing ${fileName}.`, code: "I001" });
    window.setTimeout(() => {
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parser = Worksheet2FoamTree.parse(sheet);
      parser.getLog()
          .map(l => ({ code: l.code, message: Worksheet2FoamTree.getMessage(l) }))
          .forEach(e => logStore.entries.push(e));

      const firstMatching = re => parser.getPropertyNames().find(p => re.test(p));
      const weightProperty = firstMatching(/weight/i);
      const colorProperty = firstMatching(/color/i);

      const dataObject = parser.getDataObject();
      let count = 0;
      forEachDescendant(dataObject, (group, parent) => {
        count++;
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

      logStore.entries.push({ message: `Visualizing ${fileName} (${count} groups).`, code: "I002" });
      setDataObject(dataObject);
    }, 50);
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) {
      return;
    }
    const file = acceptedFiles[0];
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => loadSpreadsheet(reader.result, file.name)
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
      const name = `papio_anubis_anon.xlsx`;
      fetch(`examples/${name}`)
          .then(response => response.arrayBuffer())
          .then(response => loadSpreadsheet(response, name));
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
            <hr/>
            <div style={{textAlign: "right", marginBottom: "0.25em"}}>
              <ButtonLink onClick={() => logStore.entries = []}>clear log</ButtonLink>
            </div>
            <OperationLog log={logStore} />
          </div>
        </main>
        <Welcome visible={!dataObject.groups} />
      </div>
  );
};

export default FoamTreeCsv;
