import { AnchorButton, NavbarGroup } from "@blueprintjs/core";
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";
import { useCallback, useState } from "react";

export interface DateSelectorProps {};

export const DateSelector:React.FC<DateSelectorProps> = ()=> {
    const [dateValue, setDateValue] = useState<string>();
    const handleChange = useCallback(setDateValue, []);
    const dateFnsFormat = "yyyy-MM-dd";
    const formatDate = useCallback((date: Date) => format(date, dateFnsFormat), [Date, dateFnsFormat]);
    const parseDate = useCallback((str: string) => parse(str, dateFnsFormat, new Date()), [String, dateFnsFormat]);

    return (
        <NavbarGroup className="DateSelector">
        <DateInput2
            formatDate={formatDate}
            // onChange={handleChange}
            parseDate={parseDate}
            placeholder={dateFnsFormat}
            value={dateValue}
            shortcuts
            defaultValue={format(new Date(), dateFnsFormat)}
            reverseMonthAndYearMenus
        />
        <AnchorButton icon='chevron-left' minimal/>
        <AnchorButton icon='time' minimal/>
        <AnchorButton icon='chevron-right' minimal />
        </NavbarGroup>
        
    );
}
