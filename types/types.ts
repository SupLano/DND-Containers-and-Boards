export type ID = string | number;

export type Column = {
    Id: ID;
    title: string;
}

export type Task = {
    ID : ID,
    columnId: ID,
    content: string
}