interface Observer<T = unknown> {
  update: (action: T)=> void;
}

export class Subject<T = unknown> {
  private _observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>) {
    this._observers.push(observer);
  }

  unsubscribe(observer: Observer<T>) {
    this._observers.filter(ob => ob !== observer);
  }

  notify(action: T) {
    this._observers.forEach(obs => obs.update(action));
  }
}

export class ConcreteObserver<T = unknown> implements Observer<T> {
  update(action: T): void {
    console.log(`Observer notified of ${action}`);
  }
}

interface UserAction {
  type: 'login' | 'logout';
  userId: string;
}
const subject = new Subject<UserAction>();
const observer1 = new ConcreteObserver<UserAction>();
const observer2 = new ConcreteObserver<UserAction>();

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.notify({ type: 'login', userId: '2' });
