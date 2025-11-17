import { useState } from 'react';
import { useTasks } from '../contexts/useTasks';
import { Link } from 'react-router-dom';

function PlannerPage() {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Adjust to start on Monday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);

  // Helper to convert time string (e.g., "10:00 AM") to minutes from midnight
  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let finalHours = hours;
    if (hours === 12) {
      finalHours = modifier === 'AM' ? 0 : 12;
    } else {
      finalHours = modifier === 'PM' ? hours + 12 : hours;
    }
    return finalHours * 60 + minutes;
  };

  // Constants for timeline layout
  const START_HOUR = 9; // 9 AM
  const PIXELS_PER_HOUR = 7 * 16; // h-28 = 7rem = 112px

  return (
    <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary font-display">
      {/* Top App Bar */}
      <header className="flex shrink-0 items-center justify-between bg-background-light dark:bg-background-dark px-4 pt-4 pb-2">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Planner</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      </header>

      {/* Horizontal Calendar Scroll */}
      <div className="shrink-0 overflow-x-auto">
        <div className="flex border-b border-gray-200 dark:border-gray-800 px-4 gap-3">
          {weekDays.map((day) => {
            const isSelected = formatDate(day) === formatDate(currentDate);
            return (
              <a
                key={day.toISOString()}
                className={`flex shrink-0 flex-col items-center justify-center gap-2 rounded-t-lg px-2 pb-2 pt-3 ${isSelected ? 'bg-primary/10' : ''}`}
                href="#"
                onClick={() => setCurrentDate(day)}
              >
                <p className={`text-xs font-medium uppercase ${isSelected ? 'text-primary font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                  {day.toLocaleString('default', { weekday: 'short' })}
                </p>
                <div className={`flex size-8 items-center justify-center rounded-full ${isSelected ? 'bg-primary text-white' : ''}`}>
                  <p className={`text-sm font-semibold ${isSelected ? 'font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                    {day.getDate()}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Main Content: Vertical Timeline */}
      <main className="flex-1 overflow-y-auto px-4 pt-6">
        <div className="relative grid grid-cols-[auto_1fr] gap-x-3">
          {/* Hour Labels */}
          <div className="flex flex-col text-right">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-28 text-xs font-medium text-gray-400 dark:text-gray-500">
                {i + START_HOUR > 12 ? i + START_HOUR - 12 : i + START_HOUR} {i + START_HOUR >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>

          {/* Timeline & Events */}
          <div className="relative">
            {/* Timeline Dividers */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-28 border-b border-gray-200 dark:border-gray-800"></div>
              ))}
            </div>

            {/* Event Cards Container */}
            <div className="relative h-full">
              {tasks
              .filter(task => task.startDate === formatDate(currentDate))
              .map(task => {
                const startMinutes = timeToMinutes(task.time);
                // Assuming a default duration of 1 hour if no end time is provided
                const endMinutes = task.endDate ? timeToMinutes(task.endDate) : startMinutes + 60;
                const durationMinutes = endMinutes - startMinutes;

                const top = ((startMinutes - START_HOUR * 60) / 60) * PIXELS_PER_HOUR;
                const height = (durationMinutes / 60) * PIXELS_PER_HOUR;

                if (top < 0) return null; // Don't render tasks before the start hour

                return (
                  <div key={task.id} className="absolute w-full" style={{ top: `${top}px`, height: `${height}px` }}>
                    <div className="relative h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800/50 shadow-sm mr-2">
                      <div className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: task.tagColor }}></div>
                      <div className="flex items-start gap-2 pl-4 pr-2 pt-2">
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{task.text}</p>
                          {task.description && <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="h-24"></div> {/* Spacer for Bottom Nav */}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 shrink-0 border-t border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 pb-3 pt-2">
        <div className="flex">
          <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined">sunny</span>
            <p className="text-xs font-medium">Dashboard</p>
          </Link>
          <Link to="/planner" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
            <span className="material-symbols-outlined font-bold">calendar_month</span>
            <p className="text-xs font-bold">Planner</p>
          </Link>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400" href="#">
            <span className="material-symbols-outlined">repeat</span>
            <p className="text-xs font-medium">Habits</p>
          </a>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400" href="#">
            <span className="material-symbols-outlined">track_changes</span>
            <p className="text-xs font-medium">Goals</p>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default PlannerPage;