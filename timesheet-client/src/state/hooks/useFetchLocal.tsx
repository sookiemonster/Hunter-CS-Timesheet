import React from "react";
import { useFetch } from "@mantine/hooks";


export default function useFetchLocal<T>(endpoint:string) {
    const { data, loading, error, refetch, abort } = useFetch<T>(
        `http://localhost:8000${endpoint}`
    );

    return { data, loading, error, refetch, abort };
}