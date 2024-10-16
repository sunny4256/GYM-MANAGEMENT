import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState({});
  const [feedback, setFeedback] = useState('');
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }

        // Fetch all trainers
        const trainersSnapshot = await getDocs(collection(db, 'trainers'));
        const trainersData = {};
        trainersSnapshot.forEach(doc => {
          trainersData[doc.id] = doc.data().name;
        });
        setTrainers(trainersData);

        // Fetch user's sessions
        const sessionsQuery = query(collection(db, 'sessions'), where('userId', '==', auth.currentUser.uid));
        const sessionsSnapshot = await getDocs(sessionsQuery);
        setSessions(sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch user's feedback
        const feedbackDoc = await getDoc(doc(db, 'feedbacks', auth.currentUser.uid));
        if (feedbackDoc.exists()) {
          setFeedback(feedbackDoc.data().feedback);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleFeedbackSubmit = async () => {
    if (auth.currentUser && user) {
      await setDoc(doc(db, 'feedbacks', auth.currentUser.uid), {
        fullName: `${user.firstName} ${user.lastName}`,
        feedback: feedback,
        updatedAt: new Date().toISOString()
      });
      setIsEditingFeedback(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.firstName} {user.lastName}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.dateOfBirth}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Membership</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.membership}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Booked Sessions Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Booked Sessions</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <li key={session.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{session.program}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Trainer: {trainers[session.trainer] || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback and Suggestions Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Feedback and Suggestions</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {isEditingFeedback ? (
              <div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  rows="4"
                  placeholder="Enter your feedback and suggestions here..."
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleFeedbackSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsEditingFeedback(false)}
                    className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  {feedback || "You haven't provided any feedback yet."}
                </p>
                <button
                  onClick={() => setIsEditingFeedback(true)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {feedback ? "Edit Feedback" : "Add Feedback"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}