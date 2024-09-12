import './App.css';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<SignUp/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
   
    </>
    
  );
}

export default App;
