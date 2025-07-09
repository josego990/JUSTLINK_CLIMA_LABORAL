import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-7GHIE4LF.js";
import "./chunk-YTOFZCNT.js";
import "./chunk-R4QB32YE.js";
import "./chunk-565HCF7A.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-QNJ37ECC.js";
import "./chunk-WWSOESXV.js";
import "./chunk-JZNJFBOG.js";
import "./chunk-7BL5JATI.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-B26O4DSU.js";
import "./chunk-IMRQAWFM.js";
import "./chunk-OIM6NNUD.js";
import "./chunk-5M7LWBGS.js";
import "./chunk-FJUXMR4P.js";
import "./chunk-VL7QC4A6.js";
import "./chunk-YWKBOROT.js";
import "./chunk-OZ7C5UV6.js";
import "./chunk-56RTCAX2.js";
import "./chunk-XPDLXDVA.js";
import "./chunk-42FJBLFI.js";
import "./chunk-GV5LUSDY.js";
import "./chunk-445OEVKI.js";
import "./chunk-7V3BBJVU.js";
import "./chunk-R5QKVC3V.js";
import "./chunk-MMVZ32PN.js";
import "./chunk-BPVAK5EC.js";
import "./chunk-DSSDW2YN.js";
import "./chunk-KQB4LJPA.js";
import "./chunk-CORJMSJK.js";
import "./chunk-MQUILGSN.js";
import "./chunk-CDKGSVIP.js";
import "./chunk-2O4WY5GE.js";
import "./chunk-PJ2U5DKU.js";
import "./chunk-QPYGKNNE.js";
import "./chunk-ENAXULGO.js";
import "./chunk-IJBUEUEZ.js";
import "./chunk-WTTAYEQT.js";
import "./chunk-2IQXLFEV.js";
import "./chunk-IC62NIWK.js";
import "./chunk-ISM5WLAM.js";
import "./chunk-ZZ67MR3E.js";
import "./chunk-IIGRIO22.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanelWrap', [
  //   transition('* => void', query('@transformPanel', [animateChild()], {optional: true})),
  // ])
  /**
   * This animation ensures the select's overlay panel animation (transformPanel) is called when
   * closing the select.
   * This is needed due to https://github.com/angular/angular/issues/23302
   */
  transformPanelWrap: {
    type: 7,
    name: "transformPanelWrap",
    definitions: [{
      type: 1,
      expr: "* => void",
      animation: {
        type: 11,
        selector: "@transformPanel",
        animation: [{
          type: 9,
          options: null
        }],
        options: {
          optional: true
        }
      },
      options: null
    }],
    options: {}
  },
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [{
      type: 0,
      name: "void",
      styles: {
        type: 6,
        styles: {
          opacity: 0,
          transform: "scale(1, 0.8)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "void => showing",
      animation: {
        type: 4,
        styles: {
          type: 6,
          styles: {
            opacity: 1,
            transform: "scale(1, 1)"
          },
          offset: null
        },
        timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
      },
      options: null
    }, {
      type: 1,
      expr: "* => void",
      animation: {
        type: 4,
        styles: {
          type: 6,
          styles: {
            opacity: 0
          },
          offset: null
        },
        timings: "100ms linear"
      },
      options: null
    }],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
