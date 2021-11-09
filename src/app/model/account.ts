export class AccountTable {
    id: number;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
    roles: string;
}

export class Account {
    id: number;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
    roles: string[];
}