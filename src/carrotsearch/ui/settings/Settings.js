import React from 'react';
import PropTypes from 'prop-types';
import Group from "./Group.js";

import "./Settings.css";

Settings.propTypes = {
  settings: PropTypes.object.isRequired,
  get: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired
};

function Settings({settings, get, set}) {
  return (
      <Group className="Settings" setting={settings} set={set} get={get} />
  );
}

export default Settings;