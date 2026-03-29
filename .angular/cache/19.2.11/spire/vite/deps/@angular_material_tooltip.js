import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatTooltip,
  MatTooltipModule,
  SCROLL_THROTTLE_MS,
  TOOLTIP_PANEL_CLASS,
  TooltipComponent,
  getMatTooltipInvalidPositionError
} from "./chunk-3XDBVA6X.js";
import "./chunk-YWKBOROT.js";
import "./chunk-OZ7C5UV6.js";
import "./chunk-PFONXOAX.js";
import "./chunk-OIBNGD5S.js";
import "./chunk-XPDLXDVA.js";
import "./chunk-42FJBLFI.js";
import "./chunk-GV5LUSDY.js";
import "./chunk-OTB5LYNR.js";
import "./chunk-O4U5JBOQ.js";
import "./chunk-HLX6YUUY.js";
import "./chunk-MMVZ32PN.js";
import "./chunk-DSSDW2YN.js";
import "./chunk-KQB4LJPA.js";
import "./chunk-PIYZR644.js";
import "./chunk-2O4WY5GE.js";
import "./chunk-PJ2U5DKU.js";
import "./chunk-QPYGKNNE.js";
import "./chunk-CORJMSJK.js";
import "./chunk-MQUILGSN.js";
import "./chunk-HNQM4JWI.js";
import "./chunk-IJBUEUEZ.js";
import "./chunk-WTTAYEQT.js";
import "./chunk-2IQXLFEV.js";
import "./chunk-ISM5WLAM.js";
import "./chunk-IC62NIWK.js";
import "./chunk-ZZ67MR3E.js";
import "./chunk-IIGRIO22.js";

// node_modules/@angular/material/fesm2022/tooltip.mjs
var matTooltipAnimations = {
  // Represents:
  // trigger('state', [
  //   state('initial, void, hidden', style({opacity: 0, transform: 'scale(0.8)'})),
  //   state('visible', style({transform: 'scale(1)'})),
  //   transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
  //   transition('* => hidden', animate('75ms cubic-bezier(0.4, 0, 1, 1)')),
  // ])
  /** Animation that transitions a tooltip in and out. */
  tooltipState: {
    type: 7,
    name: "state",
    definitions: [{
      type: 0,
      name: "initial, void, hidden",
      styles: {
        type: 6,
        styles: {
          opacity: 0,
          transform: "scale(0.8)"
        },
        offset: null
      }
    }, {
      type: 0,
      name: "visible",
      styles: {
        type: 6,
        styles: {
          transform: "scale(1)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "* => visible",
      animation: {
        type: 4,
        styles: null,
        timings: "150ms cubic-bezier(0, 0, 0.2, 1)"
      },
      options: null
    }, {
      type: 1,
      expr: "* => hidden",
      animation: {
        type: 4,
        styles: null,
        timings: "75ms cubic-bezier(0.4, 0, 1, 1)"
      },
      options: null
    }],
    options: {}
  }
};
export {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatTooltip,
  MatTooltipModule,
  SCROLL_THROTTLE_MS,
  TOOLTIP_PANEL_CLASS,
  TooltipComponent,
  getMatTooltipInvalidPositionError,
  matTooltipAnimations
};
//# sourceMappingURL=@angular_material_tooltip.js.map
