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

export class UpdateAccountRequest {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
}

export class UpdateAccountResponse {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
    token: string;
}

export class GetAccountResponse {
    id: number;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city: string;
}

export class ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}