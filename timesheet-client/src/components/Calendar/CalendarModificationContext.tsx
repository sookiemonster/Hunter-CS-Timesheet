import React, {useState, useCallback, PropsWithChildren } from "react";
import { useDisclosure } from '@mantine/hooks';
import { UUID } from "crypto";


interface Event {
    title:string,
    start: Date,
    end: Date,
    id: any,
    allDay?: boolean
}

export const CalendarModificationContext = React.createContext<any>(null);

export function CalendarModificationProvider(props: PropsWithChildren) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selected, setSelected] = useState<Event | null>(null);

    const [selectedWeekOne, selectWeek] = useState(true);
    const [weekOneEvents, setWeekOneEvents] = useState<Event[]>([]);
    const [weekTwoEvents, setWeekTwoEvents] = useState<Event[]>([]);
    
    const saveEdits = useCallback(
        (newStart:Date, newEnd:Date, newTitle:string) => {
            const setTargetWeek = (selectedWeekOne) ? setWeekOneEvents : setWeekTwoEvents;
            
            let updatedList;

            setTargetWeek(prev => {
                updatedList = prev.filter(itr => itr.id !== selected?.id);
                const updatedEvent = {
                    title: newTitle, 
                    start: newStart,
                    end: newEnd,
                    id: selected?.id || crypto.randomUUID()
                }

                return [...updatedList, updatedEvent];
            })
            finish();
        }, [selected, setWeekOneEvents, setWeekTwoEvents]
    )

    const finish = () => {
        setSelected(null);
        close();
    }

    const value = { 
        weekOneEvents, weekTwoEvents,
        selected, setSelected, 
        opened, open, finish, saveEdits, 
        selectedWeekOne, selectWeek };
    return <CalendarModificationContext.Provider value={value}>
        {props.children}
    </CalendarModificationContext.Provider>
}