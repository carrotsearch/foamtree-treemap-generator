import { persistentStore } from "./carrotsearch/util/persistent-store.js";
import { store } from 'react-easy-state';

export const settingsStore = persistentStore("treemapConfig",
    {
      "stacking": "flattened-stab",
      "layout": "relaxed",
      "showPathInTitleBar": false
    }
);

export const logStore = store({
  entries: []
});