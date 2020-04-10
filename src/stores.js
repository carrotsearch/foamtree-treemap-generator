import { persistentStore } from "./carrotsearch/util/persistent-store.js";

export const settingsStore = persistentStore("treemapConfig",
    {
      "stacking": "flattened"
    }
);
