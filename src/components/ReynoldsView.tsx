/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { reynoldsLogData, reynoldsObsData } from "../data";
import {
  HelpCircle,
  TrendingUp,
  Compass,
  Waves,
  Info,
  Sliders,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ReferenceLine
} from "recharts";

export default function ReynoldsView() {
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);
  const [controlRe, setControlRe] = useState<number>(2300); // Slider state
  const [activeTab, setActiveTab] = useState<"chart" | "data_obs">("chart");

  // Determine qualitative flow regime based on manual slider
  let dyeShape = "直线";
  let dyeColor = "#ec4899"; // Pink stroke
  let flowStatus = "层流 (Laminar Flow - Re ≤ 2000)";
  let flowDesc = "墨水保持光滑如镜的直线条丝，无任何径向脉动渗杂，各流层互不混合。";

  if (controlRe > 2000 && controlRe <= 3500) {
    dyeShape = "波浪状";
    flowStatus = "过渡流 (Transitional Flow - 2000 < Re ≤ 4000)";
    flowDesc = "流道水力受高频绕动，墨线上出现不规则小弯曲、蛇形波浪震荡，流束即将发散。";
  } else if (controlRe > 3500) {
    dyeShape = "散开混掺 (不明显)";
    flowStatus = "湍流/紊流 (Turbulent Flow - Re > 4000)";
    flowDesc = "流速过高导致质点急剧混掺杂乱，有色墨丝一经喷出就瞬间散开、彻底破碎并把全管染色。";
  }

  return (
    <div className="space-y-6">
      {/* Header index card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            雷诺流态判别与摩擦阻力实验 (7 雷诺实验)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            本实验用于定性观察层流和湍流流态及其状态转变；测定圆管流动阻力损失由线性向二次方演变的临界雷诺数。
          </p>
        </div>
        <button
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showFormulaInfo ? "隐藏" : "显示"}实验原理
        </button>
      </div>

      {/* Formula info modal */}
      {showFormulaInfo && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl text-slate-700 text-sm space-y-3 leading-relaxed border border-purple-100/30">
          <h3 className="font-semibold text-purple-950 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-purple-600" />
            雷诺流动粘滞规律与对数阻力折线特征
          </h3>
          <p>
            雷诺依据流态演变，总结出无因次能量判据——
            <span className="font-bold text-purple-700 mx-1">雷诺数 (Re)</span>：
          </p>
          <div className="flex bg-white/70 p-3.5 border border-purple-100 rounded-xl justify-center font-mono my-2 font-bold text-purple-800">
            Re = v * d / ν = 4 * qV / (π * d * ν)
          </div>
          <p>
            式中，<span className="font-semibold font-mono">v</span> 为断面平均流速，
            <span className="font-semibold font-mono">d</span> 为圆管内径，
            <span className="font-semibold font-mono">ν</span> 为流体的运动粘度。通常，管流下临界雷诺数约为 <span className="font-semibold text-purple-750">2000 ~ 2300</span>。
          </p>
          <p className="text-slate-600 text-xs pl-2 border-l-2 border-purple-300">
            在阻力特性上（由对数曲线表征）：
            <br />
            以 <span className="font-bold text-slate-800 font-mono">log Jv</span> 为纵轴，
            <span className="font-bold text-slate-800 font-mono">log v</span> 为横轴绘图：
            <br />
            1. 当处于 <span className="font-semibold text-indigo-600">层流区</span> 时，沿程水头损失 h_f 与流速 v 一次方成正比，其对数比斜率刚好为 <span className="font-bold font-mono">1.0</span>。
            <br />
            2. 当处于 <span className="font-semibold text-rose-600">充分湍流区</span> 时，惯性能量极大阻耗，水头损失与流速的 1.75 ~ 2.0 次方成正比，因而斜率明显弯折并陡然提至 <span className="font-bold font-mono">1.75 ~ 2.0</span>。
          </p>
        </div>
      )}

      {/* Live Controller and dynamic pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Particle and Water Tube Simulator Panel */}
        <div className="bg-slate-950 text-slate-200 p-6 rounded-3xl shadow-lg border border-slate-800 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">雷诺玻璃管道仿真模型</span>
              <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30 text-purple-300 font-bold">Dynamic Physics</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-200">墨水丝层流-紊流动态演变演示器</h4>
          </div>

          {/* Svg flow pipeline animation */}
          <div className="my-6 relative py-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center">
            {/* Control Valve Sider */}
            <div className="w-11/12 px-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-4 mb-4">
              <span className="text-[10px] text-slate-400 shrink-0">调节阀门开度 (Re):</span>
              <input
                type="range"
                min="500"
                max="9500"
                step="250"
                value={controlRe}
                onChange={(e) => setControlRe(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-auto cursor-pointer accent-purple-500"
              />
              <span className="font-mono text-purple-400 font-bold text-xs shrink-0">{controlRe}</span>
            </div>

            <svg viewBox="0 0 320 80" className="w-[90%] h-auto">
              {/* Pipe layout */}
              <rect x="5" y="20" width="310" height="40" rx="4" fill="none" stroke="#64748b" strokeWidth="2.5" />
              <rect x="5" y="21" width="310" height="38" fill="#38bdf8" fillOpacity="0.05" />

              {/* Dye nozzle tip */}
              <path d="M 5 40 L 40 40 L 45 40" fill="none" stroke="#94a3b8" strokeWidth="3" />
              <circle cx="45" cy="40" r="1.5" fill="#f43f5e" />

              {/* Dye Thread Stroke based on Re status */}
              {controlRe <= 2000 ? (
                // Pure straight laminar streamline
                <line x1="45" y1="40" x2="310" y2="40" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
              ) : controlRe > 2000 && controlRe <= 3500 ? (
                // Beautiful sine wave oscillation representing transitional waves
                <path
                  d="M 45 40 Q 70 34, 100 40 T 150 40 T 200 40 T 250 40 T 310 40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                // Chaotic scattered line with opacity demonstrating turbulence
                <>
                  <path
                    d="M 45 40 Q 60 35, 75 42 T 110 33 T 150 48 T 200 30 T 250 50 T 310 38"
                    fill="none"
                    stroke="#b91c1c"
                    strokeWidth="2.2"
                    strokeOpacity="0.8"
                  />
                  {/* Turbulent spreading ink drops */}
                  <rect x="120" y="22" width="190" height="36" fill="#ef4565" fillOpacity="0.22" rx="4" />
                  <circle cx="160" cy="35" r="4" fill="#b91c1c" fillOpacity="0.4" className="animate-ping" />
                  <circle cx="230" cy="45" r="5" fill="#b91c1c" fillOpacity="0.4" className="animate-ping" />
                </>
              )}
            </svg>

            {/* Qualitative observation log card */}
            <div className="w-11/12 mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[10px] space-y-1">
              <div className="flex justify-between items-center text-purple-400 font-bold text-[11px]">
                <span>流态鉴定: {flowStatus}</span>
                <span className="text-[9px] bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">形态: {dyeShape}</span>
              </div>
              <p className="text-slate-400 font-sans leading-relaxed">{flowDesc}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-400">
            💡 <span className="font-semibold text-slate-300">流体雷诺特性点评：</span>
            本模型完美展示了高频剪截摩擦时雷诺数的演变机制。下临界雷诺数 Re_cr 约为 2000。调节阀门，层流、波浪转变、混杂溃散过渡完美呈现于流线图示，定性重演了奥斯本·雷诺（Osborne Reynolds）在1883年的世纪经典实验！
          </div>
        </div>

        {/* Double-Logarithmic curve plot log J ~ log V */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                雷诺双对数阻力斜率特性曲线 (log J ~ log V Plot)
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">X轴：log V | Y轴：log Jv</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setActiveTab("chart")}
                className={`px-3 py-1 rounded text-[11px] font-bold select-none cursor-pointer ${
                  activeTab === "chart" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                对数折线图
              </button>
              <button
                onClick={() => setActiveTab("data_obs")}
                className={`px-3 py-1 rounded text-[11px] font-bold select-none cursor-pointer ${
                  activeTab === "data_obs" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                水线观察表
              </button>
            </div>
          </div>

          {activeTab === "chart" ? (
            <>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="logV"
                      type="number"
                      domain={[1.0, 2.0]}
                      height={50}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      label={{ value: "流速对数 log V", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 10 }}
                    />
                    <YAxis
                      dataKey="logJv"
                      type="number"
                      domain={[-4.5, -1.0]}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      label={{ value: "水力坡度对数 log Jv", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                              <p className="font-bold text-purple-400">测点 #{data.trial}</p>
                              <hr className="border-slate-800 my-1" />
                              <p><span className="text-slate-400">log V:</span> <span className="font-mono font-bold text-cyan-300">{data.logV}</span></p>
                              <p><span className="text-slate-400">log Jv:</span> <span className="font-mono font-bold text-amber-300">{data.logJv}</span></p>
                              <p><span className="text-slate-400">雷诺数 Re:</span> <span className="font-mono font-bold text-white">{data.Re}</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                    <Scatter
                      name="实测对数关系点 (Log Line)"
                      data={reynoldsLogData}
                      fill="#8b5cf6"
                      line={{ stroke: "#a78bfa", strokeWidth: 1.5 }}
                    />
                    {/* Reference Line for Critical Transition Point (around logV = 1.33, Re = 3189 or logV = 1.26, Re = 2700) */}
                    <ReferenceLine x={1.26} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "下临界分界线", position: "insideTopLeft", fill: "#f43f5e", fontSize: 8 }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 text-[11px] text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700">📈 双对数折线斜率剖析：</span>
                图中可以看到明显的**分段转弯特性**。在 log V 较低的区间（log V 小于 1.26，对应 Re 小于 2700），由于管流主要成分属于静压层流，对数斜率斜弦度温和，接近于 1.0；而在 log V 水平攀升跨过临界分段后，曲线剧烈抬斜，斜率爬升到了 1.75 以上，这代表着紊流耗损高阶次方爆发，**完美对应了阻力损失规律从一阶跃升至高次方紊流阻力区的发展规律**。
              </div>
            </>
          ) : (
            <div className="overflow-y-auto max-h-[295px] pr-2">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                    <td className="py-2 px-3">实验工况次序</td>
                    <td className="py-2 px-3">有色墨线流束形态</td>
                    <td className="py-2 px-3">测量流量 qv (mL/s)</td>
                    <td className="py-2 px-3 text-purple-600 font-bold">流动雷诺数 Re</td>
                    <td className="py-2 px-3">阀门操作开度</td>
                  </tr>
                </thead>
                <tbody>
                  {reynoldsObsData.map((row) => (
                    <tr key={row.trial} className="border-b border-slate-100 hover:bg-slate-50/60 transition">
                      <td className="py-2 px-3 font-mono text-slate-500">#{row.trial}</td>
                      <td className="py-2 px-3 font-semibold text-slate-700">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          row.dyeShape === "直线" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          row.dyeShape === "波浪状" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                          {row.dyeShape}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono">{row.qv}</td>
                      <td className="py-2 px-3 font-mono text-purple-600 font-bold">{row.Re}</td>
                      <td className="py-2 px-3 text-slate-400">{row.valveOpening}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 text-[10px] text-amber-800 mt-3 font-sans">
                💡 **墨线观测规律：** 
                由此表可知，流量从高到低阀门逐渐收临时，流动从紊紊波动逐渐平滑，当雷诺数 Re 跌至 2456 以下后（第5与第6测次），横向绕动完全磨损耗失，墨水重现完美直线。这展现了雷诺临界剪截带的稳定性。
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quantitative logs Table 1 */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">
          雷诺阻力摩擦对数定比实验记录表 (Table 1)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/55 text-slate-500 font-medium">
                <th className="py-2.5 px-3">测量次数</th>
                <th className="py-2.5 px-3">多管压差 ▽1-2 (cm)</th>
                <th className="py-2.5 px-3">水头沿损 hf (cm)</th>
                <th className="py-2.5 px-3">水力坡降 Jv (10⁻² Scale)</th>
                <th className="py-2.5 px-3 font-semibold">流量 Qv (cm³/s)</th>
                <th className="py-2.5 px-3 font-semibold">管均流速 v (cm/s)</th>
                <th className="py-2.5 px-3 font-semibold text-purple-600">雷诺数 Re</th>
                <th className="py-2.5 px-3 text-amber-600 font-bold">对数值 log V</th>
                <th className="py-2.5 px-3 text-amber-600 font-bold">对数值 log Jv</th>
              </tr>
            </thead>
            <tbody>
              {reynoldsLogData.map((row) => (
                <tr key={row.trial} className="border-b border-slate-100 hover:bg-slate-50/60 transition text-slate-600">
                  <td className="py-2 px-3 font-mono text-slate-500">#{row.trial}</td>
                  <td className="py-2 px-3 font-mono">{row.hLostDiff}</td>
                  <td className="py-2 px-3 font-mono">{row.hf}</td>
                  <td className="py-2 px-3 font-mono">{row.Jv}</td>
                  <td className="py-2 px-3 font-mono text-slate-700 font-semibold">{row.Qv}</td>
                  <td className="py-2 px-3 font-mono">{row.v}</td>
                  <td className="py-2 px-3 font-mono text-purple-600 font-bold">{row.Re}</td>
                  <td className="py-2 px-3 font-mono text-amber-600 font-bold">{row.logV}</td>
                  <td className="py-2 px-3 font-mono text-amber-600 font-bold">{row.logJv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
