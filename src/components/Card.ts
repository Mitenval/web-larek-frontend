import { IProduct } from "../types";
import { CATEGORY_COLOR_MAP } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	id: IProduct['id'];
	description: IProduct['description'];
	image: IProduct['image'];
	title: IProduct['title'];
	category: IProduct['category'];
	price: IProduct['price'];
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	button: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._description = container.querySelector(`.card__text`);
		this._price = container.querySelector(`.${blockName}__price`);
		this.button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: IProduct['id']) {
		this.container.dataset.id = value;
	}

	get id(): IProduct['id'] {
		return this.container.dataset.id || '';
	}

	set title(value: IProduct['title']) {
		this.setText(this._title, value);
	}

	get title(): IProduct['title'] {
		return this._title.textContent;
	}

	set description(value: IProduct['description']) {
		this.setText(this._description, value);
	}

	set image(value: IProduct['image']) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: IProduct['price']) {
		this.setText(this._price, value ? `${value} синапсов` : `Бесценно`);
		if (this.button) {
			if (value === null) {
				this.setDisabled(this.button, true);
			} else {
				this.setDisabled(this.button, false);
			}
		}
	}

	set category(value: IProduct['category']) {
		this.setText(this._category, value);
		const colorClass = CATEGORY_COLOR_MAP[value.toLowerCase()] || 'default';
		this._category.className = `card__category card__category_${colorClass}`;
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set buttonText(value: string) {
		if (this.button) {
			this.setText(this.button, value);
		}
	}

	setDisabled(element: HTMLElement, state: boolean): void {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

}