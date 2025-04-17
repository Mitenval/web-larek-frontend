/**
 * Абстрактный компонент UI-элемента
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	/**
	 * Переключает класс на элементе
	 */
	toggleClass(el: HTMLElement, cls: string, force?: boolean): void {
		el.classList.toggle(cls, force);
	}

	/**
	 * Устанавливает текст в элемент
	 */
	protected setText(el: HTMLElement, value: unknown): void {
		if (el) {
			el.textContent = String(value ?? '');
		}
	}

	/**
	 * Делает элемент неактивным или активным
	 */
	setDisabled(el: HTMLElement, disabled: boolean): void {
		if (!el) return;
		if (disabled) {
			el.setAttribute('disabled', 'disabled');
		} else {
			el.removeAttribute('disabled');
		}
	}

	/**
	 * Скрывает элемент (display: none)
	 */
	protected setHidden(el: HTMLElement): void {
		el.style.display = 'none';
	}

	/**
	 * Показывает элемент, убирая display
	 */
	protected setVisible(el: HTMLElement): void {
		el.style.removeProperty('display');
	}

	/**
	 * Устанавливает источник изображения и alt
	 */
	protected setImage(el: HTMLImageElement, src: string, alt?: string): void {
		if (!el) return;
		el.src = src;
		if (alt !== undefined) {
			el.alt = alt;
		}
	}

	/**
	 * Обновляет данные компонента и возвращает его контейнер
	 */
	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this, data);
		}
		return this.container;
	}
}
