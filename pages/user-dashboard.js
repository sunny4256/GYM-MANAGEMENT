import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../services/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { UserCircle } from 'lucide-react';

export default function UserDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const router = useRouter();
  const programsRef = useRef(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      const trainersCollection = collection(db, 'trainers');
      const trainersSnapshot = await getDocs(trainersCollection);
      const trainersList = trainersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainers(trainersList);
    };

    fetchTrainers();
  }, []);

  const programs = [
    { name: 'YOGA', description: 'Find balance and flexibility through yoga.', image: 'https://media.gettyimages.com/id/1483989758/photo/diverse-yoga-class-participants-doing-a-side-plank-on-their-yoga-mats-in-a-beautiful-yoga.jpg?s=612x612&w=0&k=20&c=guBKG02OaeNEtN-N0NICSplx02mDIVWmnCBHQvWXVrQ=' },
   
    { name: 'MINDFULNESS', description: 'Cultivate awareness and inner peace.', image: 'https://media.gettyimages.com/id/1472357042/photo/meditation-yoga-and-top-view-of-woman-with-prayer-hands-in-home-for-health-and-wellness.jpg?s=612x612&w=0&k=20&c=Up7E7HKhYoQ2iAF7-EAynmJi6dGVoa8iqpa2Z9ne79M=' },
   
    { name: 'STRENGTH TRAINING', description: 'Build muscle and increase your power.', image: 'https://media.gettyimages.com/id/1288737452/photo/you-are-strong-strong-is-you.jpg?s=612x612&w=0&k=20&c=KBa7d-_SK2NOPIi8U82atJykQBCuzqjVFXF_2ydHdUQ=' },
   
    { name: 'CARDIO', description: 'Improve your endurance and heart health.', image: 'https://media.gettyimages.com/id/1183038884/photo/view-of-a-row-of-treadmills-in-a-gym-with-people.jpg?s=612x612&w=0&k=20&c=VnTSyKHKl-YFOmpFqW_hNyIlis0sFksfcR9Ei3-r29s=' },
  ];

  const handleBookSession = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const sessionData = {
      date: form.date.value,
      time: form.time.value,
      name: form.name.value,
      trainer: form.trainer.value,
      program: selectedProgram,
      userId: auth.currentUser.uid,
    };

    try {
      await addDoc(collection(db, 'sessions'), sessionData);
      setShowModal(false);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error) {
      console.error("Error booking session: ", error);
    }
  };

  const scrollToPrograms = () => {
    programsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4 fixed w-full top-0 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="w-13 h-12" />
          <span className="text-2xl font-bold">FitTech Gym</span>
        </div>
        <div>
          <UserCircle size={32} className="cursor-pointer" onClick={() => router.push('/profile')} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 flex items-center justify-between min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to FitTech</h1>
            <button 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600"
              onClick={scrollToPrograms}
            >
              Browse Classes
            </button>
          </div>
          <div className="md:w-1/2">
            <img src="https://media.gettyimages.com/id/455244937/photo/group-of-friends-doing-pushups-with-dumbbells.jpg?s=612x612&w=0&k=20&c=bxdEkJNhgdM5V-gyXh_Z8BcvdVQv5yQq8Yvp5PYo7X0=" alt="Gym" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section ref={programsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program) => (
              <div key={program.name} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                <img src={program.image} alt={program.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{program.name}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => handleBookSession(program.name)}
                  >
                    BOOK SESSION
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Book {selectedProgram} Session</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Date</label>
                <input type="date" name="date" className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Time</label>
                <input type="time" name="time" className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input type="text" name="name" className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Trainer</label>
                <select name="trainer" className="w-full p-2 border rounded" required>
                  <option value="">Select a trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Book Now
                </button>
                <button 
                  type="button" 
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Success Popup */}
      {bookingSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Session booked successfully!
        </div>
      )}
    </div>
  );
}