import React, { Component } from "react";
import "./about.css";



export class About extends Component {
    public render(): JSX.Element {
        return (
            <div className="about">
                <h1>You Should Be Here!!!</h1>
                <iframe width="1400" height="700"
                    src="https://www.youtube.com/embed/4G9pblXxejM?autoplay=1"
                    allow="accelerometer; autoplay; encrypted-media"
                    title="You Should Be Here!">

                </iframe>

            </div>
        )
    }
}