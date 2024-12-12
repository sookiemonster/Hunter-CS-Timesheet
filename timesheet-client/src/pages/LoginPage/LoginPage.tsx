import React, { useContext } from "react";
import { Login } from "./LoginSheet";

export default function LoginPage() {
    return (
    <div>
        <div id="login-page-container">
            <div id="welcome-text-container">
                <span id="layer-one">Hunter CS</span>
                <span id="layer-two">Timesheet System</span>
            </div>
            <Login />
        </div>
    </div>
    )
}