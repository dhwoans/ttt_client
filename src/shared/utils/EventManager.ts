type EventCallback = (data: any) => void;

class EventManager {
  private events: Record<string, EventCallback[]>;

  constructor() {
    this.events = {};
  }

  on(eventName: string, callback: EventCallback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: EventCallback): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback,
      );
    }
  }

  emit(eventName: string, data: any): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data));
    }
  }
}

export const eventManager = new EventManager();
