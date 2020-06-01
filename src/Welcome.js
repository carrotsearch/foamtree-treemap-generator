import React from 'react';
import PropTypes from 'prop-types';

import "./Welcome.css";
import { ButtonLink } from "./carrotsearch/ui/ButtonLink.js";
import { Icon } from "@blueprintjs/core";
import { GitHubLogo } from "./GitHubLogo.js";
import { FoamTreeLogo } from "./FoamTreeLogo.js";

const ExampleLink = ({ fileName, label, onClick, children }) => {
  return <>
    <ButtonLink onClick={() => onClick(fileName)}>{children}</ButtonLink>&nbsp;&nbsp;
    <a href={`examples/${fileName}`} title="download this example"><Icon icon={"download"} /></a>
  </>;
};

export const Welcome = ({ visible, exampleClicked }) => {
  return (
      <article className="Welcome" style={{display: visible ? "block" : "none" }}>
        <div>
          <div className="intro">
            <h1>Spreadsheet 🡒 FoamTree</h1>

            <h4>
              Turn a spreadsheet into an interactive treemap visualization!
            </h4>

            <p>
              Drag and drop a spreadsheet file into this window. Excel, OpenOffice and
              CSV files are supported.
            </p>

            <p>
              Examples: <ExampleLink fileName="papio_anubis_anon.xlsx"onClick={exampleClicked}>protein levels</ExampleLink>
            </p>

            <hr/>

            <p>
              Your spreadsheet must follow a specific format, which looks similar to this:
            </p>

            <table className="spreadsheet">
              <thead>
              <tr>
                <th><span className="triangle"></span></th>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>D</th>
                <th>E</th>
              </tr>
              </thead>

              <tbody>
              <tr>
                <th>1</th>
                <td>Dir (level 1)</td>
                <td>Dir (level 2)</td>
                <td>File (level 3)</td>
                <td>File (weight)</td>
                <td>File type (color)</td>
              </tr>

              <tr>
                <th>2</th>
                <td>carrotsearch</td>
                <td>visualization</td>
                <td>foamtree</td>
                <td>140</td>
                <td>hsl(40, 80%, 60%)</td>
              </tr>

              <tr>
                <th>3</th>
                <td>carrotsearch</td>
                <td>visualization</td>
                <td>circles</td>
                <td>90</td>
                <td>hsl(60, 80%, 60%)</td>
              </tr>

              <tr>
                <th>4</th>
                <td>carrotsearch</td>
                <td>visualization</td>
                <td>dotatlas</td>
                <td>220</td>
                <td>hsl(90, 80%, 60%)</td>
              </tr>

              <tr>
                <th>5</th>
                <td>carrotsearch</td>
                <td>clustering</td>
                <td>lingo3g</td>
                <td>1500</td>
                <td>hsl(0, 80%, 60%)</td>
              </tr>

              <tr>
                <th>6</th>
                <td>carrotsearch</td>
                <td>clustering</td>
                <td>lingo4g</td>
                <td>2200</td>
                <td>hsl(20, 80%, 60%)</td>
              </tr>

              <tr>
                <th>7</th>
                <td>opensource</td>
                <td></td>
                <td>carrot2</td>
                <td>1200</td>
                <td>hsl(50, 80%, 60%)</td>
              </tr>

              <tr>
                <th>8</th>
                <td>opensource</td>
                <td></td>
                <td>hppc</td>
                <td>800</td>
                <td>hsl(20, 0%, 60%)</td>
              </tr>
              </tbody>
            </table>

            <ExampleLink fileName="example.ods" onClick={exampleClicked}>visualize this example</ExampleLink>
          </div>

          <hr/>

          <p>
            The specific conventions your spreadsheet must follow are those:
          </p>

          <div className="columns">
            <ul>
              <li>
                <p>
                  <strong>Denormalized hierarchy data.</strong> One row defines one treemap polygon. For each
                  polygon, provide all parent polygons, starting with the top-level parent in column A.
                </p>
              </li>

              <li>
                <p>
                  <strong>Hierarchy structure columns first, then extra properties.</strong> The first
                  columns in the spreadsheet must define polygon hierarchy. Use as many columns as required.
                  Further columns can define extra cell properties, such as weight or color.
                </p>
              </li>

              <li>
                <p>
                  <strong>One-row header.</strong> No less, no more.
                </p>
              </li>

              <li>
                <p>
                  <strong>Header contents conventions.</strong> The hierarchy definition columns
                  must contain the (case-insensitive) string <code>level N</code>, where <code>N</code> is a natural number.
                  The column to be interpreted as polygon size must contain the string <code>weight</code>.
                  The column to be interpreted as polygon color must contain the string <code>color</code>.
                </p>
              </li>

              <li>
                <p>
                  <strong>Use CSS3 strings for color specifications.</strong>
                </p>
              </li>
            </ul>
          </div>

          <hr/>

          <p>
            <strong>Tips:</strong>
          </p>

          <ul>
            <li>
              <p>
                <strong>Use formulas.</strong> If the weight or color of the polygon depends on some
                other properties of your data, use Excel or OpenOffice formulas to compute the CSS3
                color string.
              </p>
            </li>
          </ul>

          <hr/>
          <p class="Stamps">
            <a href="https://carrotsearch.com/foamtree/"
               title="Powered by FoamTree treemap visualization"
               className="PoweredBy Stamp"
               target="_blank" rel="noopener noreferrer">
              Powered by
              <FoamTreeLogo />
            </a>

            <a href="https://github.com/carrotsearch"
               title="Source code on GitHub"
               className="SourceCode Stamp"
               target="_blank" rel="noopener noreferrer">
              Source code
              <GitHubLogo />
            </a>
          </p>
        </div>

      </article>
  );
};

Welcome.propTypes = {
  visible: PropTypes.bool
};