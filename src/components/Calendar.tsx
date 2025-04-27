import { useState, useEffect } from 'react';
import { getEvents, Event } from '@/lib/mockData';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { EventClickArg } from '@fullcalendar/core';
import { EventModal } from './EventModal';
import { EventDetails } from './EventDetails';

export function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = () => {
      const allEvents = getEvents();
      setEvents(allEvents);
    };

    fetchEvents();
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

  const handleEventChange = () => {
    setEvents(getEvents());
  };

  const formatEventsForCalendar = (events: Event[]) => {
    return events.map(event => {
      let backgroundColor = '#EC4899'; // pink-500 for reserved
      let borderColor = '#DB2777'; // pink-600
      const textColor = '#FFFFFF';

      if (event.status === 'in-use') {
        backgroundColor = '#F59E0B'; // amber-500 for in-use
        borderColor = '#D97706'; // amber-600
      } else if (event.status === 'completed') {
        backgroundColor = '#10B981'; // emerald-500 for completed
        borderColor = '#059669'; // emerald-600
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

  return (
    <div className="calendar-wrapper">
      <style jsx global>{`
        .fc .fc-toolbar-title {
          font-size: 1.4rem;
          color: #DB2777;
        }
        .fc .fc-button-primary {
          background-color: #F9A8D4;
          border-color: #F9A8D4;
          color: #831843;
          font-weight: 600;
          border-radius: 0.75rem;
          padding: 0.375rem 0.75rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
        }
        .fc .fc-daygrid-day-number {
          color: #6B7280;
          font-weight: 500;
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
        height="auto"
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
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={selectedDate}
        onEventAdded={handleEventChange}
      />

      {selectedEvent && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isDetailsOpen && 'hidden'}`}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)}></div>
          <div className="z-10 w-full max-w-lg">
            <EventDetails
              event={selectedEvent}
              onClose={() => setIsDetailsOpen(false)}
              onEventUpdated={() => {
                handleEventChange();
                setIsDetailsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 