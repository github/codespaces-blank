// src/components/CreateGoalPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoals } from '../contexts/useGoals';
import { useTasks } from '../contexts/useTasks';

function CreateGoalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addGoal, goals } = useGoals();
  const { tasks } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

  const assignedTaskIds = new Set(goals.flatMap(goal => goal.tasks));

  const incompleteTasks = tasks.filter(task => 
    !task.isCompleted && 
    (!assignedTaskIds.has(task.id) || selectedTaskIds.includes(task.id))
  );

  useEffect(() => {
    setTimeout(() => {
      if (location.state?.goalData) {
        const { goalData, newTaskId } = location.state;
        setTitle(goalData.title || '');
        setDescription(goalData.description || '');
        setTargetDate(goalData.targetDate || '');

        let taskIds = goalData.selectedTaskIds || [];
        if (newTaskId && !taskIds.includes(newTaskId)) {
          taskIds = [...taskIds, newTaskId];
        }
        setSelectedTaskIds(taskIds);
      }
    }, 0);
  }, [location.state]);


  const handleCreateGoal = () => {
    if (!title.trim()) {
      alert('Please enter a goal title.');
      return;
    }
    addGoal({
      title,
      description,
      targetDate,
      tasks: selectedTaskIds,
      completed: false,
    });
    navigate('/');
  };

  const handleTaskSelection = (taskId: number) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleAddNewTaskClick = () => {
    navigate('/create-task', {
      state: {
        from: '/create-goal',
        goalData: { title, description, targetDate, selectedTaskIds },
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-20">
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80">
          <button onClick={() => navigate(-1)} className="flex items-center justify-start">
            <p className="shrink-0 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Cancel</p>
          </button>
          <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-text-dark-primary">New Goal</h2>
          <button onClick={handleCreateGoal} className="flex items-center justify-end">
            <p className="shrink-0 text-base font-bold leading-normal tracking-[0.015em] text-primary">Create</p>
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 pt-2">
          <div className="flex flex-col gap-4">
            {/* Goal Title Input */}
            <input
              className="form-input h-16 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-card-light p-4 text-2xl font-bold leading-tight tracking-[-0.015em] text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
              placeholder="e.g., Learn Advanced UI Design"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Details Section */}
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              {/* Description */}
              <label className="flex flex-1 flex-col">
                <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Description</p>
                <textarea
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                  placeholder="Add a description..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </label>

              {/* Target Date */}
              <label className="flex flex-1 flex-col">
                <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Target Date</p>
                <div className="relative">
                  <input
                    type="date"
                    className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                  <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">calendar_today</span>
                </div>
              </label>
            </div>

            {/* Tasks Section */}
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <label className="text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Tasks</label>
              <div className="flex flex-col divide-y divide-border-light rounded-lg border border-border-light bg-input-light dark:divide-border-dark dark:border-border-dark dark:bg-input-dark">
                {incompleteTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-x-3 p-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary"
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => handleTaskSelection(task.id)}
                    />
                    <span className="flex-1 text-base text-text-light-primary dark:text-text-dark-primary">{task.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-x-3 p-3">
                  <button
                    onClick={handleAddNewTaskClick}
                    className="flex w-full items-center gap-x-3 text-text-light-primary dark:text-text-dark-primary"
                  >
                    <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">add</span>
                    <span className="text-base">Add a new task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateGoalPage;