// Типы лучше выносить отдельно — удобнее масштабировать
type EventName = string | RegExp;
type Subscriber = (...args: any[]) => void;
type EmitterEvent = {
    eventName: string;
    data: unknown;
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Класс EventEmitter — простая реализация паттерна наблюдателя.
 */
export class EventEmitter implements IEvents {
    private readonly _events = new Map<EventName, Set<Subscriber>>();

    /**
     * Добавляет обработчика на событие
     */
    on<T extends object>(event: EventName, callback: (data: T) => void): void {
        if (!this._events.has(event)) {
            this._events.set(event, new Set());
        }
        this._events.get(event)?.add(callback);
    }

    /**
     * Удаляет обработчика с события
     */
    off(event: EventName, callback: Subscriber): void {
        const subs = this._events.get(event);
        if (!subs) return;

        subs.delete(callback);

        if (subs.size === 0) {
            this._events.delete(event);
        }
    }

    /**
     * Вызывает обработчики события
     */
    emit<T extends object>(event: string, payload?: T): void {
        for (const [name, handlers] of this._events.entries()) {
            const match =
              (typeof name === 'string' && name === event) ||
              (name instanceof RegExp && name.test(event)) ||
              name === '*';

            if (!match) continue;

            for (const handler of handlers) {
                if (name === '*') {
                    handler({ eventName: event, data: payload });
                } else {
                    handler(payload);
                }
            }
        }
    }

    /**
     * Добавляет обработчика на все события
     */
    onAll(callback: (evt: EmitterEvent) => void): void {
        this.on('*', callback);
    }

    /**
     * Удаляет все обработчики
     */
    offAll(): void {
        this._events.clear();
    }

    /**
     * Генерирует коллбек, инициирующий событие
     */
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void {
        return (data: T = {} as T) => {
            this.emit(event, { ...context, ...data });
        };
    }
}
