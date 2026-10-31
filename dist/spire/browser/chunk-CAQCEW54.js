import {
  utils,
  writeFileSync
} from "./chunk-Y2ZBDXTZ.js";

// src/app/shared/tableExportUtil.ts
var getFileName = (name) => {
  const timeSpan = (/* @__PURE__ */ new Date()).toISOString();
  const sheetName = name || "ExportResult";
  const fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName
  };
};
var TableExportUtil = class {
  static exportToExcel(arr, name) {
    const { sheetName, fileName } = getFileName(name);
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(arr);
    utils.book_append_sheet(wb, ws, sheetName);
    writeFileSync(wb, `${fileName}.xlsx`);
  }
};

export {
  TableExportUtil
};
//# sourceMappingURL=chunk-CAQCEW54.js.map
