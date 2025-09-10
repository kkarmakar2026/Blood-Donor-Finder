import React from "react";
import { MessageCircle } from "lucide-react"; // WhatsApp-like icon

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/9170632326" // <-- Replace with your institute number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110"
    >
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppButton;
