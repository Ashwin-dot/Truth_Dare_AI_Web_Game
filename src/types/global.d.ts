// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      alt?: string;
      "camera-position"?: string;
      "auto-rotate"?: boolean;
      ar?: boolean;
      "ar-modes"?: string;
    };
  }
}
