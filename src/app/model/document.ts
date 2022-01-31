import { History } from './history';
import { Login } from './login';
import { Operation } from './product';

export class Document {
    operations: number[];
    type: Operation;
}

export class DocumentResponse {
    id: number;
    operations: History[];
    type: Operation;
    email: string;
}

export class ValidateDocumentRequest{
    validate: boolean;
    id: Login;
    date: string;
}

export class DocumentHistory {
    id: string;
    type: Operation;
    date: string;
}

export class OrderDocument {
    operations: number[];
}