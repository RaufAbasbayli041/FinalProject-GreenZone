declare module "next" {
  export type Metadata = Record<string, any>
}
declare module "next/*" {
  const x: any
  export default x
}