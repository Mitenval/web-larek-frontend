import { IProduct } from "../types";
import { EVENT_TYPES } from "../utils/constants";
import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(blockName: string, container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>(`.${blockName}__list`, this.container);
		this._price = this.container.querySelector(`.${blockName}__price`);
		this._button = this.container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(EVENT_TYPES.ORDER_OPEN);
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
		}
		this._button.disabled = items.length ? false : true;
	}

	disableButton() {
		this._button.disabled = true
	}

	set total(total: number) {
		this.setText(this._price, `${total} синапсов`)
	}
}

interface IBasketItem extends IProduct{
	index: number;
}

interface IStoreItemBasketActions {
	onClick: (event: MouseEvent) => void;
}

export class BasketItem extends Component<IBasketItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(blockName: string, container: HTMLElement, action?: IStoreItemBasketActions) {
		super(container)

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container)
		this._index = ensureElement<HTMLElement>('.basket__item-index', container)
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container)
		this._button = container.querySelector(`.${blockName}__button`)

		if(this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove()
				action?.onClick(evt)
			})
		}

	}

	set index(value: number) {
		this.setText(this._index, (value + 1));
	}

	set price(value: number) {
		if(value === null) {
			this.setText(this._price, 'Бесценно')
		} else {
			this.setText(this._price, value + 'Синапсов')
		}
	}

	set title(value: string) {
		this.setText(this._title, value)
	}
}