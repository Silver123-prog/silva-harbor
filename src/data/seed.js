export const tasksKey = (userId) => `harbor-tasks:${userId}`;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

// Sample tasks, used only by the "Try the demo" account.
export const demoTasks = [
  { id: "s1", title: "Plan the week", notes: "Pick three things that matter most.", priority: "high", due: "", done: true, createdAt: daysAgo(3), completedAt: daysAgo(2) },
  { id: "s2", title: "Reply to design feedback", notes: "", priority: "medium", due: "", done: true, createdAt: daysAgo(3), completedAt: daysAgo(1) },
  { id: "s3", title: "Book dentist appointment", notes: "", priority: "low", due: "", done: true, createdAt: daysAgo(2), completedAt: daysAgo(1) },
  { id: "s4", title: "Finish portfolio case study", notes: "Add the before/after screenshots and a short summary.", priority: "high", due: "", done: false, createdAt: daysAgo(1), completedAt: null },
  { id: "s5", title: "Read two chapters", notes: "", priority: "low", due: "", done: false, createdAt: daysAgo(1), completedAt: null },
  { id: "s6", title: "Groceries", notes: "Rice, tomatoes, fish, plantain.", priority: "medium", due: "", done: false, createdAt: daysAgo(0), completedAt: null },
];
