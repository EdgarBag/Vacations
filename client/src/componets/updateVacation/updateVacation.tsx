import React, { Component } from 'react';
import "./updateVacation.css";
import { Vacation } from "../../models/vacation";
import { Heading } from "../heading/heading";
import { ActionType } from '../../redux/actionType';
import { store } from '../../redux/store';
import { getCurrentUserObject, isAdmin } from '../globalFunctions/globalFunctions';
import { Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client';

let socket: any;

interface UpdateVacaionState {
    vacations: Vacation[];
    vacation: Vacation;
    vacationUpdated: Vacation;
    vacationID: number;
    errors: {
        descriptionError: string;
        destinationError: string;
        imgError: string;
        dateFromError: string;
        dateToError: string;
        priceError: string;
    }

}

export class Update extends Component<any, UpdateVacaionState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: [],
            vacation: new Vacation(),
            vacationUpdated: new Vacation(),
            vacationID: 0,
            errors: {
                descriptionError: "*",
                destinationError: "*",
                imgError: "*",
                dateFromError: "*",
                dateToError: "*",
                priceError: "*"
            }


        };
    }

    public render(): JSX.Element {

        //Checks if user have permission to access the page
        if (getCurrentUserObject() === null || !isAdmin()) {
            alert("Only an authorized Admin can see this page!");
            return <Redirect to="/home" exact />;
        }


        return (
            <div className="updateVacation" >

                <Heading>Update Vacation</Heading>

                <NavLink to="/home" exact activeClassName="active-link" className="backToAllVacations">
                    <p>back to  All vacations</p >
                </NavLink>

                <div className="selectedVacation">
                    <h2>Selected Vacation:</h2>
                    <div className="vacationDivOld" >

                        <h5>destination:{this.state.vacation.destination}</h5>
                        <h5>description:<div className="descriptionH">{this.state.vacation.description}</div></h5>
                        <h4>img:{<img src="/assets/images/vac1.jpg" alt={"imgInfo"} />}</h4>
                        <div className="dates">
                            <h6 className="dateFromH">From:{this.formatDate(this.state.vacation.dateFrom)} &#8658; </h6>
                            <h6 className="dateToH">To:{this.formatDate(this.state.vacation.dateTo)}</h6><br />
                            <h6 className="priceH">Price:{this.state.vacation.price} &#36;</h6>

                        </div>
                    </div>
                </div>
                <div className="insertUpdates">
                    <h2>Please insert updates:</h2>
                    <div className="vacationTochange">
                        <form>
                            <div className="vacationToChangeUpdates">

                                <label> Destination:</label><br />
                                <input type="text" placeholder="Destination..." onChange={this.setDestination} value={this.state.vacationUpdated.destination} />
                                <span>{this.state.errors.destinationError}</span><br />

                                <label> Description:</label><br />
                                <textarea placeholder="Description..." cols={5} rows={3} onChange={this.setDescription} value={this.state.vacationUpdated.description} />
                                <span>{this.state.errors.descriptionError}</span><br />

                                <label> Image:</label><br />
                                <input type="file" onChange={this.setImage} value={this.state.vacationUpdated.nameOfIMG} />
                                <span>{this.state.errors.imgError}</span><br />

                                <label> Date From:</label><br />
                                <input type="date" onChange={this.setDateFrom} value={this.state.vacationUpdated.dateFrom} />
                                <span>{this.state.errors.dateFromError}</span><br />

                                <label> Date To:</label><br />
                                <input type="date" onChange={this.setDateTo} value={this.state.vacationUpdated.dateTo} />
                                <span>{this.state.errors.dateToError}</span><br />

                                <label> Price:</label><br />
                                <input type="text" onChange={this.setPrice} value={this.state.vacationUpdated.price} />
                                <span>{this.state.errors.priceError}</span><br /><br />

                            </div>
                            <button type="button" disabled={!this.isFormLegal()} onClick={this.updateVacationButton} className="btn btn-success btnAddVacation">update vacation</button>

                        </form>
                    </div>
                </div>

            </div >
        )
    }


    public componentDidMount() {

        socket = io.connect('http://localhost:3001');
        socket.on('admin-made-changes', (vacations: Vacation[]): void => {
            const action = { type: ActionType.GetAllVacations, payload: vacations };
            store.dispatch(action);
        });

        const id = +this.props.match.params.vacID;
        this.setState({ vacationID: id });

        fetch("http://localhost:3001/api/vacations/")
            .then(response => response.json())
            .then(vacations => {
                const vacation = vacations.find((e: Vacation) => e.vacationID === id);
                this.setState({ vacation });
            })
            .catch(err => alert(err));
    }

    //Function - Update vacation
    private updateVacationButton = (): void => {
        if (window.confirm("Are you sure you want to update this vacation? ") === true) {
            socket = io.connect('http://localhost:3001');
            fetch("http://localhost:3001/api/vacations/" + this.state.vacationID, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(this.state.vacationUpdated)
            })
                .then(response => response.json())
                .then(vacation => {
                    alert("You have successfully updated vacation to " + vacation.destination);
                    const action = { type: ActionType.UpdateVacation, payload: vacation };
                    store.dispatch(action);
                    this.vacationEmit();
                    this.props.history.push("/home");
                })
                .catch(err => alert(err));
        } else {
            this.props.history.push("/home");
        }
    }

    //Sending changes to server
    public vacationEmit = (): void => {
        socket.emit("admin-made-changes");
    }


    private formatDate(date: string): string {
        const d = new Date(date);
        let day: any = d.getDate();
        let month: any = (d.getMonth() + 1);
        const year = d.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        return month + "/" + day + "/" + year;
    }

    // Getting description of new vacation
    public setDestination = (e: any): void => {
        const destination = e.target.value;
        let errorMessage = "";
        if (destination === "") { errorMessage = "Missing destination." }
        else if (destination.length > 40) { errorMessage = "Description tool long." }
        this.setState({ vacationUpdated: { ...this.state.vacationUpdated, destination } });
        const errors = { ...this.state.errors };
        errors.destinationError = errorMessage;
        this.setState({ errors });
    }

    // Getting destination of new vacation
    public setDescription = (e: any): void => {
        const description = e.target.value;
        let errorMessage = "";
        if (description === "") { errorMessage = "Missing description." }
        else if (description.length > 60) { errorMessage = "Description too long" }
        this.setState({ vacationUpdated: { ...this.state.vacationUpdated, description } });
        const errors = { ...this.state.errors };
        errors.descriptionError = errorMessage;
        this.setState({ errors });
    }

    // Getting image of new vacation
    public setImage = (e: any): void => {
        const nameOfIMG = e.target.value;
        this.setState({ vacationUpdated: { ...this.state.vacationUpdated, nameOfIMG } })
    }

    // Getting dateFrom of new vacation
    public setDateFrom = (e: any): void => {
        const dateFrom = e.target.value;
        let errorMessage = "";
        if (dateFrom === "") { errorMessage = "Missing date." }
        this.setState({ vacationUpdated: { ...this.state.vacationUpdated, dateFrom } });
        const errors = { ...this.state.errors };
        errors.dateFromError = errorMessage;
        this.setState({ errors })
    }

    // Getting dateTo of new vacation
    public setDateTo = (e: any): void => {
        const dateTo = e.target.value;
        let errorMessage = "";

        if (dateTo === "") { errorMessage = "Missing date." };
        this.setState({ vacationUpdated: { ...this.state.vacationUpdated, dateTo } });
        const errors = { ...this.state.errors };
        errors.dateToError = errorMessage;
        this.setState({ errors });
    }

    // Getting price of new vacation
    public setPrice = (e: any): void => {
        const price = +e.target.value;
        let errorMessage = "";
        if (price === undefined) { errorMessage = "Missing price."; }
        else if (price < 0) { errorMessage = "Price can't be negative."; }
        this.setState({ vacationUpdated: { ...this.state.vacationUpdated, price } });
        const errors = { ...this.state.errors };
        errors.priceError = errorMessage;
        this.setState({ errors });

    }
    
    //Validation of form 
    private isFormLegal(): boolean {
        return this.state.errors.descriptionError === "" &&
            this.state.errors.destinationError === "" &&
            this.state.errors.dateFromError === "" &&
            this.state.errors.dateToError === "" &&
            this.state.errors.priceError === "";
    }

}