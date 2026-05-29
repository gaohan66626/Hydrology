/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { localLossData, LocalLossItem } from "../data";
import {
  HelpCircle,
  TrendingUp,
  Sliders,
  Waves,
  Info,
  Layers,
  Zap
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter
} from "recharts";

export default function LocalLossView() {
  const [activeType, setActiveType] = useState<"sudden_expansion" | "sudden_contraction">("sudden_expansion");
  const [showFormulaInfo, setShowFormulaInfo] = useState<boolean>(false);
  const [selectedTrialIdx, setSelectedTrialIdx] = useState<number>(0);

  // Filter data by active type
  const items = localLossData.filter((d) => d.type === activeType);
  const currentItem: LocalLossItem = items[selectedTrialIdx] || items[0];

  // Custom data for comparing Measured vs Theoretical zeta
  const comparisonChartData = items.map((item) => ({
    name: `测次 ${item.trial} (qv=${item.qv})`,
    "实测阻力系数 ζ": item.zeta,
    "理论/经验系数 ζ": item.theoreticalZeta,
    "压差损失 hj": item.hj
  }));

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            局部水头损失实验 (5 局部水头损失实验)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            本实验用于掌握突扩管与突缩管产生局部能量折损的力学机理，验证局部摩擦阻力系数 ζ 与理论（经验）公式。
          </p>
        </div>
        <button
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showFormulaInfo ? "隐藏" : "显示"}实验原理
        </button>
      </div>

      {/* Formula info panel */}
      {showFormulaInfo && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl text-slate-700 text-sm space-y-3 leading-relaxed border border-amber-100/30">
          <h3 className="font-semibold text-amber-950 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-600" />
            局部阻损及能量流线方程
          </h3>
          <p>
            当流体流经截面急剧改变的突扩或突缩节时，由于附面层分离、主流脱离管壁自冲形成剧烈的漩涡区，造成极大的机械摩擦阻力损失，即为
            <span className="font-bold text-amber-700 mx-1">局部水头损失 (hj)</span>。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="bg-white/70 p-3 rounded-xl border border-amber-100">
              <span className="font-bold text-amber-900 block mb-1">① 突然扩大管 (Borda-Carnot 理论)</span>
              理论推导得出损失系数：
              <code className="block bg-slate-100 p-1.5 font-mono text-xs rounded text-rose-600 font-semibold mt-1">
                ζ = (1 - A1 / A2)² ≈ 0.589
              </code>
              <span className="text-slate-500 text-[11px]">（以突扩前窄管流速 v₁ 为准）</span>
            </div>
            <div className="bg-white/70 p-3 rounded-xl border border-amber-100">
              <span className="font-bold text-amber-900 block mb-1">② 突然缩小管 (经验公式)</span>
              缩口收缩射流导致膨胀涡损失系数：
              <code className="block bg-slate-100 p-1.5 font-mono text-xs rounded text-rose-600 font-semibold mt-1">
                ζ = 0.5 * (1 - A5 / A4) ≈ 0.380
              </code>
              <span className="text-slate-500 text-[11px]">（以突缩后窄管流速 v₅ 为准）</span>
            </div>
          </div>
          <p className="text-slate-600 text-xs pl-2 border-l-2 border-amber-300">
            通过测量前断面测高 E₁' 与后断面测高 E₂' 的水头差值，并扣除沿程摩阻，即可获得纯局部水头损失：
            <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-semibold mx-1">
              hj = E₁' - E₂'
            </span>，其无量纲阻力系数定义为：
            <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-semibold">
              ζ = hj / (v²/2g)
            </span>。
          </p>
        </div>
      )}

      {/* Selector and Trial Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Toggle Tube Types */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-500" />
            选择局部几何阻力形式
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveType("sudden_expansion");
                setSelectedTrialIdx(0);
              }}
              className={`p-4 rounded-xl text-xs font-semibold text-left select-none transition border cursor-pointer ${
                activeType === "sudden_expansion"
                  ? "bg-slate-900 text-amber-400 border-transparent shadow shadow-slate-300"
                  : "border-slate-100 hover:border-amber-100 text-slate-600"
              }`}
            >
              🚀 突然扩大管道 (1 → 2)
              <span className="text-[10px] text-slate-400 block font-normal mt-1">
                窄管 (d1=10.1mm) 突扩成 宽管 (d2=20.8mm)
              </span>
            </button>
            <button
              onClick={() => {
                setActiveType("sudden_contraction");
                setSelectedTrialIdx(0);
              }}
              className={`p-4 rounded-xl text-xs font-semibold text-left select-none transition border cursor-pointer ${
                activeType === "sudden_contraction"
                  ? "bg-slate-900 text-amber-400 border-transparent shadow shadow-slate-300"
                  : "border-slate-100 hover:border-amber-100 text-slate-600"
              }`}
            >
              📉 突然缩小管道 (4 → 5)
              <span className="text-[10px] text-slate-400 block font-normal mt-1">
                宽管 (d4=20.8mm) 突缩成 窄管 (d5=10.4mm)
              </span>
            </button>
          </div>
        </div>

        {/* Real-time verification results */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-500" />
                当前测次局部损失物理表
              </h3>
              <div className="flex gap-1.5">
                {items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTrialIdx(idx)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                      selectedTrialIdx === idx
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                    }`}
                  >
                    测点 {item.trial}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 block">流量 qv</span>
                <span className="text-sm font-bold font-mono text-slate-700">{currentItem.qv} <span className="text-[9px] font-normal">mL/s</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 block">局部損失 hj</span>
                <span className="text-sm font-bold font-mono text-rose-600">{currentItem.hj} <span className="text-[9px] font-normal">cm</span></span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 block">表定阻力因数 ζ</span>
                <span className="text-sm font-bold font-mono text-amber-600">{currentItem.zeta}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 block">阻力常数理论值</span>
                <span className="text-sm font-bold font-mono text-slate-500">{currentItem.theoreticalZeta}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-xs text-amber-900 mt-4 leading-relaxed">
            <span className="font-bold">🧪 阻能校验报告：</span>
            本测次中，实测局部损系数为 
            <span className="font-mono font-bold text-amber-700"> ζ_实测 = {currentItem.zeta}</span>，与理论极限
            <span className="font-mono font-bold text-slate-700"> ζ_理论 = {currentItem.theoreticalZeta}</span> 相比，
            相对误差仅约 <span className="font-mono font-semibold text-rose-600">{Math.abs((currentItem.zeta - currentItem.theoreticalZeta) / currentItem.theoreticalZeta * 100).toFixed(1)}%</span>。
            在湍流水流边界摩擦复杂的实验环境中，此吻合度精度极高，充分说明节流耗能公式是经典力学的黄金定理。
          </div>
        </div>
      </div>

      {/* Layout Split: HGL/EGL visualization SVG & Recharts comparison curve */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Dynamic Energy Line SVG (HGL/EGL Graph) */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-md border border-slate-800 xl:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">高程能量坡度线模型</span>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-amber-300">HGL & EGL Graph</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-300">
              {activeType === "sudden_expansion" ? "突扩管" : "突缩管"}{" "}
              能量坡降线 (EGL) 与 测压管水头线 (HGL) 动态剖面
            </h4>
          </div>

          <div className="my-6 flex justify-center">
            <svg viewBox="0 0 320 200" className="w-full max-w-[300px] h-auto font-mono text-[9px]">
              {/* Device pipe drawing in section scale */}
              {activeType === "sudden_expansion" ? (
                // Sudden Expansion (1 -> 2)
                // Left thin pipe (height 30 to 170). Right wide pipe (height 10 to 190)
                <>
                  {/* Pipe contour boundary */}
                  <path d="M 10 70 L 130 70 L 130 40 L 310 40" fill="none" stroke="#475569" strokeWidth="2" />
                  <path d="M 10 130 L 130 130 L 130 160 L 310 160" fill="none" stroke="#475569" strokeWidth="2" />
                  
                  {/* Water shade */}
                  <path d="M 10 71 L 129 71 L 129 41 L 309 41 L 309 159 L 129 159 L 129 129 L 10 129 Z" fill="#38bdf8" fillOpacity="0.1" />

                  {/* Lines representing:
                      - EGL (Total Energy) starts at y=30, drops by local loss hj(from 29.32 to 23.63) around section change
                      - HGL (Pressure Head) starts at y=80 (EGL - speed Head pre 9.5), drops or rises since speed head decreases to 0.53 (y = EGL - 0.5)
                  */}
                  {/* Let's draw: EGL = Red, HGL = Yellow */}
                  {/* Entrance EGL: 30px. Exit EGL: 70px (due to drop of 5.69cm). 
                      Let's use currentItem values to draw proportional lines.
                  */}
                  {(() => {
                    const eglPreY = 40;                 // Entry Energy level (represented as pixel coordinates)
                    const velocityHeadPreY = currentItem.vHeadPre * 3.5; // velocity head pre (proportional pixels)
                    const hglPreY = eglPreY + velocityHeadPreY; // Entry pressure head

                    const hjY = currentItem.hj * 4;     // loss
                    const eglPostY = eglPreY + hjY;     // Exit Energy level
                    const velocityHeadPostY = currentItem.vHeadPost * 3.5;
                    const hglPostY = eglPostY + velocityHeadPostY;

                    return (
                      <>
                        {/* EGL (Total Energy Line E') - Red */}
                        <path
                          d={`M 10 ${eglPreY} L 130 ${eglPreY} L 150 ${eglPostY} L 310 ${eglPostY}`}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />
                        <text x="40" y={eglPreY - 6} fill="#ef4444" className="font-bold text-[8px]">总水头线 (EGL, E')</text>

                        {/* HGL (Hydraulic Grade Line Hp) - Yellow */}
                        <path
                          d={`M 10 ${hglPreY} L 130 ${hglPreY} T 150 ${hglPostY} L 310 ${hglPostY}`}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          strokeDasharray="3,1"
                        />
                        <text x="40" y={hglPreY + 11} fill="#fbbf24" className="font-bold text-[8px]">测压管水头线 (HGL)</text>

                        {/* Drop indicators */}
                        <line x1="145" y1={eglPreY} x2="145" y2={eglPostY} stroke="#f87171" strokeWidth="1.5" strokeDasharray="2,2" />
                        <text x="152" y={eglPreY + 14} fill="#f87171" className="font-bold">hj = {currentItem.hj}cm</text>

                        {/* Vortex circles at corner */}
                        <path d="M 132 45 A 5 5 0 0 1 138 65" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="1,1" className="animate-spin" />
                        <path d="M 132 155 A 5 5 0 0 0 138 135" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="1,1" className="animate-spin" />
                        <text x="142" y="55" fill="#60a5fa" className="text-[7px]">剧降涡区</text>
                      </>
                    );
                  })()}
                </>
              ) : (
                // Sudden Contraction (4 -> 5)
                // Left wide pipe (height 10 to 190). Right thin pipe (height 30 to 170)
                <>
                  {/* Pipe contour boundary */}
                  <path d="M 10 40 L 130 40 L 130 70 L 310 70" fill="none" stroke="#475569" strokeWidth="2" />
                  <path d="M 10 160 L 130 160 L 130 130 L 310 130" fill="none" stroke="#475569" strokeWidth="2" />

                  {/* Water shade */}
                  <path d="M 10 41 L 129 41 L 129 71 L 309 71 L 309 129 L 129 129 L 129 159 L 10 159 Z" fill="#38bdf8" fillOpacity="0.1" />

                  {/* Lines representing:
                      - EGL starts high, drops by local loss hj(from 18.65 to 13.83)
                      - HGL starts close to EGL (since velocity is low vHeadPre=0.75), and falls dramatically as velocity increases (vHeadPost=12.03)
                  */}
                  {(() => {
                    const eglPreY = 40;                 // Entry Energy level (represented as pixel coordinates)
                    const velocityHeadPreY = currentItem.vHeadPre * 3.5; 
                    const hglPreY = eglPreY + velocityHeadPreY; // Entry pressure head

                    const hjY = currentItem.hj * 4;     // loss
                    const eglPostY = eglPreY + hjY;     // Exit Energy level
                    const velocityHeadPostY = currentItem.vHeadPost * 3.5;
                    const hglPostY = eglPostY + velocityHeadPostY;

                    return (
                      <>
                        {/* EGL - Red */}
                        <path
                          d={`M 10 ${eglPreY} L 130 ${eglPreY} L 150 ${eglPostY} L 310 ${eglPostY}`}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />
                        <text x="40" y={eglPreY - 6} fill="#ef4444" className="font-bold text-[8px]">总水头线 (EGL)</text>

                        {/* HGL - Yellow */}
                        <path
                          d={`M 10 ${hglPreY} L 130 ${hglPreY} T 150 ${hglPostY} L 310 ${hglPostY}`}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          strokeDasharray="3,1"
                        />
                        <text x="40" y={hglPreY + 11} fill="#fbbf24" className="font-bold text-[8px]">测压管水头线 (HGL)</text>

                        {/* Drop indicators */}
                        <line x1="145" y1={eglPreY} x2="145" y2={eglPostY} stroke="#f87171" strokeWidth="1.5" strokeDasharray="2,2" />
                        <text x="152" y={eglPreY + 14} fill="#f87171" className="font-bold">hj = {currentItem.hj}cm</text>
                      </>
                    );
                  })()}
                </>
              )}
            </svg>
          </div>

          <div className="bg-slate-800 p-3 rounded-2xl flex items-center justify-between text-[11px] text-slate-400">
            <span>前/后速度水头转变：</span>
            <span className="font-mono text-amber-400 font-bold">
              v₁²/2g: {currentItem.vHeadPre}cm → v₂²/2g: {currentItem.vHeadPost}cm
            </span>
          </div>
        </div>

        {/* Recharts Bar/Line chart comparing measured vs theoretical zeta */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 xl:col-span-7 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            实测阻力系数与理论经验值对比曲线 (ζ Coefficients Verification)
          </h4>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={comparisonChartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" height={50} tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis
                  yAxisId="left"
                  domain={[0, 1.0]}
                  label={{ value: "阻力系数 ζ", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 12]}
                  label={{ value: "损失高程 hj (cm)", angle: 90, position: "insideRight", fill: "#64748b", fontSize: 10 }}
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
                          <p><span className="text-slate-400">实测 ζ:</span> <span className="text-amber-400 font-mono font-bold">{data["实测阻力系数 ζ"]}</span></p>
                          <p><span className="text-slate-400">理论 ζ:</span> <span className="text-slate-300 font-mono font-bold">{data["理论/经验系数 ζ"]}</span></p>
                          <p><span className="text-slate-400">水头局部损失 hj:</span> <span className="text-rose-400 font-mono font-bold">{data["压差损失 hj"]} cm</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar
                  yAxisId="left"
                  dataKey="实测阻力系数 ζ"
                  fill="#fbbf24"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="理论/经验系数 ζ"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="理论/经验系数"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="压差损失 hj"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  name="水头损失 hj (右轴)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 text-xs text-slate-500 space-y-1">
            <p>
              💡 <span className="font-semibold text-slate-700">理论特性总结：</span>
              由于突扩的理论公式是基于严格的动量方程、连续方程和能量方程解析所得，突扩阻力系数 ζ 一般不随流量而剧烈跳动，保持极好的高度稳定性（约 0.59）。而突缩管由于 vena contracta 收缩涡流更复杂，经验公式略微取均，但实测拟合依旧在合理的高水平拟合度中。
            </p>
          </div>
        </div>
      </div>

      {/* Raw numerical logs table */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">
          局部阻力损失实验详细数据记录表
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/55 text-slate-500 font-medium">
                <th className="py-2.5 px-3">阻力形式</th>
                <th className="py-2.5 px-3">测次</th>
                <th className="py-2.5 px-3">流量 qv (10⁻⁶ m³/s)</th>
                <th className="py-2.5 px-3">入口速度水头 av1²/2g (cm)</th>
                <th className="py-2.5 px-3">出口速度水头 av2²/2g (cm)</th>
                <th className="py-2.5 px-3 text-rose-500 font-bold">损失高程 hj (cm)</th>
                <th className="py-2.5 px-3 text-amber-600">实测阻力系数 ζ</th>
                <th className="py-2.5 px-3">理论阻力系数 ζ_theo</th>
              </tr>
            </thead>
            <tbody>
              {localLossData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 hover:bg-amber-50/20 transition ${
                    activeType === row.type && selectedTrialIdx === row.trial - 1
                      ? "bg-amber-50/40 font-medium text-amber-950"
                      : ""
                  }`}
                >
                  <td className="py-2 px-3 text-slate-700 font-semibold">{row.typeName}</td>
                  <td className="py-2 px-3 font-mono">{row.trial}</td>
                  <td className="py-2 px-3 font-mono">{row.qv}</td>
                  <td className="py-2 px-3 font-mono text-slate-500">{row.vHeadPre}</td>
                  <td className="py-2 px-3 font-mono text-slate-500">{row.vHeadPost}</td>
                  <td className="py-2 px-3 font-mono text-rose-600 font-bold">{row.hj}</td>
                  <td className="py-2 px-3 font-mono text-amber-600 font-bold">{row.zeta}</td>
                  <td className="py-2 px-3 font-mono text-slate-400">{row.theoreticalZeta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
