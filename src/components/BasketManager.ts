import { IProduct } from "../types";
import { TEMPLATES, EVENT_TYPES } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { BasketItem, Basket } from "./Basket";

interface IBasketManager {
	updateBasket(items: IProduct[]): void;
	clearCache(): void;
}

export class BasketManager implements IBasketManager {
	private itemsCache: Map<string, BasketItem>;

	constructor(private basket: Basket, private events: IEvents) {
		this.itemsCache = new Map<string, BasketItem>();
	}

	updateBasket(items: IProduct[]): void {
		const newItems = items.map((item, index) => {
			let basketItem = this.itemsCache.get(item.id);
			if (!basketItem) {
				basketItem = new BasketItem('card', cloneTemplate(TEMPLATES.CARD_BASKET_TEMPLATE), {
					onClick: () => this.events.emit(EVENT_TYPES.BASKET_REMOVE, item),
				});
				this.itemsCache.set(item.id, basketItem);
			}
			return basketItem.render({ ...item, index });
		});
		this.basket.items = newItems;
		this.basket.total = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	clearCache(): void {
		this.itemsCache.clear();
		this.basket.items = [];
		this.basket.total = 0;
	}
}