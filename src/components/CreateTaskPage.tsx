// src/components/CreateTaskPage.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '../contexts/useTasks';

function CreateTaskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTask, categories } = useTasks();

  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [time, setTime] = useState('');
  const [tag, setTag] = useState(categories[0]?.name || '');
  const [description, setDescription] = useState('');


  const handleCreate = () => {
    if (!text.trim()) {
      alert('Please enter a task name.');
      return;
    }
    const selectedCategory = categories.find(c => c.name === tag);
    if (!selectedCategory) {
      alert('Please select a valid category.');
      return;
    }

    const newTaskId = addTask({
      text,
      time: time || 'Anytime',
      startDate,
      tag: selectedCategory.name,
      tagColor: selectedCategory.color,
      description,
    });

    const from = location.state?.from;
    const goalData = location.state?.goalData;

    if (from === `/goal-details/${goalData.id}`) {
      const updatedGoalTasks = [...(goalData.tasks || []), newTaskId];
      navigate(from, { state: { goalData: { ...goalData, tasks: updatedGoalTasks } } });
    } else if (from === '/create-goal') {
      navigate(from, { state: { newTaskId, goalData } });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-20">
      <div className="flex h-full w-full flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80">
          <button onClick={() => navigate(-1)} className="flex items-center justify-start">
            <p className="shrink-0 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Cancel</p>
          </button>
          <button onClick={handleCreate} className="flex items-center justify-end">
            <p className="shrink-0 text-base font-bold leading-normal tracking-[0.015em] text-primary">Create</p>
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 pt-0">
          <div className="flex flex-col gap-4">
            <input
              className="form-input h-16 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-card-light p-4 text-2xl font-bold leading-tight tracking-[-0.015em] text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
              placeholder="e.g., Finish Q3 report"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <div className="flex flex-wrap items-end gap-4">
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Due Date</p>
                  <div className="relative">
                    <input
                      type="date"
                      className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">calendar_today</span>
                  </div>
                </label>
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Time</p>
                  <div className="relative">
                    <input
                      type="time"
                      className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">schedule</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <div className="flex flex-col">
                <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Category</p>
                <div className="relative flex h-14 w-full items-center rounded-lg border-none bg-input-light p-4 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary">
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-transparent appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <label className="flex flex-1 flex-col min-w-40">
                <p className="text-base font-medium leading-normal pb-2 text-text-light-primary dark:text-text-dark-primary">Description</p>
                <textarea
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-0 border-none bg-input-light dark:bg-input-dark min-h-36 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary p-4 text-base font-normal leading-normal"
                  placeholder="Add more details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateTaskPage;
