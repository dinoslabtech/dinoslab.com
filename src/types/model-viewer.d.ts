declare namespace astroHTML.JSX {
  interface IntrinsicElements {
    "model-viewer": astroHTML.JSX.HTMLAttributes & {
      src?: string;
      alt?: string;
      "camera-controls"?: boolean;
      "touch-action"?: string;
      "camera-orbit"?: string;
      "camera-target"?: string;
      "interaction-prompt"?: string;
      "shadow-intensity"?: string;
      exposure?: string;
    };
  }
}
