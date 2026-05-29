/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import DashboardOverview from "./components/DashboardOverview";
import HydrostaticsView from "./components/HydrostaticsView";
import VenturiView from "./components/VenturiView";
import LocalLossView from "./components/LocalLossView";
import MomentumView from "./components/MomentumView";
import ReynoldsView from "./components/ReynoldsView";
import {
  Compass,
  Gauge,
  Activity,
  Layers,
  Award,
  Sparkles,
  Menu,
  X,
  Droplet
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Menu item mapping
  const menuItems = [
    { id: "dashboard", label: "核心科研主页", icon: Compass },
    { id: "hydrostatic", label: "1-2 静水压强实验", icon: Gauge },
    { id: "venturi", label: "4 文丘里综合实验", icon: Activity },
    { id: "localloss", label: "5 局部水头损失实验", icon: Layers },
    { id: "momentum", label: "6 动量定律综合实验", icon: Award },
    { id: "reynolds", label: "7 雷诺实验", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      {/* Mobile Nav Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-slate-900 text-white shadow-md z-30 shrink-0">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="font-bold tracking-tight text-sm font-display">水力学实验系统</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className={`
        fixed inset-0 md:sticky md:top-0 z-40 bg-slate-900 text-slate-300 w-64 p-5 h-screen shrink-0 flex flex-col justify-between transition-transform duration-300
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/80">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Droplet className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h1 className="text-white text-md font-bold tracking-tight font-display">
                水力学综合系统
              </h1>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-widest leading-none mt-0.5">
                HYDRAULICS LABORATORY
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold select-none transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow shadow-indigo-600/30"
                      : "hover:bg-slate-800/65 hover:text-white text-slate-400"
                  }`}
                >
                  <IconComp className={`w-4 h-4 transition ${isActive ? "scale-110" : ""}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Info footer inside sidebar */}
        <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono space-y-1">
          <p>水力学实验室教学手册</p>
          <p>© 2026 实验分析标定平台</p>
        </div>
      </aside>

      {/* Sidebar background overlay for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity"
        />
      )}

      {/* Main Content Workspace viewport */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full transition-all duration-300">
        {activeTab === "dashboard" && <DashboardOverview onNavigate={setActiveTab} />}
        {activeTab === "hydrostatic" && <HydrostaticsView />}
        {activeTab === "venturi" && <VenturiView />}
        {activeTab === "localloss" && <LocalLossView />}
        {activeTab === "momentum" && <MomentumView />}
        {activeTab === "reynolds" && <ReynoldsView />}
      </main>
    </div>
  );
}
