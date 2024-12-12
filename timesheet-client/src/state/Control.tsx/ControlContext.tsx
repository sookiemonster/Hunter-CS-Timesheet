import React, { useState, PropsWithChildren } from "react";
import PayrollPeriod, { NULL_PERIOD } from "../../components/PeriodHeader/PayrollPeriod";


export const ControlContext = React.createContext<any>(null);

export function ControlProvider(props:PropsWithChildren){    
    const [selectedEmail, setSelectedEmail] = useState(
        sessionStorage.employee || ""
    );
    const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod>(
        () => {
            try {
                const stored = JSON.parse(sessionStorage.period) || NULL_PERIOD
                return stored;
            } catch {
                return NULL_PERIOD;
            }
        }
    );

    const selectPeriod = (p:PayrollPeriod) => {
        sessionStorage.setItem('period', JSON.stringify(p));
        setSelectedPeriod(p);
    }

    const selectEmail = (email:string) => {
        sessionStorage.setItem('employee', email);
        setSelectedEmail(email);
    }

    const value = { selectedPeriod, selectPeriod, selectEmail, selectedEmail };
    return <ControlContext.Provider value={value}>
        {props.children}
    </ControlContext.Provider>
}