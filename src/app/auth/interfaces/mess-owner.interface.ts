import { userRole } from "./user.interface";

export interface MessOwner {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: userRole.mess_owner;
    createdAt?: Date;
    updatedAt?: Date;
} 