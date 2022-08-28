import { AnchorButton, NavbarGroup } from "@blueprintjs/core";
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";
import React from "react";

export class DateSelector extends React.Component<any, { dateValue: Date }> {
    private static dateFnsFormat = 'yyyy-MM-dd';
    private static formatDate = (date: Date) => format(date, DateSelector.dateFnsFormat);
    private static parseDate = (str: string) => parse(str, DateSelector.dateFnsFormat, new Date());

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
                    value={DateSelector.formatDate(this.state.dateValue)}
                />
                <AnchorButton icon='chevron-left' minimal onClick={this.setPreviousDay} />
                <AnchorButton icon='time' minimal onClick={this.setToday} />
                <AnchorButton icon='chevron-right' minimal onClick={this.setNextDay} />
            </NavbarGroup>
        );
    }

    private handleChange(newDateStr: string | null) {
        this.setState({
            dateValue: DateSelector.parseDate(newDateStr ?? this.getTodayStr())
        });
    }

    private readonly mSecPerDay = 1000 * 60 * 60 * 24;
    private setNextDay() {
        this.setState(state => {
            return {
                dateValue: new Date(state.dateValue.getTime() + this.mSecPerDay)
            }
        });
    }

    private setPreviousDay() {
        this.setState(state => {
            return {
                dateValue: new Date(state.dateValue.getTime() - this.mSecPerDay)
            }
        });
    }

    private setToday() {
        this.setState(state => {
            return {
                dateValue: new Date()
            }
        });
    }

    private getTodayStr() {
        return format(new Date(), DateSelector.dateFnsFormat);
    }

}