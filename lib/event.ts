type UnsubscriptionFunction = () => void;

type Listener<T> = {
  /**
   * Whether the listener should only be invoked one time and then be automatically unsubbed.
   */
  once: boolean;
  /**
   * The function that's invoked for this listener when the event is triggered.
   */
  handler: T;
};

/**
 * A generic object-oriented event. The event can take subscriptions and be triggered with or without args.
 */
export class Event<T extends (...args: any[]) => void> {
  private listeners: Listener<T>[];

  constructor() {
    this.listeners = [];
  }

  /**
   * Subscribes the provided `handler` to this event. When the event is `trigger`ed, it will invoke the `handler`.
   * 
   * @param handler - Function to invoke when the event is triggered.
   * 
   * @returns A function that can be called to unsubscribe your handler from the event. You should always unsubscribe
   * your handler when it's no longer needed.
   */
  subscribe(handler: T): UnsubscriptionFunction {
    this.listeners.push({
      once: false,
      handler: handler,
    });

    return () => {
      this.unsubscribe(handler);
    };
  }

  /**
   * Subscribes the provided `handler` to this event. When the event is `trigger`ed, it will invoke the `handler` and then
   * automatically unsubscribe it. Useful if you need to perform an action only once and not for subsequent `trigger`s.
   * 
   * @param handler - Function to invoke when the event is triggered.
   * 
   * @returns A function that can be called to unsubscribe your handler from the event. You should be sure to unsubscribe any `once`
   * handlers if there's a chance they didn't get invoked by the time you don't need them anymore. There is no negative 
   * effect for unsubscribing a handler that no longer exists on the event.
   */
  once(handler: T): UnsubscriptionFunction {
    this.listeners.push({
      once: true,
      handler,
    });

    return () => {
      this.unsubscribe(handler);
    };
  }

  /**
   * Unsubscribes the provided `handler` from the event. This is an alternative to calling unsubscription function
   * returned by `subscribe` and `once` should you have the reference for your handler and you prefer unsubscribing
   * this way.
   * 
   * @param handler - The `handler` reference you passed to `subscribe` or `once`.
   */
  unsubscribe(handler: T) {
    this.listeners = this.listeners.filter((l) => l.handler !== handler);
  }

  /**
   * Triggers the event, invoking all subscribed handlers.
   * 
   * @param args - The arguments to pass to every invoked handler for the event.
   */
  trigger(...args: Parameters<T>) {
    this.listeners.forEach((listener) => {
      listener.handler(...args);

      if (listener.once) {
        this.unsubscribe(listener.handler);
      }
    });
  }
}
