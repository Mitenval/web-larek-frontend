import { IEvents } from './events';

/**
 * Проверка, является ли объект моделью
 */
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};

/**
 * Абстрактная базовая модель, отличающаяся от обычных DTO
 */
export abstract class Model<T> {
	protected constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	/**
	 * Уведомляет подписчиков об изменениях
	 */
	emitChanges(event: string, payload?: object): void {
		this.events.emit(event, payload || {});
	}
}
