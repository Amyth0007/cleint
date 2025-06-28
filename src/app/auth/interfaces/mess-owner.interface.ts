export interface MessOwner {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: 'mess_owner';
    createdAt?: Date;
    updatedAt?: Date;
} 