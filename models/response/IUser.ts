// models/response/IUser.ts
export interface IUser {
    id: number;
    email: string;
    isActivated: boolean;
    displayName?: string;
    displaySurname?: string;
    photoUrl?: string;
    role?: string;
    createdAt?: string;
    companyName?: string;
    profession?: string;
    inn?: number;
}