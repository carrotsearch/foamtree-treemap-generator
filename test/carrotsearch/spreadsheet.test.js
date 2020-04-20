import { describe, it } from "mocha";
import must from "must";

import { Worksheet2FoamTree } from "../../src/carrotsearch/spreadsheet.js";

import { readFile } from "xlsx";

const getWorksheet = file => {
  const workbook = readFile(`./public/examples/${file}`);
  workbook.must.not.be.undefined();
  workbook.SheetNames.must.be.not.empty();
  return workbook.Sheets[workbook.SheetNames[0]];
};

const getDataObject = file => {
  const sheet = getWorksheet(file);
  const parser = Worksheet2FoamTree.parse(sheet);
  const log = parser.getLog();
  log.must.be.empty();
  return parser.getDataObject();
};

describe("Worksheet2Foamtree", function () {
  it("must report an empty worksheet", function () {
    const sheet = getWorksheet("empty.csv");
    const parser = Worksheet2FoamTree.parse(sheet);
    const log = parser.getLog();
    log.must.not.be.empty();
    log[0].code.must.equal("E001");
  });

  it("must report missing level headings", function () {
    const sheet = getWorksheet("no-level-headings.csv");
    const parser = Worksheet2FoamTree.parse(sheet);
    const log = parser.getLog();
    log.must.not.be.empty();
    log[0].code.must.equal("E002");
  });

  it("must report no data rows", function () {
    const sheet = getWorksheet("no-data-rows.csv");
    const parser = Worksheet2FoamTree.parse(sheet);
    const log = parser.getLog();
    const dataObject = parser.getDataObject();
    log.must.not.be.empty();
    log[0].code.must.equal("W001");
    dataObject.must.not.be.empty();
    dataObject.groups.must.be.empty();
  });

  describe("must correctly parse", function () {
    it("hierarchy structure column headers", function () {
      const dataObject = getDataObject("level-header-convention.csv");
      dataObject.must.eql({
        "groups": [
          {
            "label": "Parent 1",
            "groups": [
              {
                "label": "Child 1",
                "intensity": 0.5
              }
            ]
          }
        ]
      });
    });

    it("one level input without properties", function () {
      const dataObject = getDataObject("one-level-no-properties.csv");
      dataObject.must.eql({
        "groups": [
          {
            "label": "Parent 1"
          },
          {
            "label": "Parent 2"
          }
        ]
      });
    });

    it("one level input with properties", function () {
      const dataObject = getDataObject("one-level-with-properties.csv");
      dataObject.must.eql({
        "groups": [
          {
            "label": "Parent 1",
            "color": "rgba(200, 0, 0, 0.5)",
            "intensity": 0.5
          },
          {
            "label": "Parent 2",
            "color": "rgba(0, 200, 0, 0.5)",
            "intensity": 0.3
          }
        ]
      });
    });

    const twoLevelGroups = {
      "groups": [
        {
          "label": "Parent 1",
          "groups": [
            {
              "label": "Child 1",
              "color": "rgba(200, 0, 0, 0.5)",
              "intensity": 0.5
            },
            {
              "label": "Child 2",
              "color": "rgba(200, 0, 0, 0.5)",
              "intensity": 0.05
            }
          ]
        },
        {
          "label": "Parent 2",
          "groups": [
            {
              "label": "Child 1",
              "color": "rgba(0, 200, 0, 0.5)",
              "intensity": 0.3
            },
            {
              "label": "Child 2",
              "color": "rgba(0, 200, 0, 0.5)",
              "intensity": 0.03
            }
          ]
        }
      ]
    };

    it("two levels input with properties", function () {
      const dataObject = getDataObject("two-level-with-properties.csv");
      dataObject.must.eql(twoLevelGroups);
    });

    it("two levels irregular input with properties", function () {
      const dataObject = getDataObject("two-level-irregular-with-properties.csv");
      dataObject.must.eql({
        "groups": [
          {
            "label": "Parent 1",
            "intensity": 0.5,
            "groups": [
              {
                "label": "Child 1",
                "intensity": 0.05
              }
            ]
          },
          {
            "label": "Parent 2",
            "intensity": 0.3,
            "groups": [
              {
                "label": "Child 1",
                "intensity": 0.03
              }
            ]
          }
        ]
      });
    });

    it("three levels irregular gaped input with properties", function () {
      const dataObject = getDataObject("three-level-irregular-with-properties.csv");
      dataObject.must.eql({
        "groups": [
          {
            "label": "Parent 1",
            "groups": [
              {
                "label": "Mid 1",
                "groups": [
                  {
                    "label": "Child 1",
                    "intensity": 0.5
                  }
                ]
              },
              {
                "label": "Mid 2",
                "intensity": 0.05
              }
            ]
          }
        ]
      });
    })

    it("Excel input", function () {
      const dataObject = getDataObject("excel.xlsx");
      dataObject.must.eql(twoLevelGroups);
    });

    it("OpenOffice input", function () {
      const dataObject = getDataObject("openoffice.ods");
      dataObject.must.eql(twoLevelGroups);
    });

    it("TSV input", function () {
      const dataObject = getDataObject("tsv.txt");
      dataObject.must.eql(twoLevelGroups);
    });

    it("large input", function () {
      const dataObject = getDataObject("papio_anubis.ods");
      console.log(dataObject.groups.length);
    });
  });
});