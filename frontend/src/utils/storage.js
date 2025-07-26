const STORAGE_KEYS = {
  ISSUES: 'scit_issues',
  CURRENT_USER: 'scit_current_user',
  USERS: 'scit_users'
};

// Mock users for demonstration
const defaultUsers = [
  {
    id: '1',
    name: 'John Citizen',
    email: 'john@example.com',
    role: 'citizen'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@city.gov',
    role: 'admin'
  }
];

export const getStoredIssues = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.ISSUES);
  return stored ? JSON.parse(stored) : [];
};

export const storeIssue = (issue) => {
  const issues = getStoredIssues();
  const existingIndex = issues.findIndex(i => i.id === issue.id);
  
  if (existingIndex >= 0) {
    issues[existingIndex] = issue;
  } else {
    issues.push(issue);
  }
  
  localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getUsers = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};
