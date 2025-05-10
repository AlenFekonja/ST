import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UserList from './components/userList.tsx';
import TaskList from './components/taskList.tsx';
import RewardList from './components/rewardList.tsx';
import PreferenceList from './components/preferenceList.tsx';
import UserRewardList from './components/userRewardList.tsx';
import AuthPage from "./components/auth.tsx";
import Layout from './layout.tsx';
import { ServiceWorker } from './serviceWorker.tsx';
import Shortcuts from './components/shortcuts.tsx';
import Register from './components/register.tsx';
import TaskForm from './components/taskForm.tsx';
import PreferenceForm from './components/preferenceForm.tsx';
import RewardForm from './components/rewardForm.tsx';
import Profile from "./components/profile.tsx";

export function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
    });
  } else {
    console.log("Notification permission not granted");
  }
}

function App() {
  ServiceWorker();
  return (
    <Router>
      <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}> 
        <Route path="/preferences" element={<PreferenceList />} />
        <Route path="/preferences/add" element={<PreferenceForm />} />
        <Route path="/preferences/edit/:id" element={<PreferenceForm />} />
        <Route path="/rewards" element={<RewardList />} />
        <Route path="/rewards/add" element={<RewardForm />} />
        <Route path="/rewards/edit/:id" element={<RewardForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/add" element={<TaskForm />} />
        <Route path="/tasks/edit/:id" element={<TaskForm />} />
        <Route path="/myRewards" element={<UserRewardList />} />
        <Route path="/shortcuts" element={<Shortcuts />} />
        <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;