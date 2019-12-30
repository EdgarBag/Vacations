import React, { Component } from "react";
import "./header.css";
import { NavLink } from "react-router-dom";
import { isCustomerOnline } from "../globalFunctions/globalFunctions";

interface HeaderState {
    isLoggedIn: boolean
}
export class Header extends Component<any, HeaderState>{
    public constructor() {
        super(undefined);
        this.state = {
            isLoggedIn: false
        }

    }

    public render(): JSX.Element {


        return (
            <div className="header">

                <nav>
                    <div className="logInLink" style={{ display: isCustomerOnline() ? "none" : "block" }}>
                        <span className="spanForLinks" >  | </span>
                        <NavLink to="/login" exact activeClassName="active-link" className="nameLogin" >Login</NavLink>
                    </div>

                    <div className="homeLink" style={{ display: isCustomerOnline() ? 'block' : 'none' }}>
                        <span className="spanForLinks">  | </span>
                        <NavLink to="/home" exact activeClassName="active-link" className="nameHome">Home</NavLink>
                    </div>

                    <span className="spanForLinks">  | </span>
                    <NavLink to="/about" exact activeClassName="active-link" className="nameAbout">About</NavLink>
                    <span className="spanForLinks">  | </span>

                    <h1>Welcome to our vacations website.</h1>
                </nav>

            </div >
        )
    }


    public logOut() {
        localStorage.removeItem("currentUser")
    }

    public checkstyle(): void {
        this.divStyleLognin();
        this.divStyleLognin();
    }

    private divStyleLognin() {
        return { display: isCustomerOnline() ? 'none' : 'block' }
    }
    private divStyleHome() {
        return { display: isCustomerOnline() ? 'block' : 'none' }
    }

}
