declare module "unidiff" {
  export function diffLines(oldStr: string, newStr: string, options?: any): any;
  export function formatLines(lines: any, options?: any): string;

  export function parsePatch(input: string): any;
  export function structuredPatch(
    oldFileName: string,
    newFileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: any
  ): any;
  export function unifiedDiff(...args: any[]): any;

  const _default: {
    diffLines: typeof diffLines;
    formatLines: typeof formatLines;
    parsePatch: typeof parsePatch;
    structuredPatch: typeof structuredPatch;
    unifiedDiff: typeof unifiedDiff;
  };
  export default _default;
}
