import React, {useState, useCallback, PropsWithChildren, useMemo, useEffect } from "react";

import { useMouse } from '@mantine/hooks';
export const MouseHistoryContext = React.createContext<any>(null);

interface Point {
    x: number,
    y:number
}

const NullPosition = {
    x: 0,
    y: 0,
}

export function MouseHistoryProvider(props: PropsWithChildren) {
    const [storedMousePosition, setStoredMousePosition] = useState<Point>(NullPosition);
    const { x, y } = useMouse(); 

    const modalWidth = 256;
    const padding = 100;

    const mouseOnLeft = () => {
        return x < window.innerWidth / 2;
    }

    const storeCurrentPosition = () => {
        setStoredMousePosition({
            'x': x + ( mouseOnLeft() ? padding : -modalWidth -padding ),
            'y': y
        })
        console.log(storedMousePosition);
    }

    const clearMouseStorage = () => {
        setStoredMousePosition(NullPosition);
    }

    console.log(x);
    
    const value = {
        storedMousePosition, storeCurrentPosition, clearMouseStorage, mouseOnLeft };
    return <MouseHistoryContext.Provider value={value}>
        {props.children}
    </MouseHistoryContext.Provider>
}