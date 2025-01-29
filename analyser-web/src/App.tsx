import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnalysesPage } from './pages/analyses';
import { AnalysisDetailsPage } from './pages/analysis-details';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnalysesPage />} />
        <Route path="/analysis/:id" element={<AnalysisDetailsPage />} />
      </Routes>
    </Router>
  );
}
