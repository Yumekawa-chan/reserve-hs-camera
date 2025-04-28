'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Calendar } from '@/components/Calendar';
import { TeamManagement } from '@/components/TeamManagement';
import { Header } from '@/components/Header';
import { exportToCsv } from '@/lib/utils';
import { getEvents } from '@/lib/firebaseData';
import { FiDownload, FiSettings, FiCheck, FiCalendar } from 'react-icons/fi';
import Confetti from 'react-confetti';

export default function Home() {
  const [isExportSuccessful, setIsExportSuccessful] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);
  const [teamManagementLastClosed, setTeamManagementLastClosed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

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

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-pink-50">
      <Header />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#EC4899', '#F472B6', '#F9A8D4', '#4F46E5', '#10B981', '#F59E0B']}
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
          <div className="flex justify-end mb-4 space-x-3">
            <Button 
              onClick={handleExportCSV}
              className="flex items-center"
              variant="primary"
              disabled={isExporting}
            >
              <FiDownload className="mr-1" />
              {isExporting ? 'エクスポート中...' : 'CSV出力'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsTeamManagementOpen(true)}
              className="flex items-center"
            >
              <FiSettings className="mr-1" />
              設定
            </Button>
          </div>
          
          {isExportSuccessful && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-xl border border-green-300 flex items-center">
              <FiCheck className="mr-2 text-green-600" />
              CSVファイルがダウンロードされました
            </div>
          )}
          
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-2 border-pink-100 flex-1 overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold text-pink-600 mb-3 flex items-center flex-shrink-0">
              <span className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <FiCalendar className="text-pink-500" />
              </span>
              予約カレンダー
            </h2>
            <div className="flex-1 overflow-auto min-h-0">
              <Calendar key={`calendar-${teamManagementLastClosed}`} onReportCompleted={handleReportCompleted} />
            </div>
          </div>
        </div>
        
        <TeamManagement 
          isOpen={isTeamManagementOpen}
          onClose={handleTeamManagementClose}
        />
      </main>
    </div>
  );
}
