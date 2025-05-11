import React, { useState } from "react";
import { ChevronLeft, Pause } from "lucide-react";

const PauseSettings = () => {
  const [reminderInterval, setReminderInterval] = useState("30 min");
  const [trackTabActivity, setTrackTabActivity] = useState(false);
  const [allowPopups, setAllowPopups] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <button className="mb-6 text-white">
        <ChevronLeft size={24} />
      </button>

      <h1 className="text-3xl font-light mb-2">
        Make <span className="font-bold">PA</span>
        <span className="inline-block align-middle mx-1 bg-blue-500 text-black rounded-full w-6 h-6 flex items-center justify-center">
          <Pause size={14} />
        </span>
        <span className="font-bold">SE</span> work for you
      </h1>

      <div className="mt-10 space-y-8">
        <div>
          <label className="block mb-2 text-lg">Remind me to take a breath every</label>
          <select
            value={reminderInterval}
            onChange={(e) => setReminderInterval(e.target.value)}
            className="bg-transparent border border-blue-500 rounded-md px-4 py-2 text-white focus:outline-none"
          >
            <option value="15 min">15 min</option>
            <option value="30 min">30 min</option>
            <option value="1 hr">1 hr</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-lg">Allow to track my tab activity</label>
          <input
            type="checkbox"
            checked={trackTabActivity}
            onChange={() => setTrackTabActivity(!trackTabActivity)}
            className="w-10 h-5 rounded-full bg-gradient-to-r from-green-400 to-blue-500 appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-lg">Allow pop-up reminders</label>
          <input
            type="checkbox"
            checked={allowPopups}
            onChange={() => setAllowPopups(!allowPopups)}
            className="w-10 h-5 rounded-full bg-gradient-to-r from-green-400 to-blue-500 appearance-none cursor-pointer"
          />
        </div>
      </div>

      <footer className="mt-20 text-center text-xs text-gray-500">2025 BaNaNa</footer>
    </div>
  );
};

export default PauseSettings;
