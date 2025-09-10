import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={handleMenuClick} />
      
      <div className="p-8">
        <h1 className="text-sub1 text-black mb-6">
          Platos
        </h1>
        
      </div>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
    </div>
  );
}
