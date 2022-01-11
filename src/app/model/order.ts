import { ProductQuantity } from "../components/merchant/order/product-quantity/product-quantity.component";

export class CreateOrder {
    name: string;
    phone: string;
    city: string;
    address: string;
    price: number;
    brittle: boolean;
    open: boolean;
    date: string;
    comment: string;
    products: ProductQuantity[];
}