import React, { useContext } from "react";
import { UserContext } from "../../state/User";
import { useNavigate } from "react-router-dom";
import PeriodHeader from "../../components/PeriodHeader";
import Tabular from "../../components/Table";
import "./styles/styles.css"
import { Space } from "@mantine/core";
import LandingBackround from "../LandingPage/LandingBackground";

export default function EmployeePage() {
    const { isAdmin } = useContext(UserContext);

    return (
        <>
        <div id="employee-page-container">
            {!isAdmin() 
                ? <></>
                : 
                <>
                    <PeriodHeader font_size="small" />
                    <Space h={'md'}/>
                    <Tabular />
                </>
            }
        </div>
        </>
    )
}