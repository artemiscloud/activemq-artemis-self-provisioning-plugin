import { formatDistance } from "date-fns";

const getFormattedDate = (
    date: string | Date,
    translatePostfix: string
): string => {
    date = typeof date === "string" ? new Date(date) : date;
    return formatDistance(date, new Date()) + " " + translatePostfix;
};

export {
    getFormattedDate
};