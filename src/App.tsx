import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerForm from './components/CustomerForm';
import TypeSelection from './components/TypeSelection';
import OptionsSelection from './components/OptionsSelection';
import Result from './components/Result';
import './styles/style.css';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerForm />} />
        <Route path="/select-type" element={<TypeSelection />} />
        <Route path="/select-options" element={<OptionsSelection />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;