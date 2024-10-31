import React, { useState, useMemo } from "react";
import { schedules, holidays } from "./data/schedules";
import "./Calendar.css";
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEKDAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(2);
  const [currentYear, setCurrentYear] = useState(2025);
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [activeTooltip, setActiveTooltip] = useState(null);

  // 날짜 관련 유틸리티 함수들
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month - 1, 1);
    const days = [];

    for (let i = 0; i < date.getDay(); i++) {
      days.push(null);
    }

    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  // 달력 날짜 계산을 메모이제이션
  const daysInMonth = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // 현재 날짜 관련
  const today = new Date();
  const isToday = (date) => {
    return (
      date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 공휴일 체크
  const isHoliday = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    return holidays[dateString];
  };

  // Todo 관련 함수들
  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos([
        ...todos,
        {
          text: todoInput.trim(),
          date: new Date(),
          id: Date.now(),
        },
      ]);
      setTodoInput("");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 미니 캘린더 컴포넌트
  const MiniCalendar = ({ year, month, title }) => {
    const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

    return (
      <div className="mini-calendar-wrapper">
        <div className="mini-calendar-title">{title}</div>
        <div className="mini-calendar-grid">
          {WEEKDAYS_KR.map((day, index) => (
            <div
              key={day}
              className={`mini-cal-header ${
                index === 0 ? "sunday" : index === 6 ? "saturday" : ""
              }`}
            >
              {day}
            </div>
          ))}
          {days.map((date, index) => (
            <div
              key={index}
              className={`mini-cal-day ${
                !date
                  ? ""
                  : date.getDay() === 0
                  ? "sunday"
                  : date.getDay() === 6
                  ? "saturday"
                  : ""
              } ${isToday(date) ? "today" : ""}`}
            >
              {date ? date.getDate() : ""}
            </div>
          ))}
        </div>
      </div>
    );
  };
  // 일정 항목 컴포넌트

  const ScheduleItem = ({ schedule, id }) => {
    const handleMouseEnter = () => {
      setActiveTooltip(id);
    };

    const handleMouseLeave = () => {
      setActiveTooltip(null);
    };
    // 일정 텍스트를 항상 2줄로 표시하도록 수정
    const formatText = (text) => {
      return (
        <div className="schedule-content">
          <div className="schedule-text-wrapper">{text}</div>
          <div className="schedule-department-wrapper">
            ({schedule.department})
          </div>
        </div>
      );
    };
    // 일정 글자수 제한
    const truncateText = (text, maxWidth) => {
      let currentWidth = 0;
      let result = "";

      for (let char of text) {
        const charWidth = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(char) ? 2 : 1;
        if (currentWidth + charWidth > maxWidth) {
          return result + "...";
        }
        currentWidth += charWidth;
        result += char;
      }

      return text;
    };

    const handleClick = (e) => {
      e.stopPropagation();
    };
    /*일정 출력*/
    return (
      <div
        className="schedule-item"
        tabIndex={0}
        role="button"
        data-tooltip-active={activeTooltip === id ? "true" : "false"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        {formatText(schedule.text)}
        {activeTooltip === id && (
          <div className="schedule-tooltip">
            <div className="tooltip-text">{schedule.text}</div>
            <div className="tooltip-department">({schedule.department})</div>
          </div>
        )}
      </div>
    );
  };
  // 캘린더 헤더 컴포넌트
  const CalendarHeader = () => {
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    return (
      <div className="calendar-header">
        <div className="header-section year-month">
          <div className="year-display">{currentYear}</div>
          <div className="month-navigation">
            <button
              onClick={() => {
                if (currentMonth === 1) {
                  setCurrentMonth(12);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="nav-button"
              aria-label="이전 월로 이동"
            >
              ＜
            </button>
            <h2>{String(currentMonth).padStart(2, "0")}</h2>
            <button
              onClick={() => {
                if (currentMonth === 12) {
                  setCurrentMonth(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="nav-button"
              aria-label="다음 월로 이동"
            >
              ＞
            </button>
          </div>
        </div>
        <div className="header-section todo-section">
          <div className="todo-container">
            <h2>TO DO LIST</h2>
            <div className="todo-input-container">
              <label htmlFor="todo-input" className="sr-only">
                할 일 입력
              </label>
              <input
                id="todo-input"
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addTodo();
                  }
                }}
                placeholder="입력해주세요"
                className="todo-input"
              />
              <button
                onClick={addTodo}
                className="todo-add-button"
                aria-label="할 일 추가"
              >
                +
              </button>
            </div>
          </div>
          <div className="todo-list">
            <div className="grid-background"></div>
            <div className="todo-items">
              {todos.map((todo) => (
                <div key={todo.id} className="todo-item">
                  <span>{todo.text}</span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="todo-delete-button"
                    aria-label="할 일 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="header-section mini-calendars">
          <MiniCalendar
            year={prevYear}
            month={prevMonth}
            title={`${prevMonth}월`}
          />
          <MiniCalendar
            year={nextYear}
            month={nextMonth}
            title={`${nextMonth}월`}
          />
        </div>
      </div>
    );
  };

  // 캘린더 월 렌더링
  const renderMonth = (year, month) => {
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;

    return (
      <div className="month-container">
        <div className="calendar-grid">
          {WEEKDAYS.map((day, index) => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
          {daysInMonth.map((date, index) => {
            if (!date) return <div key={index} className="calendar-day"></div>;

            const holiday = isHoliday(date);
            const isWeekend = date.getDay() === 0;
            const dateColor = holiday || isWeekend ? "text-red-600" : "";

            return (
              <div
                key={index}
                className={`calendar-day ${isToday(date) ? "today" : ""}`}
              >
                <div className={`date-number ${dateColor}`}>
                  {date.getDate()}
                  {holiday && <div className="holiday-name">{holiday}</div>}
                </div>
                <div
                  className={`schedule-list ${
                    schedules[monthKey]?.[date.getDate()]?.length > 3
                      ? "has-more"
                      : ""
                  }`}
                >
                  {schedules[monthKey]?.[date.getDate()]?.map((schedule, i) => (
                    <ScheduleItem
                      key={i}
                      id={`${date.getDate()}-${i}`}
                      schedule={schedule}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <CalendarHeader />
      <div className="calendar-body">
        {renderMonth(currentYear, currentMonth)}
      </div>
    </div>
  );
};

export default Calendar;
