interface IDo {
    do(): void;
}

export class Demo implements IDo {
    do() {
        console.log('do something');
    }
}