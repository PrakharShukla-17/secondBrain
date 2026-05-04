//solved step 8 problem via 
//You want to create a custom definition, and use a feature in Typescript called Declaration Merging. This is commonly used, e.g. in method-override.
//ref:StackOverflow

// Source - https://stackoverflow.com/a/40762463
// Posted by maximilianvp, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-02, License - CC BY-SA 4.0

declare namespace Express {
   export interface Request {
      userId?: string
   }
}
