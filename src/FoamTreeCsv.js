import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FoamTreePanel, prepareDataObject, forEachDescendant } from "./FoamTreePanel.js";
import SettingsPanel from "./SettingsPanel.js";
import { useDropzone } from 'react-dropzone'
import { Worksheet2FoamTree } from "./carrotsearch/spreadsheet.js";
import { Welcome } from "./Welcome.js";
import { OperationLog } from "./OperationLog.js";
import { saveAs } from 'file-saver'
import cloneDeep from "lodash.clonedeep";

import { logStore } from "./stores.js";

import XLSX from "xlsx";
import './FoamTreeCsv.css';
import { ButtonLink } from "./carrotsearch/ui/ButtonLink.js";

const baseStyle = {
  borderWidth: 4,
  borderRadius: 2,
  borderColor: 'transparent',
  borderStyle: 'dashed',
  background: "#fff",
  outline: 'none',
  position: "absolute",
  top: "0.5em",
  bottom: "0.5em",
  left: "0.5em",
  right: "0.5em"
  // boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)"
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: 'hsl(90, 100%, 35%)'
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
      loadExample(`example.ods`);
    }
  }, [ loadExample ]);

  const foamTreeRef = useRef(undefined);

  const exportFoamTreeData = (extesion, fn = x => x) => {
    if (foamTreeRef.current) {
      const data = cloneDeep(foamTreeRef.current.get("dataObject"));
      forEachDescendant(data, group => {
        delete group["parent"];
      });
      saveAs(new Blob([ fn(JSON.stringify(data, null, "  ")) ],
          { type: "application/json;charset=utf-8" }), `foamtree-data.${extesion}`);
    }
  };

  const exportJson = useCallback(() => {
    exportFoamTreeData("json");
  }, []);
  const exportJsonP = useCallback(() => {
    exportFoamTreeData("js",json => {
      return `modelDataAvailable(${json})`;
    });
  }, []);

  return (
      <div {...getRootProps({ style })}>
        <main className="FoamTreeCsv" style={{visibility: !!dataObject.groups ? "visible" : "hidden"}}>
          <div className="visualization">
            <FoamTreePanel dataObject={dataObject} foamTreeRef={foamTreeRef} />
          </div>
          <div className="settings">
            <SettingsPanel welcomeClicked={() => setDataObject({})}
                           exportJsonClicked={exportJson} exportJsonPClicked={exportJsonP} />
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
