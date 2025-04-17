import { IOrder } from "../../types";
import { EVENT_TYPES } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface ISuccess {
	total: IOrder['total'];
}
export class Success extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected _close: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container)
		this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

		this._close.addEventListener('click', () => events.emit(EVENT_TYPES.SUCCESS_CLOSE))
	}

	set total(value: IOrder['total']) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}