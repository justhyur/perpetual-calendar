import moment from 'moment';
import { useEffect, useState, useRef } from 'react';
const monthNames=['January', 'February', 'March', 'April', 'May', 'June', 'Sol', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Settings({currYear, setCurrYear, calendarType, setCalendarType}){
    return(<>
    <div className="year-selector">
        <button onClick={()=>{setCurrYear(currYear-1)}}>⬅️</button>
        <span>{currYear}</span>
        <button onClick={()=>{setCurrYear(currYear+1)}}>➡️</button>
    </div>
    <div className="settings">
        <div className="calendar-type">
            Calendar Type:
            <select value={calendarType} onChange={(e)=>{setCalendarType(parseInt(e.target.value))}}>
                <option value="1">Perpetual</option>
                <option value="0">Gregorian</option>
            </select>
        </div>
    </div>
    </>
    )
}

function Month({num, startDay, calendarType, currYear}){
    return(
        <div className="month">
            <div className="title">{monthNames[num]}</div>
            <div className="content">
                <table>
                    <thead>
                        <tr>
                        {Array.from({ length: 7 }).map((n, dayName) => (
                            <th key={`dayName${dayName}`}>
                                {dayNames[dayName + startDay < 7 ? dayName + startDay : dayName + startDay - 7].substring(0,3)}
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: 4 }).map((n, week) => (
                        <tr key={`week${week}`}>
                        {Array.from({ length: 7 }).map((n, day) => (
                            <Day 
                                key={`day${day}`}
                                month={num}
                                week={week}
                                day={day}
                                calendarType={calendarType} 
                                currYear={currYear}
                                startDay={startDay}
                            />
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function Day({month, week, day, calendarType, currYear, startDay}){
    const dayRef = useRef(null);
    const [isPerpetual, setIsPerpetual] = useState(true);
    const dayNum = day+1+week*7+month*28;
    const currDay = new Date(currYear, 0, dayNum);

    const today = new Date();
    const isToday = today.getFullYear() === currDay.getFullYear() && 
    today.getMonth() === currDay.getMonth() &&
    today.getDate() === currDay.getDate()

    return(
        <td className={`${isToday? "current" : ""} ${currDay < today? "past" : "future"}`}
            ref={dayRef} 
            onMouseOver={()=>{setIsPerpetual(false)}}
            onMouseOut={()=>{setIsPerpetual(true)}}
        >
            {(calendarType && isPerpetual) || (!calendarType && !isPerpetual)?
                <div className="perpetual">{day+1+week*7}</div>
                :
                <div className="gregorian">{currDay && moment(currDay).format("MMM D YYYY")}</div>
            }
        </td>
    )
}

export default function Calendar({}){
    const now = new Date();
    const [currYear, setCurrYear] = useState(now.getYear()+1900);
    const [calendarType, setCalendarType] = useState(0);
    const [startDay, setStartDay] = useState(1);

    const [customStartDay, setCustomStartDay] = useState(1);

    useEffect(()=>{
        const firstDay = new Date(currYear, 0, 1);
        setStartDay(firstDay.getDay());
    },[currYear]);

    const isLeapYear = new Date(currYear, 1, 29).getDate() === 29;
    const today = new Date();

    const leapDay = new Date(currYear, 11, 30);
    const leapDayRef = useRef(null);
    const [isLeapDayPerpetual, setIsLeapDayPerpetual] = useState(true);
    const isLeapDay = today.getFullYear() === leapDay.getFullYear() && 
    today.getMonth() === leapDay.getMonth() &&
    today.getDate() === leapDay.getDate();
    
    const yearDay = new Date(currYear, 11, 31);
    const yearDayRef = useRef(null);
    const [isYearDayPerpetual, setIsYearDayPerpetual] = useState(true);
    const isYearDay = today.getFullYear() === leapDay.getFullYear() && 
    today.getMonth() === leapDay.getMonth() &&
    today.getDate() === leapDay.getDate();

    return (<>
        <Settings 
            currYear={currYear} 
            setCurrYear={setCurrYear}
            calendarType={calendarType} 
            setCalendarType={setCalendarType}
            customStartDay={customStartDay}
            setCustomStartDay={setCustomStartDay}
        />
        <div className="calendar">
            {Array.from({ length: 13 }).map((n, index) => (
                <Month
                    key={`month${index}`}
                    num={index}
                    startDay={startDay}
                    calendarType={calendarType} 
                    currYear={currYear}
                />
            ))}
            <div className="month">
                <div className="content">
                    <table style={{width:`${isLeapYear? "180px" : "90px"}`}}>
                        <thead>
                            <tr className="extra-td">
                                {isLeapYear &&
                                    <th>LEAP DAY</th>
                                }
                                <th>YEAR DAY</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="extra-td">
                                {isLeapYear &&
                                    <td className={`extra-td ${isLeapDay? "current" : ""} ${leapDay < today? "past" : "future"}`}
                                        ref={leapDayRef} 
                                        onMouseOver={()=>{setIsLeapDayPerpetual(false)}}
                                        onMouseOut={()=>{setIsLeapDayPerpetual(true)}}
                                    >
                                        {(calendarType && isLeapDayPerpetual) || (!calendarType && !isLeapDayPerpetual)?
                                            <div className="perpetual">{"L"}</div>
                                            :
                                            <div className="gregorian">{moment(leapDay).format("MMM D YYYY")}</div>
                                        }
                                    </td>
                                }
                                <td className={`extra-td ${isYearDay? "current" : ""} ${yearDay < today? "past" : "future"}`}
                                    ref={yearDayRef} 
                                    onMouseOver={()=>{setIsYearDayPerpetual(false)}}
                                    onMouseOut={()=>{setIsYearDayPerpetual(true)}}
                                >
                                    {(calendarType && isYearDayPerpetual) || (!calendarType && !isYearDayPerpetual)?
                                        <div className="perpetual">{"Y"}</div>
                                        :
                                        <div className="gregorian">{moment(yearDay).format("MMM D YYYY")}</div>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>)
    
}