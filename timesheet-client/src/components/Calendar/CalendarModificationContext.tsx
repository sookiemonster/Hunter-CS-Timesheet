import React, {useState, useCallback, PropsWithChildren, useRef, useMemo } from "react";
import { useDisclosure } from '@mantine/hooks';
import { convertToCalendar } from "../../state/Schedule";

interface Event {
    title?:string,
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
    const editsEnabled = useRef(true);
    const [opened, { open, close }] = useDisclosure(false);
    const [selected, setSelected] = useState<Event>(NullEvent);

    const [selectedWeekOne, selectWeek] = useState(true);
    const [weekOneEvents, setWeekOneEvents] = useState<Event[]>([]);
    const [weekTwoEvents, setWeekTwoEvents] = useState<Event[]>([]);
    const [temporaryEvents, setTemporaryEvents] = useState<Event[]>([]);

    const countHours = (list:Event[]) => {
        if (list.length === 0) { return 0; }
        return list.reduce((total, event) => {
            const ms = event.end.getTime() - event.start.getTime();
            return total + ms;
        }, 0) / (1000 * 60 * 60);
    }

    const [isEdited, setIsEdited] = useState(false);

    const weekOneHours = useMemo(() => 
        countHours(weekOneEvents)
    , [weekOneEvents])

    const weekTwoHours = useMemo(() => 
        countHours(weekTwoEvents)
    , [weekTwoEvents])

    const regularHours = useCallback((defaultHours:any) => {
        return true;
    }, [weekOneEvents, weekTwoEvents])
    
    const saveEdits = useCallback(
        (newStart:Date, newEnd:Date, newTitle:string) => {
            const setTargetWeek = (selectedWeekOne) ? setWeekOneEvents : setWeekTwoEvents;
            
            setIsEdited(true);
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
            clearSelected();
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

    const clearSelected = () => {
        setSelected(NullEvent);
    }

    const enableEdits = () => {
        editsEnabled.current = true;
    }

    const value = { 
        isEdited, setIsEdited,
        editsEnabled, enableEdits,
        weekOneEvents, weekTwoEvents,
        setWeekOneEvents, setWeekTwoEvents,
        weekOneHours, weekTwoHours,
        selected, setSelected, deleteSelected, clearSelected,
        opened, open, close, saveEdits, 
        selectedWeekOne, selectWeek, temporaryEvents, clearTemp, updateTemp };
    return <CalendarModificationContext.Provider value={value}>
        {props.children}
    </CalendarModificationContext.Provider>
}