import { useState, useEffect } from 'react';
import { getEvents, Event, getTeams } from '@/lib/firebaseData';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { EventClickArg } from '@fullcalendar/core';
import { EventModal } from './EventModal';
import { EventDetails } from './EventDetails';
import { getTeamColor, updateTeamColorCache, resetTeamColorCache } from '@/lib/utils';

interface CalendarProps {
  onReportCompleted?: () => void;
}

export function Calendar({ onReportCompleted }: CalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [teamColors, setTeamColors] = useState<Record<string, { bg: string, border: string }>>({});

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      resetTeamColorCache();
      const localTeamColors: Record<string, { bg: string, border: string }> = {};
      
      const teams = await getTeams();
      for (const team of teams) {
        if (team.color) {
          localTeamColors[team.name] = team.color;
          updateTeamColorCache(team.name, team.color);
        } else {
          const defaultColor = getTeamColor(team.name);
          localTeamColors[team.name] = defaultColor;
          updateTeamColorCache(team.name, defaultColor);
        }
      }
      
      setTeamColors(localTeamColors);
      
      const allEvents = await getEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('データの読み込み中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const eventData = arg.event.extendedProps as unknown as Event;
    setSelectedEvent(eventData);
    setIsDetailsOpen(true);
  };

  const handleEventChange = async (updatedEvent?: Event) => {
    try {
      fetchData();
      
      if (updatedEvent && selectedEvent && selectedEvent.id === updatedEvent.id) {
        setSelectedEvent(updatedEvent);
      }
    } catch (err) {
      console.error('Error refreshing events:', err);
    }
  };

  const handleEventDeleted = async (eventId: string) => {
    try {
      fetchData();
      
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(null);
        setIsDetailsOpen(false);
      }
    } catch (err) {
      console.error('Error refreshing events after deletion:', err);
    }
  };

  const formatEventsForCalendar = (events: Event[]) => {
    const sortedEvents = [...events].sort((a, b) => {
      if (a.date !== b.date) return 0;
      
      if (!a.time && !b.time) return 0;
      
      if (!a.time) return 1;
      if (!b.time) return -1;
      
      return a.time.localeCompare(b.time);
    });

    return sortedEvents.map(event => {
      let backgroundColor, borderColor;
      const textColor = '#FFFFFF';

      if (event.status === 'in-use') {
        backgroundColor = '#EF4444';
        borderColor = '#DC2626';
      } else {
        const teamColor = teamColors[event.team];
        if (teamColor) {
          backgroundColor = teamColor.bg;
          borderColor = teamColor.border;
        } else {
          const fallbackColors = getTeamColor(event.team);
          backgroundColor = fallbackColors.bg;
          borderColor = fallbackColors.border;
        }
      }

      const timeDisplay = event.time ? 
        (event.endTime ? ` ${event.time}〜${event.endTime}` : ` ${event.time}`) : '';

      return {
        title: `${event.team}${timeDisplay}`,
        date: event.date,
        backgroundColor,
        borderColor,
        textColor,
        extendedProps: event
      };
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">カレンダーデータを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className="calendar-wrapper h-full flex flex-col">
      <style jsx global>{`
        .fc {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .fc .fc-view-harness {
          flex: 1;
          min-height: 0;
        }
        .fc .fc-toolbar-title {
          font-size: 1.2rem;
          color: #DB2777;
        }
        .fc .fc-button-primary {
          background-color: #F9A8D4;
          border-color: #F9A8D4;
          color: #831843;
          font-weight: 600;
          border-radius: 0.75rem;
          padding: 0.25rem 0.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          font-size: 0.875rem;
        }
        .fc .fc-button-primary:hover {
          background-color: #F472B6;
          border-color: #F472B6;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active, 
        .fc .fc-button-primary:not(:disabled):active {
          background-color: #BE185D;
          border-color: #BE185D;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #FCE7F3;
        }
        .fc-theme-standard .fc-scrollgrid {
          border-color: #FCE7F3;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .fc-day-today {
          background-color: #FCE7F3 !important;
        }
        .fc-day-sat {
          background-color: #F5F3FF;
        }
        .fc-day-sun {
          background-color: #FEE2E2;
        }
        .fc-event {
          border-radius: 0.5rem;
          padding: 2px;
          border-width: 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-size: 0.875rem;
        }
        .fc .fc-daygrid-day-number {
          color: #6B7280;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .fc .fc-toolbar {
          flex-wrap: wrap;
          row-gap: 0.5rem;
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={jaLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        height="100%"
        events={formatEventsForCalendar(events)}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false
        }}
        buttonText={{
          today: '今日'
        }}
        dayMaxEventRows={3}
        moreLinkClick="day"
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={selectedDate}
        onEventAdded={(newEvent) => handleEventChange(newEvent)}
      />

      {selectedEvent && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isDetailsOpen && 'hidden'}`}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)}></div>
          <div className="z-10 w-full max-w-lg">
            <EventDetails
              event={selectedEvent}
              onClose={() => setIsDetailsOpen(false)}
              onEventUpdated={(updatedEvent) => {
                handleEventChange(updatedEvent);
                setIsDetailsOpen(false);
              }}
              onEventDeleted={handleEventDeleted}
              onReportCompleted={onReportCompleted}
            />
          </div>
        </div>
      )}
    </div>
  );
} 