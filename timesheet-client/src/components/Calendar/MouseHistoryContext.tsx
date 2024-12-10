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

    const clampMargin = 350;
    const padding = 50;

    const storeCurrentPosition = () => {
        const allowedViewport = window.innerWidth - clampMargin;
        console.log("STORING NOW.", x)
        setStoredMousePosition({'x' : Math.min(allowedViewport, x + padding), 'y': y})
        console.log(storedMousePosition);
    }

    const clearMouseStorage = () => {
        setStoredMousePosition(NullPosition);
    }

    console.log(x);
    
    const value = {
        storedMousePosition, storeCurrentPosition, clearMouseStorage };
    return <MouseHistoryContext.Provider value={value}>
        {props.children}
    </MouseHistoryContext.Provider>
}