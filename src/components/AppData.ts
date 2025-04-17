import { FormError, IAppState, IProduct, IOrder, OrderForm } from "../types";
import { ERROR_MESSAGES, EVENT_TYPES } from "../utils/constants";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	basket: IProduct[] = [];
	preview: IProduct['id'] | null = null;
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: 0,
		items: [],
	};
	formErrors: FormError = {};

	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges(EVENT_TYPES.CATALOG_CHANGE);
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
	}

	addToBasket(item: IProduct) {
		this.basket = [...this.basket, item];
		this.emitChanges(EVENT_TYPES.BASKET_CHANGE);
	}

	removeFromBasket(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges(EVENT_TYPES.BASKET_CHANGE);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges(EVENT_TYPES.BASKET_CHANGE);
	}

	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
			total: 0,
			items: [],
		};
		this.formErrors = {};
		this.emitChanges(EVENT_TYPES.ORDER_ERRORS_CHANGE, this.formErrors);
		this.emitChanges(EVENT_TYPES.CONTACTS_ERRORS_CHANGE, this.formErrors);
	}

	clearAll() {
		this.clearBasket();
		this.clearOrder();
	}

	getTotalPrice(): IOrder['total'] {
		return this.basket.reduce((total, item) => total + (item.price || 0), 0);
	}

	getBasketItems() {
		return this.basket.length;
	}

	selected(): void {
		this.order.items = this.basket.map((items) => items.id);
	}

	prepareOrder(): IOrder {
		this.selected();
		this.order.total = this.getTotalPrice();
		return this.order;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = ERROR_MESSAGES.ADDRESS_REQUIRED;
		}
		if (!this.order.payment) {
			errors.payment = ERROR_MESSAGES.PAYMENT_REQUIRED;
		}

		this.formErrors = errors;
		this.emitChanges(EVENT_TYPES.ORDER_ERRORS_CHANGE, this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
		}
		if (!this.order.phone) {
			errors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
		}

		this.formErrors = errors;
		this.emitChanges(EVENT_TYPES.CONTACTS_ERRORS_CHANGE, this.formErrors);

		return Object.keys(errors).length === 0;
	}

	setOrderInput(field: keyof OrderForm, value: string) {
		if (field === 'email' || field === 'phone') {
			this.order[field] = value;
			this.validateContact();
		} else {
			this.order[field] = value;
			this.validateOrder();
		}
	}
}