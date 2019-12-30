import React, { Component } from "react";
import "./login.css";
import { NavLink } from "react-router-dom";
import { Heading } from "../heading/heading";
import { User } from "../../models/user";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { getCurrentUserObject, logOut, logIn } from "../globalFunctions/globalFunctions";


interface LoginState {
    userName: string;
    password: string;
    errors: {
        userNameError: string;
        passwordError: string
    };
    users: User[];
    typeOfUser: number;
    _isMounted: boolean
}

export class Login extends Component<any, LoginState> {

    private unsubscribeStore: Unsubscribe;
    public constructor(props: any) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            errors: {
                userNameError: "*",
                passwordError: "*",
            },
            users: store.getState().users,
            typeOfUser: 0,
            _isMounted: false
        };

        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ users: store.getState().users }))
    }

    public render(): JSX.Element {

        return (
            <div className="login">
                <Heading> Sign In: </Heading>
                <form >

                    <label>User Name: </label>
                    <input type="text" placeholder=" User Name..." onChange={this.getUserName} autoFocus />
                    <span>{this.state.errors.userNameError}</span>
                    <br /><br />

                    <label>Password: </label>
                    <input type="current-password" placeholder=" Enter password..." onChange={this.getPassword} />
                    <span>{this.state.errors.passwordError}</span>
                    <br /><br />

                    <button className="btn btn-success btnAddVacation" disabled={!this.isFormLegal()} type="button" onClick={this.checkUser}  >  Sign In </button>
                    <br /><br />
                </form>

                <NavLink to="/signup" exact activeClassName="active-link" className="linkNewUser">
                    <h2 className="signUpLink"> Don't have an account on our website yet? Sign Up...</h2>
                </NavLink>
            </div>
        )
    }

    //function checking if customer exist id DB
    public checkUser = (): void => {

        if (getCurrentUserObject() !== null) {
            logOut();
        }

        let userExist = store.getState().users.find((u: User) =>
            u.userName === this.state.userName && u.userPassword === this.state.password);

        if (userExist === undefined) {
            alert("One or more IDs that you provided are incorrect!\nPlease try again.");
        } else {
            alert(userExist.userName + ", Welcome to our website!");
            logIn(userExist);
            this.props.history.push("/home")
        }
    }

    //Getting all users from server
    public componentDidMount(): void {
        this.setState({ _isMounted: true });
        fetch("http://localhost:3001/api/users")
            .then(response => response.json())
            .then(users => {
                const action = { type: ActionType.GetAllUsers, payload: users };
                store.dispatch(action)
            })
            .catch(err => alert(err.message))
    }

    //Function - getting userName with validation
    public getUserName = (e: any): void => {
        const userName = e.target.value;
        let errorMessage = ""
        if (userName === "") { errorMessage = "Missing User Name! " };
        this.setState({ userName });
        const errors = { ...this.state.errors };
        errors.userNameError = errorMessage;
        this.setState({ errors })
    }

    //Function - getting password with validation
    public getPassword = (e: any): void => {
        const password = e.target.value;
        let errorMessage = "";
        if (password === "") { errorMessage = "Missing password! " }
        this.setState({ password });
        const errors = { ...this.state.errors };
        errors.passwordError = errorMessage;
        this.setState({ errors })
    }

    // Function checking form
    private isFormLegal(): boolean {
        return this.state.errors.passwordError === "" &&
            this.state.errors.userNameError === "";
    }

}