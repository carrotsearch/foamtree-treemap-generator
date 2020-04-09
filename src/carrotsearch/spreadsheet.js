import XLSX from "xlsx";

export const Worksheet2FoamTree = /** @constructor */ function (worksheet) {
  const log = [];
  const dataObject = {};

  this.getLog = () => log;

  this.getDataObject = () => dataObject;

  const get = (r, c) => worksheet[XLSX.utils.encode_cell({ c: c, r: r })];
  const getV = (r, c) => {
    const e = get(r, c);
    return e && e.v;
  };

  // Ensure that the worksheet is not empty
  const rangeRaw = worksheet["!ref"];
  if (!rangeRaw) {
    log.push({ code: "E001" });
    return;
  }

  // Check if there is any data. The first row is a heading.
  const range = XLSX.utils.decode_range(rangeRaw);
  if (range.e.r <= 0) {
    log.push({ code: "W001" });
    dataObject.groups = [];
    return;
  }

  // Look for level headings, we require a specific level heading format defined below.
  const LEVEL_HEADING_REGEX = /^Level\s+\d+$/i;
  let maxLevels = 0;
  while (maxLevels <= range.e.c && LEVEL_HEADING_REGEX.test(getV(0, maxLevels))) {
    maxLevels++;
  }

  // No level headings found
  if (maxLevels === 0) {
    log.push({ code: "E002" });
    return;
  }

  // Headings beyond the hierarchy definitions. These will be the custom group properties.
  const propertyHeadings = [];
  let i = maxLevels;
  while (i <= range.e.c) {
    propertyHeadings.push(getV(0, i));
    i++;
  }

  // Build the data object.
  const root = { groups: new Map() };
  const getOrCreateGroup = (root, v) => {
    let group = root.groups.get(v);
    if (!group) {
      group = { label: v, groups: new Map() };
      root.groups.set(v, group);
    }
    return group;
  };

  for (let r = 1; r <= range.e.r; r++) {
    // Hierarchy placement
    let currentGroup = root;
    for (let c = 0; c < maxLevels; c++) {
      const v = getV(r, c);
      if (v === undefined) {
        continue;
      }
      currentGroup = getOrCreateGroup(currentGroup, v);
    }

    for (let c = maxLevels; c <= range.e.c; c++) {
      const v = getV(r, c);
      const p = propertyHeadings[c - maxLevels];
      currentGroup[p] = v;
    }
  }

  const reduceIndex = root => Array.from(root.groups.values()).reduce(reducer, []);
  const reducer = (groups, g) => {
    const group = Object.keys(g).reduce((newGroup, prop) => {
      if (prop !== "groups") {
        newGroup[prop] = g[prop];
      } else {
        if (g.groups.size > 0) {
          newGroup.groups = reduceIndex(g);
        }
      }
      return newGroup;
    }, {});
    groups.push(group);
    return groups;
  };
  dataObject.groups = reduceIndex(root);
};

Worksheet2FoamTree.parse = worksheet => new Worksheet2FoamTree(worksheet);

const messages = {
  "E001": "The provided worksheet is empty, no data to import.",
  "E002": "No hierarchy level headings found. The heading must follow the format 'Level N', where N is a number.",
  "W001": "The provided worksheet has no data rows.",
};

Worksheet2FoamTree.getMessage = entry => {
  return messages[entry.code];
};