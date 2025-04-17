export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	email: string;
	phone: string;
	address: string;
	payment: string;
	total: number;
	items: string[];
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: IProduct | null;
	order: IOrder | null;
}

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

export type FormError = Partial<Record<keyof OrderForm, string>>;

export type OrderSuccess = {
	id: string;
	total: number;
}