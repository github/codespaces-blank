import { useGoals } from '../contexts/useGoals';
import { useTasks } from '../contexts/useTasks';
import { Link } from 'react-router-dom';

function GoalOverviewPage() {
  const { goals } = useGoals();
  const { tasks } = useTasks();

  if (!goals || !tasks) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border-light bg-background-light/80 px-4 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">My Goals</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary-light hover:bg-black/5 dark:text-text-secondary-dark dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-2xl"> more_vert </span>
        </button>
      </header>

      {/* Goals List */}
      <main className="flex-1 space-y-4 p-4 pb-24">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-light bg-card-light p-8 text-center dark:border-border-dark dark:bg-card-dark mt-8">
            <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark">flag</span>
            <h3 className="mt-4 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">No goals yet</h3>
            <p className="mt-1 text-base text-text-secondary-light dark:text-text-secondary-dark">Tap the '+' to create your first one and start your journey!</p>
          </div>
        ) : (
          goals.map(goal => {
            const goalTasks = tasks.filter(task => goal.tasks.includes(task.id));
            const completedGoalTasks = goalTasks.filter(task => task.isCompleted).length;
            const progress = goalTasks.length > 0 ? (completedGoalTasks / goalTasks.length) * 100 : 0;
            const visibleTasks = goalTasks.slice(0, 2); // Show first 2 tasks as in the design

            return (
              <Link to={`/goal-details/${goal.id}`} key={goal.id} className="block">
                <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold leading-tight tracking-tight text-text-primary-light dark:text-text-primary-dark">{goal.title}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-border-light dark:bg-border-dark">
                        <div className="h-2 rounded-full bg-gradient-to-r from-accent-teal to-accent-mint" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{Math.round(progress)}%</p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Linked Tasks ({completedGoalTasks}/{goalTasks.length})</p>
                    {visibleTasks.map(task => (
                      <div className="flex items-center gap-3" key={task.id}>
                        <span className={`material-symbols-outlined ${task.isCompleted ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                          {task.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <p className="flex-1 text-base text-text-primary-light dark:text-text-primary-dark">{task.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-20">
        <Link to="/create-goal" className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined text-3xl"> add </span>
        </Link>
      </div>
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 shrink-0 border-t border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 pb-3 pt-2">
        <div className="flex">
          <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined">sunny</span>
            <p className="text-xs font-medium">Dashboard</p>
          </Link>
          <Link to="/planner" className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined">calendar_month</span>
            <p className="text-xs font-medium">Planner</p>
          </Link>
          <a className="flex flex-1 flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400" href="#">
            <span className="material-symbols-outlined">repeat</span>
            <p className="text-xs font-medium">Habits</p>
          </a>
          <Link to="/goals" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
            <span className="material-symbols-outlined font-bold">track_changes</span>
            <p className="text-xs font-bold">Goals</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default GoalOverviewPage;
