export class Product {
    id : number;
	name: string;
	description: string;
	quantity: number;
	category: string;
	price: string;
	reference: string;
	weight: string;
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
	operationQuantity: number
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
	operation: Operation;
}

export enum Operation{
	ALIMENTER, RETOURNER, FIN_SERIE
}