/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1-2静水压强实验数据项
export interface HydrostaticItem {
  condition: string; // 'p0 = pa' | 'p0 > pa' | 'p0 < pa'
  conditionLabel: string; // '密闭容器压强 p0 = pa' | '加压状态 p0 > pa' | '减压状态 p0 < pa'
  trial: number;
  pabs: {
    A: number; // 绝对压强 (cmH2O)
    B: number;
    C: number;
  };
  pr: {
    A: number; // 相对压强 (cmH2O)
    B: number;
    C: number;
  };
  pv: {
    A: number; // 真空度/真空压强 (cmH2O)
    B: number;
    C: number;
  };
  Hp: {
    A: number; // 测压管水头 (cmH2O)
    B: number;
    C: number;
  };
}

export const hydrostaticData: HydrostaticItem[] = [
  {
    condition: "p0 = pa",
    conditionLabel: "密闭容器压强 p0 = pa",
    trial: 1,
    pabs: { A: 1034.2, B: 1043.5, C: 1033.0 },
    pr: { A: 1.2, B: 10.5, C: 0.0 },
    pv: { A: 0.0, B: 0.0, C: 0.0 },
    Hp: { A: 24.8, B: 24.9, C: 24.7 }
  },
  {
    condition: "p0 > pa",
    conditionLabel: "加压正压状态 p0 > pa",
    trial: 1,
    pabs: { A: 1037.4, B: 1046.6, C: 1035.6 },
    pr: { A: 4.4, B: 13.6, C: 2.6 },
    pv: { A: 0.0, B: 0.0, C: 0.0 },
    Hp: { A: 28.0, B: 28.0, C: 28.0 }
  },
  {
    condition: "p0 > pa",
    conditionLabel: "加压正压状态 p0 > pa",
    trial: 2,
    pabs: { A: 1036.4, B: 1045.6, C: 1034.6 },
    pr: { A: 3.4, B: 12.6, C: 1.6 },
    pv: { A: 0.0, B: 0.0, C: 0.0 },
    Hp: { A: 27.0, B: 27.0, C: 27.0 }
  },
  {
    condition: "p0 < pa",
    conditionLabel: "降压真空状态 p0 < pa",
    trial: 1,
    pabs: { A: 1034.0, B: 1043.2, C: 1032.5 },
    pr: { A: 1.0, B: 10.2, C: -0.5 },
    pv: { A: 0.0, B: 0.0, C: 0.5 },
    Hp: { A: 24.6, B: 24.6, C: 24.6 }
  },
  {
    condition: "p0 < pa",
    conditionLabel: "降压真空状态 p0 < pa",
    trial: 2,
    pabs: { A: 1031.3, B: 1040.5, C: 1029.8 },
    pr: { A: -1.7, B: 7.5, C: -3.2 },
    pv: { A: 1.7, B: 0.0, C: 3.2 },
    Hp: { A: 21.9, B: 21.9, C: 21.9 }
  }
];

// 4-文丘里综合型实验数据项
export interface VenturiItem {
  trial: number;
  qv: number;      // 流量 qV (10^-6 m^3/s)
  deltaH: number;  // 压差水头 △h = h1 - h2 + h3 - h4 (10^-2 m)
  Re: number;      // 雷诺数 Re
  qvPrime: number; // 理论流量 qV' = K * sqrt(△h) (10^-6 m^3/s)
  mu: number;      // 流量系数 μ = qV / qV'
}

export const venturiData: VenturiItem[] = [
  { trial: 1, qv: 106.6, deltaH: 39.1, Re: 10687, qvPrime: 111.3, mu: 0.958 },
  { trial: 2, qv: 91.4, deltaH: 29.1, Re: 9163, qvPrime: 96.0, mu: 0.952 },
  { trial: 3, qv: 78.6, deltaH: 21.9, Re: 7880, qvPrime: 83.3, mu: 0.944 },
  { trial: 4, qv: 60.6, deltaH: 13.1, Re: 6075, qvPrime: 64.4, mu: 0.941 },
  { trial: 5, qv: 42.2, deltaH: 6.5, Re: 4231, qvPrime: 45.4, mu: 0.930 },
  { trial: 6, qv: 21.0, deltaH: 1.6, Re: 2105, qvPrime: 22.5, mu: 0.933 }
];

// 5-局部水头损失实验数据项
export interface LocalLossItem {
  type: "sudden_expansion" | "sudden_contraction";
  typeName: string;
  trial: number;
  qv: number;        // 流量 qV (10^-6 m^3/s)
  vHeadPre: number;  // 前测段流速水头 (10^-2 m) (即 av_1^2 / 2g)
  eprecPre: number;  // 前测段测管水头 E_1' (10^-2 m)
  vHeadPost: number; // 后测段流速水头 (10^-2 m) (即 av_2^2 / 2g)
  eprecPost: number; // 后测段测管水头 E_2' (10^-2 m)
  hj: number;        // 局部水头损失 hj (10^-2 m)
  zeta: number;      // 局部阻力系数 ζ
  theoreticalZeta: number; // 理论值或经验值 ζ
}

export const localLossData: LocalLossItem[] = [
  // 突然扩大 (1 -> 2)
  {
    type: "sudden_expansion",
    typeName: "突然扩大管道 (1 → 2)",
    trial: 1,
    qv: 109.4,
    vHeadPre: 9.52,
    eprecPre: 29.32,
    vHeadPost: 0.53,
    eprecPost: 23.63,
    hj: 5.69,
    zeta: 0.60,
    theoreticalZeta: 0.589 // 理论公式:(1 - A1/A2)^2 ≈ (1 - 1.01^2 / 2.08^2)^2 ≈ 0.584
  },
  {
    type: "sudden_expansion",
    typeName: "突然扩大管道 (1 → 2)",
    trial: 2,
    qv: 130.3,
    vHeadPre: 13.51,
    eprecPre: 27.41,
    vHeadPost: 0.75,
    eprecPost: 19.25,
    hj: 8.16,
    zeta: 0.60,
    theoreticalZeta: 0.589
  },
  {
    type: "sudden_expansion",
    typeName: "突然扩大管道 (1 → 2)",
    trial: 3,
    qv: 59.4,
    vHeadPre: 2.81,
    eprecPre: 32.51,
    vHeadPost: 0.16,
    eprecPost: 30.86,
    hj: 1.65,
    zeta: 0.59,
    theoreticalZeta: 0.589
  },
  // 突然缩小 (4 -> 5)
  {
    type: "sudden_contraction",
    typeName: "突然缩小管道 (4 → 5)",
    trial: 1,
    qv: 109.4,
    vHeadPre: 0.53,
    eprecPre: 23.03,
    vHeadPost: 8.48,
    eprecPost: 19.38,
    hj: 3.65,
    zeta: 0.43,
    theoreticalZeta: 0.380 // 经验公式: 0.5 * (1 - A5/A4) ≈ 0.375
  },
  {
    type: "sudden_contraction",
    typeName: "突然缩小管道 (4 → 5)",
    trial: 2,
    qv: 130.3,
    vHeadPre: 0.75,
    eprecPre: 18.65,
    vHeadPost: 12.03,
    eprecPost: 13.83,
    hj: 4.82,
    zeta: 0.40,
    theoreticalZeta: 0.380
  },
  {
    type: "sudden_contraction",
    typeName: "突然缩小管道 (4 → 5)",
    trial: 3,
    qv: 59.4,
    vHeadPre: 0.16,
    eprecPre: 30.66,
    vHeadPost: 2.50,
    eprecPost: 29.30,
    hj: 1.36,
    zeta: 0.54,
    theoreticalZeta: 0.380
  }
];

// 6-动量定律综合型实验数据项
export interface MomentumItem {
  trial: number;
  H0: number;   // 管嘴作用水头 H0 (10^-2 m)
  hc: number;   // 活塞作用水深 hc (10^-2 m)
  qv: number;   // 射流流量 qV (10^-6 m^3/s)
  v: number;    // 流速 v (10^-2 m/s)
  F: number;    // 动量力 F_meas (10^-5 N) = ρ * g * D_piston * hc = 9.8 * D^2 * hc... 
  beta: number; // 动量修正因数 β
}

export const momentumData: MomentumItem[] = [
  { trial: 1, H0: 18.0, hc: 11.5, qv: 125.1, v: 111.54, F: 3538.9, beta: 1.015 },
  { trial: 2, H0: 20.7, hc: 13.7, qv: 146.6, v: 130.70, F: 4216.0, beta: 1.020 },
  { trial: 3, H0: 22.7, hc: 15.0, qv: 157.8, v: 140.69, F: 4615.8, beta: 1.039 }
];

// 7-雷诺实验数据项
// 表 1: 折线图/曲线图 log Jv ~ log V 
export interface ReynoldsLogItem {
  trial: number;
  hLostDiff: number; // 读数差 ▽ 1-2 (cm)
  hf: number;        // 水头损失 hf (cm)
  Jv: number;        // 水力坡度 Jv
  Qv: number;        // 流量 Qv (cm^3/s)
  v: number;         // 流速 v (cm/s)
  Re: number;        // 雷诺数 Re
  logV: number;      // log V
  logJv: number;     // log Jv
}

export const reynoldsLogData: ReynoldsLogItem[] = [
  { trial: 1, hLostDiff: 2.8,   hf: 1.4,   Jv: 0.0233, Qv: 92.0, v: 62.59, Re: 9374, logV: 1.80, logJv: -1.63 },
  { trial: 2, hLostDiff: 2.2,   hf: 1.1,   Jv: 0.0183, Qv: 82.4, v: 56.05, Re: 8396, logV: 1.75, logJv: -1.74 },
  { trial: 3, hLostDiff: 1.4,   hf: 0.7,   Jv: 0.0117, Qv: 70.6, v: 48.03, Re: 7193, logV: 1.68, logJv: -1.93 },
  { trial: 4, hLostDiff: 1.0,   hf: 0.5,   Jv: 0.0083, Qv: 60.5, v: 41.16, Re: 6164, logV: 1.61, logJv: -2.08 },
  { trial: 5, hLostDiff: 0.7,   hf: 0.35,  Jv: 0.0058, Qv: 51.4, v: 34.97, Re: 5237, logV: 1.54, logJv: -2.23 },
  { trial: 6, hLostDiff: 0.45,  hf: 0.225, Jv: 0.0038, Qv: 41.3, v: 28.10, Re: 4208, logV: 1.45, logJv: -2.43 },
  { trial: 7, hLostDiff: 0.208, hf: 0.104, Jv: 0.0017, Qv: 31.3, v: 21.29, Re: 3189, logV: 1.33, logJv: -2.76 },
  { trial: 8, hLostDiff: 0.152, hf: 0.076, Jv: 0.0013, Qv: 26.5, v: 18.03, Re: 2700, logV: 1.26, logJv: -2.90 },
  { trial: 9, hLostDiff: 0.006, hf: 0.003, Jv: 0.0001, Qv: 18.3, v: 12.45, Re: 1865, logV: 1.10, logJv: -4.30 }
];

// 表 2: 颜色水线试验观察
export interface ReynoldsObservationItem {
  trial: number;
  dyeShape: string;  // 颜色水线形状 ('波浪状' | '直线' | '不明显')
  qv: number;        // 流量 qv (10^-6 m^3/s)
  Re: number;        // 雷诺数 Re
  valveOpening: string; // 阀门开度
}

export const reynoldsObsData: ReynoldsObservationItem[] = [
  { trial: 1, dyeShape: "波浪状", qv: 82.0, Re: 8355, valveOpening: "减 (↓)" },
  { trial: 2, dyeShape: "波浪状", qv: 65.0, Re: 6623, valveOpening: "减 (↓)" },
  { trial: 3, dyeShape: "波浪状", qv: 49.0, Re: 4993, valveOpening: "减 (↓)" },
  { trial: 4, dyeShape: "波浪状", qv: 26.4, Re: 2690, valveOpening: "减 (↓)" },
  { trial: 5, dyeShape: "直线",   qv: 24.1, Re: 2456, valveOpening: "减 (↓)" },
  { trial: 6, dyeShape: "直线",   qv: 18.0, Re: 1834, valveOpening: "减 (↓)" },
  { trial: 7, dyeShape: "不明显", qv: 2.0,  Re: 204,  valveOpening: "减 (↓)" }
];
