import React, { Component } from "react";
import "./newUser.css";
import { User } from "../../models/user";
import { logIn } from "../globalFunctions/globalFunctions";

interface NewUserState {
    newUser: User;
    errors: {
        nameError: string;
        lastNameError: string;
        userNameError: string;
        passwordError: string;
    }
}

export class NewUser extends Component<any, NewUserState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            newUser: new User(),
            errors: {
                nameError: "*",
                lastNameError: "*",
                userNameError: "*",
                passwordError: "*",
            }

        };
    }

    public render(): JSX.Element {

        return (
            <div className="newUser">
                <h2>Sign Up:</h2>
                <form>
                    <label> First Name:</label>
                    <input type="text" onChange={this.setName} autoFocus value={this.state.newUser.userFirstName} />
                    <span>{this.state.errors.nameError}</span>
                    <br /><br />

                    <label>Last Name: </label>
                    <input type="text" onChange={this.setLastName} value={this.state.newUser.userSecondName} />
                    <span>{this.state.errors.lastNameError}</span>
                    <br /><br />

                    <label>User name: </label>
                    <input type="text" onChange={this.setUserName} value={this.state.newUser.userName} className="inputUserName" />
                    <span>{this.state.errors.userNameError}</span>
                    <br /><br />

                    <label>Password:   </label>
                    <input type="password" onChange={this.setPassword} value={this.state.newUser.userPassword} />
                    <span>{this.state.errors.passwordError}</span>
                    <br /><br />

                    <label></label>
                    <button className="btn btn-success" type="button" disabled={!this.isFormLegal()} onClick={this.addNewUser}>Sign Up</button>

                </form>

            </div>
        )
    }

    //Function - for adding a new user to the server
    public addNewUser = (): void => {
        fetch("http://localhost:3001/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.newUser)
        })
            .then(response => response.json())
            .then(newUser => {
                if (newUser.userFirstName !== undefined) {
                    alert(newUser.userFirstName + ", You have successfully registered.\nWelcome to our website!");
                    logIn(newUser);
                    this.props.history.push("/home");
                } else {
                    alert(newUser);
                }
            })
            .catch(err => alert(err));
    };

    //getting name of new User with validation
    public setName = (e: any): void => {
        const name = e.target.value;
        let errorMessage = "";
        if (name === "") {
            errorMessage = "Missing Name."
        }
        else if (name.length > 10) {
            errorMessage = "Name too long."
        }

        const newUser = { ...this.state.newUser };
        const errors = { ...this.state.errors };
        newUser.userFirstName = name;
        errors.nameError = errorMessage;
        this.setState({ newUser, errors });
    };

    //getting Last Name of new User with validation
    public setLastName = (e: any): void => {
        const lastName = e.target.value;
        let errorMessage = "";
        if (lastName === "") {
            errorMessage = "Missing Last Name."
        }
        else if (lastName.length > 10) {
            errorMessage = "Last Name too long"
        }
        const newUser = { ...this.state.newUser };
        const errors = { ...this.state.errors };
        newUser.userSecondName = lastName;
        errors.lastNameError = errorMessage;
        this.setState({ newUser, errors })
    };

    //getting User Name of new User with validation
    public setUserName = (e: any): void => {
        const userName = e.target.value;
        let errorMessage = "";
        if (userName === "") {
            errorMessage = "Missing User Name."
        }
        else if (userName.length > 10) {
            errorMessage = "User Name too long."
        }
        else if (userName.length < 4) {
            errorMessage = "User Name too short."
        }
        const newUser = { ...this.state.newUser };
        const errors = { ...this.state.errors };
        newUser.userName = userName;
        errors.userNameError = errorMessage;
        this.setState({ newUser, errors })

    }

    //getting password of new User with validation
    public setPassword = (e: any): void => {
        const password = e.target.value;
        let errorMessage = "";
        if (password === "") {
            errorMessage = "Missing Password."
        }
        else if (password.length > 12) {
            errorMessage = "Password too long"
        }
        else if (password.length < 4) {
            errorMessage = "Password too short."
        }
        const newUser = { ...this.state.newUser };
        const errors = { ...this.state.errors };
        newUser.userPassword = password;
        errors.passwordError = errorMessage;
        this.setState({ newUser, errors })
    }

    //Function checking form
    private isFormLegal(): boolean {
        return this.state.errors.nameError === "" &&
            this.state.errors.lastNameError === "" &&
            this.state.errors.userNameError === "" &&
            this.state.errors.passwordError === "";
    }
}