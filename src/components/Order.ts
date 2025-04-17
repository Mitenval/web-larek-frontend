import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";
import { OrderForm } from "../types";


export class Order extends Form<OrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected _selectedPayment = '';

	constructor(container: HTMLFormElement, evt: IEvents) {
		super(container, evt)

		this._card = ensureElement<HTMLButtonElement>('button[name="card"]', container);
		this._cash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
		this._address = ensureElement<HTMLInputElement>('input[name="address"]', container);

		if (this._card) {
			this._card.addEventListener('click', () => {
				this.togglePayment('card');
			})
		}

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this.togglePayment('cash')
			})
		}
	}

	togglePayment(payment: string) {
		this._selectedPayment = payment;
		if (payment === 'card') {
			this.toggleClass(this._card, 'button_alt-active', true);
			this.toggleClass(this._cash, 'button_alt-active', false);
		} else if (payment === 'cash') {
			this.toggleClass(this._cash, 'button_alt-active', true);
			this.toggleClass(this._card, 'button_alt-active', false);
		}
		this.onInputChange('payment', payment)
	}

	resetForm(): void {
		super.resetForm();
		this._selectedPayment = '';
		this.toggleClass(this._card, 'button_alt-active', false);
		this.toggleClass(this._cash, 'button_alt-active', false);
		this._address.value = '';
	}
}