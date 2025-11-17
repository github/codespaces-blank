// src/components/GoalDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoals } from '../contexts/useGoals';
import { useTasks } from '../contexts/useTasks';
import { type Goal } from '../types';

function GoalDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getGoal, updateGoal, deleteGoal } = useGoals();
  const { tasks, updateTask } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    description: '',
    targetDate: '',
    tasks: [],
    completed: false,
  });

  const goalId = id || '';
  const currentGoal = getGoal(goalId);

  useEffect(() => {
    if (currentGoal) {
      setTimeout(() => {
        setFormData({
          title: currentGoal.title,
          description: currentGoal.description || '',
          targetDate: currentGoal.targetDate || '',
          tasks: currentGoal.tasks || [],
          completed: currentGoal.completed,
        });
      }, 0);
    }
  }, [currentGoal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.title?.trim()) {
      alert('Please enter a goal title.');
      return;
    }
    updateGoal(goalId, formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
      navigate('/');
    }
  };

  const handleTaskCompletionToggle = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { isCompleted: !task.isCompleted });
    }
  };

  const handleMarkGoalComplete = () => {
    updateGoal(goalId, { completed: !formData.completed });
    setFormData((prev) => ({ ...prev, completed: !prev.completed }));
  };

  const incompleteTasks = tasks.filter(task => formData.tasks?.includes(task.id) && !task.isCompleted);
  const completedTasks = tasks.filter(task => formData.tasks?.includes(task.id) && task.isCompleted);

  const totalTasks = formData.tasks?.length || 0;
  const completedTaskCount = completedTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTaskCount / totalTasks) * 100 : 0;

  if (!currentGoal) {
    return (
      <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-20 flex items-center justify-center">
        <p className="text-text-light-primary dark:text-text-dark-primary">Goal not found.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-20">
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80">
          <button onClick={() => navigate(-1)} className="flex items-center justify-start">
            <p className="shrink-0 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Back</p>
          </button>
          <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-text-dark-primary">
            {isEditing ? 'Edit Goal' : currentGoal.title}
          </h2>
          {isEditing ? (
            <button onClick={handleSave} className="flex items-center justify-end">
              <p className="shrink-0 text-base font-bold leading-normal tracking-[0.015em] text-primary">Save</p>
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center justify-end">
              <p className="shrink-0 text-base font-bold leading-normal tracking-[0.015em] text-primary">Edit</p>
            </button>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 pt-2">
          <div className="flex flex-col gap-4">
            {/* Goal Title Input (Editable) */}
            {isEditing ? (
              <input
                className="form-input h-16 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-card-light p-4 text-2xl font-bold leading-tight tracking-[-0.015em] text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                placeholder="e.g., Learn Advanced UI Design"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            ) : (
              <h1 className="h-16 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-card-light p-4 text-2xl font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:bg-card-dark dark:text-text-dark-primary">
                {currentGoal.title}
              </h1>
            )}

            {/* Progress Card */}
            <div className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Tasks Completed</p>
                  <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary">{completedTaskCount}/{totalTasks}</p>
                </div>
                <div className="rounded-full bg-border-light dark:bg-border-dark">
                  <div className="h-2.5 rounded-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              {/* Description */}
              <label className="flex flex-1 flex-col">
                <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Description</p>
                {isEditing ? (
                  <textarea
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                    placeholder="Add a description..."
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                ) : (
                  <p className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 text-base font-normal leading-normal text-text-light-primary dark:bg-input-dark dark:text-text-dark-primary">
                    {currentGoal.description || 'No description provided.'}
                  </p>
                )}
              </label>

              {/* Target Date */}
              <label className="flex flex-1 flex-col">
                <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Target Date</p>
                <div className="relative">
                  {isEditing ? (
                    <input
                      type="date"
                      className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary dark:bg-input-dark dark:text-text-dark-primary">
                      {currentGoal.targetDate || 'No target date.'}
                    </p>
                  )}
                  <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">calendar_today</span>
                </div>
              </label>
            </div>

            {/* Tasks Section */}
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <label className="text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Tasks</label>
              <div className="flex flex-col divide-y divide-border-light rounded-lg border border-border-light bg-input-light dark:divide-border-dark dark:border-border-dark dark:bg-input-dark">
                {incompleteTasks.length > 0 && (
                  <>
                    <h3 className="px-3 pt-2 pb-2 text-base font-bold text-text-light-primary dark:text-text-dark-primary">In Progress</h3>
                    {incompleteTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-x-4 py-3.5 px-3">
                        {isEditing ? (
                          <input
                            className="h-5 w-5 rounded-md border-2 border-border-light dark:border-border-dark bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 dark:checked:border-primary"
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleTaskCompletionToggle(task.id)}
                          />
                        ) : (
                          <input
                            className="h-5 w-5 rounded-md border-2 border-border-light dark:border-border-dark bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 dark:checked:border-primary"
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleTaskCompletionToggle(task.id)}
                          />
                        )}
                        <p className="flex-1 text-base font-normal leading-normal text-text-light-primary dark:text-text-dark-primary">{task.text}</p>
                        {isEditing && (
                          <button
                            onClick={() => navigate(`/edit-task/${task.id}`, { state: { from: `/goal-details/${goalId}`, goalData: formData } })}
                            className="text-primary text-sm"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {isEditing && (
                  <div className="flex items-center gap-x-3 p-3">
                    <button
                      onClick={() => navigate('/create-task', { state: { from: `/goal-details/${goalId}`, goalData: formData } })}
                      className="flex w-full items-center gap-x-3 text-text-light-primary dark:text-text-dark-primary"
                    >
                      <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">add</span>
                      <span className="text-base">Add a new task</span>
                    </button>
                  </div>
                )}
                {completedTasks.length > 0 && (
                  <>
                    <h3 className="px-3 pt-6 pb-2 text-base font-bold text-text-light-primary dark:text-text-dark-primary">Completed</h3>
                    {completedTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-x-4 py-3.5 px-3 opacity-60">
                        {isEditing ? (
                          <input
                            className="h-5 w-5 rounded-md border-2 border-border-light dark:border-border-dark bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 dark:checked:border-primary"
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleTaskCompletionToggle(task.id)}
                          />
                        ) : (
                          <input
                            className="h-5 w-5 rounded-md border-2 border-border-light dark:border-border-dark bg-transparent text-primary checked:border-primary checked:bg-primary focus:ring-0 focus:ring-offset-0 dark:checked:border-primary"
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleTaskCompletionToggle(task.id)}
                          />
                        )}
                        <p className="flex-1 text-base font-normal leading-normal text-text-light-primary dark:text-text-dark-primary line-through">{task.text}</p>
                        {isEditing && (
                          <button
                            onClick={() => navigate(`/edit-task/${task.id}`, { state: { from: `/goal-details/${goalId}`, goalData: formData } })}
                            className="text-primary text-sm"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {totalTasks === 0 && !isEditing && (
                  <p className="p-3 text-base text-text-light-secondary dark:text-text-dark-secondary">No tasks linked to this goal.</p>
                )}
                {totalTasks === 0 && isEditing && (
                  <p className="p-3 text-base text-text-light-secondary dark:text-text-dark-secondary">No tasks linked. Add new tasks below.</p>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleDelete}
                className="flex h-12 w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-red-500 px-5 text-base font-bold leading-normal tracking-[0.015em] text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="truncate">Delete Goal</span>
              </button>
            )}
          </div>
        </main>

        {/* Footer Button */}
        {!isEditing && (
          <div className="fixed bottom-0 left-0 right-0 border-t border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 p-4 backdrop-blur-sm">
            <button
              onClick={handleMarkGoalComplete}
              className="flex h-12 w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="truncate">{formData.completed ? 'Mark Goal as Incomplete' : 'Mark Goal as Complete'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalDetailsPage;
