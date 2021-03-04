function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

const myDecorator = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) =>  {
  console.log('decorator');
}

@classDecorator
export class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
  }
}

@classDecorator
export class Rocket {
  @myDecorator
  launch() {
    return true
  }
}