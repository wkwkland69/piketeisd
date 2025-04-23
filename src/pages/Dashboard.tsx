import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { format, isToday, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle, XCircle, Info } from 'lucide-react';
import { Schedule } from '../types';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { getUpcomingSchedules, hasSubmittedProof } = useSchedule();
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    if (currentUser) {
      const schedules = getUpcomingSchedules(currentUser.nim, 5);
      setUpcomingSchedules(schedules);

      const todaySched = schedules.find(s => {
        const scheduleDate = new Date(s.date);
        return isToday(scheduleDate);
      }) || null;
      
      setTodaySchedule(todaySched);
    }
  }, [currentUser, getUpcomingSchedules]);

  const formatDate = (date: Date) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {currentUser?.name || 'Student'}
        </p>
      </div>

      {todaySchedule && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 animate-fadeIn">
          <h2 className="flex items-center text-lg font-medium text-blue-800">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Today's Inspection Schedule
          </h2>
          <p className="mt-2 text-sm text-blue-700">
            {formatDate(todaySchedule.date)}
          </p>
          
          <div className="mt-4 flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Your Status:</p>
              <div className="mt-1 flex items-center">
                {hasSubmittedProof(todaySchedule.date, currentUser?.nim || '') ? (
                  <span className="inline-flex items-center text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" /> 
                    Submitted
                  </span>
                ) : (
                  <span className="inline-flex items-center text-amber-700">
                    <Clock className="h-4 w-4 mr-1" /> 
                    Pending
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 flex items-center">
                PIC Room 
                <span className="group relative ml-1">
                  <Info className="h-4 w-4 text-blue-500 cursor-help" />
                  <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-2 transform -translate-y-full w-48 px-2 py-1 bg-gray-900 rounded-lg text-center text-white text-xs after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-900">
                    Responsible for uploading room photo evidence
                  </span>
                </span>:
              </p>
              <p className="mt-1 text-sm text-blue-700">
                {todaySchedule.representative.name}
                {todaySchedule.representative.nim === currentUser?.nim && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                    You
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Upcoming Schedules</h2>
        
        {upcomingSchedules.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSchedules.map((schedule) => (
              <div 
                key={schedule.date.toString()} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-600 px-4 py-2 text-white">
                  <p className="font-medium">{formatDate(schedule.date)}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-start mb-3">
                    <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Team Members:</p>
                      <ul className="mt-1 text-sm text-gray-600 space-y-1">
                        {schedule.students.map((student) => (
                          <li key={student.nim} className="flex items-center">
                            <span className={student.nim === currentUser?.nim ? "font-medium" : ""}>
                              {student.name}
                            </span>
                            {student.nim === currentUser?.nim && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                You
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 flex items-center">
                        PIC Room
                        <span className="group relative ml-1">
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-2 transform -translate-y-full w-48 px-2 py-1 bg-gray-900 rounded-lg text-center text-white text-xs after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-900">
                            Responsible for uploading room photo evidence
                          </span>
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {schedule.representative.name}
                        {schedule.representative.nim === currentUser?.nim && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <XCircle className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">You don't have any upcoming schedules.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;