export interface ChartDaysButton {
    label: string,
    value: number,
};

export const chartDays:ChartDaysButton[] = [
    {
        label: "24 Hours",
        value: 1,
    },
    {
        label: "30 Days",
        value: 30,
    },
    {
        label: "3 Months",
        value: 90,
    },
    {
        label: "1 Year",
        value: 365,
    },
];