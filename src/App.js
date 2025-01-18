import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './Components/Layout';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App;