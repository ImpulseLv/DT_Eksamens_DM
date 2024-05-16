
export enum AnimalStatuss {
    free = "free",
    taken = "taken",
    booked = "booked"
}

export interface Animal{
    id: number | null;
    name: string;
    type: string;
    statuss: AnimalStatuss;
    date_of_birth: string;
    gender: string;
    creation_date:number;
    update_date: number;
    owner_id: number | null;
}