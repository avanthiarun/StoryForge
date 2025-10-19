import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GenerateStoryPage } from './pages/GenerateStoryPage';
import { ViewStoryPage } from './pages/ViewStoryPage';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <main className={user ? "pt-16" : ""}>
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <LoginPage />} 
            />
            <Route 
              path="/" 
              element={user ? <HomePage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/projects" 
              element={user ? <ProjectsPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/generate/:projectId" 
              element={user ? <GenerateStoryPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/story/:storyId" 
              element={user ? <ViewStoryPage /> : <Navigate to="/login" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
