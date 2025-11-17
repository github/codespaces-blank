// This is src/components/Dashboard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../contexts/useTasks';
import { useGoals } from '../contexts/useGoals'; // Import useGoals

function Dashboard() {
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const { goals } = useGoals(); // Consume goals from context

  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'Dashboard' | 'Tomorrow' | 'Week'>('Dashboard');

  if (!tasks || !goals) { // Check for goals as well
    return <div>Loading...</div>;
  }

  const isTomorrow = (taskDate?: string) => {
    if (!taskDate) return false;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const task = new Date(taskDate);

    return task.getDate() === tomorrow.getDate() &&
           task.getMonth() === tomorrow.getMonth() &&
           task.getFullYear() === tomorrow.getFullYear();
  };

  const getFilteredTasks = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    switch (selectedFilter) {
      case 'Dashboard':
        return tasks.filter(task => {
          if (!task.startDate) return true; // Tasks without a start date are considered for 'Dashboard'
          return task.startDate === todayString;
        });
      case 'Tomorrow':
        return tasks.filter(task => isTomorrow(task.startDate));
      case 'Week':
        // Implement week filtering logic here if needed, for now return all tasks
        return tasks;
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const incompleteTasks = tasks.filter(task => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return !task.isCompleted && (!task.startDate || task.startDate === todayString);
  }).length;

  return (
    <div className="relative flex h-screen w-full flex-col group/design-root overflow-hidden text-text-light-primary dark:text-text-dark-primary font-display bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="flex flex-col gap-2 p-4 pb-2">
        <div className="flex items-center h-12 justify-between">
          <h1 className="text-text-light-primary dark:text-text-dark-primary tracking-light text-[28px] font-bold leading-tight">Hi, Omar!</h1>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card-light dark:bg-card-dark">
            <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">notifications</span>
          </div>
        </div>
        <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal">
          You have {incompleteTasks} {incompleteTasks === 1 ? 'task' : 'tasks'} for today.
        </p>
      </div>

      {/* My Goals Section */}
      <h2 className="text-text-light-primary dark:text-text-dark-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">My Goals</h2>
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 pr-1">
        {goals.map((goal) => {
          const goalTasks = tasks.filter(task => goal.tasks.includes(task.id));
          const completedGoalTasks = goalTasks.filter(task => task.isCompleted).length;
          const progress = goalTasks.length > 0 ? (completedGoalTasks / goalTasks.length) * 100 : 0;

          return (
            <Link to={`/goal-details/${goal.id}`} key={goal.id} className="flex-shrink-0 w-64 rounded-xl bg-card-light dark:bg-card-dark p-4 mr-3 shadow-md">
              <div>
                <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">{goal.title}</h3>
                {goal.description && <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">{goal.description}</p>}
                {goal.targetDate && <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">Target: {goal.targetDate}</p>}
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">{Math.round(progress)}% Complete</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* My Habits Section */}
      <h2 className="text-text-light-primary dark:text-text-dark-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">My Habits</h2>
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 pr-1">
        {/* ... Habit Icons ... */}
      </div>

      {/* Tasks Section */}
      <main className="flex-1 overflow-y-auto px-4 pt-5">
        <h2 className="text-text-light-primary dark:text-text-dark-primary text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">Tasks</h2>
        <div className="flex w-full items-center gap-2 rounded-lg bg-background-light dark:bg-card-dark p-1 mb-4">
          <button
            onClick={() => setSelectedFilter('Dashboard')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${selectedFilter === 'Dashboard' ? 'bg-primary text-white' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setSelectedFilter('Tomorrow')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${selectedFilter === 'Tomorrow' ? 'bg-primary text-white' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setSelectedFilter('Week')}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${selectedFilter === 'Week' ? 'bg-primary text-white' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}
          >
            Week
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 rounded-xl bg-card-light dark:bg-card-dark p-4">
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                  task.isCompleted ? 'border-primary bg-primary' : 'border-text-light-secondary/50 dark:border-text-dark-secondary/50'
                }`}
              >
                {task.isCompleted && <span className="material-symbols-outlined text-white !text-lg">check</span>}
              </button>
              <div className="flex-1">
                <p className={`text-base font-medium ${task.isCompleted ? 'line-through' : ''}`}>{task.text}</p>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{task.time}</p>
              </div>
              <div
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: `${task.tagColor}20`, color: task.tagColor }}
              >
                {task.tag}
              </div>
              <div className="flex gap-2">
                <Link to={`/edit-task/${task.id}`} className="text-primary text-sm">Edit</Link>
                <button onClick={() => deleteTask(task.id)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="h-24"></div> {/* Spacer for FAB and Bottom Nav */}
      </main>
      
      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-4 z-10">
        {isFabMenuOpen && (
          <div className="flex flex-col items-end gap-4 mb-4">
            <Link to="/create-task" className="flex items-center gap-3 bg-card-light dark:bg-card-dark p-3 rounded-lg shadow-lg">
              <span className="font-medium">Task</span>
              <span className="material-symbols-outlined">task</span>
            </Link>
            <Link to="/create-goal" className="flex items-center gap-3 bg-card-light dark:bg-card-dark p-3 rounded-lg shadow-lg">
              <span className="font-medium">Goal</span>
              <span className="material-symbols-outlined">flag</span>
            </Link>
            <div className="flex items-center gap-3 bg-card-light dark:bg-card-dark p-3 rounded-lg shadow-lg">
              <span className="font-medium">Habit</span>
              <span className="material-symbols-outlined">sync</span>
            </div>
          </div>
        )}
        <button onClick={() => setIsFabMenuOpen(!isFabMenuOpen)} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg">
          <span className="material-symbols-outlined !text-3xl">{isFabMenuOpen ? 'close' : 'add'}</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 pb-3 pt-2">
        <div className="flex">
          <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
            <span className="material-symbols-outlined font-bold">sunny</span>
            <p className="text-xs font-bold">Dashboard</p>
          </Link>
          <Link to="/planner" className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined">calendar_month</span>
            <p className="text-xs font-medium">Planner</p>
          </Link>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400" href="#">
            <span className="material-symbols-outlined">repeat</span>
            <p className="text-xs font-medium">Habits</p>
          </a>
          <Link to="/goals" className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined">track_changes</span>
            <p className="text-xs font-medium">Goals</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Dashboard;