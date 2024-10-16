import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function TrainerDashboard() {
  const [trainer, setTrainer] = useState(null);
  const [sessions, setSessions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTrainerData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/trainer-login');
        return;
      }

      try {
        // Fetch trainer data
        const trainerDoc = await getDoc(doc(db, 'trainers', user.uid));
        if (trainerDoc.exists()) {
          setTrainer(trainerDoc.data());
        } else {
          // If trainer document doesn't exist, redirect to login
          router.push('/trainer-login');
          return;
        }

        // Fetch trainer's sessions
        const sessionsQuery = query(collection(db, 'sessions'), where('trainerId', '==', user.uid));
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsList = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSessions(sessionsList);
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      }
    };

    fetchTrainerData();
  }, [router]);

  if (!trainer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-yellow-600">Trainer Dashboard</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Trainer Information</h2>
          <p><strong>Name:</strong> {trainer.name}</p>
          <p><strong>Email:</strong> {trainer.email}</p>
          <p><strong>Specialization:</strong> {trainer.specialization}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          {sessions.length > 0 ? (
            <ul>
              {sessions.map(session => (
                <li key={session.id} className="mb-4 p-4 border rounded">
                  <p><strong>Date:</strong> {session.date}</p>
                  <p><strong>Time:</strong> {session.time}</p>
                  <p><strong>Program:</strong> {session.program}</p>
                  <p><strong>Client:</strong> {session.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming sessions scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}