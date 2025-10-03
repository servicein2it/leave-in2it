import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { th } from 'date-fns/locale';
import { LeaveRequest, LeaveStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    th: th,
  },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: LeaveRequest;
  status: LeaveStatus;
}

interface CalendarViewProps {
  leaveRequests: LeaveRequest[];
  isAdmin?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  leaveRequests, 
  isAdmin = false, 
  onEventClick 
}) => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<'all' | LeaveStatus>('all');
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const filteredRequests = statusFilter === 'all' 
      ? leaveRequests 
      : leaveRequests.filter(req => req.status === statusFilter);

    const calendarEvents: CalendarEvent[] = filteredRequests.map(request => ({
      id: request.id,
      title: isAdmin 
        ? `${request.employeeName} - ${request.leaveType}`
        : request.leaveType,
      start: new Date(request.startDate),
      end: new Date(request.endDate),
      resource: request,
      status: request.status as LeaveStatus,
    }));

    setEvents(calendarEvents);
  }, [leaveRequests, statusFilter, isAdmin]);

  const handleSelectEvent = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    let color = 'white';
    
    switch (event.status) {
      case LeaveStatus.PENDING:
        backgroundColor = '#f59e0b';
        break;
      case LeaveStatus.APPROVED:
        backgroundColor = '#10b981';
        break;
      case LeaveStatus.REJECTED:
        backgroundColor = '#ef4444';
        break;
      default:
        backgroundColor = '#6b7280';
    }

    return {
      style: {
        backgroundColor,
        color,
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        padding: '2px 4px',
      }
    };
  };

  const messages = {
    allDay: 'ทั้งวัน',
    previous: 'ก่อนหน้า',
    next: 'ถัดไป',
    today: 'วันนี้',
    month: 'เดือน',
    week: 'สัปดาห์',
    day: 'วัน',
    agenda: 'กำหนดการ',
    date: 'วันที่',
    time: 'เวลา',
    event: 'กิจกรรม',
    noEventsInRange: 'ไม่มีการลาในช่วงนี้',
    showMore: (total: number) => `+ อีก ${total} รายการ`,
  };

  const formats = {
    monthHeaderFormat: 'MMMM yyyy',
    dayHeaderFormat: 'dd/MM/yyyy',
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`,
    agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`,
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">
            ปฏิทินการลา
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value={LeaveStatus.PENDING}>รอพิจารณา</SelectItem>
                <SelectItem value={LeaveStatus.APPROVED}>อนุมัติ</SelectItem>
                <SelectItem value={LeaveStatus.REJECTED}>ปฏิเสธ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-sm text-gray-600">รอพิจารณา</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">อนุมัติ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">ปฏิเสธ</span>
          </div>
        </div>
        
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            date={date}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            messages={messages}
            formats={formats}
            culture="th"
            style={{ height: '100%' }}
            popup
            showMultiDayTimes
            step={60}
            timeslots={1}
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            toolbar={true}
            components={{
              event: ({ event }: { event: any }) => (
                <div className="text-xs font-medium truncate">
                  {event.title}
                </div>
              ),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};