declare module 'types' {
  export interface Dictionary<T> {
    [key: string]: T;
  }
}
declare module 'sendthe' {
  const SendThe: {
    (name: any, params?: any, query?: any): any;
    add(name: any, endpoint: any): void;
  };
  export default SendThe;
}
declare module 'index.test' {}
