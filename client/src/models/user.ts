export class User {
    public constructor(
        public typeOfUser?: number,
        public userFirstName: string = "",
        public userSecondName: string = "",
        public userName: string = "",
        public userPassword: string = "",
    ) { }
}