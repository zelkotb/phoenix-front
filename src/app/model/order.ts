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

export class Order {
    id: number;
    name: string;
    phone: string;
    city: string;
    address: string;
    price: number;
    brittle: boolean;
    open: boolean;
    date: string;
    comment: string;
    status: OrderStatus;
    products: ProductQuantity[];
    documentId: number;
}

export class RefuseOrderRequest {
    comment: string;
}

export class CommentResponse{
    comment: string;
    id: string;
}

export enum OrderStatus{
    EN_ATTENTE, EN_ATTENTE_RAMASSAGE, RAMASSE, EXPEDITE, IN_DISTRIBUTION, LIVRE, ANNULE, REFUSE
}