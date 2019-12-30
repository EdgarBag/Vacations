export class Vacation {
    public constructor(
        public vacationID: number = 0,
        public description: string = "",
        public destination: string = "",
        public nameOfIMG: string = "",
        public dateFrom: string = "",
        public dateTo: string = "",
        public price: number = 0
    ) { }
}