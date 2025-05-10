"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import "./styles.css";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Take a Moment to <span className="text-blue-600">Pause</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your browsing experience with mindful pauses. Get gentle
            reminders to breathe, reflect, and reset throughout your day.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() =>
              window.open("https://chrome.google.com/webstore", "_blank")
            }
          >
            Add to Chrome - It's Free
          </motion.button>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="text-blue-600 text-4xl mb-4">🧘</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Mindful Moments
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get gentle reminders to take breaks and practice mindfulness
              throughout your day.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="text-blue-600 text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Beautiful Themes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose from various calming themes and customize your pause
              experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="text-blue-600 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Lightweight
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Minimal impact on your browser's performance while providing
              maximum benefits.
            </p>
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <ol className="text-left space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                  1
                </span>
                <p className="text-gray-600 dark:text-gray-300">
                  Install the extension and set your preferred pause frequency
                </p>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                  2
                </span>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive gentle reminders to take mindful breaks
                </p>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                  3
                </span>
                <p className="text-gray-600 dark:text-gray-300">
                  Enjoy calming visuals, quotes, and optional ambient sounds
                </p>
              </li>
            </ol>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>Made with ❤️ for a more mindful browsing experience</p>
      </footer>
    </div>
  );
};

// Create root element
const root = document.createElement("div");
root.id = "pause-root";
document.body.appendChild(root);

// Render the app
const rootElement = document.getElementById("pause-root");
if (rootElement) {
  const reactRoot = createRoot(rootElement);
  reactRoot.render(<LandingPage />);
}
