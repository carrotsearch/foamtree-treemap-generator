import React, { useRef, useEffect } from 'react';
import "./OperationLog.css";

import { view } from "react-easy-state";

const LogEntry = ({ entry }) => {
  let level;
  switch (entry.code.charAt(0)) {
    case "I": level = "info"; break;
    case "W": default: level = "warning"; break;
    case "E": level = "error"; break;
  }
  return (
    <div className={`LogEntry ${level}`}>
      <div>{entry.code}:&nbsp;</div>
      <div>{entry.message}</div>
    </div>
  );
};

export const OperationLog = view(({ log }) => {
  const element = useRef();
  useEffect(() => {
    element.current.scrollTop = element.current.scrollHeight;
  });
  return (
      <div className="OperationLog" ref={element}>
        {
          log.entries.map((e, i) => <LogEntry key={i} entry={e} />)
        }
      </div>
  );
});