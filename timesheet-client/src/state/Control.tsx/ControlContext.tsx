import React, { useState, useCallback, PropsWithChildren, useEffect } from "react";
import PayrollPeriod, { NULL_PERIOD } from "../../components/PeriodHeader/PayrollPeriod";


export const ControlContext = React.createContext<any>(null);

export function ControlProvider(props:PropsWithChildren){    
    const [selectedEmployee, setSelectedEmployee] = useState(null);
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

    const value = { selectedPeriod, selectPeriod, selectedEmployee, setSelectedEmployee };
    return <ControlContext.Provider value={value}>
        {props.children}
    </ControlContext.Provider>
}