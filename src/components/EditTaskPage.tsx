// src/components/EditTaskPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../contexts/useTasks';

function EditTaskPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addTask, editTask, getTask, categories } = useTasks();

  const [formData, setFormData] = useState({
    text: '',
    startDate: '',
    time: '',
    tag: categories[0]?.name || '',
    description: '',
  });

  const isEditMode = id !== undefined;

  useEffect(() => {
    if (isEditMode) {
      const taskId = parseInt(id, 10);
      const task = getTask(taskId);
      if (task) {
        setTimeout(() => {
          setFormData({
            text: task.text,
            startDate: task.startDate || '',
            time: task.time || '',
            tag: task.tag,
            description: task.description || '',
          });
        }, 0);
      }
    } else {
      // Reset form data when not in edit mode (e.g., creating a new task)
      setTimeout(() => {
        setFormData({
          text: '',
          startDate: '',
          time: '',
          tag: categories[0]?.name || '',
          description: '',
        });
      }, 0);
    }
  }, [id, isEditMode, getTask, categories]);

  const handleSave = () => {
    if (!formData.text.trim()) {
      alert('Please enter a task name.');
      return;
    }
    const selectedCategory = categories.find(c => c.name === formData.tag);
    if (!selectedCategory) {
      alert('Please select a valid category.');
      return;
    }

    const taskData = {
      text: formData.text,
      time: formData.time || 'Anytime',
      startDate: formData.startDate,
      tag: selectedCategory.name,
      tagColor: selectedCategory.color,
      description: formData.description,
    };

    if (isEditMode) {
      const taskId = parseInt(id, 10);
      editTask(taskId, taskData);
    } else {
      addTask(taskData);
    }

    const from = location.state?.from;
    const goalData = location.state?.goalData;

    if (from === `/goal-details/${goalData?.id}`) {
      navigate(from, { state: { goalData } });
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
          <button onClick={handleSave} className="flex items-center justify-end">
            <p className="shrink-0 text-base font-bold leading-normal tracking-[0.015em] text-primary">{isEditMode ? 'Update' : 'Create'}</p>
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 pt-0">
          <div className="flex flex-col gap-4">
            <input
              className="form-input h-16 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border-none bg-card-light p-4 text-2xl font-bold leading-tight tracking-[-0.015em] text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:bg-card-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
              placeholder="e.g., Finish Q3 report"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
            <div className="flex flex-col gap-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
              <div className="flex flex-wrap items-end gap-4">
                <label className="flex flex-1 flex-col min-w-40">
                  <p className="pb-2 text-base font-medium leading-normal text-text-light-primary dark:text-text-dark-primary">Due Date</p>
                  <div className="relative">
                    <input
                      type="date"
                      className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-input-light p-4 pr-12 text-base font-normal leading-normal text-text-light-primary placeholder:text-text-light-secondary focus:outline-0 focus:ring-0 dark:bg-input-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-secondary"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditTaskPage;
