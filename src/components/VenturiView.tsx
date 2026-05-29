/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { venturiData, VenturiItem } from "../data";
import {
  HelpCircle,
  TrendingUp,
  Activity,
  Waves,
  Info,
  ChevronRight,
  Gauge
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

export default function VenturiView() {
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);
  const [chartType, setChartType] = useState<"mu_re" | "qv_dh">("mu_re");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Prepare data for the square root verification: qv vs. sqrt(deltaH)
  const expandedData = venturiData.map((d) => ({
    ...d,
    sqrtDeltaH: parseFloat(Math.sqrt(d.deltaH).toFixed(3)),
    // Theoretical linear benchmark 
    qvTheo: parseFloat((d.qvPrime).toFixed(1))
  }));

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            文丘里流量计综合型实验 (4 文丘里综合型实验)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            本实验用于了解文丘里管流量计的构造和工作原理，测量流量系数 μ 并绘制校准特性曲线。
          </p>
        </div>
        <button
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showFormulaInfo ? "隐藏" : "显示"}实验原理
        </button>
      </div>

      {/* Formula info panel */}
      {showFormulaInfo && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl text-slate-700 text-sm space-y-3 leading-relaxed border border-emerald-100/30">
          <h3 className="font-semibold text-emerald-950 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600" />
            温丘里流量计基本原理与标定公式
          </h3>
          <p>
            文丘里管是利用管道收缩导致局部动能增加、势能降低（流速大处压强小）的原理测量流量的。根据伯努利方程，不计阻力时的理论流量算公式为：
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-3.5 bg-white/70 rounded-xl my-2 border border-emerald-200">
            <div className="text-center font-mono">
              <span className="text-emerald-700 font-bold block">理论流量公式:</span>
              qV' = K * √Δh
            </div>
            <div className="text-slate-400 font-light hidden sm:block">|</div>
            <div className="text-center font-mono">
              <span className="text-emerald-700 font-bold block">流量系数 (Discharge Coefficient):</span>
              μ = qV / qV' ≈ 0.92 ~ 0.98
            </div>
          </div>
          <p>
            式中：<span className="font-semibold font-mono">K</span> 称为文丘里流量计常数（与管径及截面积有关，本实验仪中其几何构造折合为 K 乘子）；
            <span className="font-semibold font-mono">Δh</span> 为两测断面间多管压差计的读数差（表示阻力及重力引起的差值，本仪中折合为 $\Delta h = h_1 - h_2 + h_3 - h_4$ 测量高度）。
          </p>
          <p className="text-slate-600 text-xs pl-2 border-l-2 border-emerald-300">
            流量系数 <span className="font-bold">μ</span> 的大小体现了文丘里收缩口和扩大节流过程中的水头能量损失程度。在充分层流时，μ 随雷诺数 Re 的极速增大而向上攀升；在大流速、高雷诺数（湍流自相似区）时，μ 值受边界层摩擦影响变稳定，进入恒定平面区。
          </p>
        </div>
      )}

      {/* Graphics section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Dynamic Simulator and Data Cards */}
        <div className="bg-slate-950 text-slate-200 p-6 rounded-3xl shadow-lg border border-slate-800 xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">管流体力学断面</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300">Animated Streamlines</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-300">文丘里渐缩与渐扩水流流态</h4>
          </div>

          {/* Flow Lines Venturi Animation */}
          <div className="relative py-6 flex justify-center">
            <svg viewBox="0 0 320 160" className="w-full max-w-[280px] h-auto">
              {/* Back panel */}
              <rect width="320" height="150" fill="#090d16" rx="8" />

              {/* Upper & lower boundaries of the Venturi tube */}
              <path
                d="M 10 30 L 100 30 C 120 30, 130 65, 145 65 L 175 65 C 190 65, 200 30, 220 30 L 310 30"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
              />
              <path
                d="M 10 120 L 100 120 C 120 120, 130 85, 145 85 L 175 85 C 190 85, 200 120, 220 120 L 310 120"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
              />

              {/* Piezometer connections */}
              <rect x="50" y="5" width="8" height="26" fill="#090d16" stroke="#475569" />
              <rect x="156" y="5" width="8" height="61" fill="#090d16" stroke="#475569" />

              {/* Wave Streamlines inside */}
              {/* Entrance thick streamlines */}
              <path d="M 15 50 Q 100 50, 140 70 T 180 70 Q 220 50, 305 50" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.4" />
              <path d="M 15 75 Q 100 75, 160 75 T 305 75" fill="none" stroke="#22c55e" strokeWidth="2.5" className="glow-pulse" />
              <path d="M 15 100 Q 100 100, 140 80 T 180 80 Q 220 100, 305 100" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* Tiny water molecules speed animation */}
              <circle cx="60" cy="75" r="3" fill="#ffffff" className="animate-pulse" />
              <circle cx="160" cy="75" r="2" fill="#ffffff" className="animate-pulse" />
              <circle cx="260" cy="75" r="3" fill="#ffffff" className="animate-pulse" />

              {/* Diameter metrics */}
              <text x="54" y="110" textAnchor="middle" fill="#94a3b8" className="text-[10px] font-mono">D_1 = 14.0 mm</text>
              <text x="160" y="52" textAnchor="middle" fill="#34d399" className="text-[10px] font-mono font-bold">D_2 = 7.05 mm (节流喉)</text>

              {/* Pressure status tags */}
              <text x="40" y="24" fill="#38bdf8" className="text-[8px] font-bold">高静压 HGL</text>
              <text x="148" y="58" fill="#f87171" className="text-[8px] font-bold">低压(流速高)</text>
            </svg>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-slate-500 uppercase font-bold block mb-1">各测次数据提炼</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">平均流量系数 μ_avg</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {(venturiData.reduce((acc, d) => acc + d.mu, 0) / venturiData.length).toFixed(3)}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">最高雷诺数 Re_max</span>
                <span className="text-base font-bold text-emerald-400 font-mono">10,687</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Panel */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 xl:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                文丘里特性校准曲线图
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">点击下方标签切换不同物理关系校核曲线</p>
            </div>

            {/* Toggle chart views */}
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setChartType("mu_re")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition cursor-pointer ${
                  chartType === "mu_re"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                μ - Re (流量系数-雷诺数)
              </button>
              <button
                onClick={() => setChartType("qv_dh")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition cursor-pointer ${
                  chartType === "qv_dh"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                q_V - △h (二次抛物线)
              </button>
            </div>
          </div>

          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "mu_re" ? (
                <LineChart
                  data={venturiData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="Re"
                    type="number"
                    domain={[1000, 12000]}
                    height={50}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    label={{ value: "雷诺数 Re", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 10 }}
                  />
                  <YAxis
                    domain={[0.9, 0.98]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    label={{ value: "流量系数 μ", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data: VenturiItem = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                            <p className="font-bold text-emerald-400">第 {data.trial} 次测量数据</p>
                            <hr className="border-slate-800 my-1" />
                            <p><span className="text-slate-400">雷诺数 Re:</span> <span className="font-mono font-bold text-slate-200">{data.Re}</span></p>
                            <p><span className="text-slate-400">流量系数 μ:</span> <span className="font-mono font-bold text-emerald-300 text-sm">{data.mu}</span></p>
                            <p><span className="text-slate-400">实测流量:</span> <span className="font-mono">{data.qv} L/s</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Line
                    type="monotone"
                    dataKey="mu"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    name="校准曲线 (μ - Re)"
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <ScatterChart
                  margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="deltaH"
                    type="number"
                    name="压差水头"
                    domain={[0, 45]}
                    height={50}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    label={{ value: "水头压差 △h (10^-2 m)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 10 }}
                  />
                  <YAxis
                    dataKey="qv"
                    type="number"
                    name="实测流量"
                    domain={[0, 120]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    label={{ value: "流量 qV (10^-6 m³/s)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }}
                  />
                  <ZAxis range={[60, 60]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                            <p className="font-bold text-cyan-400">第 {data.trial} 次测定</p>
                            <hr className="border-slate-800 my-1" />
                            <p><span className="text-slate-400">压强头差 △h:</span> <span className="font-mono font-bold text-amber-300">{data.deltaH} cm</span></p>
                            <p><span className="text-slate-400">实测流量 qv:</span> <span className="font-mono font-bold text-cyan-300">{data.qv}</span></p>
                            <p><span className="text-slate-400">理论流量 qv':</span> <span className="font-mono text-slate-400">{data.qvPrime}</span></p>
                            <p><span className="text-slate-400">sqrt(△h):</span> <span className="font-mono text-slate-300">{data.sqrtDeltaH}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  {/* Two series: Experiential and Theoretical */}
                  <Scatter
                    name="实测流量 qV ~ △h 点"
                    data={expandedData}
                    fill="#10b981"
                    line={{ stroke: "#0ea5e9", strokeWidth: 1.5, strokeDasharray: "4,2" }}
                  />
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 text-xs text-slate-500">
            <p>
              📊 <span className="font-semibold text-slate-700">曲线形态学分析：</span>
              1. 在 <span className="font-bold">μ - Re 曲线</span> 中，随雷诺数 Re 从 2000 上涨到 10000 以上，因粘滞阻力相对惯性力的影响减小，流量系数逐渐收敛于 <span className="text-emerald-600 font-semibold font-mono">0.93 - 0.96</span>，吻合管内附面层充分紊流自相似流特性。
            </p>
            <p className="mt-1">
              2. 在 <span className="font-bold">q_V - △h 曲线</span> 中，由于阻损及速能水头差成二次方，流量点严格服从抛物线平方根特性，表明管外多点多管差测压具备极高的精度。
            </p>
          </div>
        </div>
      </div>

      {/* Numerical Data Tabular Grid */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">
          文丘里综合仪实测数据表格记录 (Verification Grid)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/55 text-slate-500 font-medium">
                <th className="py-2.5 px-3">次数</th>
                <th className="py-2.5 px-3">实测流量 qV (10⁻⁶ m³/s)</th>
                <th className="py-2.5 px-3">多管压差 △h (10⁻² m)</th>
                <th className="py-2.5 px-3">平均雷诺数 Re</th>
                <th className="py-2.5 px-3">理论流量 qV' (10⁻⁶ m³/s)</th>
                <th className="py-2.5 px-3 text-emerald-600">测得流量系数 μ</th>
                <th className="py-2.5 px-3">比差 (1 - μ) / μ (%)</th>
              </tr>
            </thead>
            <tbody>
              {venturiData.map((row) => (
                <tr
                  key={row.trial}
                  onMouseEnter={() => setHoveredIndex(row.trial)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`border-b border-slate-100 transition ${
                    hoveredIndex === row.trial ? "bg-emerald-50/30" : ""
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-500 font-mono">#{row.trial}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700 font-mono">{row.qv}</td>
                  <td className="py-2.5 px-3 font-mono text-amber-600 font-bold">{row.deltaH}</td>
                  <td className="py-2.5 px-3 font-mono">{row.Re}</td>
                  <td className="py-2.5 px-3 font-mono">{row.qvPrime}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 font-bold">{row.mu}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {(((row.qvPrime - row.qv) / row.qv) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
