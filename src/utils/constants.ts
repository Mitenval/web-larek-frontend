import { ensureElement } from "./utils";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;


export const TEMPLATES = {
	CARD_PREVIEW_TEMPLATE: ensureElement<HTMLTemplateElement>('#card-preview'),
	CARD_CATALOG_TEMPLATE: ensureElement<HTMLTemplateElement>('#card-catalog'),
	CARD_BASKET_TEMPLATE: ensureElement<HTMLTemplateElement>('#card-basket'),
	BASKET_TEMPLATE: ensureElement<HTMLTemplateElement>('#basket'),
	ORDER_TEMPLATE: ensureElement<HTMLTemplateElement>('#order'),
	CONTACTS_TEMPLATE: ensureElement<HTMLTemplateElement>('#contacts'),
	SUCCESS_TEMPLATE: ensureElement<HTMLTemplateElement>('#success'),
} as const;

export const EVENT_TYPES = {
	CATALOG_CHANGE: 'catalog:change',
	CARD_SELECT: 'card:select',
	CARD_ADD: 'card:add',
	BASKET_OPEN: 'basket:open',
	BASKET_REMOVE: 'basket:remove',
	BASKET_CHANGE: 'basket:change',
	ORDER_OPEN: 'order:open',
	ORDER_SUBMIT: 'order:submit',
	CONTACTS_SUBMIT: 'contacts:submit',
	ORDER_ERRORS_CHANGE: 'orderErrors:change',
	CONTACTS_ERRORS_CHANGE: 'contactsErrors:change',
	MODAL_OPEN: 'modal:open',
	MODAL_CLOSE: 'modal:close',
	SUCCESS_CLOSE: 'success:close',
	FORM_INPUT_CHANGE: /^(order|contacts)\..*:change/,
} as const;

export const ERROR_MESSAGES = {
	ORDER_SUBMIT_FAILED: 'Ошибка при оформлении заказа',
	ADDRESS_REQUIRED: 'Необходимо указать адрес',
	PAYMENT_REQUIRED: 'Необходимо выбрать способ оплаты',
	EMAIL_REQUIRED: 'Необходимо указать email',
	PHONE_REQUIRED: 'Необходимо указать телефон',
} as const;

export const CATEGORY_COLOR_MAP: Record<string, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'дополнительное': 'additional',
	'кнопка': 'button',
	'другое': 'other',
} as const;