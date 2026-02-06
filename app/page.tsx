"use client";

import { useState } from "react";

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  const addParticipants = () => {
    const names = inputText.split('\n').filter(name => name.trim() !== '');
    if (names.length > 0) {
      setParticipants(prev => [...prev, ...names]);
      setInputText('');
    }
  };

  const spinSlots = () => {
    if (isSpinning || participants.length === 0) return;
    
    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);
    
    let spins = 0;
    const spinInterval = setInterval(() => {
      // Show a random name on each interval
      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentSlot(randomIndex);
      spins++;
      
      // Stop after enough spins for dramatic effect
      if (spins > 50) {
        clearInterval(spinInterval);
        // Final winner selection
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const selectedWinner = participants[winnerIndex];
        
        setWinner(selectedWinner);
        setCurrentSlot(winnerIndex);
        
        // Remove winner from participants and add to winners list
        setParticipants(prev => prev.filter((_, index) => index !== winnerIndex));
        setWinners(prev => [selectedWinner, ...prev]);
        
        setIsSpinning(false);
        setShowWinnerModal(true);
      }
    }, 60); // Fast flicker effect - change every 60ms
  };

  const closeWinnerModal = () => {
    setShowWinnerModal(false);
  };

  const resetRaffle = () => {
    setParticipants([]);
    setWinners([]);
    setWinner(null);
    setCurrentSlot(0);
    setInputText('');
    setShowWinnerModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-wide text-[#1A1A1A] mb-4">Ordlabs Raffle Machine</h1>
          <p className="text-lg font-light text-[#6B7280] max-w-md mx-auto leading-relaxed">
            Draw a lucky winner from your participants
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Participant Input Section */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 shadow-lg">
            <h3 className="text-2xl font-light mb-6 text-[#1A1A1A] tracking-wide">Add Participants</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="participants-input" className="text-base font-light text-[#6B7280] block mb-2">
                  Enter participant names (one per line):
                </label>
                <textarea
                  id="participants-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-32 px-4 py-3 text-black font-light bg-[#F8F9FA] border border-[#D1D5DB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FFA400] focus:border-transparent"
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={addParticipants}
                  disabled={inputText.trim() === ''}
                  className="flex-1 px-4 py-2 rounded-lg font-light text-base bg-[#FFA400] text-white hover:bg-[#FF8800] disabled:bg-[#E0E0E0] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Add Participants
                </button>
                <button
                  onClick={() => setInputText('')}
                  className="px-4 py-2 rounded-lg font-light text-base bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
              <div className="text-sm font-light text-[#6B7280]">
                {participants.length} participant{participants.length === 1 ? '' : 's'} added
              </div>
            </div>
          </div>

          {/* Raffle Card - Wide */}
          <div className="xl:col-span-2 row-span-2 bg-white rounded-2xl border border-[#D1D5DB] p-10 shadow-lg">
            {/* Slot Display */}
            <div className="bg-[#F8F9FA] rounded-2xl p-16 mb-8 text-center">
              <div className="h-20 flex items-center justify-center">
                <div className={`text-7xl font-thin tabular-nums transition-all duration-300 ${
                  isSpinning ? 'text-[#FFA400]' : 'text-[#1A1A1A]'
                }`}>
                  {participants[currentSlot] || 'Ready'}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={spinSlots}
                disabled={isSpinning || participants.length === 0}
                className={`px-12 py-4 rounded-2xl font-light text-lg transition-all duration-300 transform tracking-wide ${
                  isSpinning || participants.length === 0
                    ? 'bg-[#E0E0E0] text-[#6B7280] cursor-not-allowed scale-95'
                    : 'bg-gradient-to-r from-[#FFA400] to-[#FF8800] text-white hover:from-[#FF8800] hover:to-[#FFA400] hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl'
                }`}
              >
                {isSpinning ? 'Drawing...' : participants.length === 0 ? 'No Participants' : 'Draw Winner'}
              </button>
            </div>

            {/* Error Message */}
            {participants.length === 0 && (
              <div className="mt-4 text-center">
                <p className="text-red-600 font-light text-sm">
                  {winners.length > 0 
                    ? 'Raffle is complete - all participants have won!' 
                    : 'No participants available for the raffle'}
                </p>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 shadow-lg">
            <h3 className="text-xl font-light mb-6 text-[#1A1A1A] tracking-wide">Raffle Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-[#6B7280]">Total Participants</span>
                <span className="text-3xl font-thin tabular-nums text-[#1A1A1A]">{participants.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-[#6B7280]">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-light uppercase tracking-wide ${
                  winner 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : isSpinning 
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : participants.length === 0
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {winner ? 'Complete' : isSpinning ? 'Drawing' : participants.length === 0 ? 'No Participants' : 'Ready'}
                </span>
              </div>

              {winners.length > 0 && (
                <div className="mt-6 p-4 bg-[#F8F9FA] rounded-xl">
                  <p className="text-xs font-light text-[#6B7280] mb-1">Winners Drawn</p>
                  <p className="text-lg font-light text-[#1A1A1A]">{winners.length}</p>
                </div>
              )}

              {participants.length === 0 && (
                <button
                  onClick={resetRaffle}
                  className="mt-6 w-full px-4 py-2 rounded-xl font-light text-sm bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200"
                >
                  Reset Raffle
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Winners History */}
        {winners.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-[#1A1A1A] tracking-wide">🏆 Winners History</h3>
              <span className="text-sm font-light text-[#6B7280]">{winners.length} winner{winners.length === 1 ? '' : 's'}</span>
            </div>
            <div className="space-y-2">
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] transition-all duration-200 hover:border-[#FFA400]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-light bg-[#FFA400]">
                      {index + 1}
                    </div>
                    <span className="font-light text-[#1A1A1A]">{winner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Winner Modal */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-12 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFA400] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏆</span>
              </div>
              <h2 className="text-3xl font-light text-[#FFA400] mb-4 tracking-wide">Winner Selected!</h2>
              <p className="text-4xl font-thin text-[#1A1A1A] mb-8 tracking-wide">{winner}</p>
              <button
                onClick={closeWinnerModal}
                className="px-8 py-3 rounded-xl font-light text-lg bg-[#FFA400] text-white hover:bg-[#FF8800] transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}