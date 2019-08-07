declare module "types" {
    export interface Dictionary<T> {
        [key: string]: T;
    }
}
declare module "sendthe" {
    import { Dictionary } from "types";
    const SendThe: (API?: {}) => {
        get: (name: any, params?: any, query?: any) => any[] | null;
        add: (name: any, endpoint: any) => void;
        cache: Dictionary<string[]>;
    };
    export default SendThe;
}
declare module "index.test" { }
declare module "index" {
    export { default as SendThe } from "sendthe";
}
