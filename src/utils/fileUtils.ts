import { extname } from "path";

export function isTypeScriptFile(filename: string): boolean {
  const ext: string = extname(filename);
  return ext.endsWith(".ts") && !ext.endsWith(".d.ts");
}
