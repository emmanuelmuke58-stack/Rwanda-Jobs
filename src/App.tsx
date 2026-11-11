import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase.ts';

// Pages
import Home from './pages/Home.tsx';
import FindJobs from './pages/FindJobs.tsx';
import JobDetails from './pages/JobDetails.tsx';
import Tenders from './pages/Tenders.tsx';
import Announcements from './pages/Announcements.tsx';
import AdminDashboard from './pages/Admin/Dashboard.tsx';
import AdminLogin from './pages/Admin/Login.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Companies from './pages/Companies.tsx';

// Layout
import Navbar from './components/layout/Navbar.tsx';
import Footer from './components/layout/Footer.tsx';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827] font-inter">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-jobs" element={<FindJobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/*" 
                element={
                  loading ? (
                    <div className="flex items-center justify-center h-96">Loading...</div>
                  ) : user ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/admin/login" />
                  )
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
