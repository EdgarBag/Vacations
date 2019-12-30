import { Vacation } from "../models/vacation";
import { User } from "../models/user";
import { Follow } from "../models/follow";

export class AppState {
    public vacations: Vacation[] = [];
    public users: User[] = [];
    public followers: Follow[]
}