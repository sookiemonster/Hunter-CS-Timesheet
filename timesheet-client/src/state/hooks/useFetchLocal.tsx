import React, { useEffect, useRef } from "react";
import { useFetch } from "@mantine/hooks";


export default function useFetchLocal<T>(endpoint:string) {
    const attempts = useRef(3);
    const { data, loading, error, refetch, abort } = useFetch<T>(
        `http://localhost:8000${endpoint}`
    );

    useEffect(() => {
        if (attempts.current < 0 ) { abort(); return; }
        if (error) { 
            setTimeout(() => {
                attempts.current = attempts.current - 1; 
                refetch();
            }, 5000)
        }
    }, [error, data, loading])

    return { data, loading, error, refetch, abort };
}