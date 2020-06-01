import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FoamTreePanel, prepareDataObject } from "./FoamTreePanel.js";
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

      const propertyNames = parser.getPropertyNames();
      const dataObject = prepareDataObject(propertyNames, parser.getDataObject());
      const count = dataObject ? dataObject.groups.reduce(function counter(cnt, group) {
        return cnt + 1 + (group.groups ? group.groups.reduce(counter, 0) : 0);
      }, 0) : 0;

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

  const loadExample = useCallback(name => {
    setDataObject({ groups: [] });
    window.setTimeout(() => {
      fetch(`examples/${name}`)
          .then(response => response.arrayBuffer())
          .then(response => loadSpreadsheet(response, name));
    }, 50);
  }, []);

// Load some example on start
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // loadExample(`papio_anubis_anon.xlsx`);
    }
  }, [ loadExample ]);

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
        <Welcome visible={!dataObject.groups} exampleClicked={loadExample} />
      </div>
  );
};

export default FoamTreeCsv;
