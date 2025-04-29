'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Calendar } from '@/components/Calendar';
import { TeamManagement } from '@/components/TeamManagement';
import { exportToCsv } from '@/lib/utils';
import { getEvents } from '@/lib/firebaseData';
import { FiDownload, FiSettings, FiCheck, FiCalendar, FiKey, FiShield, FiHome } from 'react-icons/fi';
import Confetti from 'react-confetti';
import Link from 'next/link';

export default function AdminPage() {
  const [isExportSuccessful, setIsExportSuccessful] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);
  const [teamManagementLastClosed, setTeamManagementLastClosed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    const authDataStr = localStorage.getItem('adminAuthData');
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        const now = new Date().getTime();
        
        if (authData.expiry && authData.expiry > now) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminAuthData');
        }
      } catch {
        localStorage.removeItem('adminAuthData');
      }
    }

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const events = await getEvents();
      await exportToCsv(events);
      setIsExportSuccessful(true);
      setTimeout(() => setIsExportSuccessful(false), 3000);
    } catch (error) {
      console.error('CSVエクスポートエラー:', error);
      alert('CSVエクスポート中にエラーが発生しました。');
    } finally {
      setIsExporting(false);
    }
  };

  const handleTeamManagementClose = () => {
    setIsTeamManagementOpen(false);
    setTeamManagementLastClosed(Date.now());
  };

  const handleReportCompleted = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
      
      if (password === correctPassword) {
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setDate(now.getDate() + 2);
        
        const authData = {
          isAuthenticated: true,
          expiry: expiryDate.getTime()
        };
        
        localStorage.setItem('adminAuthData', JSON.stringify(authData));
        setIsAuthenticated(true);
      } else {
        setError('管理者パスワードが正しくありません');
        setPassword('');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      setError('認証中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-blue-50">
      <header className="bg-blue-600 text-white shadow-lg flex-shrink-0">
        <div className="max-w-6xl mx-auto py-3 px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white p-1.5 rounded-full shadow-md mr-3">
              <FiShield className="text-xl text-blue-600" />
            </div>
            <h1 className="text-lg md:text-xl font-bold">
              HSカメラ 管理者ページ
            </h1>
          </div>
          <Link 
            href="/" 
            className="bg-white/20 hover:bg-white/30 text-white rounded-md px-3 py-1.5 text-sm flex items-center transition-colors"
          >
            <FiHome className="mr-1.5" />
            予約ページへ
          </Link>
        </div>
      </header>
      
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#3B82F6', '#60A5FA', '#93C5FD', '#4F46E5', '#10B981', '#F59E0B']}
          gravity={0.3}
          initialVelocityX={15}
          initialVelocityY={30}
          confettiSource={{
            x: windowSize.width / 2,
            y: windowSize.height / 2,
            w: 0,
            h: 0
          }}
          tweenDuration={100}
          wind={0.05}
        />
      )}
      <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto w-full flex flex-col overflow-hidden flex-1">
          {isAuthenticated ? (
            <>
              <div className="flex justify-end mb-4 space-x-3">
                <Button 
                  onClick={handleExportCSV}
                  className="flex items-center"
                  variant="blue"
                  disabled={isExporting}
                >
                  <FiDownload className="mr-1" />
                  {isExporting ? 'エクスポート中...' : 'CSV出力'}
                </Button>
                <Button 
                  variant="blue-outline"
                  onClick={() => setIsTeamManagementOpen(true)}
                  className="flex items-center"
                >
                  <FiSettings className="mr-1" />
                班管理
                </Button>
              </div>
              
              {isExportSuccessful && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-xl border border-green-300 flex items-center">
                  <FiCheck className="mr-2 text-green-600" />
                  CSVファイルがダウンロードされました
                </div>
              )}
              
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-2 border-blue-100 flex-1 overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold text-blue-600 mb-3 flex items-center flex-shrink-0">
                  <span className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <FiCalendar className="text-blue-500" />
                  </span>
                  管理者カレンダー
                </h2>
                <div className="flex-1 overflow-auto min-h-0">
                  <Calendar key={`admin-calendar-${teamManagementLastClosed}`} onReportCompleted={handleReportCompleted} readOnly={true} isAdmin={true} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShield className="text-3xl text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">管理者認証</h2>
                  <p className="text-gray-600 mt-2">
                    管理者ページにアクセスするには、パスワードを入力してください。
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      管理者パスワード
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiKey className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="管理者パスワードを入力"
                        required
                        autoFocus
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">
                        {error}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center"
                    variant="blue"
                    disabled={isSubmitting || !password}
                  >
                    {isSubmitting ? '認証中...' : '管理者として認証'}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
        
        {isAuthenticated && (
          <TeamManagement 
            isOpen={isTeamManagementOpen}
            onClose={handleTeamManagementClose}
          />
        )}
      </main>
    </div>
  );
}
