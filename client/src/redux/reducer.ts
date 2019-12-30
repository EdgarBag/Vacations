import { AppState } from "./appState";
import { AnyAction } from "redux";
import { ActionType } from "./actionType";


export function reducer(oldAppState: AppState | undefined, action: AnyAction): AppState {
    if (!oldAppState) {
        return new AppState();
    }
    const newAppState = { ...oldAppState };

    switch (action.type) {

        case ActionType.GetAllVacations:
            newAppState.vacations = action.payload;
            break;

        case ActionType.GetAllUsers:
            newAppState.users = action.payload;
            break;

        case ActionType.GetAllFollowers:
            newAppState.users = action.payload;
            break;


        case ActionType.AddVacation:
            newAppState.vacations.unshift(action.payload);
            break;

        case ActionType.UpdateVacation:
            var updatedVacation = action.payload;
            let index = 0;
            for (var i = 0; newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].vacationID === action.payload.vacationID) {
                    index = i;
                    break;
                }
            }
            newAppState.vacations[index] = updatedVacation;
            break;

        case ActionType.DeleteVacation:
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].vacationID === action.payload) {
                    newAppState.vacations.splice(i, 1);
                    break;
                }
            }

            break;

    }
    return newAppState;

}