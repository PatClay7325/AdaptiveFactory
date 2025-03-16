// Type declaration for JSON imports
declare module './mockDb.json' {
    const value: { [key: string]: any[] };
    export default value;
  }
  
  // Type declaration for any other JSON imports
  declare module '*.json' {
    const value: any;
    export default value;
  }