import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectDashboard from './pages/ProjectDashboard';
import PipelineView from './pages/PipelineView';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectDashboard />} />
          <Route path="/projects/:projectId/pipeline" element={<PipelineView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
