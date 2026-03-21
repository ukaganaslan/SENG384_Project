import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Form from './Form';
import PeopleList from './PeopleList';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: 'blue' }}>Kayıt Formu</Link>
          <Link to="/people" style={{ textDecoration: 'none', color: 'blue' }}>Kişi Listesi</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/people" element={<PeopleList />} /> {}
        </Routes>
      </div>
    </Router>
  );
}

export default App;