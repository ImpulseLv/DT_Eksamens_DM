
export enum AnimalStatuss {
    free = "free",
    taken = "taken",
    notVerified = "notVerified",
    booked = "booked"
}

export interface Animal{
    id: number | null;
    name: string;
    type: string;
    statuss: AnimalStatuss;
    date_of_birth: string;
    gender: string;
    creationDate:number;
    update_date: number;
    owner_id: number | null;
    price: number;
    takenBy: number;
}