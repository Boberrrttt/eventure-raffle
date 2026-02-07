"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy, Users, CheckCircle, Clock, XCircle, RotateCcw, X, Upload, Expand, Shrink } from "lucide-react";

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showAllParticipantsModal, setShowAllParticipantsModal] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [csvUploadMessage, setCsvUploadMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const addParticipants = () => {
    const names = inputText.split("\n").filter((name) => name.trim() !== "");
    if (names.length > 0) {
      setParticipants((prev) => [...prev, ...names]);
      setInputText("");
      setShowParticipantsModal(false);
    } else {
      // If no text input but CSV was uploaded, just close modal
      if (csvUploadMessage && csvUploadMessage.includes("Successfully")) {
        setShowParticipantsModal(false);
        setCsvUploadMessage("");
      }
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim() !== "");

      // Parse CSV lines - handle quoted names and different formats
      const names: string[] = [];
      lines.forEach((line, index) => {
        // Skip header if it looks like a header row
        if (
          index === 0 &&
          (line.toLowerCase().includes("name") ||
            line.toLowerCase().includes("first") ||
            line.toLowerCase().includes("last"))
        ) {
          return;
        }

        // Split by comma and handle quoted fields
        const fields = line
          .split(",")
          .map((field) => field.trim().replace(/^"|"$/g, ""));

        // Try different name formats:
        // 1. Single column (just name)
        // 2. First, Last columns
        // 3. Last, First columns
        // 4. Any column that contains letters (likely a name)

        let name = "";

        if (fields.length === 1) {
          // Single column - use as is
          name = fields[0];
        } else if (fields.length >= 2) {
          // Check if first two columns look like first/last names
          const first = fields[0];
          const last = fields[1];

          if (/^[a-zA-Z\s'-]+$/.test(first) && /^[a-zA-Z\s'-]+$/.test(last)) {
            // First, Last format
            name = `${first} ${last}`;
          } else if (
            /^[a-zA-Z\s'-]+$/.test(last) &&
            /^[a-zA-Z\s'-]+$/.test(first)
          ) {
            // Last, First format
            name = `${last} ${first}`;
          } else {
            // Find first column that looks like a name
            const nameField = fields.find((field) =>
              /^[a-zA-Z\s'-]+$/.test(field),
            );
            if (nameField) name = nameField;
          }
        }

        if (name && name.trim() !== "") {
          names.push(name.trim());
        }
      });

      if (names.length > 0) {
        setParticipants((prev) => [...prev, ...names]);
        setCsvUploadMessage(
          `Successfully added ${names.length} participant${names.length === 1 ? "" : "s"} from CSV`,
        );
        // Clear message after 3 seconds
        setTimeout(() => setCsvUploadMessage(""), 3000);
      } else {
        setCsvUploadMessage("No valid names found in CSV");
        setTimeout(() => setCsvUploadMessage(""), 3000);
      }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = "";
  };

  const openParticipantsModal = () => {
    setShowParticipantsModal(true);
    setCsvUploadMessage("");
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

      // Stop after ~10 seconds (60ms per tick ≈ 167 ticks)
      if (spins > 167) {
        clearInterval(spinInterval);
        // Final winner selection
        const winnerIndex = Math.floor(Math.random() * participants.length);
        const selectedWinner = participants[winnerIndex];

        setWinner(selectedWinner);
        setCurrentSlot(winnerIndex);

        // Remove winner from participants and add to winners list
        setParticipants((prev) =>
          prev.filter((_, index) => index !== winnerIndex),
        );
        setWinners((prev) => [selectedWinner, ...prev]);

        setIsSpinning(false);
        setShowWinnerModal(true);
      }
    }, 55); // Fast flicker effect - change every 60ms
  };

  const closeWinnerModal = () => {
    setShowWinnerModal(false);
  };

  const resetRaffle = () => {
    setParticipants([]);
    setWinners([]);
    setWinner(null);
    setCurrentSlot(0);
    setInputText("");
    setShowWinnerModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex flex-col gap-4 justify-center items-center mb-4">
            <img
              src="/ordlabs/Secondary.png"
              alt="Ordlabs"
              className="h-12 w-auto mb-2"
            />
            <hr className="border-[0.5px] border-gray-300 w-full" />
            <div className="flex gap-2 items-end">
              <img
                src="/LogoMark.svg"
                alt="Ordlabs"
                className="h-8 w-auto mb-1"
              />
              <p className="text-5xl font-semibold font-montserrat tracking-wide text-[#1A1A1A]">
                Raffle Machine
              </p>
            </div>
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
                  className="flex items-center gap-1 px-3 py-1 bg-[#F8F9FA] rounded-full border border-[#D1D5DB] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                >
                  <Users className="w-3 h-3 text-[#6B7280]" />
                  <span className="text-xs font-light text-[#1A1A1A]">
                    {participants.length}
                  </span>
                </button>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                    winner
                      ? "bg-green-100 text-green-800 border-green-200"
                      : isSpinning
                        ? "bg-orange-100 text-orange-800 border-orange-200"
                        : participants.length === 0
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {winner ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-xs font-light">Complete</span>
                    </>
                  ) : isSpinning ? (
                    <>
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-light">Drawing</span>
                    </>
                  ) : participants.length === 0 ? (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span className="text-xs font-light">
                        No Participants
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-xs font-light">Ready</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 items-center">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg font-light text-sm bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200 shadow-lg cursor-pointer"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                </button>
                <button
                  onClick={openParticipantsModal}
                  className="px-3 py-2 rounded-lg font-light text-sm bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200 shadow-lg cursor-pointer"
                >
                  Add Participants
                </button>
                {participants.length === 0 && (
                  <button
                    onClick={resetRaffle}
                    className="p-2 rounded-lg font-light text-sm bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200 shadow-lg cursor-pointer"
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
                <h2 className="text-6xl font-semibold text-[#FFA400] mb-4 tracking-wide">
                  WINNER!
                </h2>
                <p className="text-6xl font-semibold text-[#1A1A1A] mb-8 tracking-wide">
                  {winner}
                </p>
              </div>
            ) : (
              <div className="bg-[#F8F9FA] rounded-2xl p-16 mb-8 text-center">
                <div className="h-20 flex items-center justify-center">
                  <div
                    className={`text-7xl font-thin tabular-nums transition-all duration-300 ${
                      isSpinning ? "text-[#FFA400]" : "text-[#1A1A1A]"
                    }`}
                  >
                    {participants[currentSlot] || "Ready"}
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
                    : 'bg-gradient-to-r from-[#FFA400] to-[#FF8800] text-white hover:from-[#FF8800] hover:to-[#FFA400] hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl cursor-pointer'
                }`}
              >
                {isSpinning
                  ? "Drawing..."
                  : participants.length === 0
                    ? "No Participants"
                    : "Draw Winner"}
              </button>
            </div>
          </div>

          {/* Winners History */}
          {winners.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light text-[#1A1A1A] tracking-wide">
                  Winners History
                </h3>
                <span className="text-sm font-light text-[#6B7280]">
                  {winners.length} winner{winners.length === 1 ? "" : "s"}
                </span>
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
                      <span className="font-light text-[#1A1A1A]">
                        {winner}
                      </span>
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
              <h3 className="text-xl font-light text-[#1A1A1A] tracking-wide">
                Add Participants
              </h3>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="participants-input-modal"
                  className="text-sm font-light text-[#6B7280] block mb-2"
                >
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
              <div className="border-t border-[#E5E7EB] pt-4">
                <label className="text-sm font-light text-[#6B7280] block mb-2">
                  Or upload a CSV file:
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-[#D1D5DB] rounded-lg cursor-pointer hover:border-[#FFA400] hover:bg-[#F8F9FA] transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-sm font-light text-[#6B7280]">
                      Click to upload CSV file
                    </span>
                  </label>
                </div>
                <p className="text-xs font-light text-[#6B7280] mt-2">
                  Supports CSV files with name columns (First, Last, or single
                  name column)
                </p>
                {csvUploadMessage && (
                  <div
                    className={`mt-2 p-2 rounded-lg text-sm font-light text-center ${
                      csvUploadMessage.includes("Successfully")
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {csvUploadMessage}
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={addParticipants}
                  disabled={inputText.trim() === '' && csvUploadMessage === ''}
                  className="flex-1 px-4 py-2 rounded-lg font-light text-base bg-[#FFA400] text-white hover:bg-[#FF8800] disabled:bg-[#E0E0E0] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                >
                  Add Participants
                </button>
                <button
                  onClick={() => setInputText('')}
                  className="px-4 py-2 rounded-lg font-light text-base bg-[#9D8189] text-white hover:bg-[#9D8189]/80 transition-colors duration-200 cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="text-sm font-light text-[#6B7280] text-center">
                {participants.length} participant
                {participants.length === 1 ? "" : "s"} added
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
              <h3 className="text-xl font-light text-[#1A1A1A] tracking-wide">
                All Participants ({participants.length})
              </h3>
              <button
                onClick={() => setShowAllParticipantsModal(false)}
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors cursor-pointer"
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
                <p className="text-center text-[#6B7280] font-light py-8">
                  No participants added yet
                </p>
              ) : (
                <div className="space-y-2">
                  {participants
                    .filter((participant) =>
                      participant
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )
                    .map((participant, filteredIndex) => (
                      <div
                        key={participant}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] transition-all duration-200 hover:border-[#FFA400]/30"
                      >
                        <div className="flex items-center gap-3">
                          {searchQuery === "" && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-light bg-[#9D8189]">
                              {participants.indexOf(participant) + 1}
                            </div>
                          )}
                          <span className="font-light text-[#1A1A1A]">
                            {participant}
                          </span>
                        </div>
                      </div>
                    ))}
                  {participants.filter((participant) =>
                    participant
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  ).length === 0 &&
                    searchQuery !== "" && (
                      <p className="text-center text-[#6B7280] font-light py-8">
                        No participants found matching "{searchQuery}"
                      </p>
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
