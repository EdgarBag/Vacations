import React, { Component } from "react";
import { Heading } from "../heading/heading";
import "./page404.css";

export class Page404 extends Component {
    public render(): JSX.Element {
        return (
            <div className="page404">

                <Heading>The page you are looking for doesn't exist!</Heading>
                <div className="row rowForPage404">
                    <iframe width="530" height="300" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=1" allow="autoplay" title="Page not Found"></iframe>
                    <iframe width="530" height="300" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=1" allow="autoplay" title="Page not Found"></iframe>
                    <iframe width="530" height="300" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=1" allow="autoplay" title="Page not Found"></iframe>
                </div>
            </div>
        );
    }
}