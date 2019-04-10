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

/**
 * 组件装饰器
 * @param options 组件装饰器参数
 */
export function component<T = any>(options?: any) {
    return function (constructor: new (...args: any[]) => any) {
      
    };
  }