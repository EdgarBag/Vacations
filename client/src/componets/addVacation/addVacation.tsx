import React, { Component, ChangeEvent } from 'react';
import "./addVacation.css";
import { Vacation } from '../../models/vacation';
import { ActionType } from '../../redux/actionType';
import { store } from '../../redux/store';
import { getCurrentUserObject, isAdmin } from '../globalFunctions/globalFunctions';
import { Redirect } from 'react-router';
import { Heading } from '../heading/heading';
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client';

let socket: any;



interface AddVacationState {
    vacation: Vacation;
    errors: {
        descriptionError: string;
        destinationError: string;
        imgError: string;
        dateFromError: string;
        dateToError: string;
        priceError: string;
    };
}
export class AddVacation extends Component<any, AddVacationState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            vacation: new Vacation(),
            errors: {
                descriptionError: "*",
                destinationError: "*",
                imgError: "*",
                dateFromError: "*",
                dateToError: "*",
                priceError: "*"
            },

        }
    }

    public render(): JSX.Element {

        if (getCurrentUserObject() === null || !isAdmin()) {
            alert("Only an authorized Admin can see this page!");
            return <Redirect to="/home" exact />;
        }

        return (
            <div className="addVacation" >
                <Heading> New Vacation</Heading>
                <NavLink to="/home" exact activeClassName="active-link" className="backToAllVacations"> <p>back to  All vacations</p ></NavLink>

                <div className="newVacation">
                    <form action="/upload-image" method="POST" encType="multipart/form-data">

                        <label> Description: </label><br />
                        <textarea placeholder=" Description..." onChange={this.setDescription} value={this.state.vacation.description} />
                        <span>{this.state.errors.descriptionError}</span>
                        <br /><br />

                        <label>Destination:</label><br />
                        <input type="text" placeholder=" Destination..." onChange={this.setDestination} value={this.state.vacation.destination} />
                        <span>{this.state.errors.destinationError}</span>
                        <br /><br />

                        <label>Image:  </label><br />
                        <input type="file" accept="image/*" name="userImage" onChange={this.setImage} value={this.state.vacation.nameOfIMG} />
                        <span>{this.state.errors.imgError}</span>
                        <br /><br />

                        <label>From: </label><br />
                        <input type="date" onChange={this.setDateFrom} value={this.state.vacation.dateFrom} />
                        <span>{this.state.errors.dateFromError}</span>
                        <br /><br />

                        <label>To:</label><br />
                        <input type="date" onChange={this.setDateTo} value={this.state.vacation.dateTo} />
                        <span>{this.state.errors.dateToError}</span>
                        <br /><br />

                        <label>Price:        </label><br />
                        <input type="text" placeholder=" Price..." onChange={this.setPrice} value={this.state.vacation.price} />
                        <span>{this.state.errors.priceError}</span>
                        <br /><br />

                        <button className="btn btn-success btnAddVacation" disabled={!this.isFormLegal()} type="button" onClick={this.addVacation}>Add vacation</button>

                    </form>

                </div>

            </div >
        )
    }
    // Getting description of new vacation
    public setDescription = (e: any): void => {
        const description = e.target.value;
        let errorMessage = "";

        if (description === "") { errorMessage = "Missing description." }
        else if (description.length > 199) { errorMessage = "Description is too long"; }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.description = description;
        errors.descriptionError = errorMessage;
        this.setState({ vacation, errors });

    }

    // Getting destination of new vacation
    public setDestination = (e: any): void => {
        const destination = e.target.value;
        let errorMessage = "";
        if (destination === "") { errorMessage = "Missing destination." }
        else if (destination.length > 40) { errorMessage = "Description tool long." }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.destination = destination;
        errors.destinationError = errorMessage;
        this.setState({ vacation, errors });
    }

    // Getting image of new vacation
    public setImage = (e: any): void => {
        const img = e.target.value;
        let errorMessage = "";
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.nameOfIMG = img;
        errors.destinationError = errorMessage;
        this.setState({ vacation, errors });
    }

    // Getting dateFrom of new vacation
    public setDateFrom = (e: ChangeEvent<HTMLInputElement>): void => {
        const dateFrom = e.target.value;
        let errorMessage = "";
        if (dateFrom === "") { errorMessage = "Missing date." }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.dateFrom = dateFrom;
        errors.dateFromError = errorMessage;
        this.setState({ vacation, errors });
    }

    // Getting dateTo of new vacation
    public setDateTo = (e: any): void => {
        const dateTo = e.target.value;
        let errorMessage = "";
        if (dateTo === "") { errorMessage = "Missing date." }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.dateTo = dateTo;
        errors.dateToError = errorMessage;
        this.setState({ vacation, errors });
    }

    // Getting price of new vacation
    public setPrice = (e: any): void => {
        const price = +e.target.value;
        let errorMessage = "";

        if (price === undefined) { errorMessage = "Missing price."; }
        else if (price < 0) { errorMessage = "Price can't be negative."; }

        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        vacation.price = price;
        errors.priceError = errorMessage;
        this.setState({ vacation, errors });
    }

    //Validation of form 
    private isFormLegal(): boolean {
        return this.state.errors.descriptionError === "" &&
            this.state.errors.destinationError === "" &&
            this.state.errors.dateFromError === "" &&
            this.state.errors.dateToError === "" &&
            this.state.errors.priceError === "";
    }

    //Sending changes to server
    public vacationEmit = (): void => {
        socket.emit("admin-made-changes");
    }

    //Function for adding new vacation
    private addVacation = (): void => {
        socket = io.connect('http://localhost:3001');
        fetch("http://localhost:3001/api/vacations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.vacation)
        })
            .then(response => response.json())
            .then(vacation => {
                alert("A new vacation to " + vacation.destination + " has been successfully added.");
                const action = { type: ActionType.AddVacation, payload: vacation };
                store.dispatch(action);
                this.vacationEmit();
                this.props.history.push("/home");
            })
            .catch(err => alert(err))
    };
}