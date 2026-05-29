/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Gauge,
  Activity,
  Layers,
  Award,
  Sparkles,
  Waves,
  Cpu,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardOverviewProps {
  onNavigate: (tabId: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  // Bento grid card definitions
  const experiments = [
    {
      id: "hydrostatic",
      title: "1-2 静水压强实验",
      equation: "z + p/ρg = C",
      icon: Gauge,
      color: "border-indigo-100 hover:border-indigo-300 text-indigo-600 bg-indigo-50/30",
      desc: "在重力静止流体中，验证高度水头与压强水头相互转换且总和守恒定律。探究容器内正压加压与抽气负压对测高面一致性的影响规律。",
      metric: "等高测高线 HGL ≈ 24.8 cm"
    },
    {
      id: "venturi",
      title: "4 文丘里综合型实验",
      equation: "qv = μ K √Δh",
      icon: Activity,
      color: "border-emerald-100 hover:border-emerald-300 text-emerald-600 bg-emerald-50/30",
      desc: "利用渐细喉道流阻加速产生静高压降的伯努利机械效应测量流量，并标定极其关键的管流阻损失修正参数——流量系数 μ。",
      metric: "管均流量系数 μ ≈ 0.942"
    },
    {
      id: "reynolds",
      title: "7 雷诺实验",
      equation: "Re = v d / ν",
      icon: Sparkles,
      color: "border-purple-100 hover:border-purple-300 text-purple-600 bg-purple-50/30",
      desc: "观察平直有色墨丝在圆管流中受控由平滑单流（层流）向高频蛇形（过渡流）及完全杂乱碎混（湍流）过渡的雷诺数边界临界规律。",
      metric: "下临界雷诺数 Recr ≈ 2000"
    },
    {
      id: "localloss",
      title: "5 局部水头损失实验",
      equation: "hj = ζ * v²/2g",
      icon: Layers,
      color: "border-amber-100 hover:border-amber-300 text-amber-600 bg-amber-50/30",
      desc: "分析管道截面急剧扩大和突然缩减引发附面层急转涡旋导致的局部重力流能重阻损失，测定突变局部能量损失ζ值。",
      metric: "突扩阻阻系数 ζ_exp ≈ 0.60"
    },
    {
      id: "momentum",
      title: "6 动量定律综合型实验",
      equation: "F = β ρ qv v",
      icon: Award,
      color: "border-rose-100 hover:border-rose-300 text-rose-600 bg-rose-50/30",
      desc: "运用自稳活塞筒反馈测力设计，测算极高压力水枪喷流冲击平板底座的理论冲量和摩擦，完美验证牛顿第二物理定律在流体力学中的适用性。",
      metric: "平均动量修正 β ≈ 1.025"
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Hero Welcome banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
        {/* Animated backdrop glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/20 text-xs font-bold text-indigo-300">
            <Cpu className="w-3.5 h-3.5" /> Hydraulics Laboratory Visual Suite
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
            水力学实验数据标定与可视化系统
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
            这是一个基于真实水力学实验室实测读数（测压高度、雷诺转换、突扩管道突缩损失、作用力动能）开发的高级交互式标定面板。点击以下各项目卡，可进入高精度物理图形拟合及虚拟水流流态演示工作台中。
          </p>
        </div>
      </div>

      {/* Bento grid experiments */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          经典学术实验课题核心平台 (Bento Laboratory Hub)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ duration: 0.15 }}
                className={`bg-white p-6 rounded-2xl border ${item.color} flex flex-col justify-between h-[255px] cursor-pointer shadow-sm hover:shadow-md group transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <code className="text-xs font-bold font-mono px-2.5 py-1 bg-slate-900 text-white rounded-lg">
                      {item.equation}
                    </code>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-1">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100/50 flex items-center justify-between mt-4">
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    实测标定：{item.metric}
                  </span>
                  <span className="text-slate-400 group-hover:text-slate-700 transition flex items-center gap-0.5 text-xs font-semibold">
                    工作台 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition duration-200" />
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Reference properties card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-300 flex flex-col justify-between h-[255px] shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <Waves className="w-5 h-5 text-sky-400" />
                </span>
                <span className="text-[10px] bg-sky-500/20 px-2.5 py-1 border border-sky-500/30 text-sky-300 rounded-lg font-bold">Standard Constant</span>
              </div>
              <h4 className="text-white text-base font-bold font-display">水力学流动重力物性常数</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                实验采用常温清水（温度标定为 24℃ ~ 26℃）进行流道设计。计算中使用以下标称动力物物理常量：
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-center border-r border-slate-800/80">
                <span className="text-slate-500 block">密度 ρ</span>
                <span className="text-white font-bold block mt-0.5">1000 kg/m³</span>
              </div>
              <div className="text-center border-r border-slate-800/80">
                <span className="text-slate-500 block">粘度 ν</span>
                <span className="text-white font-bold block mt-0.5">1e-6 m²/s</span>
              </div>
              <div className="text-center">
                <span className="text-slate-500 block">重力 g</span>
                <span className="text-white font-bold block mt-0.5">9.806 m/s²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
