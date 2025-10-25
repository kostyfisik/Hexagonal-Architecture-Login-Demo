/**
 * Simple type-safe event emitter for application events
 */
export type EventHandler<T = any> = (data: T) => void;

export class EventEmitter<TEvents extends Record<string, any>> {
  private listeners: Map<keyof TEvents, Set<EventHandler>> = new Map();

  /**
   * Subscribe to an event
   * @param eventName The name of the event to listen to
   * @param handler The callback function to execute when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  on<K extends keyof TEvents>(eventName: K, handler: EventHandler<TEvents[K]>): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    
    this.listeners.get(eventName)!.add(handler);
    
    // Return unsubscribe function
    return () => this.off(eventName, handler);
  }

  /**
   * Unsubscribe from an event
   * @param eventName The name of the event
   * @param handler The callback function to remove
   */
  off<K extends keyof TEvents>(eventName: K, handler: EventHandler<TEvents[K]>): void {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit an event to all subscribers
   * @param eventName The name of the event to emit
   * @param data The data to pass to event handlers
   */
  emit<K extends keyof TEvents>(eventName: K, data: TEvents[K]): void {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[EventEmitter] Error in event handler for ${String(eventName)}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for a specific event or all events
   * @param eventName Optional event name. If not provided, removes all listeners
   */
  clear<K extends keyof TEvents>(eventName?: K): void {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }
}
