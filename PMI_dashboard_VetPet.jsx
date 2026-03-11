import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, ComposedChart } from "recharts";

const COLORS = {
  teal: "#0097A7",
  tealLight: "#4DD0E1",
  tealDark: "#006064",
  coral: "#FF6B6B",
  gold: "#FFB347",
  navy: "#1A2332",
  slate: "#2D3748",
  bg: "#0F1419",
  card: "#1A2332",
  cardHover: "#1E2A3A",
  border: "#2D3748",
  text: "#E2E8F0",
  textMuted: "#94A3B8",
  green: "#4ADE80",
  red: "#F87171",
  purple: "#A78BFA",
};

const fmt = (v) => `€${(v / 1000000).toFixed(1)}M`;
const fmtK = (v) => `€${(v / 1000).toFixed(0)}K`;
const pct = (v) => `${(v * 100).toFixed(1)}%`;

// ─── DATA ───────────────────────────────────────────────────────────────────

const businessPlanNoSyn = {
  revenues: [
    { year: 2024, standardTreatments: 44.2, premiumTreatments: 1.8, subscription: 0 },
    { year: 2025, standardTreatments: 45.2, premiumTreatments: 1.8, subscription: 0 },
    { year: 2026, standardTreatments: 46.2, premiumTreatments: 2.0, subscription: 0 },
    { year: 2027, standardTreatments: 47.4, premiumTreatments: 2.0, subscription: 0 },
  ],
  costs: [
    { year: 2024, total: 41.9 },
    { year: 2025, total: 42.7 },
    { year: 2026, total: 43.4 },
    { year: 2027, total: 44.2 },
  ],
};

const businessPlanWithSyn = {
  revenues: [
    { year: 2024, standardTreatments: 44.2, premiumTreatments: 1.8, subscription: 0 },
    { year: 2025, standardTreatments: 46.5, premiumTreatments: 1.9, subscription: 0 },
    { year: 2026, standardTreatments: 49.4, premiumTreatments: 2.0, subscription: 0.9 },
    { year: 2027, standardTreatments: 52.3, premiumTreatments: 2.5, subscription: 3.6 },
  ],
};

const ebitdaData = [
  { year: "2024", noSyn: 4.0, withSyn: 4.0, noSynMargin: 8.7, withSynMargin: 8.7 },
  { year: "2025", noSyn: 4.4, withSyn: 6.7, noSynMargin: 9.3, withSynMargin: 13.8 },
  { year: "2026", noSyn: 4.8, withSyn: 11.1, noSynMargin: 9.9, withSynMargin: 21.3 },
  { year: "2027", noSyn: 5.2, withSyn: 17.5, noSynMargin: 10.5, withSynMargin: 30.0 },
];

const synergiesBreakdown = [
  { name: "Brand & Cross-selling", value: 9.9, type: "revenue" },
  { name: "Subscription fees", value: 4.5, type: "revenue" },
  { name: "Layoffs (Staff)", value: 0.65, type: "cost" },
  { name: "Reduction of TPP", value: 11.5, type: "cost" },
  { name: "Booking Service", value: 0.65, type: "cost" },
  { name: "Materials expense", value: 4.1, type: "cost" },
];

const dissynergies = [
  { name: "Salary increase", value: -4.6, type: "dissyn" },
  { name: "IT services", value: -1.6, type: "dissyn" },
  { name: "Training", value: -1.7, type: "dissyn" },
  { name: "Change Mgmt", value: -0.12, type: "dissyn" },
];

const costEvolution = [
  { year: "2024", services: 7.6, materials: 7.9 },
  { year: "2025", services: 7.2, materials: 7.4 },
  { year: "2026", services: 5.1, materials: 6.9 },
  { year: "2027", services: 6.4, materials: 6.4 },
];

const revenueBreakdownWithSyn = [
  { year: "2024", routine: 13.3, basicSurg: 5.7, specCheck: 4.2, specSurg: 21.0, premium: 1.8, subscription: 0 },
  { year: "2025", routine: 14.0, basicSurg: 6.0, specCheck: 4.4, specSurg: 22.1, premium: 1.9, subscription: 0 },
  { year: "2026", routine: 14.8, basicSurg: 6.4, specCheck: 4.6, specSurg: 23.4, premium: 2.0, subscription: 0.9 },
  { year: "2027", routine: 15.8, basicSurg: 6.8, specCheck: 4.9, specSurg: 24.9, premium: 2.5, subscription: 3.6 },
];

const costBreakdownWithSyn = [
  { year: "2024", labour: 13.3, tpp: 10.4, materials: 7.9, it: 2.3, other: 8.0 },
  { year: "2025", labour: 14.4, tpp: 8.7, materials: 7.4, it: 3.0, other: 8.2 },
  { year: "2026", labour: 15.6, tpp: 7.1, materials: 6.9, it: 4.0, other: 7.6 },
  { year: "2027", labour: 17.2, tpp: 5.1, materials: 6.4, it: 4.6, other: 7.7 },
];

const pnlComparison = [
  { item: "Standard Treatments", noSyn2024: 44.2, noSyn2027: 47.4, withSyn2024: 44.2, withSyn2027: 52.3 },
  { item: "Premium Treatments", noSyn2024: 1.8, noSyn2027: 2.0, withSyn2024: 1.8, withSyn2027: 2.5 },
  { item: "New Subscription", noSyn2024: 0, noSyn2027: 0, withSyn2024: 0, withSyn2027: 3.6 },
];

const kpis = [
  { name: "Labour Cost %", noSyn: 29.1, withSyn: 29.4 },
  { name: "Material Cost %", noSyn: 17.1, withSyn: 10.9 },
  { name: "TPP Cost %", noSyn: 22.3, withSyn: 8.7 },
  { name: "Staff Cost %", noSyn: 4.4, withSyn: 2.5 },
];

const employeeData = [
  { year: "2024", staff: 40, surgeons: 20, baseVets: 155, specVets: 20, spa: 7 },
  { year: "2025", staff: 36, surgeons: 20, baseVets: 155, specVets: 30, spa: 7 },
  { year: "2026", staff: 24, surgeons: 20, baseVets: 150, specVets: 40, spa: 7 },
  { year: "2027", staff: 24, surgeons: 20, baseVets: 140, specVets: 52, spa: 7 },
];

const netSynergiesYearly = [
  { year: "2024", revenues: 0, costs: 0, total: 0 },
  { year: "2025", revenues: 1.39, costs: -0.93, total: 0.45 },
  { year: "2026", revenues: 4.07, costs: -2.27, total: 1.80 },
  { year: "2027", revenues: 9.03, costs: -3.31, total: 5.72 },
];

const initiatives = [
  { id: 1, name: "Tiered Brand Strategy", impact: "High", effort: "High", quadrant: "Combine Carefully", desc: "Maintain 'VetWell by PetCare' for premium clients with dual-brand model" },
  { id: 2, name: "Procurement Optimization", impact: "High", effort: "Low", quadrant: "Combine Quickly", desc: "Centralize procurement, bulk purchasing, consolidate suppliers" },
  { id: 3, name: "Unification of IT Systems", impact: "High", effort: "Medium", quadrant: "Combine Carefully", desc: "Replace PetCare IT with VetWell's AI-driven CRM platform" },
  { id: 4, name: "Staff Functions Centralization", impact: "Medium", effort: "Medium", quadrant: "Combine Slowly", desc: "Shared Services Center for payroll, procurement, reporting" },
  { id: 5, name: "Workforce Upskilling", impact: "High", effort: "High", quadrant: "Combine Carefully", desc: "Cross-training programs, Center of Excellence, specialist rotations" },
];

const orgStructure = [
  { role: "CEO", level: 0, count: 1 },
  { role: "COO", level: 1, count: 1 },
  { role: "CMO", level: 1, count: 1 },
  { role: "CFO", level: 1, count: 1 },
  { role: "HR / Marketing / IT / Procurement", level: 2, parent: "COO", count: "4 depts" },
  { role: "Health Manager", level: 2, parent: "CMO", count: 1 },
  { role: "Wellness Manager", level: 2, parent: "CMO", count: 1 },
  { role: "10 PetCare Clinics", level: 3, count: "10" },
  { role: "4 VetWell Clinics", level: 3, count: "4" },
];

const sensitivityScenarios = {
  baseline: { label: "Baseline", customerGrowth: [3, 3.5, 4], treatmentIncrease: [5, 7.5, 10], subscriptionExp: [0, 180, 360] },
  pessimistic: { label: "Pessimistic", customerGrowth: [1, 1.5, 2], treatmentIncrease: [1, 3, 5], subscriptionExp: [0, 120, 200] },
  optimistic: { label: "Optimistic", customerGrowth: [4, 4.5, 5], treatmentIncrease: [7, 9, 12], subscriptionExp: [0, 220, 450] },
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const tabs = [
  { id: "overview", label: "Overview", icon: "◉" },
  { id: "strategy", label: "Strategy", icon: "◈" },
  { id: "synergies", label: "Synergies", icon: "⬡" },
  { id: "financials", label: "P&L", icon: "◆" },
  { id: "operations", label: "Operations", icon: "⚙" },
  { id: "sensitivity", label: "Sensitivity", icon: "◎" },
];

function MetricCard({ label, value, sub, accent = COLORS.teal, small }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 12, padding: small ? "14px 16px" : "20px 24px",
      border: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden",
      transition: "transform 0.2s, border-color 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: accent }} />
      <div style={{ fontSize: small ? 11 : 12, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
      <div style={{ fontSize: small ? 22 : 28, fontWeight: 700, color: COLORS.text, fontFamily: "'Outfit', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>{children}</h2>
      {sub && <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children, span = 1 }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 12, padding: "20px 24px",
      border: `1px solid ${COLORS.border}`, gridColumn: span > 1 ? `span ${span}` : undefined,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>
      {children}
    </div>
  );
}

function InitiativeCard({ init }) {
  const color = init.quadrant === "Combine Quickly" ? COLORS.green : init.quadrant === "Combine Carefully" ? COLORS.gold : COLORS.purple;
  return (
    <div style={{
      background: COLORS.card, borderRadius: 12, padding: "16px 20px",
      border: `1px solid ${COLORS.border}`, display: "flex", gap: 16, alignItems: "flex-start",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: `${color}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 700, color, flexShrink: 0, fontFamily: "'Outfit', sans-serif",
      }}>{init.id}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>{init.name}</div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{init.desc}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: `${color}20`, color, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{init.quadrant}</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: `${COLORS.teal}20`, color: COLORS.teal, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Impact: {init.impact}</span>
        </div>
      </div>
    </div>
  );
}

// ─── TAB PANELS ─────────────────────────────────────────────────────────────

function OverviewPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Hero Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="Total Synergies Value" value="€21M" sub="Cumulative 2024-2027" accent={COLORS.green} />
        <MetricCard label="2027 EBITDA (w/ Synergies)" value="€17.5M" sub="30% EBITDA Margin" accent={COLORS.teal} />
        <MetricCard label="Revenue Synergies" value="€14.5M" sub="Brand + Cross-selling + Subscriptions" accent={COLORS.gold} />
        <MetricCard label="Cost Synergies" value="€18.0M" sub="Net of €5.2M dissynergies" accent={COLORS.purple} />
      </div>

      {/* EBITDA Comparison */}
      <ChartCard title="EBITDA Evolution: No Synergies vs. With Synergies (€M)" span={2}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={ebitdaData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis yAxisId="left" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke={COLORS.textMuted} fontSize={12} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="noSyn" name="EBITDA No Synergies" fill={COLORS.textMuted} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar yAxisId="left" dataKey="withSyn" name="EBITDA With Synergies" fill={COLORS.teal} radius={[4, 4, 0, 0]} barSize={32} />
            <Line yAxisId="right" type="monotone" dataKey="noSynMargin" name="Margin No Syn %" stroke={COLORS.textMuted} strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
            <Line yAxisId="right" type="monotone" dataKey="withSynMargin" name="Margin With Syn %" stroke={COLORS.green} strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Business Model Canvas Summary */}
      <SectionTitle sub="Comprehensive veterinary care platform combining PetCare's scale with VetWell's premium services">Post-Merger Business Model</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { title: "Value Proposition", items: "Reliable routine & specialist care • 24/7 emergency hospital • Premium spa & home visits • AI-powered telemedicine", color: COLORS.teal },
          { title: "Customer Segments", items: "Mainstream clients (affordable quality) • Premium segment (personalized) • Digitally engaged pet parents • Local communities across Lombardy", color: COLORS.gold },
          { title: "Revenue Streams", items: "Standard treatments • Specialist surgeries • Telemedicine • Spa & premium services • Product sales • New subscriptions", color: COLORS.green },
          { title: "Key Activities", items: "Medical services delivery • Specialist coordination • Telemedicine operations • Premium services (spa, nutrition, home visits)", color: COLORS.purple },
          { title: "Key Resources", items: "14 clinics network • 24/7 veterinary staff • VetWell's digital tools • Dual-brand equity", color: COLORS.coral },
          { title: "Channels", items: "Physical clinics • Call center • VetWell's AI telemedicine • Web presence", color: COLORS.tealLight },
        ].map((item, i) => (
          <div key={i} style={{
            background: COLORS.card, borderRadius: 10, padding: "16px 18px",
            border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${item.color}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{item.title}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{item.items}</div>
          </div>
        ))}
      </div>

      {/* New Revenue Streams */}
      <SectionTitle sub="Three new revenue streams identified for the integrated entity">Potential Revenue Streams</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { num: "01", title: "Premium Digital Concierge", desc: "Monthly subscription fees with priority services & product upsells", model: "Recurring Subscription", color: COLORS.teal },
          { num: "02", title: "Smart Collar Integration", desc: "Vital signs monitoring with proactive alerts & predictive health analysis", model: "Device + Subscription", color: COLORS.gold },
          { num: "03", title: "Post-Surgery Care Programs", desc: "Tailored solutions via in-clinic, home visit, or remote guidance", model: "Fee-per-Session", color: COLORS.coral },
        ].map((item, i) => (
          <div key={i} style={{
            background: `linear-gradient(135deg, ${COLORS.card} 0%, ${item.color}08 100%)`,
            borderRadius: 12, padding: "24px 20px",
            border: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: `${item.color}40`, fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>{item.num}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{item.title}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</div>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: `${item.color}20`, color: item.color, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{item.model}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrategyPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle sub="End-to-end integration plan across Brand, Operations, and Organizational Structure">Integration Initiatives</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {initiatives.map(init => <InitiativeCard key={init.id} init={init} />)}
      </div>

      {/* Impact-Effort Matrix */}
      <ChartCard title="Impact-Effort Matrix">
        <div style={{ position: "relative", height: 320, background: `${COLORS.bg}80`, borderRadius: 8, overflow: "hidden" }}>
          {/* Grid lines */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `${COLORS.border}60` }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: `${COLORS.border}60` }} />
          {/* Labels */}
          <div style={{ position: "absolute", top: 8, left: 8, fontSize: 10, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>DON'T COMBINE</div>
          <div style={{ position: "absolute", top: 8, right: 8, fontSize: 10, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>COMBINE CAREFULLY</div>
          <div style={{ position: "absolute", bottom: 8, left: 8, fontSize: 10, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>COMBINE SLOWLY</div>
          <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 10, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>COMBINE QUICKLY</div>
          <div style={{ position: "absolute", left: 4, top: "50%", transform: "rotate(-90deg) translateX(50%)", fontSize: 10, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>EFFORT ▲</div>
          <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>IMPACT ▶</div>
          {/* Circles */}
          {[
            { id: 1, x: "78%", y: "25%", size: 44, color: COLORS.gold },
            { id: 2, x: "82%", y: "68%", size: 36, color: COLORS.green },
            { id: 3, x: "72%", y: "48%", size: 40, color: COLORS.gold },
            { id: 4, x: "58%", y: "50%", size: 38, color: COLORS.purple },
            { id: 5, x: "85%", y: "18%", size: 42, color: COLORS.gold },
          ].map(c => (
            <div key={c.id} style={{
              position: "absolute", left: c.x, top: c.y, width: c.size, height: c.size,
              borderRadius: "50%", background: `${c.color}30`, border: `2px solid ${c.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: c.color, transform: "translate(-50%, -50%)",
              fontFamily: "'Outfit', sans-serif",
            }}>{c.id}</div>
          ))}
        </div>
      </ChartCard>

      {/* Org Structure */}
      <SectionTitle sub="Integrated and scalable model combining clinical excellence with centralized operations">New Organizational Structure</SectionTitle>
      <div style={{ background: COLORS.card, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
        {/* CEO */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ padding: "10px 24px", background: `${COLORS.teal}20`, border: `2px solid ${COLORS.teal}`, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>CEO</div>
          </div>
        </div>
        {/* C-Suite */}
        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 24 }}>
          {[
            { title: "COO", sub: "HR, Marketing, IT, Procurement", color: COLORS.gold },
            { title: "CMO", sub: "Health Manager + Wellness Manager", color: COLORS.green },
            { title: "CFO", sub: "Financial Governance", color: COLORS.purple },
          ].map((c, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ padding: "8px 20px", background: `${c.color}15`, border: `1.5px solid ${c.color}`, borderRadius: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: "'DM Sans', sans-serif" }}>{c.title}</div>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{c.sub}</div>
            </div>
          ))}
        </div>
        {/* Clinics */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ padding: "8px 16px", background: `${COLORS.teal}10`, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: 12, color: COLORS.teal, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>10 PetCare Clinics</span>
          </div>
          <div style={{ padding: "8px 16px", background: `${COLORS.gold}10`, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: 12, color: COLORS.gold, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>4 VetWell Clinics</span>
          </div>
          <div style={{ padding: "8px 16px", background: `${COLORS.coral}10`, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: 12, color: COLORS.coral, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>80 Base Vets • 30 Specialist Vets • 20 Surgeons • 7 Spa Ops</span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
          Integration Office (12-18 months) under CEO supervision for smooth transition
        </div>
      </div>

      {/* Governance */}
      <SectionTitle sub="Strategic control, operational speed, and full accountability">Governance Structure</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {[
          { role: "Integration Steering Committee", members: "CEOs of PetCare & VetWell, CFO, Medical Officers", freq: "Monthly reviews" },
          { role: "Integration Coordinator", members: "CEO of PetCare", freq: "Ongoing execution" },
          { role: "PMO", members: "M&A Consultant Lead", freq: "Structured reporting" },
          { role: "Change Management Committee", members: "Head of Comms, HR, IT leads + Consultants", freq: "Feedback-driven" },
        ].map((g, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: 10, padding: "14px 18px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.teal, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{g.role}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{g.members}</div>
            <div style={{ fontSize: 10, color: COLORS.gold, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{g.freq}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SynergiesPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="Revenue Synergies" value="€14.5M" sub="Brand + Cross-selling + Subs" accent={COLORS.green} />
        <MetricCard label="Cost Reduction" value="€18.0M" sub="TPP + Materials + Booking + Staff" accent={COLORS.teal} />
        <MetricCard label="Dissynergies / Costs" value="€5.2M" sub="Salary + IT + Training + Change Mgmt" accent={COLORS.coral} />
        <MetricCard label="Net Total Synergies" value="€21.0M" sub="Cumulative 2024-2027" accent={COLORS.gold} />
      </div>

      {/* Synergies Waterfall */}
      <ChartCard title="Synergies Quantification Waterfall (€M, Cumulative)">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={[
            { name: "Brand &\nCross-sell", value: 9.9, fill: COLORS.green },
            { name: "Subscriptions", value: 4.5, fill: COLORS.tealLight },
            { name: "Revenue\nSynergies", value: 14.5, fill: COLORS.teal },
            { name: "Layoffs", value: 0.65, fill: COLORS.green },
            { name: "TPP\nReduction", value: 11.5, fill: COLORS.green },
            { name: "Booking\nService", value: 0.65, fill: COLORS.green },
            { name: "Materials", value: 4.1, fill: COLORS.green },
            { name: "Cost\nSynergies", value: 17.95, fill: COLORS.teal },
            { name: "Salary\nIncrease", value: -4.6, fill: COLORS.coral },
            { name: "IT\nServices", value: -1.6, fill: COLORS.coral },
            { name: "Training", value: -1.7, fill: COLORS.coral },
            { name: "Change\nMgmt", value: -0.12, fill: COLORS.coral },
            { name: "Total Net\nSynergies", value: 21.0, fill: COLORS.gold },
          ]} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="name" stroke={COLORS.textMuted} fontSize={10} interval={0} angle={-25} textAnchor="end" height={60} />
            <YAxis stroke={COLORS.textMuted} fontSize={12} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`€${v.toFixed(1)}M`]} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {[COLORS.green, COLORS.tealLight, COLORS.teal, COLORS.green, COLORS.green, COLORS.green, COLORS.green, COLORS.teal, COLORS.coral, COLORS.coral, COLORS.coral, COLORS.coral, COLORS.gold].map((c, i) => (
                <Cell key={i} fill={c} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Net Synergies yearly */}
      <ChartCard title="Net Synergies Yearly Evolution (€M)">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={netSynergiesYearly}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis stroke={COLORS.textMuted} fontSize={12} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`€${v.toFixed(2)}M`]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="revenues" name="Revenue Synergies" fill={COLORS.green} radius={[4, 4, 0, 0]} barSize={28} />
            <Bar dataKey="costs" name="Cost Dissynergies" fill={COLORS.coral} radius={[4, 4, 0, 0]} barSize={28} />
            <Line type="monotone" dataKey="total" name="Net Synergies" stroke={COLORS.gold} strokeWidth={3} dot={{ r: 5, fill: COLORS.gold }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Synergies / Dissynergies Table */}
      <SectionTitle sub="High-level synergies and potential dissynergies from the integration">Synergies & Dissynergies Detail</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>High-Level Synergies</div>
          {[
            { title: "Digital Transformation & CRM", desc: "VetWell's AI CRM across PetCare: automate scheduling, cut admin workload" },
            { title: "Service Expansion & Revenue Growth", desc: "Cross-selling premium services, bundled offerings, new subscription models" },
            { title: "Operational Efficiency", desc: "Centralized procurement, reduced TPP costs via bulk purchasing" },
            { title: "Talent Development", desc: "Standardized training, AI diagnostics across all clinics" },
            { title: "Premium Brand Differentiation", desc: "Dual-brand strategy: VetWell by PetCare for premium + PetCare for mainstream" },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${COLORS.green}40` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.coral, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>Potential Dissynergies</div>
          {[
            { title: "High Upfront IT Costs", desc: "PetCare's basic IT not compatible — major investment in migration & training" },
            { title: "Rebranding Expenses", desc: "Targeted marketing for brand continuity — assumed neutral via efficiency gains" },
            { title: "Increased Labour Costs", desc: "Hiring specialized vets + salary harmonization drives up payroll" },
            { title: "Cultural Integration Challenges", desc: "Different cultures & service models — needs change management investment" },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `2px solid ${COLORS.coral}40` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinancialsPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* P&L Comparison Table */}
      <SectionTitle sub="Numbers in € Millions — comparing baseline (no synergies) vs. with synergies scenario">P&L Comparison: No Synergies vs. With Synergies</SectionTitle>
      <div style={{ background: COLORS.card, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.textMuted }}></th>
              <th colSpan={2} style={{ textAlign: "center", padding: "8px 12px", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.textMuted }}>NO SYNERGIES</th>
              <th colSpan={2} style={{ textAlign: "center", padding: "8px 12px", borderBottom: `2px solid ${COLORS.teal}`, color: COLORS.teal }}>WITH SYNERGIES</th>
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 12px", color: COLORS.textMuted }}>€ Millions</th>
              {["2024", "2027", "2024", "2027"].map((y, i) => (
                <th key={i} style={{ textAlign: "right", padding: "6px 12px", color: COLORS.textMuted }}>{y}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} style={{ padding: "8px 12px", color: COLORS.teal, fontWeight: 700, borderBottom: `1px solid ${COLORS.border}` }}>Revenues</td></tr>
            {[
              ["Standard Treatments", 44.2, 47.4, 44.2, 52.3],
              ["Premium Treatments", 1.8, 2.0, 1.8, 2.5],
              ["New Subscription", "—", "—", "—", 3.6],
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 12px", color: COLORS.text }}>{row[0]}</td>
                {row.slice(1).map((v, j) => (
                  <td key={j} style={{ textAlign: "right", padding: "6px 12px", color: j >= 2 ? COLORS.teal : COLORS.textMuted }}>{typeof v === "number" ? v.toFixed(1) : v}</td>
                ))}
              </tr>
            ))}
            <tr style={{ fontWeight: 700 }}>
              <td style={{ padding: "6px 12px", color: COLORS.text, borderTop: `1px solid ${COLORS.border}` }}>TOT.</td>
              {[45.9, 49.4, 45.9, 58.4].map((v, i) => (
                <td key={i} style={{ textAlign: "right", padding: "6px 12px", color: i >= 2 ? COLORS.teal : COLORS.textMuted, borderTop: `1px solid ${COLORS.border}` }}>{v.toFixed(1)}</td>
              ))}
            </tr>
            <tr><td colSpan={5} style={{ padding: "8px 12px", color: COLORS.coral, fontWeight: 700, borderBottom: `1px solid ${COLORS.border}`, borderTop: `1px solid ${COLORS.border}` }}>Costs</td></tr>
            {[
              ["Labour", 13.3, 14.4, 13.3, 17.2],
              ["Training", 0.3, 0.3, 0.3, 0.4],
              ["G&A (Staff)", 2.2, 2.2, 2.2, 1.4],
              ["Third Party Professionals", 10.4, 11.0, 10.4, 5.1],
              ["Other services", 4.5, 4.5, 4.5, 4.1],
              ["Materials", 7.9, 8.5, 7.9, 6.4],
              ["Marketing & Comm.", 1.1, 1.1, 1.1, 1.1],
              ["IT service", 2.3, 2.3, 2.3, 4.6],
              ["Change Management", "—", "—", "—", 0.6],
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 12px", color: COLORS.text }}>{row[0]}</td>
                {row.slice(1).map((v, j) => (
                  <td key={j} style={{ textAlign: "right", padding: "6px 12px", color: j >= 2 ? COLORS.teal : COLORS.textMuted }}>{typeof v === "number" ? v.toFixed(1) : v}</td>
                ))}
              </tr>
            ))}
            <tr style={{ fontWeight: 700 }}>
              <td style={{ padding: "6px 12px", color: COLORS.text, borderTop: `1px solid ${COLORS.border}` }}>TOT.</td>
              {[41.9, 44.2, 41.9, 40.9].map((v, i) => (
                <td key={i} style={{ textAlign: "right", padding: "6px 12px", color: i >= 2 ? COLORS.teal : COLORS.textMuted, borderTop: `1px solid ${COLORS.border}` }}>{v.toFixed(1)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Revenue breakdown chart */}
      <ChartCard title="Revenue Breakdown With Synergies (€M)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueBreakdownWithSyn}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis stroke={COLORS.textMuted} fontSize={12} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`€${v.toFixed(1)}M`]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="routine" name="Routine" stackId="a" fill={COLORS.teal} />
            <Bar dataKey="basicSurg" name="Basic Surgery" stackId="a" fill={COLORS.tealLight} />
            <Bar dataKey="specCheck" name="Specialist Check" stackId="a" fill={COLORS.gold} />
            <Bar dataKey="specSurg" name="Specialist Surgery" stackId="a" fill={COLORS.purple} />
            <Bar dataKey="premium" name="Premium Services" stackId="a" fill={COLORS.coral} />
            <Bar dataKey="subscription" name="Subscriptions" stackId="a" fill={COLORS.green} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Cost breakdown chart */}
      <ChartCard title="Cost Breakdown With Synergies (€M)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costBreakdownWithSyn}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis stroke={COLORS.textMuted} fontSize={12} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`€${v.toFixed(1)}M`]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="labour" name="Labour" stackId="a" fill={COLORS.coral} />
            <Bar dataKey="tpp" name="Third Party Prof." stackId="a" fill={COLORS.gold} />
            <Bar dataKey="materials" name="Materials" stackId="a" fill={COLORS.purple} />
            <Bar dataKey="it" name="IT" stackId="a" fill={COLORS.teal} />
            <Bar dataKey="other" name="Other" stackId="a" fill={COLORS.textMuted} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* KPIs comparison */}
      <SectionTitle sub="Key performance indicators comparing 2027 projections">KPI Comparison (2027)</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: 10, padding: "16px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{k.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>No Syn</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textMuted, fontFamily: "'Outfit', sans-serif" }}>{k.noSyn}%</div>
              </div>
              <div style={{ fontSize: 16, color: k.withSyn < k.noSyn ? COLORS.green : COLORS.coral }}>→</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>With Syn</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.teal, fontFamily: "'Outfit', sans-serif" }}>{k.withSyn}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationsPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle sub="Leveraging VetWell's innovative know-how with PetCare's scale of operations">Post-Merger Operating Model</SectionTitle>

      {/* Operating Model Key Areas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { title: "Premium Service Delivery", icon: "★", items: ["Tiered offerings for all client segments", "Wellness + remote monitoring bundles", "24/7 AI-powered emergency support", "Convenient home consultations"], color: COLORS.gold },
          { title: "Operational Efficiency", icon: "⚡", items: ["52% reduction in Service Costs (€5.6M)", "€1.5M decrease in Materials costs", "Standardized training & insourced booking", "Centralized procurement"], color: COLORS.green },
          { title: "Future-Oriented Growth", icon: "🚀", items: ["Hub-and-Spoke clinic model", "Data-driven resource optimization", "Cloud-based scalable systems", "Seamless clinic onboarding"], color: COLORS.teal },
        ].map((area, i) => (
          <div key={i} style={{
            background: COLORS.card, borderRadius: 12, padding: "20px",
            border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${area.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>{area.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: area.color, fontFamily: "'DM Sans', sans-serif" }}>{area.title}</span>
            </div>
            {area.items.map((item, j) => (
              <div key={j} style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 0", paddingLeft: 12, borderLeft: `2px solid ${area.color}30`, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{item}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Employee Evolution */}
      <ChartCard title="Workforce Evolution (Headcount)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={employeeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis stroke={COLORS.textMuted} fontSize={12} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="staff" name="Staff" stackId="a" fill={COLORS.textMuted} />
            <Bar dataKey="surgeons" name="Surgeons" stackId="a" fill={COLORS.coral} />
            <Bar dataKey="baseVets" name="Base Vets" stackId="a" fill={COLORS.teal} />
            <Bar dataKey="specVets" name="Specialist Vets" stackId="a" fill={COLORS.gold} />
            <Bar dataKey="spa" name="Spa Operators" stackId="a" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Service & Materials Cost Evolution */}
      <ChartCard title="Service & Materials Cost Reduction (€M)">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={costEvolution}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis stroke={COLORS.textMuted} fontSize={12} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`€${v.toFixed(1)}M`]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="services" name="Services" fill={COLORS.teal} radius={[4, 4, 0, 0]} barSize={32} />
            <Bar dataKey="materials" name="Materials" fill={COLORS.coral} radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Change Management & Training */}
      <SectionTitle sub="Clear communication and structured training to ensure smooth integration">Change Management & Training</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.teal, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Communication Techniques</div>
          {[
            { tech: "Customer Kit", target: "VetWell clients", freq: "Launch / Refresh" },
            { tech: "Leadership Update", target: "All employees", freq: "Monthly" },
            { tech: "Clinic Feedback Loop", target: "Clinic staff", freq: "Weekly" },
            { tech: "Open Q&A Sessions", target: "All employees", freq: "As needed" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}20`, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{t.tech}</span>
              <span style={{ color: COLORS.textMuted }}>{t.target} • {t.freq}</span>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gold, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Training Programs</div>
          {[
            { prog: "IT & Digital Training", target: "Clinical & admin staff", method: "Micro-learning, scenario-based" },
            { prog: "Service Excellence", target: "Vets, nurses, front-desk", method: "Cross-training, AI diagnostics workshops" },
            { prog: "Cultural Integration", target: "All employees", method: "Gamified onboarding, local Change Agents" },
          ].map((p, i) => (
            <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: `2px solid ${COLORS.gold}40` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>{p.prog}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{p.target} — {p.method}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SensitivityPanel() {
  const [scenario, setScenario] = useState("baseline");
  const sc = sensitivityScenarios[scenario];

  // Compute approximate EBITDA based on scenario adjustments
  const baseEbitda = [4.0, 6.7, 11.1, 17.5];
  const multipliers = { baseline: [1, 1, 1, 1], pessimistic: [1, 0.78, 0.72, 0.65], optimistic: [1, 1.12, 1.18, 1.25] };
  const scenarioEbitda = baseEbitda.map((v, i) => +(v * multipliers[scenario][i]).toFixed(1));
  const scenarioMargin = scenarioEbitda.map((v, i) => +((v / [45.9, 48.5, 52.3, 58.4][i]) * 100).toFixed(1));

  const chartData = [
    { year: "2024", ebitda: scenarioEbitda[0], margin: scenarioMargin[0] },
    { year: "2025", ebitda: scenarioEbitda[1], margin: scenarioMargin[1] },
    { year: "2026", ebitda: scenarioEbitda[2], margin: scenarioMargin[2] },
    { year: "2027", ebitda: scenarioEbitda[3], margin: scenarioMargin[3] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle sub="Toggle scenarios to observe how changes in assumptions impact synergies and financial outcomes">Sensitivity Analysis</SectionTitle>

      {/* Scenario Toggle */}
      <div style={{ display: "flex", gap: 12 }}>
        {Object.entries(sensitivityScenarios).map(([key, val]) => (
          <button key={key} onClick={() => setScenario(key)} style={{
            padding: "10px 24px", borderRadius: 8, border: `1.5px solid ${scenario === key ? COLORS.teal : COLORS.border}`,
            background: scenario === key ? `${COLORS.teal}20` : COLORS.card,
            color: scenario === key ? COLORS.teal : COLORS.textMuted,
            fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Scenario Assumptions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: "16px 20px", border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.teal, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Customer Base Growth (YoY)</div>
          {sc.customerGrowth.map((v, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: COLORS.textMuted }}>{2025 + i}</span>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>+{v}%</span>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: "16px 20px", border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Treatment Demand Increase (%)</div>
          {sc.treatmentIncrease.map((v, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: COLORS.textMuted }}>{2025 + i}</span>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>+{v}%</span>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: "16px 20px", border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.green, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Avg. Yearly Subscription (€)</div>
          {sc.subscriptionExp.map((v, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: COLORS.textMuted }}>{2025 + i}</span>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>€{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* EBITDA by scenario */}
      <ChartCard title={`EBITDA Projection — ${sc.label} Scenario (€M)`}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="year" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis yAxisId="left" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke={COLORS.textMuted} fontSize={12} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="ebitda" name="EBITDA (€M)" fill={scenario === "pessimistic" ? COLORS.coral : scenario === "optimistic" ? COLORS.green : COLORS.teal} radius={[4, 4, 0, 0]} barSize={40} />
            <Line yAxisId="right" type="monotone" dataKey="margin" name="EBITDA Margin %" stroke={COLORS.gold} strokeWidth={2} dot={{ r: 4, fill: COLORS.gold }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* All scenarios comparison */}
      <ChartCard title="EBITDA Comparison Across All Scenarios (2027, €M)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={[
            { scenario: "Pessimistic", ebitda: 11.4, margin: 19.5 },
            { scenario: "Baseline", ebitda: 17.5, margin: 30.0 },
            { scenario: "Optimistic", ebitda: 21.9, margin: 37.5 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="scenario" stroke={COLORS.textMuted} fontSize={12} />
            <YAxis stroke={COLORS.textMuted} fontSize={12} />
            <Tooltip contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }} formatter={(v) => [`€${v}M`]} />
            <Bar dataKey="ebitda" name="2027 EBITDA" radius={[4, 4, 0, 0]} barSize={60}>
              <Cell fill={COLORS.coral} />
              <Cell fill={COLORS.teal} />
              <Cell fill={COLORS.green} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Sensitivity key drivers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.teal, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Key Sensitivity Drivers</div>
          {[
            "Customer base growth rate (brand consolidation effect)",
            "Special treatment demand (cross-selling effectiveness)",
            "Subscription model adoption & pricing",
            "Staff layoffs & hiring timeline",
            "Base Vets vs. Specialist Vets rebalancing",
            "Change management budget allocation",
          ].map((d, i) => (
            <div key={i} style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 0 4px 12px", borderLeft: `2px solid ${COLORS.teal}40`, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{d}</div>
          ))}
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gold, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Cumulative Net Synergies by Scenario</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
            {[
              { label: "Pessimistic", value: "€13.7M", color: COLORS.coral },
              { label: "Baseline", value: "€21.0M", color: COLORS.teal },
              { label: "Optimistic", value: "€26.3M", color: COLORS.green },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "12px", background: `${s.color}10`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────

export default function PMIDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const panels = {
    overview: <OverviewPanel />,
    strategy: <StrategyPanel />,
    synergies: <SynergiesPanel />,
    financials: <FinancialsPanel />,
    operations: <OperationsPanel />,
    sensitivity: <SensitivityPanel />,
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "20px 32px", borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: `linear-gradient(180deg, ${COLORS.card} 0%, ${COLORS.bg} 100%)`,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "white", fontFamily: "'Outfit', sans-serif",
            }}>P</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
                PetCare × VetWell
              </h1>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>Post-Merger Integration Dashboard</div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, textAlign: "right" }}>
          <div>Case Study — PMI Exam</div>
          <div>March 2025</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display: "flex", gap: 2, padding: "0 32px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.card,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "12px 20px", border: "none", cursor: "pointer",
            background: activeTab === tab.id ? `${COLORS.teal}15` : "transparent",
            color: activeTab === tab.id ? COLORS.teal : COLORS.textMuted,
            borderBottom: activeTab === tab.id ? `2px solid ${COLORS.teal}` : "2px solid transparent",
            fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {panels[activeTab]}
      </div>
    </div>
  );
}
