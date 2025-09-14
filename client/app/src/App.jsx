import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">IT Resource Bank</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/curriculum">Curriculum</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/faculty">Faculty</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>
        </ul>
      </div>
    </nav>
  );
}

function PageContainer({ title, children }) {
  return (
    <div className="container py-4">
      <h1 className="display-6 mb-4">{title}</h1>
      {children}
    </div>
  );
}

function Home() {
  return (
    <PageContainer title="Home">
      <p>Welcome to the IT Resource Bank.</p>
      <p><a className="btn btn-primary" href="/login">Go to Login</a></p>
    </PageContainer>
  );
}

function Curriculum() {
  return (
    <PageContainer title="Curriculum">
      <p>Choose your semester to view subjects.</p>
      <div className="d-flex gap-2 flex-wrap">
        {[1,2,3,4,5,6,7,8].map((s)=> (
          <a key={s} className="btn btn-outline-primary" href={`/semester?sem=${s}`}>Semester {s}</a>
        ))}
      </div>
    </PageContainer>
  );
}

function Faculty() {
  return (
    <PageContainer title="Faculty">
      <p>Faculty information is available on the original page.</p>
      <p><a className="btn btn-outline-secondary" href="/faculty">Open server page</a></p>
    </PageContainer>
  );
}

function Support() {
  return (
    <PageContainer title="Support">
      <p>For feedback, use the existing form.</p>
      <p><a className="btn btn-outline-secondary" href="/support">Open feedback</a></p>
    </PageContainer>
  );
}

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
