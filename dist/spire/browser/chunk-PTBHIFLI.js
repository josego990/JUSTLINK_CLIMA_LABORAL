import {
  animate,
  sequence,
  style,
  transition,
  trigger
} from "./chunk-75G4SHEF.js";

// src/app/shared/table.animations.ts
var rowsAnimation = trigger("rowsAnimation", [
  transition("void => *", [
    style({
      height: "*",
      opacity: "0",
      transform: "translateY(-50px)",
      "box-shadow": "none"
    }),
    sequence([
      animate(".30s ease", style({
        height: "*",
        opacity: ".2",
        transform: "translateY(0)",
        "box-shadow": "none"
      })),
      animate(".30s ease", style({ height: "*", opacity: 1, transform: "translateY(0)" }))
    ])
  ])
]);

export {
  rowsAnimation
};
//# sourceMappingURL=chunk-PTBHIFLI.js.map
