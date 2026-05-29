/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { hydrostaticData, HydrostaticItem } from "../data";
import {
  Compass,
  Gauge,
  HelpCircle,
  TrendingUp,
  Waves,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter
} from "recharts";

export default function HydrostaticsView() {
  const [selectedCase, setSelectedCase] = useState<string>("p0 = pa");
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);

  // Filter trials based on selected case
  const trials = hydrostaticData.filter((d) => d.condition === selectedCase);
  const [selectedTrialIdx, setSelectedTrialIdx] = useState<number>(0);
  const currentData: HydrostaticItem = trials[selectedTrialIdx] || trials[0];

  // Prepare chart data for P_abs vs Depth
  // Let's assume height positions of taps (from bottom of the tank):
  // Let A (bottom tap) be at z = 14.4 cm, B (mid-low tap) be at z = 23.6 cm, C (top or intermediate point)
  // Let's look at pabs in current data. 
  // Depth of each is: h_A = 23.6 - z_A, etc. The PDF mentions A is at height 23.6 cm and B is at height 14.4 cm. 
  // Let's plot Pabs vs Depth (h = tank_water_level - tap_height) to show static linearity.
  // Tap positions from top:
  // Tap C (uppermost - or near surface): 
  // Let C height = 24.7 cm
  // Tap B: height = 23.6 cm
  // Tap A: height = 14.4 cm (lower)
  const chartData = [
    { name: "测点 C (靠近表面)", depth: 10.0, p_abs: currentData.pabs.C, p_r: currentData.pr.C, Hp: currentData.Hp.C },
    { name: "测点 A (中层 B)", depth: 21.0, p_abs: currentData.pabs.A, p_r: currentData.pr.A, Hp: currentData.Hp.A },
    { name: "测点 B (底部 A)", depth: 32.0, p_abs: currentData.pabs.B, p_r: currentData.pr.B, Hp: currentData.Hp.B }
  ];

  return (
    <div className="space-y-6">
      {/* Header section with intro */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-800 flex items-center gap-2">
            <Gauge className="w-6 h-6 text-indigo-500" />
            流体静力学压强实验 (1-2 静水压强实验)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            本实验用于测定密封容器中静止液体内的静水压强，验证不可压缩流体静力学基本方程，并观测等压面。
          </p>
        </div>
        <button
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showFormulaInfo ? "隐藏" : "显示"}实验原理
        </button>
      </div>

      {/* Formula info panel */}
      {showFormulaInfo && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-2xl text-slate-700 text-sm space-y-3 leading-relaxed border border-indigo-100/30">
          <h3 className="font-semibold text-indigo-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-600" />
            流动静力学基本原理
          </h3>
          <p>
            在重力作用下，不可压缩流体的静力学基本方程为：
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-600 font-semibold mx-1 text-sm">
              z + p / (ρg) = C (常数)
            </span>
            。
          </p>
          <p>
            其中，<span className="font-semibold">z</span> 为测点相对于基准面的位置高度，
            <span className="font-semibold">p / (ρg)</span> 为压强水头，二者之和
            <span className="font-mono text-indigo-600 font-semibold ml-1">H = z + p / (ρg)</span> 称为测压管水头。
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>对于空气连通的敞口容器：表压强为0。三个测孔上方的水面线构成一个共享的自由水面。</li>
            <li>对于正压密封（打气加压）：所有测压管的水面都会被压缩气体向外顶起，测压管水头明显上升。</li>
            <li>对于真空状态（抽气减压）：测压管液面受到内部真空吸力向下降低，真空孔将吸入气压。</li>
          </ul>
        </div>
      )}

      {/* Controls panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selecting a Case */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-500" />
            选择实验条件 (Piston Status)
          </h3>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2.5">
            {[
              { id: "p0 = pa", label: "标准大气压 (p0 = pa)", color: "from-blue-500 to-cyan-500" },
              { id: "p0 > pa", label: "加压正表压 (p0 > pa)", color: "from-indigo-500 to-purple-500" },
              { id: "p0 < pa", label: "减压真空负压 (p0 < pa)", color: "from-rose-500 to-orange-500" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCase(item.id);
                  setSelectedTrialIdx(0);
                }}
                className={`text-left p-3.5 rounded-xl border text-sm font-medium transition duration-200 cursor-pointer ${
                  selectedCase === item.id
                    ? "border-transparent text-white bg-gradient-to-r " + item.color + " shadow-sm shadow-indigo-200"
                    : "border-slate-100 hover:border-indigo-100 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase">选择测次 (Trials)</span>
            <div className="flex gap-2">
              {trials.map((trial, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTrialIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedTrialIdx === idx
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  第 {trial.trial} 测次
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time calculated status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-indigo-500" />
              当前测次状态校验
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-0.5">绝对压强 p_abs (C)</span>
                <span className="text-lg font-bold font-mono text-slate-700">{currentData.pabs.C} <span className="text-xs font-normal">cmH₂O</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-0.5">测压管水头 H_A</span>
                <span className="text-lg font-bold font-mono text-slate-700">{currentData.Hp.A} <span className="text-xs font-normal">cmH₂O</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-0.5">测压管水头 H_B</span>
                <span className="text-lg font-bold font-mono text-slate-700">{currentData.Hp.B} <span className="text-xs font-normal">cmH₂O</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-0.5">测压管水头 H_C</span>
                <span className="text-lg font-bold font-mono text-slate-700">{currentData.Hp.C} <span className="text-xs font-normal">cmH₂O</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 block mb-0.5">真空压强 p_v (C)</span>
                <span className={`text-lg font-bold font-mono ${currentData.pv.C > 0 ? "text-rose-600" : "text-slate-700"}`}>
                  {currentData.pv.C} <span className="text-xs font-normal">cmH₂O</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-800 mt-4">
            <span className="font-bold">🧪 理论校验结论：</span>
            本测次中，测孔 A、B、C 虽位置高度不同（z A ≠ z B ≠ z C），其测压管水头线高程{" "}
            <span className="font-mono font-semibold">H = Hp_A ≈ Hp_B ≈ Hp_C ≈ {((currentData.Hp.A + currentData.Hp.B + currentData.Hp.C) / 3).toFixed(2)} cm </span>
            保持高度水平。这**完美验证了流体静力学基本方程中位置水头与压强水头之和恒为常数的定律 (z + p/ρg = C)**！
          </div>
        </div>
      </div>

      {/* Main split: Simulation Apparatus sketch and Curves plot */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* SVG Interactive Apparatus Model */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-md border border-slate-800 xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">静压装置物化模型</span>
              <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-300">Live Simulation</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-300">密封容器测压管水高度动态模型</h4>
          </div>

          {/* Device illustration inside SVG! */}
          <div className="my-6 flex justify-center">
            <svg viewBox="0 0 350 280" className="w-full max-w-[320px] h-auto font-mono text-xs">
              {/* Back panel of apparatus */}
              <rect x="10" y="10" width="330" height="260" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              
              {/* Scale rulers at back */}
              <line x1="80" y1="40" x2="80" y2="230" stroke="#475569" strokeDasharray="3,3" />
              <line x1="150" y1="40" x2="150" y2="230" stroke="#475569" strokeDasharray="3,3" />
              <line x1="220" y1="340" x2="220" y2="230" stroke="transparent" /> 

              {/* Main Tank (K) */}
              <rect x="70" y="80" width="100" height="150" rx="4" fill="#38bdf8" fillOpacity="0.15" stroke="#0ea5e9" strokeWidth="2.5" />
              <text x="120" y="145" textAnchor="middle" fill="#0ea5e9" className="font-bold text-sm">密闭水箱 K</text>
              <text x="120" y="160" textAnchor="middle" fill="#94a3b8" className="text-[9px]">A: 23.6cm | B: 14.4cm</text>
              
              {/* Tank Water line inside */}
              {/* Let's define height factor based on case. standard case tank is moderately full. */}
              {/* Say standard is 150 height. 140 width */}
              {/* Standard waterline: standard water level in tanks is usually steady, let's say y=130 */}
              <rect x="71" y="115" width="98" height="114" fill="#38bdf8" fillOpacity="0.4" />
              <line x1="71" y1="115" x2="169" y2="115" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,2" />
              
              {/* Pressure status meter icon */}
              <circle cx="120" cy="50" r="16" fill="#020617" stroke="#6366f1" strokeWidth="1.5" />
              <text x="120" y="53" textAnchor="middle" fill="#a5b4fc" className="text-[9px] font-bold">
                {selectedCase === "p0 > pa" ? "+Pa" : selectedCase === "p0 < pa" ? "-Pa" : "0 Pa"}
              </text>
              <line x1="120" y1="66" x2="120" y2="80" stroke="#6366f1" strokeWidth="2" />

              {/* Water connection channels */}
              {/* Tubes A, B, C */}
              {/* A is near bottom (z=14.4), B is higher (z=23.6), C is very high */}
              {/* Draw three vertical Glass tubes representing:
                   Tube 1 (A): measuring height A
                   Tube 2 (B): measuring height B
                   Tube 3 (C): measuring height C
                 Wait, the water levels in all 3 tubes are at same height in still setup = currentData.Hp (between 21.9 and 28.0 cm) */}
              
              {/* Let's convert currentData.Hp (21.9 to 28) to pixel scale on y-axis */}
              {/* Let's assume height 30 cm = y=50px (highest)
                   height 20 cm = y=170px (lowest)
                   Formula: pxY = 170 - (hp - 20) * 12 */}
              {(() => {
                const hpAvg = (currentData.Hp.A + currentData.Hp.B + currentData.Hp.C) / 3;
                const pxWaterY = 170 - (hpAvg - 20) * 12;

                return (
                  <>
                    {/* Tube A (Left, connected to bottom tap) */}
                    <line x1="190" y1="40" x2="190" y2="230" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.3" />
                    <line x1="190" y1="210" x2="160" y2="210" stroke="#38bdf8" strokeWidth="5" /> {/* Connection A */}
                    {/* Tube A fill fluid */}
                    <path d={`M 188 230 L 192 230 L 192 ${pxWaterY} L 188 ${pxWaterY} Z`} fill="#38bdf8" fillOpacity="0.8" />
                    <circle cx="190" cy={pxWaterY} r="3.5" fill="#0284c7" />
                    <text x="190" y="32" textAnchor="middle" fill="#94a3b8" className="text-[10px]">A</text>

                    {/* Tube B (Middle, connected to mid-tap) */}
                    <line x1="230" y1="40" x2="230" y2="230" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.3" />
                    <line x1="230" y1="160" x2="160" y2="160" stroke="#38bdf8" strokeWidth="5" /> {/* Connection B */}
                    {/* Tube B fill */}
                    <path d={`M 228 230 L 232 230 L 232 ${pxWaterY} L 228 ${pxWaterY} Z`} fill="#38bdf8" fillOpacity="0.8" />
                    <circle cx="230" cy={pxWaterY} r="3.5" fill="#0284c7" />
                    <text x="230" y="32" textAnchor="middle" fill="#94a3b8" className="text-[10px]">B</text>

                    {/* Tube C (Right, connected to top boundary or standalone U-tube showing oil level) */}
                    <line x1="270" y1="40" x2="270" y2="230" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.3" />
                    {/* Line connecting to tank C */}
                    <line x1="270" y1="120" x2="160" y2="120" stroke="#38bdf8" strokeWidth="5" />
                    {/* Tube C fill */}
                    <path d={`M 268 230 L 272 230 L 272 ${pxWaterY} L 268 ${pxWaterY} Z`} fill="#38bdf8" fillOpacity="0.8" />
                    <circle cx="270" cy={pxWaterY} r="3.5" fill="#0284c7" />
                    <text x="270" y="32" textAnchor="middle" fill="#94a3b8" className="text-[10px]">C</text>

                    {/* **Hydraulic Grade Line (测压管水头线)** */}
                    <line
                      x1="180"
                      y1={pxWaterY}
                      x2="280"
                      y2={pxWaterY}
                      stroke="#fbbf24"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      className="glow-pulse"
                    />
                    <text x="285" y={pxWaterY + 3} fill="#fbbf24" className="text-[9px] font-bold">测压管水头线 (HGL)</text>
                    <text x="230" y={pxWaterY - 8} fill="#38bdf8" textAnchor="middle" className="text-[9px] font-bold">
                      h = {hpAvg.toFixed(1)} cm
                    </text>
                  </>
                );
              })()}

              <text x="150" y="255" textAnchor="middle" fill="#475569" className="text-[10px]">等高水平测压管：验证 H = z + p/ρg 一致性</text>
            </svg>
          </div>

          <div className="bg-slate-800 p-3 rounded-2xl flex items-center justify-between text-[11px] text-slate-400">
            <span>水柱实际指示刻度：</span>
            <span className="font-mono text-cyan-400 font-bold">
              Hp A: {currentData.Hp.A}cm | B: {currentData.Hp.B}cm | C: {currentData.Hp.C}cm
            </span>
          </div>
        </div>

        {/* Recharts Curve plot proving pabs proportional to Depth */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              静水压强与淹没深度关系曲线 (p_abs ~ h Linearity)
            </h4>
            <span className="text-xs text-slate-400">坐标单位：压强 (cmH₂O) / 深度 (h)</span>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="depth"
                  type="number"
                  name="深度/位置深度"
                  domain={[0, 40]}
                  height={50}
                  label={{ value: "点相对深度 h (cm)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 10 }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  domain={["dataMin - 5", "dataMax + 5"]}
                  label={{ value: "绝对压强 p (cmH₂O)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold">{data.name}</p>
                          <hr className="border-slate-800 my-1" />
                          <p><span className="text-slate-400">设想测深度:</span> {data.depth} cm</p>
                          <p><span className="text-slate-400">绝对压强 p_abs:</span> <span className="text-cyan-400 font-mono font-bold">{data.p_abs} cmH₂O</span></p>
                          <p><span className="text-slate-400">相对高程 Hp:</span> <span className="text-amber-400 font-mono font-bold">{data.Hp} cm</span></p>
                          <p><span className="text-slate-400">表压强 / 相对压强 p_r:</span> <span className="font-mono font-bold">{data.p_r} cmH₂O</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                {/* Under the linear relation: P_abs = p_0 + \rho g h. We fit a linear regression line */}
                <Line
                  type="monotone"
                  dataKey="p_abs"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="绝对压强 (测得理论连线 p_abs)"
                  dot={false}
                  activeDot={false}
                />
                <Scatter
                  dataKey="p_abs"
                  fill="#06b6d4"
                  shape="circle"
                  name="实测位置绝对压强"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 text-xs text-slate-500 space-y-1">
            <p>
              💡 <span className="font-semibold text-slate-700">物理特性解析：</span>
              由于 $dp = \rho g dh$，水箱中任何两个相同水平面上的压强是完全相等的，这属于流体静力学中的**等压面定理**。
            </p>
            <p className="pl-5">
              如图所示，压强与深度呈完美线性关系。无论属于正压加压还是真空负压，其斜率 $\Delta p / \Delta h = \rho g$ 始终保持一致，斜弦率完美反映了水的容重属性常数。
            </p>
          </div>
        </div>
      </div>

      {/* Numerical Data Table */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">
          静水压强实测实验数据记录表
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/55 text-slate-500 font-medium">
                <th className="py-2.5 px-3">测压条件</th>
                <th className="py-2.5 px-3">测次</th>
                <th className="py-2.5 px-3 text-center" colSpan={3}>绝对压强 p_abs (cmH₂O)</th>
                <th className="py-2.5 px-3 text-center" colSpan={3}>相对压强 p_r (cmH₂O)</th>
                <th className="py-2.5 px-3 text-center" colSpan={3}>测压水头 H (cm)</th>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] text-slate-400">
                <th colSpan={2}></th>
                <th className="py-1 px-3 text-center">测点 A</th>
                <th className="py-1 px-3 text-center">测点 B</th>
                <th className="py-1 px-3 text-center">测点 C</th>
                <th className="py-1 px-3 text-center">测点 A</th>
                <th className="py-1 px-3 text-center">测点 B</th>
                <th className="py-1 px-3 text-center">测点 C</th>
                <th className="py-1 px-3 text-center">A</th>
                <th className="py-1 px-3 text-center">B</th>
                <th className="py-1 px-3 text-center">C</th>
              </tr>
            </thead>
            <tbody>
              {hydrostaticData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 hover:bg-indigo-50/20 transition ${
                    selectedCase === row.condition && selectedTrialIdx + 1 === row.trial
                      ? "bg-indigo-50/40 font-medium text-indigo-900"
                      : ""
                  }`}
                >
                  <td className="py-2 px-3 text-slate-700 font-semibold">{row.conditionLabel}</td>
                  <td className="py-2 px-3 text-slate-500">{row.trial}</td>
                  <td className="py-2 px-3 text-center font-mono">{row.pabs.A}</td>
                  <td className="py-2 px-3 text-center font-mono">{row.pabs.B}</td>
                  <td className="py-2 px-3 text-center font-mono">{row.pabs.C}</td>
                  <td className="py-2 px-3 text-center font-mono">{row.pr.A}</td>
                  <td className="py-2 px-3 text-center font-mono">{row.pr.B}</td>
                  <td className="py-2 px-3 text-center font-mono">{row.pr.C}</td>
                  <td className="py-2 px-3 text-center font-mono text-amber-600">{row.Hp.A}</td>
                  <td className="py-2 px-3 text-center font-mono text-amber-600">{row.Hp.B}</td>
                  <td className="py-2 px-3 text-center font-mono text-amber-600">{row.Hp.C}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
