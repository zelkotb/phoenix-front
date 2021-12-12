export class Product {
    id : number;
	name: string;
	description: string;
	quantity: number;
	category: string;
	price: number;
	reference: string;
	weight: number;
	quantityPhoenix: number;
}

export class CreateProduct {
	name: string;
	description: string;
	quantity: number;
	category: string;
	price: number;
	reference: string;
	weight: number;
    date: string;
	quantityPhoenix: number
}

export class UpdateProduct {
	name: string;
	description: string;
	category: string;
	price: number;
	reference: string;
	weight: number;
}


export class UpdateQuantity {
	quantity: number;
    date: string;
}