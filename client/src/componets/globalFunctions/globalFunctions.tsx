import { vacationsChekedFromLocalStorage } from "../home/home";

//Function-checking if user exist in localStorage to allow blocked pages access
export function logIn(userExist) {
    localStorage.setItem("currentUser", JSON.stringify(userExist));
};

//Delete user from localStorage and logout the user
export function logOut() {
    localStorage.removeItem("currentUser")
};

//Function getting info of customer from local storage
export function getCurrentUserObject() {
    return JSON.parse(localStorage.getItem("currentUser"));
};

//Function-cheking if user is Admin
export function isAdmin() {
    var userName = getCurrentUserObject();
    if (userName.typeOfUser === 1) {
        return true;
    }
}

//Function cheking if customer Onlne
export function isCustomerOnline() {
    const customerID = getCurrentUserObject();
    if (customerID !== null) {
        return true;
    }
}

export function checkIfvacationExistInLS(e) {
    for (let i = 0; i < vacationsChekedFromLocalStorage.length; i++) {
        const followUserID = vacationsChekedFromLocalStorage[i].followVacationID === e ? true : false;
        return followUserID;
    }
}

