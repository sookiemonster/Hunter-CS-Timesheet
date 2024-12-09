import React, {useState, useCallback, PropsWithChildren } from "react";
import { useDisclosure } from '@mantine/hooks';
import { UUID } from "crypto";
import { title } from "process";


interface Event {
    title:string,
    start: Date,
    end: Date,
    id: any,
    allDay?: boolean
}

export const CalendarModificationContext = React.createContext<any>(null);

const NullEvent = {
    title: "",
    start: new Date(),
    end: new Date,
    id: null
}

export function CalendarModificationProvider(props: PropsWithChildren) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selected, setSelected] = useState<Event>(NullEvent);

    const [selectedWeekOne, selectWeek] = useState(true);
    const [weekOneEvents, setWeekOneEvents] = useState<Event[]>([]);
    const [weekTwoEvents, setWeekTwoEvents] = useState<Event[]>([]);
    const [temporaryEvents, setTemporaryEvents] = useState<Event[]>([]);
    
    const saveEdits = useCallback(
        (newStart:Date, newEnd:Date, newTitle:string) => {
            const setTargetWeek = (selectedWeekOne) ? setWeekOneEvents : setWeekTwoEvents;

            setTargetWeek(prev => {
                const updatedList = prev.filter(itr => itr.id !== selected.id);
                const updatedEvent = {
                    title: newTitle, 
                    start: newStart,
                    end: newEnd,
                    id: selected
                }
                console.log(updatedEvent);

                return [...updatedList, updatedEvent];
            })
            close();
        }, [selected, setWeekOneEvents, setWeekTwoEvents]
    );

    const deleteSelected = useCallback(
        () => {
            const setTargetWeek = (selectedWeekOne) ? setWeekOneEvents : setWeekTwoEvents;
            setTargetWeek(prev => {
                const updatedList = prev.filter(itr => itr.id !== selected.id);
                return [...updatedList];
            })
            close();
        }, [selected]
    );

    const updateTemp = useCallback(
        (tempStart:Date, tempEnd:Date, tempTitle:string, tempId:any) => {
            const tempEvent = {
                start: tempStart,
                end: tempEnd,
                title: tempTitle,
                id: tempId
            };
            setTemporaryEvents([tempEvent]);
        }, [selected]
    )

    const clearTemp= () => {
        setTemporaryEvents([]);
    }
    // 

    const value = { 
        weekOneEvents, weekTwoEvents,
        selected, setSelected, deleteSelected,
        opened, open, close, saveEdits, 
        selectedWeekOne, selectWeek, temporaryEvents, clearTemp, updateTemp };
    return <CalendarModificationContext.Provider value={value}>
        {props.children}
    </CalendarModificationContext.Provider>
}