import { IProduct, IOrder, OrderSuccess } from "../../types";
import { Api, ApiListResponse } from "../base/api";

export interface IProductsApi {
	getProductsList: () => Promise<IProduct[]>;
	createOrder: (order: IOrder) => Promise<OrderSuccess>;
}

export class ProductsApi extends Api implements IProductsApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductsList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: `${this.cdn}${item.image}`,
			}))
		);
	}

	createOrder(order: IOrder): Promise<OrderSuccess> {
		return this.post('/order', order)
			.then((res: OrderSuccess) => res)
	}
}