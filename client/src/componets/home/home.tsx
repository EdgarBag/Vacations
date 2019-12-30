import React, { Component } from "react";
import "./home.css";
import { NavLink, Redirect } from "react-router-dom";
import { Vacation } from "../../models/vacation";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import { Heading } from "../heading/heading";
import { User } from "../../models/user";
import { getCurrentUserObject, logOut, isCustomerOnline } from "../globalFunctions/globalFunctions";
import { Follow } from '../../models/follow';
import io from 'socket.io-client';

let socket: any;
export let vacationsChekedFromLocalStorage = [];

interface HomeState {
    vacations: Vacation[];
    users: User[];
    followers: Follow[];
    follow: Follow;
    isChecked: boolean
}

export class Home extends Component<any, HomeState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            users: [],
            follow: new Follow(),
            followers: [],
            isChecked: false

        };
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ vacations: store.getState().vacations }));
    }


    public render(): JSX.Element {
        //Checks if user have permission to access the page
        if (getCurrentUserObject() === null) {
            return <Redirect from="/" to="/login" exact />
        }

        //checks type of user
        var userName = getCurrentUserObject().userFirstName;
        var ifAdmin = getCurrentUserObject().typeOfUser === 1 ? true : false;

        if (ifAdmin) {
            userName = getCurrentUserObject().userFirstName + "! You are identified as Admin. You have permissions to add, update, or delete vacations"
        }

        //Settings to view permissions for admin
        var divStyleAdmin = {
            display: ifAdmin ? 'block' : 'none'
        };
        //Settings to view permissions for user
        var divStyleUser = {
            display: ifAdmin ? 'none' : 'block'
        };


        return (
            <div className="home">

                <NavLink to="/login" exact activeClassName="active-link" className="logOutNavlink " >
                    <button className="btn btn-warning" type="button" onClick={logOut}>logOut</button>
                </NavLink>

                <div className="settingsForAdmin" style={divStyleAdmin}>
                    <NavLink to="/addvacation" exact activeClassName="active-link" className="addVacationLink">
                        <button className=" addButton btn btn-info" type="button" >Add New Vacation</button>
                    </NavLink>
                </div>


                <Heading>Hi {userName}.<br /> You're OnLine. At this moment we have {this.state.vacations.length} vacations!</Heading>
                <img src="/assets/images/kitten.gif" id="loading" alt="loading" style={{ display: this.state.vacations.length === 0 ? "inline-block" : "none" }} />


                {this.state.vacations.map(v =>
                    <div className="vacationsDiv" key={v.vacationID} style={{ display: this.state.vacations.length > 0 ? "inline-block" : "none" }}>
                        <div className="container" >
                            <div className="settingsForAdmin" style={divStyleAdmin}>
                                <div className="row" >
                                    <NavLink to={"updatevacation/" + v.vacationID} exact activeClassName="active-link" className="nameupdate">
                                        <img className="pencil" src="/assets/images/p.png" alt="update" data-key={v.vacationID} />
                                    </NavLink><br />
                                    <img className="deleteX" src="/assets/images/X.png" alt="delete" onClick={this.deleteVacation} data-key={v.vacationID} />
                                    <br />
                                </div>
                            </div>

                            <div className="followDiv" style={divStyleUser}>
                                {this.state.followers.map(f =>
                                    <div key={f.vacationID} >
                                        <p style={{ display: v.vacationID === f.vacationID ? "inline-block" : "none" }}>Total followers of this vacation :{f.countOfFollowers}</p>
                                    </div>
                                )}

                                <form>
                                    <p>Follow...</p>
                                    <input type="checkbox"
                                        className="toggle-s checkBoxToken"
                                        defaultChecked={this.checkIfvacationExistInLS(v.vacationID)}
                                        tabIndex={v.vacationID}
                                        onChange={this.handleChangeBox}
                                        data-key={v.vacationID}
                                    />
                                </form>
                            </div>
                            <br />

                            <div className="vacationInfo">
                                <h5>destination :<span className="destinationH"> {v.destination}</span></h5>
                                <h5>description :<div className="descriptionH">{v.description}</div></h5>
                                <h5>img:{<img src="/assets/images/vac1.jpg" alt={"imgInfo"} />}</h5>
                                <div className="dates">
                                    <h6 className="dateFromH">From:{this.formatDate(v.dateFrom)} </h6>
                                    <h6 className="dateToH">To:{this.formatDate(v.dateTo)}</h6><br />
                                    <h6 className="priceH">Price:{v.price}&#36;</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }
            </div >
        )
    }


    public componentWillUnmount(): void {

        this.unsubscribeStore();
        if (socket) {
            socket.disconnect();
        }
    }
    //Sending changes to server
    public vacationEmit = (): void => {
        socket.emit("admin-made-changes");
    }


    public componentDidMount(): void {
        if (isCustomerOnline()) {

            socket = io.connect('http://localhost:3001');
            socket.on('admin-made-changes', (vacations: Vacation[]): void => {
                const action = { type: ActionType.GetAllVacations, payload: vacations };
                store.dispatch(action);
                alert("Please note, changes have been made by admin.");
            })

            if (store.getState().vacations.length === 0) {
                socket = io.connect("http://localhost:3001/api/vacations");
                socket.on('admin-made-changes', (vacations: Vacation[]): void => {
                    const action = { type: ActionType.GetAllVacations, payload: vacations };
                    store.dispatch(action);
                    this.vacationEmit();
                })

                fetch("http://localhost:3001/api/vacations")
                    .then(response => response.json())
                    .then(vacations => {
                        const action = { type: ActionType.GetAllVacations, payload: vacations };
                        store.dispatch(action)
                    })
                    .catch(err => alert(err.message));


                fetch("http://localhost:3001/api/followers")
                    .then(response => response.json())
                    .then(followers => {
                        const action = { type: ActionType.GetAllFollowers, payload: followers };
                        store.dispatch(action);
                    })
                    .catch(err => alert(err.message))
            }
        }
    }

    //Functionality of checkbox
    private handleChangeBox = (e: any): void => {
        var ifCheked = e.target.checked;
        this.setState({ isChecked: ifCheked });
        const vacationID = +e.target.getAttribute('data-key');
        const userID = getCurrentUserObject() !== null ? getCurrentUserObject().userID : false;
        const follow = { ...this.state.follow };

        follow.userID = userID;
        follow.vacationID = vacationID;
        follow.id = 0;
        this.setState({ follow });

        setTimeout(() => {
            if (this.state.isChecked === true) {

                fetch("http://localhost:3001/api/followers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(this.state.follow)
                })
                    .then(response => response.json())
                    .then(responseFollow => {
                        alert("The follow has been added! ");
                        const vacationChecked = { followID: responseFollow.id, followUserID: userID, followVacationID: vacationID }
                        vacationsChekedFromLocalStorage.push(vacationChecked);
                        localStorage.setItem("vacationCheked", JSON.stringify(vacationsChekedFromLocalStorage));
                        this.getFollowesrs();
                    })
                    .catch(err => alert(err))
            }
            else {

                const id = this.funcFindChekedIDFromLS(userID, vacationID);
                fetch(`http://localhost:3001/api/followers/` + id, {
                    method: `delete`
                })
                    .then(follow => {
                        alert("Follow was removed. ");
                        this.getFollowesrs();
                    })
                    .catch(err => alert(err.message));
            }
        }, 1000);
    }

    //function checking if checked check box is exixt in Local storage
    public funcFindChekedIDFromLS(e: any, b: any) {
        for (let i = 0; i < vacationsChekedFromLocalStorage.length; i++) {
            if (vacationsChekedFromLocalStorage[i].followUserID === e && vacationsChekedFromLocalStorage[i].followVacationID === b) {
                const id = vacationsChekedFromLocalStorage[i].followID;
                vacationsChekedFromLocalStorage.splice(i, 1);
                localStorage.setItem("vacationCheked", JSON.stringify(vacationsChekedFromLocalStorage));
                return id;
            }
        }
    }

    private checkIfvacationExistInLS(e: any): boolean {
        const userIdForCheckBox = getCurrentUserObject().userID;
        for (let i = 0; i < vacationsChekedFromLocalStorage.length; i++) {
            if (vacationsChekedFromLocalStorage[i].followUserID === userIdForCheckBox && vacationsChekedFromLocalStorage[i].followVacationID === e) {
                return;
            }
        }
    }

    //getting info of followers
    public getFollowesrs(): void {
        setTimeout(() => {
            fetch("http://localhost:3001/api/followers")
                .then(response => response.json())
                .then(followers => this.setState({ followers }))

                .catch(err => alert(err.message))

        }, 1000);
    }


    //Function to delete vacation
    public deleteVacation = (e: any): void => {

        if (window.confirm("Are you sure you want to delete this vacation? ") === true) {
            socket = io.connect('http://localhost:3001');
            const id = +e.target.getAttribute('data-key');
            fetch(`http://localhost:3001/api/vacations/` + id, {
                method: `delete`
            })
                .then(vacation => {
                    const action = { type: ActionType.DeleteVacation, payload: id };
                    store.dispatch(action);
                    this.vacationEmit();
                })
                .catch(err => alert(err.message));

            alert("Vacation has been deleted!");

        };
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
        return day + "/" + month + "/" + year;
    }

}


