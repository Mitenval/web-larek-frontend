import { EVENT_TYPES } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	private scrollPosition = 0;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._catalog = ensureElement<HTMLElement>('.gallery');

		this._basket.addEventListener('click', () => {
			this.events.emit(EVENT_TYPES.BASKET_OPEN);
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set locked(value: boolean) {
		if (value === true) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}

	saveScrollPosition() {
		this.scrollPosition = window.scrollY;
	}

	restoreScrollPosition() {
		window.scrollTo({
			top: this.scrollPosition,
			behavior: 'auto'
		});
	}
}