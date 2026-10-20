// Minimal ambient types for the Node built-ins used by noscroll.test.ts,
// so the app typechecks without pulling @types/node into its dependencies.
declare module "node:fs" {
  export function readFileSync(path: string, encoding: "utf8"): string;
}
declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}
declare module "node:path" {
  export function dirname(path: string): string;
  export function join(...paths: string[]): string;
}
