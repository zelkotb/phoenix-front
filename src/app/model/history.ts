export class History {
    id: number;
    operation: Operation;
    quantity: number;
    reference: string;
    name: string;
    date: string;
    status: Status;
}

export enum Operation {
    ALIMENTER, RETOURNER, FIN_SERIE
}

export enum Status {
    EN_ATTENTE, VALIDE, REFUSE
}