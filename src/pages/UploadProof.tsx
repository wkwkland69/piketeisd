import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { format, isToday } from 'date-fns';
import { Upload, Camera, CheckCircle, AlertCircle, X } from 'lucide-react';

const UploadProof = () => {
  const { currentUser } = useAuth();
  const { getUpcomingSchedules, submitProof, hasSubmittedProof } = useSchedule();
  const [nim, setNim] = useState(currentUser?.nim || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [todaySchedule, setTodaySchedule] = useState<any>(null);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setNim(currentUser.nim);
      const schedules = getUpcomingSchedules(currentUser.nim, 1);
      
      // Check if there's a schedule for today
      const todaySched = schedules.find(s => {
        const scheduleDate = new Date(s.date);
        return isToday(scheduleDate);
      });
      
      if (todaySched) {
        setTodaySchedule(todaySched);
        setIsRepresentative(todaySched.representative.nim === currentUser.nim);
        setHasSubmitted(hasSubmittedProof(todaySched.date, currentUser.nim));
      }
    }
  }, [currentUser, getUpcomingSchedules, hasSubmittedProof]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!nim.trim()) {
      setError('Please enter your NIM');
      return;
    }
    
    if (isRepresentative && !imageFile) {
      setError('Please upload an image as proof of inspection');
      return;
    }
    
    if (!todaySchedule) {
      setError('No inspection schedule found for today');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, we would upload the image to a server
      // Here we'll just use the Data URL for demonstration
      const imageUrl = imagePreview;
      
      submitProof({
        nim,
        date: todaySchedule.date,
        imageUrl: imageUrl,
        notes: '',
      });
      
      setSuccess('Proof of inspection submitted successfully!');
      setHasSubmitted(true);
      clearImage();
    } catch (err) {
      setError('Failed to submit proof. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Upload Inspection Proof</h1>
        <p className="mt-2 text-sm text-gray-600">
          Submit your verification for today's lab inspection
        </p>
      </div>

      {!todaySchedule ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You don't have an inspection scheduled for today.
              </p>
            </div>
          </div>
        </div>
      ) : hasSubmitted ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                You have already submitted your proof for today's inspection.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
                Student ID (NIM)
              </label>
              <input
                type="text"
                id="nim"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                readOnly={!!currentUser}
              />
              {isRepresentative && (
                <p className="mt-1 text-sm text-amber-600">
                  You are the representative for today. Please upload a photo of the lab room.
                </p>
              )}
            </div>

            {isRepresentative && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Proof Photo
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 rounded-md mx-auto"
                    />
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <div className="space-y-1 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <p className="pl-1">Click to upload a photo</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Proof
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {todaySchedule && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Team</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Date:</h3>
              <p className="mt-1 text-sm text-gray-900">
                {format(new Date(todaySchedule.date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Team Members:</h3>
              <ul className="mt-1 space-y-1">
                {todaySchedule.students.map((student: any) => (
                  <li key={student.nim} className="text-sm text-gray-900 flex items-center">
                    {student.name} ({student.nim})
                    {student.nim === currentUser?.nim && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        You
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Representative:</h3>
              <p className="mt-1 text-sm text-gray-900 flex items-center">
                {todaySchedule.representative.name} ({todaySchedule.representative.nim})
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
    </div>
  );
};

export default UploadProof;