declare module "examples/person" {
    export class Person {
        name: string;
        age: number;
        gender: boolean;
        address: string;
    }
}
declare module "examples/demo" {
    interface IDo {
        do(): void;
    }
    export class Demo implements IDo {
        do(): void;
    }
    export abstract class ADemo {
    }
    /**
     * 组件装饰器
     * @param options 组件装饰器参数
     */
    export function component<T = any>(options?: any): (constructor: new (...args: any[]) => any) => void;
    export {};
}
declare module "examples" {
    export { Person } from 'examples/person';
    export { Demo } from 'examples/demo';
}