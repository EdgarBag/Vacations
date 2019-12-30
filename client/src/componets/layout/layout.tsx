import React, { Component } from "react";
import "./layout.css";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Login } from "../login/login";
import { About } from "../about/about";
import { Home } from "../home/home";
import { NewUser } from "../newUser/newUser";
import { AddVacation } from "../addVacation/addVacation";
import { Update } from "../updateVacation/updateVacation";
import { Page404 } from "../page404/page404";

export class Layout extends Component {
    public render(): JSX.Element {
        return (
            <div className="layout">
                <BrowserRouter>

                    <header>
                        <Header />
                    </header>
                    <main>
                        <Switch>
                            <Route path="/home" component={Home} exact />
                            <Route path="/login" component={Login} exact />
                            <Route path="/about" component={About} exact />
                            <Route path="/signup" component={NewUser} exact />
                            <Route path="/updatevacation/:vacID" component={Update} />
                            <Route path="/addvacation" component={AddVacation} exact />
                            <Redirect from="/" to="/home" exact />
                            <Route component={Page404} />
                        </Switch>
                    </main>

                    <footer>
                        <Footer />
                    </footer>

                </BrowserRouter>
            </div>
        )
    }
}