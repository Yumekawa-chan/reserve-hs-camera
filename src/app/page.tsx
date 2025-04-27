'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Calendar } from '@/components/Calendar';
import { TeamManagement } from '@/components/TeamManagement';
import { Header } from '@/components/Header';
import { exportToCsv } from '@/lib/utils';
import { getEvents } from '@/lib/mockData';
import { FiDownload, FiSettings, FiCheck, FiCalendar } from 'react-icons/fi';

export default function Home() {
  const [isExportSuccessful, setIsExportSuccessful] = useState(false);
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);

  const handleExportCSV = () => {
    try {
      const events = getEvents();
      exportToCsv(events);
      setIsExportSuccessful(true);
      setTimeout(() => setIsExportSuccessful(false), 3000);
    } catch (error) {
      console.error('CSVエクスポートエラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-6 space-x-3">
            <Button 
              onClick={handleExportCSV}
              className="flex items-center"
              variant="primary"
            >
              <FiDownload className="mr-1" />
              CSV出力
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
          
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-7 border-2 border-pink-100">
            <h2 className="text-xl font-bold text-pink-600 mb-4 flex items-center">
              <span className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <FiCalendar className="text-pink-500" />
              </span>
              予約カレンダー
            </h2>
            <Calendar />
          </div>
        </div>
        
        <TeamManagement 
          isOpen={isTeamManagementOpen}
          onClose={() => setIsTeamManagementOpen(false)}
        />
      </main>
    </div>
  );
}
