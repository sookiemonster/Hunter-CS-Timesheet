import React, { useEffect, useState } from "react";
import User from "../../state/User";

import TimesheetPageAdmin from "./AdminView";
import TimesheetPageUser from "./UserView";

interface TimesheetPageProps {
    user:User
}


function TimesheetPage({user}:TimesheetPageProps):JSX.Element {
    return <>
    {user.isAdmin ? <TimesheetPageAdmin/> : <TimesheetPageUser/>}
    </>
}

export default TimesheetPage;