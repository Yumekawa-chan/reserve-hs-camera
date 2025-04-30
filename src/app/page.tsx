'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/Calendar';
import { Header } from '@/components/Header';
import { PasswordEntry } from '@/components/PasswordEntry';
import { FiCalendar } from 'react-icons/fi';
import Confetti from 'react-confetti';
import { getEvents, Event } from '@/lib/firebaseData';
import { OverdueEventNotifications } from '@/components/OverdueEventNotifications';

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [overdueEvents, setOverdueEvents] = useState<Event[]>([]);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    const authDataStr = localStorage.getItem('authData');
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        const now = new Date().getTime();
        
        if (authData.expiry && authData.expiry > now) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authData');
        }
      } catch {
        localStorage.removeItem('authData');
      }
    }

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkOverdueEvents = async () => {
      try {
        const events = await getEvents();
        const now = new Date();
        
        const overdue = events.filter(event => {
          if (event.status === 'completed') return false;
          
          const [hours, minutes] = (event.time || '').split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) return false;
          
          const eventDate = new Date(event.date);
          eventDate.setHours(hours, minutes, 0, 0);
          
          return eventDate < now;
        });
        
        setOverdueEvents(overdue);
      } catch (error) {
        console.error('期限切れイベントの確認エラー:', error);
      }
    };

    checkOverdueEvents();
    const intervalId = setInterval(checkOverdueEvents, 60000 * 10); 
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleReportCompleted = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const dismissOverdueEvent = (eventId: string) => {
    setOverdueEvents(current => current.filter(event => event.id !== eventId));
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
          {isAuthenticated ? (
            <>
              <OverdueEventNotifications 
                events={overdueEvents} 
                onDismiss={dismissOverdueEvent} 
              />
              
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-2 border-pink-100 flex-1 overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold text-pink-600 mb-3 flex items-center flex-shrink-0">
                  <span className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <FiCalendar className="text-pink-500" />
                  </span>
                  予約カレンダー
                </h2>
                <div className="flex-1 overflow-auto min-h-0">
                  <Calendar key="calendar" onReportCompleted={handleReportCompleted} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <PasswordEntry onAuthenticated={handleAuthenticated} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
