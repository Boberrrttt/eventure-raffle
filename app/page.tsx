"use client";

import { useState } from "react";
import { Trophy, Users, CheckCircle, Clock, XCircle, RotateCcw, X } from "lucide-react";

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showAllParticipantsModal, setShowAllParticipantsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex flex-col justify-center items-center mb-4">
            <img 
              src="/ordlabs/Secondary.png" 
              alt="Ordlabs" 
              className="h-12 w-auto mb-2"
            />
            <p className="text-4xl font-normal tracking-wide text-[#1A1A1A]">Raffle Machine</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Raffle Card - Full Screen */}
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-10 shadow-lg min-h-[60vh] flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              {/* Status Badges */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAllParticipantsModal(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-[#F8F9FA] rounded-full border border-[#D1D5DB] hover:bg-[#E5E7EB] transition-colors"
                >
                  <Users className="w-3 h-3 text-[#6B7280]" />
                  <span className="text-xs font-light text-[#1A1A1A]">{participants.length}</span>
                </button>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                  winner 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : isSpinning 
                    ? 'bg-orange-100 text-orange-800 border-orange-200'
                    : participants.length === 0
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {winner ? (
                    <><CheckCircle className="w-3 h-3" /><span className="text-xs font-light">Complete</span></>
                  ) : isSpinning ? (
                    <><Clock className="w-3 h-3" /><span className="text-xs font-light">Drawing</span></>
                  ) : participants.length === 0 ? (
                    <><XCircle className="w-3 h-3" /><span className="text-xs font-light">No Participants</span></>
                  ) : (
                    <><CheckCircle className="w-3 h-3" /><span className="text-xs font-light">Ready</span></>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowParticipantsModal(true)}
                  className="px-3 py-2 rounded-lg font-light text-sm bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200 shadow-lg"
                >
                  Add Participants
                </button>
                {participants.length === 0 && (
                  <button
                    onClick={resetRaffle}
                    className="p-2 rounded-lg font-light text-sm bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200 shadow-lg"
                    aria-label="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {winner ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-[#FFA400] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-6xl font-semibold text-[#FFA400] mb-4 tracking-wide">WINNER!</h2>
                <p className="text-6xl font-semibold text-[#1A1A1A] mb-8 tracking-wide">{winner}</p>
              </div>
            ) : (
              <div className="bg-[#F8F9FA] rounded-2xl p-16 mb-8 text-center">
                <div className="h-20 flex items-center justify-center">
                  <div className={`text-7xl font-thin tabular-nums transition-all duration-300 ${
                    isSpinning ? 'text-[#FFA400]' : 'text-[#1A1A1A]'
                  }`}>
                    {participants[currentSlot] || 'Ready'}
                  </div>
                </div>
              </div>
            )}

            {/* Slot Display */}
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

          </div>

          {/* Winners History */}
          {winners.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-[#1A1A1A] tracking-wide">Winners History</h3>
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
      </div>

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-[#1A1A1A] tracking-wide">Add Participants</h3>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="participants-input-modal" className="text-sm font-light text-[#6B7280] block mb-2">
                  Enter participant names (one per line):
                </label>
                <textarea
                  id="participants-input-modal"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-32 px-4 py-3 text-black font-light bg-[#F8F9FA] border border-[#D1D5DB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FFA400] focus:border-transparent"
                  rows={4}
                  placeholder="John Doe\nJane Smith\nBob Johnson"
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
              <div className="text-sm font-light text-[#6B7280] text-center">
                {participants.length} participant{participants.length === 1 ? '' : 's'} added
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Participants Modal */}
      {showAllParticipantsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-[#1A1A1A] tracking-wide">All Participants ({participants.length})</h3>
              <button
                onClick={() => setShowAllParticipantsModal(false)}
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search participants..."
                className="w-full px-4 py-2 text-black font-light bg-[#F8F9FA] border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA400] focus:border-transparent"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {participants.length === 0 ? (
                <p className="text-center text-[#6B7280] font-light py-8">No participants added yet</p>
              ) : (
                <div className="space-y-2">
                  {participants
                    .filter(participant => 
                      participant.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((participant, filteredIndex) => (
                    <div
                      key={participant}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] transition-all duration-200 hover:border-[#FFA400]/30"
                    >
                      <div className="flex items-center gap-3">
                        {searchQuery === '' && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-light bg-[#9D8189]">
                            {participants.indexOf(participant) + 1}
                          </div>
                        )}
                        <span className="font-light text-[#1A1A1A]">{participant}</span>
                      </div>
                    </div>
                  ))}
                  {participants.filter(participant => 
                    participant.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && searchQuery !== '' && (
                    <p className="text-center text-[#6B7280] font-light py-8">No participants found matching "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}