import { genModule } from "@proxtx/combine/combine.js";
import { genCombine } from "@proxtx/combine-rest/request.js";
import config from "@proxtx/config";
import fs from "fs/promises";

export class Trigger {
  filesInFolder = {};

  constructor(triggerConfig, folder) {
    this.folder = folder;
    this.config = triggerConfig;

    (async () => {
      this.api = await genCombine(
        this.config.url + "/",
        "public/manager.js",
        genModule
      );

      this.html = await fs.readFile(this.folder + "index.html", "utf8");
      this.handler = await fs.readFile(this.folder + "handler.js", "utf8");
    })();
  }

  getSelectionGui = async () => {
    return {
      html: this.html,
      handler: this.handler,
      data: {},
    };
  };

  triggers = async (data, triggerConfig) => {
    try {
      let files = (
        await this.api.listDirectory(this.config.pwd, data.path)
      ).directory.map((v) => v.name);
      if (!this.filesInFolder[triggerConfig.id]) {
        this.filesInFolder[triggerConfig.id] = files;
        return false;
      }

      for (let file of files) {
        if (!this.filesInFolder[triggerConfig.id].includes(file)) {
          this.filesInFolder[triggerConfig.id] = files;
          return true;
        }
      }

      this.filesInFolder[triggerConfig.id] = files;
    } catch {
      return false;
    }

    return false;
  };
}
