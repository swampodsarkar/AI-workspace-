import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ChatAI from './pages/ChatAI'
import PdfTools from './pages/PdfTools'
import DocumentEditor from './pages/DocumentEditor'
import ImageGenerator from './pages/ImageGenerator'
import ExcelAI from './pages/ExcelAI'
import CodeAI from './pages/CodeAI'
import WebsiteBuilder from './pages/WebsiteBuilder'
import EmailWriter from './pages/EmailWriter'
import DataAnalysis from './pages/DataAnalysis'
import CloudStorage from './pages/CloudStorage'
import Earn from './pages/Earn'
import Spin from './pages/Spin'
import MemeGenerator from './pages/MemeGenerator'
import Referral from './pages/Referral'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-dark-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-400 text-sm">Loading...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="chat" element={<ChatAI />} />
        <Route path="pdf" element={<PdfTools />} />
        <Route path="documents" element={<DocumentEditor />} />
        <Route path="image" element={<ImageGenerator />} />
        <Route path="excel" element={<ExcelAI />} />
        <Route path="code" element={<CodeAI />} />
        <Route path="website" element={<WebsiteBuilder />} />
        <Route path="email" element={<EmailWriter />} />
        <Route path="analysis" element={<DataAnalysis />} />
        <Route path="storage" element={<CloudStorage />} />
        <Route path="earn" element={<Earn />} />
        <Route path="spin" element={<Spin />} />
        <Route path="meme" element={<MemeGenerator />} />
        <Route path="referral" element={<Referral />} />
      </Route>
    </Routes>
  )
}
