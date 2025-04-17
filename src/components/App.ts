import { EventEmitter } from "./base/events";
import { IProduct, OrderForm } from "../types";
import { TEMPLATES, EVENT_TYPES, ERROR_MESSAGES } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { ProductsApi } from "./api/ProductsApi";
import { AppState } from "./AppData";
import { Basket } from "./Basket";
import { Card } from "./Card";
import { Modal } from "./common/Modal";
import { Success } from "./common/Success";
import { Contacts } from "./Contacts";
import { Order } from "./Order";
import { Page } from "./Page";
import { BasketManager } from "./BasketManager";

export class App {
	private page: Page;
	private modal: Modal;
	private basket: Basket;
	private order: Order;
	private contacts: Contacts;
	private success: Success;
	private basketManager: BasketManager;

	constructor(
		private events: EventEmitter,
		private api: ProductsApi,
		private appData: AppState,
		page: Page,
		modal: Modal,
		basket: Basket,
		order: Order,
		contacts: Contacts,
		success: Success,
		basketManager: BasketManager
	) {
		this.page = page;
		this.modal = modal;
		this.basket = basket;
		this.order = order;
		this.contacts = contacts;
		this.success = success;
		this.basketManager = basketManager;

	}

	// Метод инициализации приложения
	init(): void {
		this.api.getProductsList()
			.then((data) => this.appData.setCatalog(data))
			.catch(console.error);
		this.setupEventListeners();
	}

	// Настройка всех обработчиков событий
	private setupEventListeners(): void {

		// Обновление каталог товаров на странице при изменении данных
		this.events.on(EVENT_TYPES.CATALOG_CHANGE, () => {
			this.page.catalog = this.appData.catalog.map((item) =>
				new Card('card', cloneTemplate(TEMPLATES.CARD_CATALOG_TEMPLATE), {
					onClick: () => this.events.emit(EVENT_TYPES.CARD_SELECT, item),
				}).render(item)
			);
		});

		// Отображение превью товара при выборе карточки
		this.events.on(EVENT_TYPES.CARD_SELECT, (item: IProduct) => {
			this.page.saveScrollPosition();
			this.appData.setPreview(item);
			const card = new Card('card', cloneTemplate(TEMPLATES.CARD_PREVIEW_TEMPLATE), {
				onClick: () => this.events.emit(EVENT_TYPES.CARD_ADD, item),
			});
			const isInBasket = this.appData.basket.some((basketItem) => basketItem.id === item.id);
			card.render(item);
			if (isInBasket) {
				card.setDisabled(card.button, true);
				card.buttonText = 'Нельзя купить';
			}
			this.renderModal(card);
			console.log(card.image);

		});

		// Добавление товара в корзину
		this.events.on(EVENT_TYPES.CARD_ADD, (item: IProduct) => {
			this.appData.addToBasket(item);
			this.page.counter = this.appData.basket.length;
			this.modal.close();
		});

		// Удаление товара из корзины
		this.events.on(EVENT_TYPES.BASKET_REMOVE, (item: IProduct) => {
			this.appData.removeFromBasket(item.id); // Удаляем товар из состояния
			this.page.counter = this.appData.getBasketItems(); // Обновляем счетчик
			this.basketManager.updateBasket(this.appData.basket); // Синхронизируем UI корзины
		});

		// Открытие корзины в модальном окне
		this.events.on(EVENT_TYPES.BASKET_OPEN, () => this.renderModal(this.basket));

		// Обновление содержимого корзины при изменении
		this.events.on(EVENT_TYPES.BASKET_CHANGE, () => this.basketManager.updateBasket(this.appData.basket));

		// Открывтие формы заказа
		this.events.on(EVENT_TYPES.ORDER_OPEN, () => {
			this.appData.clearOrder();
			this.order.resetForm();
			this.appData.validateOrder();
			this.renderModal(this.order, {
				address: this.appData.order.address,
				payment: this.appData.order.payment,
				valid: this.appData.validateOrder(),
				errors: Object.values(this.appData.formErrors).join('; '),
			});
		});

		// Переход к форме контактов
		this.events.on(EVENT_TYPES.ORDER_SUBMIT, () => {
			if (!this.appData.validateOrder()) return;
			this.appData.order.total = this.appData.getTotalPrice();
			this.appData.selected();
			this.contacts.clear();
			this.appData.validateContact();
			this.renderModal(this.contacts, {
				email: this.appData.order.email,
				phone: this.appData.order.phone,
				valid: this.appData.validateContact(),
				errors: Object.values(this.appData.formErrors).join('; '),
			});
		});

		// Оформление заказа
		this.events.on(EVENT_TYPES.CONTACTS_SUBMIT, () => this.submitOrder());

		// Обновление ошибок формы заказа
		this.events.on(EVENT_TYPES.ORDER_ERRORS_CHANGE, (errors: Partial<OrderForm>) =>
			this.updateFormState(this.order, errors)
		);

		// Обновление ошибок формы контактов
		this.events.on(EVENT_TYPES.CONTACTS_ERRORS_CHANGE, (errors: Partial<OrderForm>) =>
			this.updateFormState(this.contacts, errors)
		);

		// Обновление данных заказа при вводе в формы
		this.events.on(EVENT_TYPES.FORM_INPUT_CHANGE, (data: { field: keyof OrderForm; value: string }) =>
			this.appData.setOrderInput(data.field, data.value)
		);

		// Блокировка прокрутки страницы при открытии модального окна
		this.events.on(EVENT_TYPES.MODAL_OPEN, () => {
			this.page.saveScrollPosition();
			this.page.locked = true;
		});

		// Разблокируем прокрутки страницы
		this.events.on(EVENT_TYPES.MODAL_CLOSE, () => {
			this.page.locked = false;
			this.page.restoreScrollPosition();
		});
	}

	// Метод оформления заказа
	private async submitOrder(): Promise<void> {
		if (!this.appData.validateContact()) return;
		try {
			// Отправка заказа на сервер
			const orderData = this.appData.prepareOrder();
			await this.api.createOrder(orderData);

			// Показ успешного оформления
			this.success.total = orderData.total;
			this.renderModal(this.success, { total: orderData.total });

			// Сброс состояния
			this.appData.clearAll();
			this.basketManager.clearCache();
			this.page.counter = this.appData.getBasketItems();
			this.order.resetForm();
			this.contacts.resetForm();
			this.events.emit(EVENT_TYPES.BASKET_CHANGE);
		} catch (error) {
			this.contacts.errors = ERROR_MESSAGES.ORDER_SUBMIT_FAILED;
			console.error('Ошибка оформления:', error);
		}

		this.events.on(EVENT_TYPES.SUCCESS_CLOSE, () => this.modal.close());
	}

	// Универсальный метод для рендеринга модального окна
	private renderModal(content: { render: (data?: any) => HTMLElement }, state?: any): void {
		this.modal.render({ content: state ? content.render(state) : content.render() });
	}

	// Обновление состояния формы
	private updateFormState(form: Order | Contacts, errors: Partial<OrderForm>): void {
		const errorValues = Object.values(errors).filter(Boolean);
		form.valid = errorValues.length === 0;
		form.errors = errorValues.join(';');
	}
}