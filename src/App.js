import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './Components/Layout';
import PageLayout from './Components/PageLayout';
import Top from './pages/Top';
import ApplicationManagement from './pages/ApplicationManagement';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<PageLayout />}>
          <Route path="/admin/top" element={<Top />} />
          <Route path="/admin/apply" element={<ApplicationManagement />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App;