import { useEffect, useState } from "react";
import { ApiTypes } from "./api-types";

export const useFetch = (url: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [data, setData] = useState<null | ApiTypes>(null);

    const fetchData = async () => {
        try {
            const responseJson = await fetch(url);
            const response = await responseJson.json();
            setData(response);
            setLoading(false);
        } catch (err) {
            // @ts-ignore
            setError(err);
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error
    };
};