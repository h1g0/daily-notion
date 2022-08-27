import { AnchorButton, NavbarGroup } from "@blueprintjs/core";
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";
import React from "react";

export class DateSelector extends React.Component {
    private static dateFnsFormat = 'yyyy-MM-dd';
    private static formatDate = (date: Date) => format(date, DateSelector.dateFnsFormat);
    private static parseDate = (str: string) => parse(str, DateSelector.dateFnsFormat, new Date());
    //private readonly dateValue = format(new Date(), DateSelector.dateFnsFormat);

    constructor(props: any) {
        super(props);
        this.state = {
            dateValue: new Date()
        };
        this.handleChange = this.handleChange.bind(this);
        this.setNextDay = this.setNextDay.bind(this);
        this.setPreviousDay = this.setPreviousDay.bind(this);
        this.setToday = this.setToday.bind(this);
    }

    render() {
        return (
            <NavbarGroup className="DateSelector">
                <DateInput2
                    formatDate={DateSelector.formatDate}
                    onChange={this.handleChange}
                    parseDate={DateSelector.parseDate}
                    placeholder={DateSelector.dateFnsFormat}
                    shortcuts
                    defaultValue={this.getTodayStr()}
                    reverseMonthAndYearMenus
                />
                <AnchorButton icon='chevron-left' minimal onClick={this.setPreviousDay}/>
                <AnchorButton icon='time' minimal onClick={this.setToday}/>
                <AnchorButton icon='chevron-right' minimal />
            </NavbarGroup>
        );
    }

    private handleChange(newDateStr: string|null){
        this.setState({
            dateValue: DateSelector.parseDate(newDateStr??this.getTodayStr())
        });
    }

    private readonly mSecPerDay = 1000 * 60 * 60 * 24;
    private setNextDay(currentDate: Date){
        //this.handleChange(this.state)
    }

    private setPreviousDay(){
        this.setState(state => {
            //dateValue: state.dateValue.getTime() - this.mSecPerDay
        });
    }

    private setToday(){
        this.handleChange(this.getTodayStr());
    }

    private getTodayStr(){
        return format(new Date(), DateSelector.dateFnsFormat);
    }

}
