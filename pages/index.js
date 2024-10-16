import { useRef, useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const membershipRef = useRef(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const feedbacksCollection = collection(db, 'feedbacks');
      const feedbacksSnapshot = await getDocs(feedbacksCollection);
      const feedbacksList = feedbacksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(feedbacksList);
    };

    fetchFeedbacks();
  }, []);

  const scrollToMembership = () => {
    if (membershipRef.current) {
      membershipRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextFeedback = () => {
    setCurrentFeedbackIndex((prevIndex) => 
      prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevFeedback = () => {
    setCurrentFeedbackIndex((prevIndex) => 
      prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-black text-white p-4 fixed w-full top-0 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="w-13 h-12" />
          <span className="text-2xl font-bold">FitTech Gym</span>
        </div>
        <div className="space-x-6">
          <a href="/" className="hover:text-gray-400">Home</a>
          <a href="#" onClick={scrollToMembership} className="hover:text-gray-400">Memberships</a>
          <a href="/login" className="hover:text-gray-400">Login</a>
          <a href="#" onClick={scrollToMembership} className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">Join Now</a>
        </div>
      </nav>

      {/* Hero Section with Reduced Height */}
      <div
        className="flex flex-col justify-center items-center text-center h-[70vh] relative z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/gym-background.webp')" }}
      >
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h1 className="text-black text-5xl font-bold mb-4 drop-shadow-lg">
            FEEL GOOD. NOT BAD.
          </h1>
          <p className="text-black text-xl font-bold mb-6 drop-shadow-lg">
            Bad is out there. Good is at FitTech.
          </p>
          <button
            onClick={scrollToMembership}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600"
          >
            Click to Join the Fun
          </button>
        </div>
      </div>

      {/* Membership Section */}
      <div ref={membershipRef} className="bg-white py-16">
        <h2 className="text-center text-4xl font-bold mb-10">Our Membership Plans</h2>
        <div className="flex justify-center space-x-8">
          {/* Silver Membership */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-1/4">
            <h3 className="text-2xl font-bold mb-4">Silver</h3>
            <p className="text-3xl font-bold mb-4">$49.99/month</p>
            <p className="text-gray-600 mb-4">Basic membership with access to all gym facilities.</p>
            <a href="/register?membership=silver" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Join Silver
            </a>
          </div>

          {/* Gold Membership */}
          <div className="bg-yellow-100 p-8 rounded-lg shadow-lg text-center w-1/4">
            <h3 className="text-2xl font-bold mb-4">Gold</h3>
            <p className="text-3xl font-bold mb-4">$99.99/month</p>
            <p className="text-gray-600 mb-4">Access to all facilities plus group classes.</p>
            <a href="/register?membership=gold" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Join Gold
            </a>
          </div>

          {/* Platinum Membership */}
          <div className="bg-gray-300 p-8 rounded-lg shadow-lg text-center w-1/4">
            <h3 className="text-2xl font-bold mb-4">Platinum</h3>
            <p className="text-3xl font-bold mb-4">$149.99/month</p>
            <p className="text-gray-600 mb-4">Full access to gym facilities, group classes, and personal training sessions.</p>
            <a href="/register?membership=platinum" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Join Platinum
            </a>
          </div>
        </div>
      </div>

      {/* Feedback Carousel */}
      <div className="bg-gray-100 py-16">
        <h2 className="text-center text-4xl font-bold mb-10">What Our Members Say</h2>
        <div className="relative max-w-3xl mx-auto">
          {feedbacks.length > 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 italic mb-4">"{feedbacks[currentFeedbackIndex].feedback}"</p>
              <p className="text-right font-bold">- {feedbacks[currentFeedbackIndex].fullName}</p>
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading feedbacks...</p>
          )}
          {feedbacks.length > 1 && (
            <>
              <button 
                onClick={prevFeedback} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextFeedback} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
        <p className="text-center mt-4 text-gray-600">
          {feedbacks.length > 0 ? `${currentFeedbackIndex + 1} of ${feedbacks.length}` : ''}
        </p>
      </div>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; {new Date().getFullYear()} FitTech Gym. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="/contact" className="hover:text-gray-400">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}