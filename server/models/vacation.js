class Vacation {
    constructor(vacationID, description, destination, nameOfIMG, dateFrom, dateTo, price) {
        this.vacationID = vacationID;
        this.description = description;
        this.destination = destination;
        this.nameOfIMG = nameOfIMG;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.price = price;
    }
}

module.exports = Vacation;