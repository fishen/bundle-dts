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
    export {};
}
declare module "examples" {
    export { Person } from 'examples/person';
    export { Demo } from 'examples/demo';
}