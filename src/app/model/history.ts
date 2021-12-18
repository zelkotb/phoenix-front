export class History {
    id: string;
    operation: Operation;
    quantity: number;
    reference: string;
    date: string;
    status: Status;
}

export enum Operation {
    ALIMENTER, RETOURNER, FIN_SERIE
}

export enum Status {
    EN_ATTENTE, VALIDE, REFUSE
}