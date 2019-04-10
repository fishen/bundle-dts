interface IDo {
    do(): void;
}

export class Demo implements IDo {
    do() {
        console.log('do something');
    }
}

export abstract class ADemo {

}