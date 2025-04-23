import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isSameDay } from 'date-fns';
import { useSchedule } from '../contexts/ScheduleContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, CheckCircle, Info } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getSchedulesByDate, getProofsByDate } = useSchedule();

  const selectedSchedules = getSchedulesByDate(selectedDate);
  const selectedProofs = getProofsByDate(selectedDate);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-2 text-gray-700">
          {daysOfWeek[i]}
        </div>
      );
    }

    return <div className="grid grid-cols-7 border-b">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        const hasSchedule = getSchedulesByDate(day).length > 0;
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[80px] p-2 border transition-colors ${
              !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
            } ${isToday(day) ? 'bg-blue-50' : ''} ${
              isSelected ? 'bg-blue-100' : ''
            } ${isWeekend ? 'bg-gray-50' : ''}`}
            onClick={() => !isWeekend && setSelectedDate(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </span>
              {hasSchedule && !isWeekend && (
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </div>
            
            {hasSchedule && !isWeekend && isCurrentMonth && (
              <div className="mt-1 text-xs text-gray-600">
                <p>{getSchedulesByDate(day)[0].students.length} Students</p>
              </div>
            )}
            
            {isWeekend && (
              <div className="mt-1 text-xs text-gray-400">
                Weekend
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="border rounded-lg overflow-hidden">{rows}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Inspection Calendar</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage lab inspection schedules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>

          {selectedSchedules.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Assigned Students
                </h4>
                <ul className="space-y-1 ml-6 text-sm text-gray-600">
                  {selectedSchedules[0].students.map(student => (
                    <li key={student.nim}>{student.name} ({student.nim})</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  PIC Room
                  <span className="group relative ml-1">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-2 transform -translate-y-full w-48 px-2 py-1 bg-gray-900 rounded-lg text-center text-white text-xs after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-900">
                      Responsible for uploading room photo evidence
                    </span>
                  </span>
                </h4>
                <p className="ml-6 text-sm text-gray-600">
                  {selectedSchedules[0].representative.name} ({selectedSchedules[0].representative.nim})
                </p>
              </div>

              {selectedProofs.length > 0 && (
                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Proof Submissions</h4>
                  <ul className="space-y-2">
                    {selectedProofs.map(proof => (
                      <li key={proof.id} className="text-sm border rounded-md p-2 bg-gray-50">
                        <p className="font-medium text-gray-700">{proof.nim}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(proof.timestamp), 'MMM d, yyyy HH:mm')}
                        </p>
                        {proof.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={proof.imageUrl} 
                              alt="Proof" 
                              className="w-full h-auto rounded-md" 
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No schedule for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;