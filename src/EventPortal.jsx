import { useState, useEffect, useRef, useCallback } from "react";
import { supabase, sendEmail, emailTemplates } from "./supabase.js";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FL = document.createElement("link");
FL.rel = "stylesheet";
FL.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap";
document.head.appendChild(FL);

// ── College Background Image (GSSS campus) ────────────────────────────────────
const COLLEGE_BG = "data:image/jpeg;base64,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";


// ── GSSS Logo (real college logo, base64) ─────────────────────────────────────
const GSSS_LOGO = "data:image/png;base64,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";

// ── Icon system ───────────────────────────────────────────────────────────────
const ICONS = {
  shield:["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  home:["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"],
  calendar:["M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  check:["M20 6 9 17l-5-5"],
  x:["M18 6 6 18M6 6l12 12"],
  bell:["M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9","M10.3 21a1.94 1.94 0 0 0 3.4 0"],
  upload:["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  file:["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"],
  chart:["M18 20V10","M12 20V4","M6 20v-6"],
  users:["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"],
  logout:["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"],
  eye:["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  eyeoff:["M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94","M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19","M1 1l22 22"],
  send:["M22 2L11 13","M22 2l-7 20-4-9-9-4 20-7z"],
  clock:["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"],
  plus:["M12 5v14","M5 12h14"],
  image:["M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14z","M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z","M21 15l-5-5L5 21"],
  alert:["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"],
  arrowleft:["M19 12H5","M12 19l-7-7 7-7"],
  arrowright:["M5 12h14","M12 5l7 7-7 7"],
  settings:["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  trash:["M3 6h18","M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6","M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"],
  search:["M21 21l-4.35-4.35","M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"],
  menu:["M3 12h18","M3 6h18","M3 18h18"],
  instagram:["M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M16.5 7.5h.01"],
  facebook:["M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
  youtube:["M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z","M9.75 15.02V8.98l5.75 3.02-5.75 3.02z"],
  linkedin:["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z","M2 9h4v12H2z","M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  edit:["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7","M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  copy:["M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z","M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"],
  globe:["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  user:["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  announce:["M3 11l18-5v12L3 13v-2z","M11.6 16.8a3 3 0 1 1-5.8-1.6"],
  trending:["M23 6l-9.5 9.5-5-5L1 18"],
  zap:["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  star:["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  download:["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  loader:["M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"],
};
const Ic = ({ name, size=18, color="currentColor", sw=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,display:"block"}}>
    {(ICONS[name]||["M12 12h.01"]).map((d,i)=><path key={i} d={d}/>)}
  </svg>
);

// ── GSSS College Brand Colors ─────────────────────────────────────────────────
const BRAND = {
  purple: "#8B35A3",    // GSSS logo purple (kept for logo)
  coral:  "#D4451F",    // GSSS coral (kept for logo)
  // Professional accent palette:
  navy:   "#0F2952",    // deep navy
  navyD:  "#091D3E",    // darker navy
  navyL:  "#1A3A6B",    // lighter navy
  gold:   "#C8922A",    // professional gold
  goldL:  "#E2AE50",    // lighter gold
  goldD:  "#9A6E1A",    // darker gold
  teal:   "#0D7377",    // teal accent
  // Keep aliases for backward compat
  purpleD:"#091D3E",
  purpleL:"#1A3A6B",
  coralD: "#9A6E1A",
  coralL: "#E2AE50",
  orange: "#C8922A",
};

const T = {
  bg:     "#060D1B",     // deep navy-black
  surf:   "#0A1428",     // surface
  card:   "#0E1B35",     // card bg — navy dark
  cardH:  "#132242",     // card hover
  border: "rgba(255,255,255,.07)",
  borderH:"rgba(200,146,42,.20)",  // gold tint on hover
  text:   "#E8EDF5",     // warm white
  sub:    "#7A8FA8",     // muted slate
  dim:    "#3D5068",
  blue:   "#3D85C8",
  green:  "#0F9B6A",
  red:    "#D44040",
  yellow: "#C8922A",
  purple: BRAND.navy,
  pink:   "#7C5EA8",
  accent: BRAND.gold,
};

const DEPTS = ["CSE","ISE","ECE","EEE","CSE (AI&ML)","CSE (AI&DS)","Physics","Chemistry","Mathematics","MBA"];

const ROLES = {
  admin:             {label:"Admin",              tagline:"Approve events & manage portal",  icon:"settings", g1:BRAND.navyD,  g2:BRAND.navyL,   accent:BRAND.gold},
  organiser:         {label:"Event Organiser",    tagline:"Submit & track event proposals",  icon:"calendar", g1:"#062A1A",    g2:"#0A4A30",     accent:T.green},
  social_media_admin:{label:"Social Media Admin", tagline:"Manage media & post to socials",  icon:"send",     g1:"#0D1A3A",    g2:"#1A3060",     accent:"#4A7FD4"},
  staff:             {label:"Staff",              tagline:"Stay informed on all events",     icon:"users",    g1:BRAND.navyD,  g2:BRAND.teal,    accent:BRAND.teal},
  principal:         {label:"Principal",          tagline:"Oversee all event activities",    icon:"shield",   g1:"#0A1428",    g2:BRAND.navyL,   accent:BRAND.gold},
};

const STATUS_META = {
  pending:        {bg:"rgba(245,158,11,.12)",  text:"#D97706", dot:"#F59E0B", label:"Pending Review"},
  approved:       {bg:"rgba(16,185,129,.12)",  text:"#059669", dot:"#10B981", label:"Approved"},
  rejected:       {bg:"rgba(239,68,68,.12)",   text:"#DC2626", dot:"#EF4444", label:"Rejected"},
  awaiting_media: {bg:"rgba(99,102,241,.12)",  text:"#4f46e5", dot:"#6366f1", label:"📸 Awaiting Media"},
  media_uploaded: {bg:`rgba(15,41,82,.25)`,  text:BRAND.navy, dot:BRAND.navy, label:"Media Uploaded"},
  media_posted:   {bg:"rgba(236,72,153,.12)",  text:"#BE185D", dot:"#EC4899", label:"Posted"},
  website_updated:{bg:"rgba(16,185,129,.12)",  text:"#059669", dot:"#10B981", label:"Website Updated"},
  completed:      {bg:"rgba(34,197,94,.12)",   text:"#15803D", dot:"#22C55E", label:"✅ Completed"},
};

const STEPS = ["Submitted","Approved","Event Day","Media Uploaded","Posted","Done"];
const STEP_MAP = {pending:0,approved:1,awaiting_media:2,media_uploaded:3,media_posted:4,website_updated:4,completed:5};

const genId = () => Math.random().toString(36).substr(2,9);
const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const fmtTime = d => new Date(d).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const fmtShort = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"});

// ── Global CSS ────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,sans-serif;background:${T.bg}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(200,146,42,.25);border-radius:99px}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes toastIn{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes glowPulse{0%,100%{opacity:.6}50%{opacity:1}}
.skel{background:linear-gradient(90deg,#0E1B35 25%,#132242 50%,#0E1B35 75%);background-size:200% 100%;animation:shimmer 1.6s infinite;border-radius:8px}
.card{backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.hl{transition:all .18s ease}
.hl:hover{filter:brightness(1.06);transform:translateY(-1px)}
.navbtn{transition:all .14s ease}
.navbtn:hover{background:rgba(255,255,255,.05)!important}
.drag-on{border-color:${BRAND.gold}!important;background:rgba(200,146,42,.05)!important}
select option{background:#0E1B35;color:#E8EDF5}
input,textarea,select{font-family:'Inter',sans-serif!important}
@media(max-width:768px){
  .nomob{display:none!important}
  .mobfull{width:100%!important;margin-left:0!important}
  .mobpad{padding:14px!important}
  .g1mob{grid-template-columns:1fr!important}
  .mobstack{flex-direction:column!important}
}
@media(min-width:769px){.mobonly{display:none!important}}
`;

// ── Local in-memory cache (used when Supabase isn't fully wired yet) ─────────
let _localUsers = [];
let _localEvents = [];
let _localNotifs = [];
let _localAudit = [];

// ── Small UI primitives ───────────────────────────────────────────────────────
const Spinner = ({size=16}) => (
  <span style={{width:size,height:size,border:"2.5px solid rgba(255,255,255,.2)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block",flexShrink:0}}/>
);

const Badge = ({status}) => {
  const c = STATUS_META[status] || {bg:"rgba(255,255,255,.06)",text:T.sub,dot:T.dim,label:status};
  return (
    <span style={{background:c.bg,color:c.text,padding:"3px 10px 3px 8px",borderRadius:999,fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {c.label}
    </span>
  );
};

const Toast = ({list}) => (
  <div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:10,pointerEvents:"none"}}>
    {list.map(t => (
      <div key={t.id} style={{background:t.type==="success"?"#052e16":t.type==="error"?"#450a0a":"#0c1028",border:`1px solid ${t.type==="success"?"#166534":t.type==="error"?"#7f1d1d":"rgba(200,146,42,.35)"}`,borderRadius:14,padding:"13px 18px",minWidth:290,maxWidth:370,display:"flex",alignItems:"center",gap:12,animation:"toastIn .3s ease",boxShadow:"0 8px 32px rgba(0,0,0,.5)"}}>
        <div style={{width:32,height:32,borderRadius:9,background:t.type==="success"?"rgba(16,185,129,.15)":t.type==="error"?"rgba(239,68,68,.15)":`rgba(15,41,82,.25)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Ic name={t.type==="success"?"check":t.type==="error"?"x":"bell"} size={15} color={t.type==="success"?T.green:t.type==="error"?T.red:BRAND.navy}/>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:T.text}}>{t.title}</div>
          {t.msg && <div style={{fontSize:12,color:T.sub,marginTop:2}}>{t.msg}</div>}
        </div>
      </div>
    ))}
  </div>
);

const Modal = ({open,onClose,title,children,width=560}) => {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(5px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="card" style={{background:T.card,borderRadius:20,width:"100%",maxWidth:width,maxHeight:"92vh",overflow:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.65)",border:`1px solid ${T.borderH}`,animation:"fadeUp .22s ease"}}>
        <div style={{padding:"20px 26px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:T.card,borderRadius:"20px 20px 0 0",zIndex:1}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',Georgia,serif"}}>{title}</h3>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.06)",border:`1px solid ${T.border}`,cursor:"pointer",padding:6,color:T.sub,borderRadius:8,display:"flex"}}><Ic name="x" size={16}/></button>
        </div>
        <div style={{padding:"22px 26px"}}>{children}</div>
      </div>
    </div>
  );
};

const Inp = ({label,error,...p}) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{display:"block",fontSize:12,fontWeight:600,color:T.sub,marginBottom:5,letterSpacing:.3}}>{label}</label>}
    <input {...p} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${error?T.red:T.border}`,borderRadius:10,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif",background:"rgba(255,255,255,.04)",color:T.text,...(p.style||{})}}
      onFocus={e=>{e.target.style.borderColor=error?T.red:BRAND.gold;e.target.style.boxShadow=`0 0 0 3px ${error?"rgba(239,68,68,.1)":"rgba(200,146,42,.12)"}`}}
      onBlur={e=>{e.target.style.borderColor=error?T.red:T.border;e.target.style.boxShadow="none"}}/>
    {error && <p style={{margin:"4px 0 0",fontSize:11,color:T.red}}>{error}</p>}
  </div>
);

const Sel = ({label,options,...p}) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{display:"block",fontSize:12,fontWeight:600,color:T.sub,marginBottom:5}}>{label}</label>}
    <select {...p} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border}`,borderRadius:10,fontSize:14,outline:"none",background:"rgba(255,255,255,.04)",color:T.text,fontFamily:"'Inter',sans-serif",boxSizing:"border-box",cursor:"pointer"}}
      onFocus={e=>e.target.style.borderColor=BRAND.gold} onBlur={e=>e.target.style.borderColor=T.border}>
      <option value="">-- Select --</option>
      {options.map(o => <option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
    </select>
  </div>
);

const Txta = ({label,...p}) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{display:"block",fontSize:12,fontWeight:600,color:T.sub,marginBottom:5}}>{label}</label>}
    <textarea {...p} rows={3} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${T.border}`,borderRadius:10,fontSize:14,outline:"none",fontFamily:"'Inter',sans-serif",resize:"vertical",boxSizing:"border-box",background:"rgba(255,255,255,.04)",color:T.text,...(p.style||{})}}
      onFocus={e=>e.target.style.borderColor=BRAND.gold} onBlur={e=>e.target.style.borderColor=T.border}/>
  </div>
);

const Btn = ({children,v="primary",onClick,disabled,sm,full,style:sx={}}) => {
  const V = {
    primary:{background:`linear-gradient(135deg,${BRAND.navyD},${BRAND.navy})`,color:"#fff",border:"none"},
    success:{background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",border:"none"},
    danger: {background:"linear-gradient(135deg,#dc2626,#ef4444)",color:"#fff",border:"none"},
    outline:{background:"rgba(255,255,255,.04)",color:T.text,border:`1px solid ${T.border}`},
    ghost:  {background:"transparent",color:T.sub,border:"none"},
    coral:  {background:`linear-gradient(135deg,${BRAND.goldD},${BRAND.gold})`,color:"#fff",border:"none"},
    purple: {background:`linear-gradient(135deg,${BRAND.navyD},${BRAND.navy})`,color:"#fff",border:"none"},
  };
  return (
    <button onClick={onClick} disabled={disabled} className="hl"
      style={{padding:sm?"7px 13px":"10px 18px",borderRadius:10,fontSize:sm?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:6,opacity:disabled?.5:1,fontFamily:"'Inter',sans-serif",width:full?"100%":"auto",justifyContent:full?"center":"flex-start",...V[v],...sx}}>
      {children}
    </button>
  );
};

const StatCard = ({label,value,icon,accent=BRAND.gold,sub,loading}) => (
  <div className="card hl" style={{background:`linear-gradient(135deg,${T.card},${T.cardH})`,borderRadius:16,padding:"18px 20px",border:`1px solid ${T.border}`,boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>
    <div style={{width:40,height:40,borderRadius:11,background:`${accent}1a`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${accent}22`,marginBottom:14}}>
      <Ic name={icon} size={18} color={accent}/>
    </div>
    {loading ? <div className="skel" style={{height:28,width:60,marginBottom:6}}/> : <div style={{fontSize:26,fontWeight:800,color:T.text,lineHeight:1,fontFamily:"'Playfair Display',Georgia,serif"}}>{value}</div>}
    <div style={{fontSize:13,color:T.sub,marginTop:5}}>{label}</div>
    {sub && <div style={{fontSize:11,color:T.dim,marginTop:2}}>{sub}</div>}
  </div>
);

const PwdInp = ({label,value,onChange,error,placeholder}) => {
  const [show,setShow] = useState(false);
  return (
    <div style={{marginBottom:14}}>
      {label && <label style={{display:"block",fontSize:12,fontWeight:600,color:T.sub,marginBottom:5}}>{label}</label>}
      <div style={{position:"relative"}}>
        <input type={show?"text":"password"} value={value} onChange={onChange} placeholder={placeholder||"Password"}
          style={{width:"100%",padding:"10px 44px 10px 13px",border:`1.5px solid ${error?T.red:T.border}`,borderRadius:10,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif",background:"rgba(255,255,255,.04)",color:T.text}}
          onFocus={e=>e.target.style.borderColor=BRAND.gold} onBlur={e=>e.target.style.borderColor=T.border}/>
        <button type="button" onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.sub,padding:2}}>
          <Ic name={show?"eyeoff":"eye"} size={15}/>
        </button>
      </div>
      {error && <p style={{margin:"4px 0 0",fontSize:11,color:T.red}}>{error}</p>}
    </div>
  );
};

// ── GSSS College Header Banner (appears on ALL pages) ────────────────────────
const CollegeBanner = () => (
  <div style={{background:`linear-gradient(100deg,${BRAND.navyD} 0%,${BRAND.navy} 45%,#0F2D5C 70%,#0A2040 100%)`,padding:"9px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid rgba(200,146,42,.18)`,boxShadow:"0 2px 20px rgba(0,0,0,.55)"}}>
    {/* LEFT: logo + college name */}
    <div style={{display:"flex",alignItems:"center",gap:13}}>
      <div style={{width:48,height:48,borderRadius:10,background:"rgba(255,255,255,.10)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid rgba(200,146,42,.20)",overflow:"hidden",padding:3}}>
        <img src={GSSS_LOGO} alt="GSSS Logo" style={{width:42,height:42,objectFit:"contain"}}/>
      </div>
      <div>
        <div style={{fontSize:13.5,fontWeight:700,color:"#fff",lineHeight:1.25,fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:.1}}>
          GSSS Institute of Engineering and Technology for Women
        </div>
        <div style={{fontSize:9.5,color:"rgba(200,146,42,.80)",letterSpacing:.9,marginTop:2,fontWeight:600,textTransform:"uppercase"}}>
          Geetha Shishu Shikshana Sangha(R) · Mysuru, Karnataka
        </div>
      </div>
    </div>
    {/* RIGHT: accreditation badges */}
    <div className="nomob" style={{display:"flex",gap:8,alignItems:"center"}}>
      {["NBA","NAAC","VTU","AICTE"].map(b=>(
        <span key={b} style={{background:"rgba(200,146,42,.10)",border:"1px solid rgba(200,146,42,.22)",borderRadius:5,padding:"3px 9px",fontSize:9,fontWeight:700,color:"rgba(200,146,42,.85)",letterSpacing:.8}}>{b}</span>
      ))}
    </div>
  </div>
);

// ── Event Timeline ─────────────────────────────────────────────────────────────
const Timeline = ({status}) => {
  const step = STEP_MAP[status] ?? 0;
  return (
    <div style={{padding:"14px 0 6px"}}>
      <div style={{position:"relative",display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:13,right:13,top:"50%",transform:"translateY(-50%)",height:2,background:T.border,zIndex:0}}/>
        <div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",height:2,background:`linear-gradient(90deg,${BRAND.navy},${BRAND.gold})`,zIndex:1,width:`${Math.max(0,Math.min(100,(step/(STEPS.length-1))*100))}%`,transition:"width .5s ease"}}/>
        {STEPS.map((s,i) => {
          const done = i <= step;
          return (
            <div key={s} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",zIndex:2,position:"relative"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:done?`linear-gradient(135deg,${BRAND.navy},${BRAND.gold})`:T.card,border:`2px solid ${done?BRAND.gold:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .3s",boxShadow:done?`0 0 10px ${BRAND.gold}50`:"none"}}>
                {done ? <Ic name="check" size={11} color="#fff" sw={2.5}/> : <div style={{width:5,height:5,borderRadius:"50%",background:T.border}}/>}
              </div>
              <div style={{fontSize:8,fontWeight:700,color:done?BRAND.gold:T.dim,marginTop:5,textAlign:"center",whiteSpace:"nowrap",letterSpacing:.3}}>{s.toUpperCase()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Audit Log ─────────────────────────────────────────────────────────────────
const AuditLog = ({logs,users}) => {
  const col = {submitted:T.blue,approved:T.green,rejected:T.red,media_uploaded:BRAND.navy,media_posted:BRAND.gold,completed:T.green};
  if(!logs?.length) return <div style={{color:T.dim,fontSize:13,padding:"10px 0"}}>No activity yet.</div>;
  return (
    <div style={{position:"relative"}}>
      <div style={{position:"absolute",left:10,top:6,bottom:6,width:1,background:T.border}}/>
      {logs.map((l,i) => {
        const u = users?.find(x=>x.id===l.user_id)||{full_name:"System"};
        const c = col[l.action]||BRAND.gold;
        return (
          <div key={l.id||i} style={{display:"flex",gap:13,marginBottom:i<logs.length-1?14:0,position:"relative"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:`${c}20`,border:`2px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,zIndex:1}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:c}}/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.text}}>{l.note}</div>
              <div style={{fontSize:11,color:T.sub,marginTop:2}}>{u.full_name} · {fmtDate(l.created_at||l.at)} {fmtTime(l.created_at||l.at)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Calendar View ─────────────────────────────────────────────────────────────
const CalView = ({events}) => {
  const [cur,setCur] = useState(new Date());
  const y=cur.getFullYear(), m=cur.getMonth();
  const fd=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
  const apprEvs = events.filter(e=>["approved","awaiting_media","media_uploaded","media_posted","completed"].includes(e.status));
  const today = new Date();
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const getDayEvs = d => {
    const ds = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return apprEvs.filter(e=>(e.start_date||e.start||"").startsWith(ds));
  };
  return (
    <div className="card" style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden",animation:"fadeUp .3s ease"}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:14,fontWeight:700,color:T.text}}>{cur.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setCur(new Date(y,m-1,1))} style={{background:"rgba(255,255,255,.05)",border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 9px",color:T.sub,cursor:"pointer"}}><Ic name="arrowleft" size={13}/></button>
          <button onClick={()=>setCur(new Date(y,m+1,1))} style={{background:"rgba(255,255,255,.05)",border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 9px",color:T.sub,cursor:"pointer"}}><Ic name="arrowright" size={13}/></button>
        </div>
      </div>
      <div style={{padding:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
          {days.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:T.dim,padding:"3px 0",letterSpacing:.4}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {Array.from({length:fd}).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:dim}).map((_,i)=>{
            const d=i+1, devs=getDayEvs(d);
            const isT=today.getDate()===d&&today.getMonth()===m&&today.getFullYear()===y;
            return (
              <div key={d} style={{minHeight:50,borderRadius:9,border:`1px solid ${isT?BRAND.gold:T.border}`,padding:"5px 5px 3px",background:isT?`${BRAND.gold}14`:devs.length?`${BRAND.navy}0d`:"transparent"}}>
                <div style={{fontSize:11,fontWeight:isT?800:400,color:isT?BRAND.gold:T.sub,marginBottom:2}}>{d}</div>
                {devs.slice(0,2).map(ev=>(
                  <div key={ev.id} style={{fontSize:8,fontWeight:700,color:BRAND.navy,background:`${BRAND.navy}1a`,borderRadius:3,padding:"1px 3px",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ev.title}</div>
                ))}
                {devs.length>2&&<div style={{fontSize:8,color:T.dim}}>+{devs.length-2}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Notification Panel ─────────────────────────────────────────────────────────
const NotifPanel = ({notifs,onRead}) => {
  const [open,setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifs.filter(n=>!n.is_read&&!n.read).length;
  useEffect(()=>{
    const h = e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);
  return (
    <div style={{position:"relative"}} ref={ref}>
      <button onClick={()=>setOpen(!open)} style={{background:"rgba(255,255,255,.05)",border:`1px solid ${T.border}`,cursor:"pointer",padding:"7px 9px",borderRadius:10,position:"relative",color:T.sub,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Ic name="bell" size={17} color={unread?BRAND.gold:T.sub}/>
        {unread>0&&<span style={{position:"absolute",top:3,right:3,background:BRAND.gold,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,minWidth:14,height:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
      </button>
      {open && (
        <div className="card" style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:330,background:T.card,borderRadius:16,boxShadow:"0 24px 60px rgba(0,0,0,.55)",border:`1px solid ${T.borderH}`,zIndex:200,overflow:"hidden",animation:"fadeUp .15s ease"}}>
          <div style={{padding:"13px 17px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:700,color:T.text}}>Notifications</span>
            {unread>0&&<button onClick={()=>{onRead();setOpen(false);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:BRAND.gold,fontFamily:"inherit"}}>Mark all read</button>}
          </div>
          <div style={{maxHeight:340,overflowY:"auto"}}>
            {notifs.length===0
              ?<div style={{padding:22,textAlign:"center",color:T.dim,fontSize:13}}>No notifications</div>
              :notifs.slice(0,8).map(n=>(
                <div key={n.id} style={{padding:"11px 17px",borderBottom:`1px solid ${T.border}`,background:(n.is_read||n.read)?"transparent":`${BRAND.navy}08`,display:"flex",gap:9}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:(n.is_read||n.read)?"transparent":BRAND.gold,marginTop:6,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{n.title}</div>
                    <div style={{fontSize:12,color:T.sub,marginTop:1}}>{n.message||n.msg}</div>
                    <div style={{fontSize:10,color:T.dim,marginTop:3}}>{fmtDate(n.created_at||n.at)}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Event Card ─────────────────────────────────────────────────────────────────
const EventCard = ({ev,user,onAction,onView}) => {
  const now = new Date();
  const start = new Date(ev.start_date||ev.start);
  const isToday = start.toDateString()===now.toDateString();
  const isPast = start < now;
  const dl = ev.media_deadline||ev.deadline;
  const dlPassed = dl && new Date(dl)<now;
  const dlSoon = dl && !dlPassed && (new Date(dl)-now)<6*36e5;
  const hleft = dl ? Math.max(0,Math.round((new Date(dl)-now)/36e5)) : null;
  const organiserName = ev.profiles?.full_name || ev.organiser_name || "Organiser";

  return (
    <div className="card" style={{background:`linear-gradient(135deg,${T.card},${T.cardH})`,borderRadius:16,border:`1px solid ${T.border}`,padding:20,transition:"all .2s",animation:"fadeUp .3s ease"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderH;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,.3),0 0 0 1px ${BRAND.navy}18`}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:9}}>
        <Badge status={ev.status}/>
        {isToday&&<span style={{background:"rgba(245,158,11,.14)",color:T.yellow,padding:"3px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>TODAY</span>}
        {dlSoon&&!dlPassed&&<span style={{background:"rgba(239,68,68,.12)",color:T.red,padding:"3px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>⚠️ {hleft}h left</span>}
        {dlPassed&&ev.status==="approved"&&<span style={{background:"rgba(239,68,68,.12)",color:T.red,padding:"3px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>Upload Closed</span>}
      </div>
      <h4 style={{margin:"0 0 3px",fontSize:15,fontWeight:700,color:T.text}}>{ev.title}</h4>
      <p style={{margin:"0 0 12px",fontSize:12,color:T.sub}}>{ev.department||ev.dept} · {organiserName}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 12px",marginBottom:14,fontSize:12,color:T.sub}}>
        <span style={{display:"flex",alignItems:"center",gap:4}}><Ic name="calendar" size={11} color={T.dim}/>{fmtShort(ev.start_date||ev.start)}</span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><Ic name="clock" size={11} color={T.dim}/>{fmtTime(ev.start_date||ev.start)}</span>
        <span style={{display:"flex",alignItems:"center",gap:4,overflow:"hidden"}}><Ic name="home" size={11} color={T.dim}/><span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ev.venue}{ev.room_number?` (${ev.room_number})`:""}</span></span>
        <span style={{display:"flex",alignItems:"center",gap:4}}><Ic name="users" size={11} color={T.dim}/>{ev.expected_attendees||ev.attendees||"—"}</span>
      </div>
      {ev.rejection_reason&&<div style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.18)",borderRadius:9,padding:"9px 12px",marginBottom:12,fontSize:12,color:T.red}}><b>Rejected: </b>{ev.rejection_reason||ev.reason}</div>}
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        <Btn v="outline" sm onClick={()=>onView(ev)}><Ic name="eye" size={12}/>Details</Btn>
        {user.role==="admin"&&ev.status==="pending"&&<>
          <Btn v="success" sm onClick={()=>onAction("approve",ev)}><Ic name="check" size={12}/>Approve</Btn>
          <Btn v="danger" sm onClick={()=>onAction("reject",ev)}><Ic name="x" size={12}/>Reject</Btn>
        </>}
        {user.role==="organiser"&&ev.status==="approved"&&(isPast||isToday)&&!dlPassed&&
          <Btn v="coral" sm onClick={()=>onAction("upload_media",ev)}><Ic name="upload" size={12}/>Upload Media</Btn>}
        {user.role==="social_media_admin"&&ev.status==="media_uploaded"&&
          <Btn v="success" sm onClick={()=>onAction("mark_posted",ev)}><Ic name="send" size={12}/>Mark Posted</Btn>}
        {user.role==="admin"&&ev.status==="media_posted"&&
          <Btn v="primary" sm onClick={()=>onAction("mark_website",ev)}><Ic name="globe" size={12}/>Website Updated</Btn>}
        {user.role==="organiser"&&ev.status==="approved"&&!isPast&&!isToday&&
          <Btn v="outline" sm onClick={()=>onAction("use_template",ev)}><Ic name="copy" size={12}/>Use as Template</Btn>}
      </div>
    </div>
  );
};

// ── Submit Form ────────────────────────────────────────────────────────────────
const SubmitForm = ({user,onSubmit,onCancel,tmpl,events}) => {
  const init = tmpl ? {...tmpl,title:tmpl.title+" (Copy)",start_date:"",end_date:""} : {};
  const [f,setF] = useState({title:init.title||"",description:init.description||init.desc||"",department:init.department||init.dept||user.department||user.dept||"",college:"GSSS Institute of Engineering and Technology for Women",venue:init.venue||"",room_number:init.room_number||init.room||"",start_date:"",end_date:"",expected_attendees:init.expected_attendees||init.attendees||"",media_route:init.media_route||init.route||"both"});
  const [bname,setBname] = useState(null);
  const [bdata,setBdata] = useState(null);
  const [busy,setBusy] = useState(false);
  const [errs,setErrs] = useState({});
  const [dup,setDup] = useState(null);
  const ref = useRef();
  const s = (k,v) => setF(p=>({...p,[k]:v}));

  const chkDup = (venue,date) => {
    if(!venue||!date) return;
    const ds = date.split("T")[0];
    const found = events.find(e=>e.venue?.toLowerCase()===venue.toLowerCase()&&(e.start_date||e.start||"").startsWith(ds)&&["pending","approved","awaiting_media"].includes(e.status));
    setDup(found?`⚠️ "${venue}" is already booked for "${found.title}" on this date.`:null);
  };

  const go = () => {
    const e = {};
    if(!f.title) e.title="Required";
    if(!f.department) e.department="Required";
    if(!f.venue) e.venue="Required";
    if(!f.start_date) e.start_date="Required";
    if(!f.end_date) e.end_date="Required";
    if(f.start_date&&f.end_date&&new Date(f.end_date)<=new Date(f.start_date)) e.end_date="Must be after start";
    setErrs(e);
    if(Object.keys(e).length) return;
    setBusy(true);
    setTimeout(()=>{setBusy(false);onSubmit({...f,expected_attendees:parseInt(f.expected_attendees)||0,brochure_name:bname,brochure_data:bdata});},600);
  };

  return (
    <div>
      {dup&&<div style={{background:"rgba(245,158,11,.09)",border:"1px solid rgba(245,158,11,.28)",borderRadius:10,padding:"9px 13px",marginBottom:14,fontSize:13,color:T.yellow,display:"flex",gap:8,alignItems:"center"}}><Ic name="alert" size={14} color={T.yellow}/>{dup}</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 18px"}} className="g1mob">
        <div style={{gridColumn:"1 / -1"}}><Inp label="Event Title *" value={f.title} onChange={e=>s("title",e.target.value)} placeholder="e.g. Annual TechFest 2025" error={errs.title}/></div>
        <Sel label="Department *" value={f.department} onChange={e=>s("department",e.target.value)} options={DEPTS} error={errs.department}/>
        <Inp label="College / Institution" value={f.college} onChange={e=>s("college",e.target.value)}/>
        <Inp label="Venue *" value={f.venue} onChange={e=>{s("venue",e.target.value);chkDup(e.target.value,f.start_date);}} placeholder="e.g. Main Auditorium" error={errs.venue}/>
        <Inp label="Room Number" value={f.room_number} onChange={e=>s("room_number",e.target.value)} placeholder="e.g. A-101"/>
        <Inp label="Start Date & Time *" type="datetime-local" value={f.start_date} onChange={e=>{s("start_date",e.target.value);chkDup(f.venue,e.target.value);}} error={errs.start_date}/>
        <Inp label="End Date & Time *" type="datetime-local" value={f.end_date} onChange={e=>s("end_date",e.target.value)} error={errs.end_date}/>
        <Inp label="Expected Attendees" type="number" value={f.expected_attendees} onChange={e=>s("expected_attendees",e.target.value)} placeholder="200"/>
        <div style={{gridColumn:"1 / -1"}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:T.sub,marginBottom:8}}>Send Uploaded Media To *</label>
          <div style={{display:"flex",gap:11}}>
            {[{v:"admin",l:"Admin",icon:"shield"},{v:"social_media_admin",l:"Social Media Admin",icon:"send"}].map(opt=>{
              const checked = f.media_route===opt.v||f.media_route==="both";
              const isAdm = opt.v==="admin";
              const isSma = opt.v==="social_media_admin";
              const toggle = () => {
                if(f.media_route==="both") s("media_route",isAdm?"social_media_admin":"admin");
                else if(f.media_route===opt.v) s("media_route","both");
                else s("media_route","both");
              };
              return (
                <button key={opt.v} type="button" onClick={toggle}
                  style={{flex:1,padding:"11px 14px",borderRadius:11,border:`2px solid ${checked?(isAdm?BRAND.purple:BRAND.coral):T.border}`,background:checked?(isAdm?`${BRAND.purple}18`:`${BRAND.coral}18`):T.cardH,cursor:"pointer",display:"flex",alignItems:"center",gap:9,transition:"all .15s",fontFamily:"'Outfit',sans-serif"}}>
                  <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${checked?(isAdm?BRAND.purple:BRAND.coral):T.dim}`,background:checked?(isAdm?BRAND.purple:BRAND.coral):"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {checked&&<Ic name="check" size={11} color="#fff"/>}
                  </div>
                  <Ic name={opt.icon} size={15} color={checked?(isAdm?BRAND.purple:BRAND.coral):T.sub}/>
                  <span style={{fontSize:13,fontWeight:600,color:checked?T.text:T.sub}}>{opt.l}</span>
                </button>
              );
            })}
          </div>
          <div style={{fontSize:11,color:T.dim,marginTop:5}}>Select who should receive uploaded media for social media posting.</div>
        </div>
        <div style={{gridColumn:"1 / -1"}}><Txta label="Description" value={f.description} onChange={e=>s("description",e.target.value)} placeholder="Brief description of the event..."/></div>
        <div style={{gridColumn:"1 / -1"}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:T.sub,marginBottom:5}}>Brochure PDF (optional)</label>
          <div style={{border:`2px dashed ${bname?T.green:T.border}`,borderRadius:12,padding:"16px 18px",textAlign:"center",cursor:"pointer",transition:"all .2s"}} onClick={()=>ref.current.click()}
            onMouseEnter={e=>e.currentTarget.style.borderColor=bname?T.green:BRAND.gold}
            onMouseLeave={e=>e.currentTarget.style.borderColor=bname?T.green:T.border}>
            <input ref={ref} type="file" accept=".pdf" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(!file)return;setBname(file.name);const r=new FileReader();r.onload=ev=>setBdata(ev.target.result);r.readAsDataURL(file);}}/>
            <Ic name="file" size={20} color={bname?T.green:T.dim}/>
            <div style={{marginTop:5,fontSize:13,color:bname?T.green:T.sub}}>{bname?`✓ ${bname}`:"Click to upload PDF"}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:6,flexWrap:"wrap"}}>
        <Btn v="outline" onClick={onCancel}>Cancel</Btn>
        <Btn v="coral" onClick={go} disabled={busy}>{busy?<Spinner/>:<><Ic name="send" size={13}/>Submit Proposal</>}</Btn>
      </div>
    </div>
  );
};

// ── Media Upload Form ──────────────────────────────────────────────────────────
const MediaForm = ({ev,onSubmit,onCancel}) => {
  const [files,setFiles] = useState([]);
  const [prevs,setPrevs] = useState([]);
  const [drag,setDrag] = useState(false);
  const [busy,setBusy] = useState(false);
  const ref = useRef();
  const now = new Date();
  const dl = ev.media_deadline||ev.deadline;
  const dlPassed = dl && new Date(dl)<now;
  const hleft = dl && !dlPassed ? Math.round((new Date(dl)-now)/36e5) : 0;

  const addFiles = fs => {
    const v = Array.from(fs).filter(f=>f.type.startsWith("image/")||f.type.startsWith("video/"));
    setFiles(p=>[...p,...v]);
    v.forEach(f=>{
      if(f.type.startsWith("image/")){const r=new FileReader();r.onload=ev=>setPrevs(p=>[...p,{name:f.name,url:ev.target.result}]);r.readAsDataURL(f);}
      else setPrevs(p=>[...p,{name:f.name,url:null}]);
    });
  };

  if(dlPassed) return (
    <div style={{textAlign:"center",padding:"28px 0"}}>
      <div style={{fontSize:38,marginBottom:10}}>🔒</div>
      <div style={{fontSize:15,fontWeight:700,color:T.red,marginBottom:7}}>Upload Window Closed</div>
      <div style={{fontSize:13,color:T.sub}}>The 24-hour media upload window has passed.</div>
      <div style={{marginTop:18}}><Btn v="outline" onClick={onCancel}>Close</Btn></div>
    </div>
  );

  return (
    <div>
      {hleft<6&&hleft>0&&<div style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:10,padding:"9px 13px",marginBottom:14,fontSize:13,color:T.red,display:"flex",gap:8,alignItems:"center"}}><Ic name="alert" size={14} color={T.red}/>⚠️ Closes in {hleft} hour{hleft!==1?"s":""}!</div>}
      {dl&&<div style={{fontSize:12,color:T.sub,marginBottom:12,display:"flex",gap:5,alignItems:"center"}}><Ic name="clock" size={12} color={T.dim}/>Deadline: {fmtDate(dl)} {fmtTime(dl)}</div>}
      <div className={drag?"drag-on":""} style={{border:`2px dashed ${T.border}`,borderRadius:13,padding:"28px 18px",textAlign:"center",cursor:"pointer",transition:"all .2s",marginBottom:14}}
        onClick={()=>ref.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}}>
        <input ref={ref} type="file" accept="image/*,video/*" multiple style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
        <Ic name="upload" size={28} color={T.dim}/>
        <div style={{marginTop:8,fontSize:14,fontWeight:600,color:T.text}}>Drop media files or click to browse</div>
        <div style={{fontSize:12,color:T.sub,marginTop:3}}>JPG, PNG, GIF, MP4, MOV</div>
      </div>
      {prevs.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))",gap:8,marginBottom:14}}>
        {prevs.map((p,i)=>(
          <div key={i} style={{borderRadius:9,overflow:"hidden",border:`1px solid ${T.border}`,aspectRatio:"1",background:T.cardH,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {p.url?<img src={p.url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Ic name="image" size={22} color={T.dim}/>}
          </div>
        ))}
      </div>}
      <div style={{fontSize:13,color:T.sub,marginBottom:14}}>{files.length} file{files.length!==1?"s":""} selected</div>
      <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
        <Btn v="outline" onClick={onCancel}>Cancel</Btn>
        <Btn v="coral" onClick={()=>{if(!files.length)return;setBusy(true);setTimeout(()=>{setBusy(false);onSubmit(files);},700);}} disabled={!files.length||busy}>
          {busy?<Spinner/>:<><Ic name="upload" size={13}/>Upload {files.length} File{files.length!==1?"s":""}</>}
        </Btn>
      </div>
    </div>
  );
};

// ── Mark Posted Form ───────────────────────────────────────────────────────────
const PostedForm = ({ev,onSubmit,onCancel}) => {
  const PLATS = [{id:"instagram",label:"Instagram",icon:"instagram",col:"#E1306C"},{id:"facebook",label:"Facebook",icon:"facebook",col:"#1877F2"},{id:"linkedin",label:"LinkedIn",icon:"linkedin",col:"#0A66C2"},{id:"youtube",label:"YouTube",icon:"youtube",col:"#FF0000"}];
  const [sel,setSel] = useState(ev.social_platforms||ev.platforms||[]);
  const [desc,setDesc] = useState("");
  const [links,setLinks] = useState([{platform:"",url:""}]);
  const [notifyWA,setNotifyWA] = useState(true);
  const tog = id => setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const addLink = () => setLinks(l=>[...l,{platform:"",url:""}]);
  const updLink = (i,k,v) => setLinks(l=>l.map((x,j)=>j===i?{...x,[k]:v}:x));
  const removeLink = i => setLinks(l=>l.filter((_,j)=>j!==i));
  const waMsg = `📣 *${ev.title}* has been posted on our social media!\n${desc?`\n${desc}\n`:""}\n${links.filter(l=>l.url).map(l=>`🔗 ${l.platform}: ${l.url}`).join("\n")}\n\n— GSSS IET for Women`;
  return (
    <div>
      <div style={{background:T.cardH,borderRadius:10,padding:"11px 14px",marginBottom:18,display:"flex",gap:10,alignItems:"center"}}>
        <Ic name="send" size={15} color={BRAND.coral}/><div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{ev.title}</div><div style={{fontSize:12,color:T.sub}}>{ev.department||ev.dept}</div></div>
      </div>
      <div style={{fontSize:12,fontWeight:600,color:T.sub,marginBottom:10}}>Platforms posted to:</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:18}}>
        {PLATS.map(p=>(
          <button key={p.id} onClick={()=>tog(p.id)} style={{padding:"11px 14px",borderRadius:11,border:`2px solid ${sel.includes(p.id)?p.col:T.border}`,background:sel.includes(p.id)?`${p.col}15`:T.cardH,cursor:"pointer",display:"flex",alignItems:"center",gap:9,transition:"all .15s",fontFamily:"'Outfit',sans-serif"}}>
            <Ic name={p.icon} size={17} color={sel.includes(p.id)?p.col:T.sub}/>
            <span style={{fontSize:13,fontWeight:600,color:sel.includes(p.id)?T.text:T.sub}}>{p.label}</span>
            {sel.includes(p.id)&&<Ic name="check" size={12} color={p.col}/>}
          </button>
        ))}
      </div>
      <Txta label="Post Description / Caption" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Write a brief description about this event post that will be shared with staff and on WhatsApp..."/>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <label style={{fontSize:12,fontWeight:600,color:T.sub}}>Social Media Post Links</label>
          <button onClick={addLink} style={{background:`${BRAND.purple}22`,border:`1px solid ${BRAND.purple}44`,borderRadius:7,padding:"4px 10px",cursor:"pointer",color:BRAND.purple,fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:4}}>
            <Ic name="plus" size={10} color={BRAND.purple}/>Add Link
          </button>
        </div>
        {links.map((lk,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 2fr auto",gap:8,marginBottom:8,alignItems:"center"}}>
            <select value={lk.platform} onChange={e=>updLink(i,"platform",e.target.value)}
              style={{padding:"9px 10px",border:`1.5px solid ${T.border}`,borderRadius:9,fontSize:13,background:"rgba(255,255,255,.04)",color:lk.platform?T.text:T.dim,outline:"none",fontFamily:"'Outfit',sans-serif"}}>
              <option value="">Platform</option>
              {PLATS.map(p=><option key={p.id} value={p.label}>{p.label}</option>)}
            </select>
            <input value={lk.url} onChange={e=>updLink(i,"url",e.target.value)} placeholder="https://..."
              style={{padding:"9px 11px",border:`1.5px solid ${T.border}`,borderRadius:9,fontSize:13,background:"rgba(255,255,255,.04)",color:T.text,outline:"none",fontFamily:"'Outfit',sans-serif"}}
              onFocus={e=>e.target.style.borderColor=BRAND.purple} onBlur={e=>e.target.style.borderColor=T.border}/>
            {links.length>1&&<button onClick={()=>removeLink(i)} style={{background:"rgba(212,69,31,.1)",border:"none",borderRadius:7,padding:"9px 10px",cursor:"pointer",color:T.red}}><Ic name="x" size={12} color={T.red}/></button>}
          </div>
        ))}
      </div>
      <div style={{background:`${BRAND.purple}12`,border:`1px solid ${BRAND.purple}30`,borderRadius:11,padding:"12px 14px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:26,height:26,borderRadius:6,background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <span style={{fontSize:13,fontWeight:600,color:T.text}}>Share on WhatsApp Channel</span>
          </div>
          <button onClick={()=>setNotifyWA(v=>!v)} style={{width:36,height:20,borderRadius:999,background:notifyWA?"#25D366":T.dim,border:"none",cursor:"pointer",position:"relative",transition:"all .2s"}}>
            <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:notifyWA?18:2,transition:"left .2s"}}/>
          </button>
        </div>
        {notifyWA&&<div style={{fontSize:11,color:T.sub,background:"rgba(0,0,0,.2)",borderRadius:7,padding:"8px 10px",fontFamily:"monospace",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{waMsg}</div>}
      </div>
      <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
        <Btn v="outline" onClick={onCancel}>Cancel</Btn>
        <Btn v="success" onClick={()=>onSubmit(sel,desc,links.filter(l=>l.url),notifyWA)} disabled={!sel.length}><Ic name="check" size={13}/>Confirm Posted</Btn>
      </div>
    </div>
  );
};

// ── Profile Page ───────────────────────────────────────────────────────────────
const ProfilePage = ({user,onUpdate,events}) => {
  const [editing,setEditing] = useState(false);
  const [f,setF] = useState({full_name:user.full_name,department:user.department||user.dept||"",employee_id:user.employee_id||"",student_id:user.student_id||"",social_handle:user.social_handle||user.handle||""});
  const [saved,setSaved] = useState(false);
  const [busy,setBusy] = useState(false);
  const cfg = ROLES[user.role];
  const myEvs = events.filter(e=>e.organiser_id===user.id);
  const appEvs = events.filter(e=>["approved","awaiting_media","media_uploaded","media_posted","completed"].includes(e.status));
  const sv = (k,v) => setF(p=>({...p,[k]:v}));

  const save = async () => {
    setBusy(true);
    const updates = {full_name:f.full_name,department:f.department,employee_id:f.employee_id,student_id:f.student_id,social_handle:f.social_handle};
    const {error} = await supabase.from("profiles").update(updates).eq("id",user.id);
    setBusy(false);
    if(!error){const u={...user,...updates};onUpdate(u);setEditing(false);setSaved(true);setTimeout(()=>setSaved(false),2500);}
  };

  return (
    <div style={{maxWidth:660,margin:"0 auto",animation:"fadeUp .3s ease"}}>
      <div className="card" style={{background:`linear-gradient(135deg,${T.card},${T.cardH})`,borderRadius:20,border:`1px solid ${T.borderH}`,overflow:"hidden",marginBottom:18}}>
        <div style={{height:80,background:`linear-gradient(135deg,${cfg.g1},${cfg.g2},${BRAND.gold})`,opacity:.7}}/>
        <div style={{padding:"0 22px 22px",marginTop:-34}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:14,marginBottom:14}}>
            <div style={{width:66,height:66,borderRadius:"50%",background:`linear-gradient(135deg,${BRAND.navyD},${BRAND.gold})`,border:`3px solid ${T.card}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"#fff",boxShadow:`0 6px 20px ${BRAND.gold}40`}}>{user.full_name[0]}</div>
            <div style={{paddingBottom:4,flex:1}}>
              <div style={{fontSize:17,fontWeight:800,color:T.text,fontFamily:"'Playfair Display',Georgia,serif"}}>{user.full_name}</div>
              <span style={{display:"inline-flex",alignItems:"center",gap:5,background:`${cfg.accent}1e`,color:cfg.accent,padding:"3px 9px",borderRadius:999,fontSize:10,fontWeight:700,marginTop:4}}>
                <Ic name={cfg.icon} size={10} color={cfg.accent}/>{cfg.label}
              </span>
            </div>
            <Btn v="outline" sm onClick={()=>setEditing(!editing)}><Ic name="edit" size={12}/>{editing?"Cancel":"Edit"}</Btn>
          </div>
          {saved&&<div style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.2)",borderRadius:8,padding:"7px 11px",fontSize:13,color:T.green,marginBottom:11,display:"flex",gap:5,alignItems:"center"}}><Ic name="check" size={13} color={T.green}/>Profile updated!</div>}
          {editing ? (
            <div>
              <Inp label="Full Name" value={f.full_name} onChange={e=>sv("full_name",e.target.value)}/>
              {user.role!=="principal"&&<Sel label="Department" value={f.department} onChange={e=>sv("department",e.target.value)} options={DEPTS}/>}
              {(user.role==="admin"||user.role==="staff")&&<Inp label="Employee ID" value={f.employee_id} onChange={e=>sv("employee_id",e.target.value)}/>}
              {user.role==="organiser"&&<Inp label="Student ID" value={f.student_id} onChange={e=>sv("student_id",e.target.value)}/>}
              {user.role==="social_media_admin"&&<Inp label="Social Handle" value={f.social_handle} onChange={e=>sv("social_handle",e.target.value)}/>}
              <div style={{display:"flex",gap:9}}><Btn v="coral" onClick={save} disabled={busy}>{busy?<Spinner/>:<><Ic name="check" size={13}/>Save</>}</Btn><Btn v="outline" onClick={()=>setEditing(false)}>Cancel</Btn></div>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 22px"}} className="g1mob">
              {[["Email",user.email],["Department",user.department||user.dept||"N/A"],user.employee_id&&["Employee ID",user.employee_id],user.student_id&&["Student ID",user.student_id],user.social_handle&&["Handle",user.social_handle]].filter(Boolean).map(([k,v])=>(
                <div key={k} style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontSize:10,color:T.dim,letterSpacing:.4,fontWeight:600,marginBottom:2}}>{k.toUpperCase()}</div>
                  <div style={{fontSize:14,color:T.text}}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {user.role==="principal"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}} className="g1mob">
          <StatCard label="Total Events" value={events.length} icon="calendar" accent={BRAND.gold}/>
          <StatCard label="Approved" value={appEvs.length} icon="check" accent={T.green}/>
          <StatCard label="Upcoming" value={events.filter(e=>new Date(e.start_date||e.start)>new Date()&&e.status==="approved").length} icon="trending" accent={BRAND.navy}/>
        </div>
      )}
      {user.role==="organiser"&&myEvs.length>0&&(
        <div className="card" style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:12}}>My Events</div>
          {myEvs.map(e=>(
            <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
              <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{e.title}</div><div style={{fontSize:11,color:T.sub}}>{fmtShort(e.start_date||e.start)}</div></div>
              <Badge status={e.status}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Reports (all users) ────────────────────────────────────────────────────────
const Reports = ({events, userRole}) => {
  const [fil,setFil] = useState({from:"",to:"",dept:"",status:""});
  const [srch,setSrch] = useState("");
  const [dlMenu,setDlMenu] = useState(false);
  const dlRef = useRef(null);
  const sf = (k,v) => setFil(p=>({...p,[k]:v}));
  useEffect(()=>{
    const h=e=>{if(dlRef.current&&!dlRef.current.contains(e.target))setDlMenu(false)};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);

  const filt = events.filter(e=>{
    if(fil.from&&(e.start_date||e.start)<fil.from) return false;
    if(fil.to&&(e.start_date||e.start)>fil.to) return false;
    if(fil.dept&&(e.department||e.dept)!==fil.dept) return false;
    if(fil.status&&e.status!==fil.status) return false;
    if(srch){const q=srch.toLowerCase();if(!e.title.toLowerCase().includes(q)&&!(e.department||e.dept||"").toLowerCase().includes(q)&&!(e.venue||"").toLowerCase().includes(q))return false;}
    return true;
  });
  const st = {total:filt.length,app:filt.filter(e=>["approved","completed"].includes(e.status)).length,rej:filt.filter(e=>e.status==="rejected").length,comp:filt.filter(e=>e.status==="completed").length,med:filt.filter(e=>["media_uploaded","media_posted","completed"].includes(e.status)).length};
  const dB = filt.reduce((a,e)=>({...a,[(e.department||e.dept||"—")]:(a[(e.department||e.dept||"—")]||0)+1}),{});
  const mD = Math.max(...Object.values(dB),1);

  const rows = [["Title","Department","Venue","Date","Start Time","Status","Attendees","Media Uploaded","Platforms","Organiser"],...filt.map(e=>[
    e.title,e.department||e.dept||"",e.venue||"",fmtDate(e.start_date||e.start),fmtTime(e.start_date||e.start),
    STATUS_META[e.status]?.label||e.status,
    String(e.expected_attendees||e.attendees||""),
    (["media_uploaded","media_posted","completed"].includes(e.status)?"Yes":"No"),
    (e.social_platforms||e.platforms||[]).join(", "),
    e.profiles?.full_name||e.organiser_name||""
  ])];

  const dlCSV = () => {
    const data=rows.map(r=>r.map(v=>`"${String(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(data);a.download="GSSS_Event_Report.csv";a.click();
    setDlMenu(false);
  };

  const dlExcel = () => {
    // Build XLSX-compatible XML spreadsheet
    const esc = s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="H"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0F2952" ss:Pattern="Solid"/></Style></Styles><Worksheet ss:Name="Events"><Table>${
      rows.map((r,i)=>`<Row>${r.map(c=>`<Cell${i===0?' ss:StyleID="H"':''}><Data ss:Type="String">${esc(c)}</Data></Cell>`).join("")}</Row>`).join("")
    }</Table></Worksheet></Workbook>`;
    const a=document.createElement("a");a.href="data:application/vnd.ms-excel;charset=utf-8,"+encodeURIComponent(xml);a.download="GSSS_Event_Report.xls";a.click();
    setDlMenu(false);
  };

  const dlWord = () => {
    const esc = s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const headerRow = rows[0];
    const dataRows = rows.slice(1);
    const tableRows = [
      `<w:tr>${headerRow.map(h=>`<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="0F2952"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/></w:rPr><w:t>${esc(h)}</w:t></w:r></w:p></w:tc>`).join("")}</w:tr>`,
      ...dataRows.map((r,ri)=>`<w:tr>${r.map(c=>`<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="${ri%2===0?"FFFFFF":"EEF2FF"}"/></w:tcPr><w:p><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${esc(c)}</w:t></w:r></w:p></w:tc>`).join("")}</w:tr>`)
    ].join("");
    const xml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?mso-application progid="Word.Document"?><w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml"><w:body><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="0F2952"/></w:rPr><w:t>GSSS Institute of Engineering and Technology for Women</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="22"/><w:color w:val="666666"/></w:rPr><w:t>Event Report — ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}</w:t></w:r></w:p><w:p><w:r><w:t> </w:t></w:r></w:p><w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="9000" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${tableRows}</w:tbl></w:body></w:wordDocument>`;
    const a=document.createElement("a");a.href="data:application/msword;charset=utf-8,"+encodeURIComponent(xml);a.download="GSSS_Event_Report.doc";a.click();
    setDlMenu(false);
  };

  const dlPDF = () => {
    const w=window.open("","_blank","width=900,height=700");
    if(!w) return;
    const headerRow=rows[0]; const dataRows=rows.slice(1);
    w.document.write(`<!DOCTYPE html><html><head><title>GSSS Event Report</title><style>
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;background:#fff;padding:30px;color:#1a1a2e}
      .header{text-align:center;margin-bottom:28px;padding-bottom:18px;border-bottom:3px solid #0F2952}
      .logo-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:6px}
      h1{font-size:20px;color:#0F2952;font-weight:800}h2{font-size:13px;color:#666;font-weight:400;margin-top:3px}
      .meta{display:flex;gap:18px;justify-content:center;margin-top:10px;font-size:11px;color:#888}
      table{width:100%;border-collapse:collapse;font-size:11px;margin-top:16px}
      th{background:#0F2952;color:#fff;padding:8px 10px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.4px}
      td{padding:7px 10px;border-bottom:1px solid #eee;color:#333}
      tr:nth-child(even) td{background:#f5f7ff}
      .badge{display:inline-block;padding:2px 7px;border-radius:20px;font-size:9px;font-weight:700}
      .footer{margin-top:24px;text-align:center;font-size:10px;color:#aaa;padding-top:14px;border-top:1px solid #eee}
      @media print{button{display:none}body{padding:15px}}
    </style></head><body>
    <div class="header">
      <div class="logo-row"><h1>GSSS Institute of Engineering and Technology for Women</h1></div>
      <h2>Mysuru, Karnataka · VTU Affiliated · AICTE Approved · NBA & NAAC Accredited</h2>
      <div class="meta"><span>📅 Report Date: ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}</span><span>📊 Total Events: ${dataRows.length}</span></div>
    </div>
    <table><thead><tr>${headerRow.map(h=>`<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${dataRows.map((r,i)=>`<tr>${r.map((c,ci)=>ci===5?`<td><span class="badge" style="background:${c==="Completed"?"#d1fae5":c==="Approved"?"#dbeafe":c==="Pending"?"#fef3c7":"#fee2e2"};color:${c==="Completed"?"#065f46":c==="Approved"?"#1e40af":c==="Pending"?"#92400e":"#991b1b"}">${c}</span></td>`:`<td>${c||"—"}</td>`).join("")}</tr>`).join("")}
    </tbody></table>
    <div class="footer">GSSS IET for Women · Events Management Portal · Confidential</div>
    <br><button onclick="window.print()" style="padding:9px 22px;background:#0F2952;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;display:block;margin:0 auto">🖨️ Print / Save as PDF</button>
    </body></html>`);
    w.document.close();
    setDlMenu(false);
  };

  return (
    <div style={{animation:"fadeUp .3s ease"}}>
      <div className="card" style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:18,marginBottom:18}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:10,alignItems:"end"}} className="g1mob">
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic name="search" size={14} color={T.dim}/></div>
            <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Search title, dept, venue..."
              style={{width:"100%",padding:"10px 13px 10px 34px",border:`1.5px solid ${T.border}`,borderRadius:10,fontSize:13,background:"rgba(255,255,255,.04)",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor=BRAND.gold} onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <Sel value={fil.dept} onChange={e=>sf("dept",e.target.value)} options={DEPTS}/>
          <Sel value={fil.status} onChange={e=>sf("status",e.target.value)} options={Object.keys(STATUS_META).map(k=>({v:k,l:STATUS_META[k].label}))}/>
          <div style={{display:"flex",gap:7}}>
            <div style={{position:"relative"}} ref={dlRef}>
              <Btn v="coral" sm onClick={()=>setDlMenu(v=>!v)}><Ic name="download" size={12}/>Download ▾</Btn>
              {dlMenu&&(
                <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:T.card,border:`1px solid ${T.borderH}`,borderRadius:12,zIndex:200,overflow:"hidden",minWidth:165,boxShadow:"0 16px 40px rgba(0,0,0,.5)",animation:"fadeUp .12s ease"}}>
                  {[
                    {label:"📄 PDF",action:dlPDF,col:T.red},
                    {label:"📊 Excel (.xls)",action:dlExcel,col:T.green},
                    {label:"📝 Word (.doc)",action:dlWord,col:T.blue},
                    {label:"📋 CSV",action:dlCSV,col:BRAND.gold},
                  ].map(({label,action,col})=>(
                    <button key={label} onClick={action}
                      style={{display:"block",width:"100%",padding:"11px 16px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:600,color:T.text,fontFamily:"'Outfit',sans-serif",transition:"background .1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <span style={{color:col}}>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Btn v="outline" sm onClick={()=>{setFil({from:"",to:"",dept:"",status:""});setSrch("");}}><Ic name="x" size={12}/>Clear</Btn>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}} className="g1mob">
          <Inp label="From Date" type="date" value={fil.from} onChange={e=>sf("from",e.target.value)}/>
          <Inp label="To Date" type="date" value={fil.to} onChange={e=>sf("to",e.target.value)}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11,marginBottom:18}} className="g1mob">
        <StatCard label="Total" value={st.total} icon="calendar" accent={BRAND.gold}/>
        <StatCard label="Approved" value={st.app} icon="check" accent={T.green}/>
        <StatCard label="Rejected" value={st.rej} icon="x" accent={T.red}/>
        <StatCard label="Completed" value={st.comp} icon="shield" accent={BRAND.navy}/>
        <StatCard label="Media Done" value={st.med} icon="image" accent={T.blue}/>
      </div>
      {Object.keys(dB).length>0&&(
        <div className="card" style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:20,marginBottom:18}}>
          <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:13}}>Events by Department</div>
          {Object.entries(dB).sort((a,b)=>b[1]-a[1]).map(([d,c])=>(
            <div key={d} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.sub,marginBottom:4}}><span>{d}</span><span style={{fontWeight:700,color:T.text}}>{c}</span></div>
              <div style={{height:5,background:T.border,borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${(c/mD)*100}%`,background:`linear-gradient(90deg,${BRAND.navy},${BRAND.gold})`,borderRadius:999,transition:"width .5s ease"}}/></div>
            </div>
          ))}
        </div>
      )}
      <div className="card" style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>Event Records</span>
          <span style={{fontSize:12,color:T.sub}}>{filt.length} event{filt.length!==1?"s":""}</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"rgba(255,255,255,.02)"}}>
              {["Event","Date","Dept","Venue","Status","Media","Att.","Organiser"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.dim,letterSpacing:.5,borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>)}
            </tr></thead>
            <tbody>
              {filt.length===0
                ?<tr><td colSpan={8} style={{padding:"36px 14px",textAlign:"center",color:T.dim}}>No events match filters.</td></tr>
                :filt.map(e=>(
                  <tr key={e.id} style={{borderBottom:`1px solid ${T.border}`,transition:"background .1s"}}
                    onMouseEnter={ev=>ev.currentTarget.style.background="rgba(255,255,255,.02)"}
                    onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                    <td style={{padding:"11px 14px",fontSize:13,fontWeight:600,color:T.text,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.title}</td>
                    <td style={{padding:"11px 14px",fontSize:12,color:T.sub,whiteSpace:"nowrap"}}>{fmtDate(e.start_date||e.start)}</td>
                    <td style={{padding:"11px 14px",fontSize:12,color:T.sub}}>{e.department||e.dept}</td>
                    <td style={{padding:"11px 14px",fontSize:12,color:T.sub}}>{e.venue}</td>
                    <td style={{padding:"11px 14px"}}><Badge status={e.status}/></td>
                    <td style={{padding:"11px 14px",textAlign:"center"}}>{["media_uploaded","media_posted","completed"].includes(e.status)?<span style={{color:T.green,fontWeight:800}}>✓</span>:<span style={{color:T.border}}>–</span>}</td>
                    <td style={{padding:"11px 14px",fontSize:12,color:T.sub,textAlign:"center"}}>{e.expected_attendees||e.attendees||"—"}</td>
                    <td style={{padding:"11px 14px",fontSize:12,color:T.sub}}>{e.profiles?.full_name||e.organiser_name||"—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Principal Dashboard with search + Netflix carousel ─────────────────────────
const PrincipalDashboard = ({events, onView}) => {
  const [q, setQ] = useState("");
  const all = events.filter(e=>["approved","awaiting_media","media_uploaded","media_posted","completed","pending"].includes(e.status));
  const searched = q.trim() ? all.filter(e=>{
    const s=q.toLowerCase();
    return e.title?.toLowerCase().includes(s)||(e.department||"").toLowerCase().includes(s)||(e.venue||"").toLowerCase().includes(s)||(e.organiser_name||"").toLowerCase().includes(s);
  }) : null;
  const upcoming = all.filter(e=>e.status==="approved"&&new Date(e.start_date||e.start)>=new Date()).sort((a,b)=>new Date(a.start_date||a.start)-new Date(b.start_date||b.start));
  const recent = all.filter(e=>["completed","media_posted","media_uploaded"].includes(e.status)).sort((a,b)=>new Date(b.start_date||b.start)-new Date(a.start_date||a.start)).slice(0,15);
  const pending = all.filter(e=>e.status==="pending");

  return (
    <div>
      {/* Search bar */}
      <div style={{position:"relative",marginBottom:24,maxWidth:520}}>
        <div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",zIndex:1}}><Ic name="search" size={16} color={BRAND.gold}/></div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search events by title, department, venue, organiser..."
          style={{width:"100%",padding:"11px 14px 11px 40px",border:`1.5px solid ${q?BRAND.gold:T.border}`,borderRadius:12,fontSize:14,background:"rgba(255,255,255,.05)",color:T.text,fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box",transition:"border-color .15s"}}
          onFocus={e=>e.target.style.borderColor=BRAND.gold} onBlur={e=>{if(!q)e.target.style.borderColor=T.border;}}/>
        {q&&<button onClick={()=>setQ("")} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.dim,padding:2}}>
          <Ic name="x" size={14} color={T.dim}/>
        </button>}
      </div>

      {/* Search results */}
      {searched!==null ? (
        <div>
          <div style={{fontSize:13,color:T.sub,marginBottom:14}}>{searched.length} result{searched.length!==1?"s":""} for "<span style={{color:T.text,fontWeight:600}}>{q}</span>"</div>
          {searched.length===0
            ?<div className="card" style={{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:"32px 18px",textAlign:"center",color:T.dim}}>No events found matching "{q}"</div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:13}}>
              {searched.map(e=>(
                <div key={e.id} onClick={()=>onView(e)}
                  style={{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:"14px 16px",cursor:"pointer",transition:"all .2s"}}
                  onMouseEnter={ev=>{ev.currentTarget.style.borderColor=BRAND.gold;ev.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={ev=>{ev.currentTarget.style.borderColor=T.border;ev.currentTarget.style.transform="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text,flex:1,marginRight:8,lineHeight:1.3}}>{e.title}</div>
                    <Badge status={e.status}/>
                  </div>
                  <div style={{fontSize:11,color:BRAND.gold,fontWeight:600,marginBottom:5}}>{e.department||e.dept}</div>
                  <div style={{display:"flex",gap:10,fontSize:11,color:T.sub}}>
                    <span style={{display:"flex",gap:3,alignItems:"center"}}><Ic name="calendar" size={9} color={T.dim}/>{fmtShort(e.start_date||e.start)}</span>
                    <span style={{display:"flex",gap:3,alignItems:"center"}}><Ic name="home" size={9} color={T.dim}/>{e.venue}</span>
                  </div>
                </div>
              ))}
            </div>}
        </div>
      ) : (
        <>
          {pending.length>0&&<EventCarousel events={pending} title="⏳ Pending Approval" accent={T.yellow} onView={onView}/>}
          <EventCarousel events={upcoming} title="📅 Upcoming Events" accent={BRAND.gold} onView={onView}/>
          <EventCarousel events={recent} title="✅ Recently Completed" accent={T.green} onView={onView}/>
          {upcoming.length===0&&recent.length===0&&pending.length===0&&(
            <div className="card" style={{background:T.card,borderRadius:15,border:`1px solid ${T.border}`,padding:"40px 18px",textAlign:"center"}}>
              <div style={{fontSize:34,marginBottom:10}}>📭</div>
              <div style={{fontSize:14,fontWeight:700,color:T.sub}}>No events yet</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Netflix Carousel (Principal) ───────────────────────────────────────────────
const EventCarousel = ({events, title, accent, onView}) => {
  const ref = useRef(null);
  const [canLeft,setCanLeft] = useState(false);
  const [canRight,setCanRight] = useState(true);
  const [hovIdx,setHovIdx] = useState(null);
  const DEPT_COLORS = ["#8B35A3","#0F9B6A","#3D85C8","#C8922A","#D44040","#0D7377","#6366f1","#EC4899"];
  const deptColor = dept => DEPT_COLORS[Math.abs((dept||"").split("").reduce((a,c)=>a+c.charCodeAt(0),0))%DEPT_COLORS.length];
  const scroll = dir => {
    if(!ref.current) return;
    ref.current.scrollBy({left: dir*280, behavior:"smooth"});
  };
  const onScroll = () => {
    if(!ref.current) return;
    setCanLeft(ref.current.scrollLeft>10);
    setCanRight(ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth - 10);
  };
  useEffect(()=>{onScroll();},[events]);
  if(!events.length) return null;
  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:4,height:18,borderRadius:99,background:`linear-gradient(180deg,${accent},${accent}88)`}}/>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>{title}</span>
          <span style={{background:`${accent}22`,color:accent,padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700}}>{events.length}</span>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>scroll(-1)} disabled={!canLeft}
            style={{width:30,height:30,borderRadius:"50%",background:canLeft?`${accent}22`:"rgba(255,255,255,.03)",border:`1px solid ${canLeft?accent:T.border}`,cursor:canLeft?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={canLeft?accent:T.dim} strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={()=>scroll(1)} disabled={!canRight}
            style={{width:30,height:30,borderRadius:"50%",background:canRight?`${accent}22`:"rgba(255,255,255,.03)",border:`1px solid ${canRight?accent:T.border}`,cursor:canRight?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={canRight?accent:T.dim} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      <div ref={ref} onScroll={onScroll}
        style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:8,scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch"}}>
        {events.map((ev,i)=>{
          const col = deptColor(ev.department||ev.dept);
          const start = new Date(ev.start_date||ev.start);
          const isToday = start.toDateString()===new Date().toDateString();
          const daysLeft = Math.ceil((start-new Date())/864e5);
          return (
            <div key={ev.id}
              onMouseEnter={()=>setHovIdx(i)} onMouseLeave={()=>setHovIdx(null)}
              onClick={()=>onView(ev)}
              style={{flexShrink:0,width:220,borderRadius:14,overflow:"hidden",border:`1px solid ${hovIdx===i?col:T.border}`,background:T.card,cursor:"pointer",transition:"all .22s",transform:hovIdx===i?"translateY(-4px) scale(1.02)":"none",boxShadow:hovIdx===i?`0 14px 36px rgba(0,0,0,.4),0 0 0 1px ${col}44`:"none"}}>
              {/* Coloured header banner */}
              <div style={{height:72,background:`linear-gradient(135deg,${col}cc,${col}55)`,position:"relative",display:"flex",alignItems:"flex-end",padding:"0 12px 8px"}}>
                <div style={{position:"absolute",top:0,right:0,bottom:0,left:0,backgroundImage:`radial-gradient(circle at 80% 20%,rgba(255,255,255,.12) 0%,transparent 60%)`}}/>
                {isToday&&<span style={{position:"absolute",top:9,right:9,background:"#facc15",color:"#1a1a00",fontSize:8,fontWeight:800,padding:"2px 7px",borderRadius:99}}>TODAY</span>}
                {!isToday&&daysLeft>0&&daysLeft<=3&&<span style={{position:"absolute",top:9,right:9,background:T.red,color:"#fff",fontSize:8,fontWeight:800,padding:"2px 7px",borderRadius:99}}>IN {daysLeft}D</span>}
                <div style={{width:34,height:34,borderRadius:9,background:"rgba(0,0,0,.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,position:"relative",zIndex:1}}>🎓</div>
              </div>
              <div style={{padding:"10px 12px 12px"}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,lineHeight:1.3,marginBottom:5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ev.title}</div>
                <div style={{fontSize:10,fontWeight:700,color:col,marginBottom:7,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.department||ev.dept}</div>
                <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}>
                  <Ic name="calendar" size={9} color={T.dim}/>
                  <span style={{fontSize:10,color:T.sub}}>{fmtShort(ev.start_date||ev.start)}</span>
                </div>
                <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:9}}>
                  <Ic name="home" size={9} color={T.dim}/>
                  <span style={{fontSize:10,color:T.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.venue}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <Badge status={ev.status}/>
                  <span style={{fontSize:9,color:T.dim,fontWeight:600}}>{ev.expected_attendees||ev.attendees||"?"}👥</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const UserMgmt = ({meId,onRefresh}) => {
  const [users,setUsers] = useState([]);
  const [srch,setSrch] = useState("");
  const [rf,setRf] = useState("all");
  const [conf,setConf] = useState(null);
  const [loading,setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const {data} = await supabase.from("profiles").select("*");
    setUsers(data||[]);
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const del = async uid => {
    await supabase.from("profiles").delete().eq("id",uid);
    setConf(null);
    load();
    onRefresh?.();
  };

  const filt = users.filter(u=>{
    if(u.id===meId) return false;
    if(rf!=="all"&&u.role!==rf) return false;
    const q = srch.toLowerCase();
    return !q||u.full_name?.toLowerCase().includes(q)||u.email?.toLowerCase().includes(q)||(u.department||"").toLowerCase().includes(q);
  });
  const RB = {admin:{bg:`rgba(15,41,82,.22)`,text:BRAND.navy},organiser:{bg:"rgba(16,185,129,.12)",text:T.green},social_media_admin:{bg:"rgba(99,102,241,.12)",text:"#6366f1"},staff:{bg:`rgba(200,146,42,.12)`,text:BRAND.gold},principal:{bg:`rgba(15,41,82,.22)`,text:BRAND.navy}};

  return (
    <div>
      {conf&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div className="card" style={{background:T.card,borderRadius:20,padding:26,maxWidth:360,width:"100%",border:`1px solid ${T.borderH}`}}>
            <div style={{width:44,height:44,borderRadius:12,background:"rgba(239,68,68,.12)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:13}}><Ic name="trash" size={20} color={T.red}/></div>
            <h3 style={{margin:"0 0 7px",color:T.text,fontFamily:"'Playfair Display',Georgia,serif"}}>Delete User?</h3>
            <p style={{color:T.sub,fontSize:14,marginBottom:18}}>This action is permanent and cannot be undone.</p>
            <div style={{display:"flex",gap:9}}><Btn v="outline" onClick={()=>setConf(null)} full>Cancel</Btn><Btn v="danger" onClick={()=>del(conf)} full><Ic name="trash" size={13}/>Delete</Btn></div>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:11,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:190,position:"relative"}}>
          <div style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic name="search" size={14} color={T.dim}/></div>
          <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Search users..."
            style={{width:"100%",padding:"10px 13px 10px 34px",border:`1.5px solid ${T.border}`,borderRadius:10,fontSize:14,background:"rgba(255,255,255,.04)",color:T.text,fontFamily:"'Inter',sans-serif",outline:"none",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor=BRAND.gold} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
        <Sel value={rf} onChange={e=>setRf(e.target.value)} options={[{v:"all",l:"All Roles"},...Object.entries(ROLES).map(([v,c])=>({v,l:c.label}))]}/>
      </div>
      {loading?<div style={{textAlign:"center",padding:36,color:T.dim}}><Spinner size={24}/></div>
      :filt.length===0?<div style={{textAlign:"center",padding:"36px 18px",color:T.dim}}>No users found.</div>
      :filt.map(u=>{
        const rb = RB[u.role]||{bg:"rgba(255,255,255,.05)",text:T.sub};
        return (
          <div key={u.id} className="card" style={{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:"14px 18px",marginBottom:9,display:"flex",alignItems:"center",gap:13,flexWrap:"wrap"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${BRAND.navyD},${BRAND.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>{u.full_name?.[0]||"?"}</div>
            <div style={{flex:1,minWidth:140}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text}}>{u.full_name}</div>
              <div style={{fontSize:12,color:T.sub}}>{u.email} · {u.department||"—"}</div>
            </div>
            <span style={{background:rb.bg,color:rb.text,padding:"3px 9px",borderRadius:999,fontSize:10,fontWeight:700}}>{ROLES[u.role]?.label||u.role}</span>
            <button onClick={()=>setConf(u.id)} style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.14)",borderRadius:8,padding:"6px 11px",cursor:"pointer",color:T.red,display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>
              <Ic name="trash" size={12} color={T.red}/>Remove
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ── Staff Announcements ────────────────────────────────────────────────────────
const Announcements = ({events}) => {
  const upcoming = events.filter(e=>e.status==="approved"&&new Date(e.start_date||e.start)>new Date()).sort((a,b)=>new Date(a.start_date||a.start)-new Date(b.start_date||b.start));
  const recent = events.filter(e=>["completed","media_posted"].includes(e.status)).sort((a,b)=>new Date(b.start_date||b.start)-new Date(a.start_date||a.start)).slice(0,5);
  return (
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}} className="g1mob">
        <div>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12,display:"flex",gap:7,alignItems:"center"}}><Ic name="trending" size={15} color={BRAND.gold}/>Upcoming Events</div>
          {upcoming.length===0?<div className="card" style={{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:18,textAlign:"center",color:T.dim,fontSize:13}}>No upcoming events.</div>
          :upcoming.slice(0,5).map(e=>(
            <div key={e.id} className="card" style={{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:"13px 16px",marginBottom:9}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{e.title}</div>
              <div style={{display:"flex",gap:12,fontSize:12,color:T.sub}}>
                <span style={{display:"flex",gap:3,alignItems:"center"}}><Ic name="calendar" size={10} color={T.dim}/>{fmtShort(e.start_date||e.start)}</span>
                <span style={{display:"flex",gap:3,alignItems:"center"}}><Ic name="home" size={10} color={T.dim}/>{e.venue}</span>
              </div>
              <div style={{fontSize:10,color:BRAND.gold,marginTop:5,fontWeight:600}}>{e.department||e.dept}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12,display:"flex",gap:7,alignItems:"center"}}><Ic name="star" size={15} color={BRAND.navy}/>Recently Completed</div>
          {recent.length===0?<div className="card" style={{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:18,textAlign:"center",color:T.dim,fontSize:13}}>No completed events.</div>
          :recent.map(e=>(
            <div key={e.id} className="card" style={{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:"13px 16px",marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>{e.title}</div>
                <Badge status={e.status}/>
              </div>
              <div style={{fontSize:12,color:T.sub}}>{e.department||e.dept} · {fmtShort(e.start_date||e.start)}</div>
              {(e.social_platforms||e.platforms||[]).length>0&&<div style={{display:"flex",gap:5,marginTop:7}}>{(e.social_platforms||e.platforms||[]).map(p=><Ic key={p} name={p} size={13} color={T.sub}/>)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  AUTH SCREENS
// ════════════════════════════════════════════════════════════════════
const RoleSelect = ({onSelect}) => {
  const [hov,setHov] = useState(null);
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      {/* College background image with blur */}
      <div style={{position:"absolute",inset:0,backgroundImage:`url(${COLLEGE_BG})`,backgroundSize:"cover",backgroundPosition:"center",filter:"blur(3px) brightness(0.22)",transform:"scale(1.05)",zIndex:0}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(6,13,27,.88) 0%,rgba(6,13,27,.55) 50%,rgba(6,13,27,.92) 100%)",zIndex:1}}/>
      <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <CollegeBanner/>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"36px 18px"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:11,background:"rgba(200,146,42,.08)",border:`1px solid rgba(200,146,42,.20)`,borderRadius:14,padding:"9px 20px",marginBottom:18}}>
              <div style={{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,.08)",border:"1px solid rgba(200,146,42,.18)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:2}}>
                <img src={GSSS_LOGO} alt="GSSS" style={{width:32,height:32,objectFit:"contain"}}/>
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:11.5,fontWeight:700,color:"rgba(255,255,255,.92)",letterSpacing:.2,fontFamily:"'Playfair Display',Georgia,serif"}}>GSSS IET for Women</div>
                <div style={{fontSize:9.5,fontWeight:600,color:BRAND.goldL,letterSpacing:.9,marginTop:2}}>EVENT APPROVAL PORTAL</div>
              </div>
            </div>
            <h1 style={{margin:0,fontSize:"clamp(24px,4vw,40px)",fontWeight:800,color:T.text,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1.15}}>Campus Event Management</h1>
            <p style={{margin:"10px 0 0",color:T.sub,fontSize:14.5}}>Select your role to access the portal</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(188px,1fr))",gap:14,maxWidth:920,width:"100%"}}>
            {Object.entries(ROLES).map(([key,cfg])=>(
              <button key={key} onClick={()=>onSelect(key)} onMouseEnter={()=>setHov(key)} onMouseLeave={()=>setHov(null)}
                style={{padding:"22px 18px",borderRadius:16,border:`1px solid ${hov===key?cfg.accent:"rgba(255,255,255,.09)"}`,background:hov===key?"rgba(255,255,255,.06)":"rgba(14,27,53,.80)",backdropFilter:"blur(14px)",cursor:"pointer",textAlign:"left",transition:"all .2s",transform:hov===key?"translateY(-4px)":"none",boxShadow:hov===key?`0 14px 36px rgba(0,0,0,.4),0 0 0 1px ${cfg.accent}28`:"0 2px 12px rgba(0,0,0,.35)",fontFamily:"'Inter',sans-serif"}}>
                <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${cfg.g1},${cfg.g2})`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:13,border:`1px solid ${cfg.accent}20`,boxShadow:`0 4px 14px ${cfg.accent}18`}}>
                  <Ic name={cfg.icon} size={19} color="#fff"/>
                </div>
                <div style={{fontSize:13.5,fontWeight:700,color:T.text,marginBottom:5,fontFamily:"'Playfair Display',Georgia,serif"}}>{cfg.label}</div>
                <div style={{fontSize:11.5,color:T.sub,lineHeight:1.5}}>{cfg.tagline}</div>
                {hov===key&&<div style={{marginTop:11,fontSize:11.5,color:cfg.accent,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Ic name="arrowright" size={12} color={cfg.accent}/>Continue</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({roleKey,onAuth,onBack}) => {
  const cfg = ROLES[roleKey];
  const [mode,setMode] = useState("login");
  const [f,setF] = useState({full_name:"",email:"",password:"",confirm:"",department:"",employee_id:"",student_id:"",social_handle:""});
  const [errs,setErrs] = useState({});
  const [toast,setToast] = useState(null);
  const [busy,setBusy] = useState(false);
  const sv = (k,v) => setF(p=>({...p,[k]:v}));
  const showT = (msg,type="success") => {setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const login = async () => {
    const e={};if(!f.email)e.email="Required";if(!f.password)e.password="Required";setErrs(e);if(Object.keys(e).length)return;
    setBusy(true);
    const {data,error} = await supabase.auth.signInWithPassword({email:f.email,password:f.password});
    if(error||!data.user){setBusy(false);showT("Invalid credentials. Please try again.","error");return;}
    const {data:profile} = await supabase.from("profiles").select("*").eq("id",data.user.id).single();
    setBusy(false);
    if(!profile){showT("Account not found. Please register.","error");return;}
    if(profile.role!==roleKey){showT(`This account is registered as ${ROLES[profile.role]?.label||profile.role}, not ${cfg.label}.`,"error");return;}
    onAuth({...profile,email:data.user.email});
  };

  const register = async () => {
    const e={};if(!f.full_name)e.full_name="Required";if(!f.email)e.email="Required";else if(!f.email.includes("@"))e.email="Invalid email";if(!f.password||f.password.length<6)e.password="Min 6 characters";if(f.password!==f.confirm)e.confirm="Passwords don't match";if(roleKey!=="principal"&&!f.department)e.department="Required";setErrs(e);if(Object.keys(e).length)return;
    setBusy(true);
    const {data,error} = await supabase.auth.signUp({email:f.email,password:f.password});
    if(error){setBusy(false);showT(error.message||"Registration failed.","error");return;}
    const profileData = {id:data.user.id,full_name:f.full_name,email:f.email,role:roleKey,department:f.department,employee_id:f.employee_id||null,student_id:f.student_id||null,social_handle:f.social_handle||null};
    await supabase.from("profiles").upsert(profileData);
    setBusy(false);
    showT("Account created! You can now sign in.","success");
    setMode("login");
    setF(p=>({...p,password:"",confirm:""}));
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:"'Inter',sans-serif",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      {/* College background with blur */}
      <div style={{position:"absolute",inset:0,backgroundImage:`url(${COLLEGE_BG})`,backgroundSize:"cover",backgroundPosition:"center",filter:"blur(3px) brightness(0.22)",transform:"scale(1.05)",zIndex:0}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(6,13,27,.90) 0%,rgba(6,13,27,.70) 100%)",zIndex:1}}/>
      <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <CollegeBanner/>
        <div style={{flex:1,display:"flex"}}>
          {/* Left panel */}
          <div className="nomob card" style={{width:370,background:`linear-gradient(160deg,${cfg.g1},${cfg.g2})`,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"34px 30px",position:"relative",overflow:"hidden",flexShrink:0,borderRight:"1px solid rgba(200,146,42,.12)"}}>
            <div style={{position:"absolute",top:-70,right:-70,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,.04)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",bottom:-50,left:-50,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,.03)",pointerEvents:"none"}}/>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,.10)",border:"1px solid rgba(255,255,255,.14)",borderRadius:9,padding:"7px 14px",color:"#fff",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6,fontFamily:"'Inter',sans-serif",marginBottom:36}}>
                <Ic name="arrowleft" size={13} color="#fff"/>Back
              </button>
              <div style={{width:82,height:82,borderRadius:18,background:"rgba(255,255,255,.14)",border:"2px solid rgba(255,255,255,.22)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,overflow:"hidden",padding:6,boxShadow:"0 8px 28px rgba(0,0,0,.35)"}}>
                <img src={GSSS_LOGO} alt="GSSS Logo" style={{width:70,height:70,objectFit:"contain"}}/>
              </div>
              <h2 style={{margin:0,fontSize:23,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1.2}}>{cfg.label}</h2>
              <p style={{margin:"8px 0 26px",color:"rgba(255,255,255,.60)",fontSize:13}}>{cfg.tagline}</p>
              <div style={{background:"rgba(0,0,0,.22)",borderRadius:12,padding:"15px 18px",border:"1px solid rgba(255,255,255,.09)"}}>
                <div style={{fontSize:10,fontWeight:700,color:BRAND.goldL,letterSpacing:1.4,marginBottom:9,textTransform:"uppercase"}}>GSSS IET for Women</div>
                <div style={{fontSize:12.5,color:"rgba(255,255,255,.70)",lineHeight:1.7}}>Affiliated to VTU, Belagavi<br/>NBA & NAAC Accredited<br/>Mysuru, Karnataka</div>
              </div>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.28)",marginTop:20}}>© GSSS IET for Women Event Portal</div>
          </div>
          {/* Right panel */}
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"36px 24px",overflowY:"auto",background:"rgba(8,16,32,.70)",backdropFilter:"blur(4px)"}}>
            <div style={{width:"100%",maxWidth:430}}>
              <button onClick={onBack} className="mobonly" style={{background:"none",border:"none",cursor:"pointer",color:BRAND.gold,fontSize:14,display:"flex",alignItems:"center",gap:6,marginBottom:18,fontFamily:"'Inter',sans-serif"}}>
                <Ic name="arrowleft" size={14} color={BRAND.gold}/>Back to roles
              </button>
              {toast&&<div style={{background:toast.type==="success"?"rgba(16,185,129,.1)":"rgba(239,68,68,.1)",border:`1px solid ${toast.type==="success"?"rgba(16,185,129,.28)":"rgba(239,68,68,.28)"}`,borderRadius:10,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:9,fontSize:13,color:toast.type==="success"?T.green:T.red}}>
                <Ic name={toast.type==="success"?"check":"alert"} size={14} color={toast.type==="success"?T.green:T.red}/>{toast.msg}
              </div>}
              <div style={{display:"flex",background:"rgba(255,255,255,.05)",borderRadius:11,padding:3,marginBottom:26,border:`1px solid ${T.border}`}}>
                {["login","register"].map(m=>(
                  <button key={m} onClick={()=>{setMode(m);setErrs({});}} style={{flex:1,padding:"9px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"'Inter',sans-serif",background:mode===m?T.card:"transparent",color:mode===m?T.text:T.dim,boxShadow:mode===m?"0 2px 8px rgba(0,0,0,.25)":"none",transition:"all .18s"}}>
                    {m==="login"?"Sign In":"Create Account"}
                  </button>
                ))}
              </div>
              <h3 style={{margin:"0 0 4px",fontSize:21,fontWeight:800,color:T.text,fontFamily:"'Playfair Display',Georgia,serif"}}>{mode==="login"?"Welcome back":"Join as "+cfg.label}</h3>
              <p style={{margin:"0 0 24px",fontSize:13,color:T.sub}}>{mode==="login"?"Enter your credentials to access the portal.":"Fill in your details to get started."}</p>
              {mode==="register"&&<Inp label="Full Name *" value={f.full_name} onChange={e=>sv("full_name",e.target.value)} placeholder="e.g. Priya Sharma" error={errs.full_name}/>}
              <Inp label="Email *" type="email" value={f.email} onChange={e=>sv("email",e.target.value)} placeholder="you@college.edu" error={errs.email}/>
              <PwdInp label="Password *" value={f.password} onChange={e=>sv("password",e.target.value)} error={errs.password}/>
              {mode==="register"&&<>
                <PwdInp label="Confirm Password *" value={f.confirm} onChange={e=>sv("confirm",e.target.value)} error={errs.confirm} placeholder="Re-enter password"/>
                {roleKey!=="principal"&&<Sel label="Department *" value={f.department} onChange={e=>sv("department",e.target.value)} options={DEPTS}/>}
                {errs.department&&<p style={{margin:"-10px 0 12px",fontSize:11,color:T.red}}>{errs.department}</p>}
                {(roleKey==="admin"||roleKey==="staff")&&<Inp label="Employee ID" value={f.employee_id} onChange={e=>sv("employee_id",e.target.value)} placeholder="EMP001"/>}
                {roleKey==="organiser"&&<Inp label="Student ID" value={f.student_id} onChange={e=>sv("student_id",e.target.value)} placeholder="CS2024001"/>}
                {roleKey==="social_media_admin"&&<Inp label="Social Handle" value={f.social_handle} onChange={e=>sv("social_handle",e.target.value)} placeholder="@yourhandle"/>}
              </>}
              <button onClick={mode==="login"?login:register} disabled={busy} className="hl"
                style={{width:"100%",padding:"13px",background:`linear-gradient(135deg,${BRAND.navyD},${BRAND.navyL} 45%,${BRAND.gold})`,color:"#fff",border:"none",borderRadius:11,fontSize:14,fontWeight:700,cursor:busy?"not-allowed":"pointer",fontFamily:"'Inter',sans-serif",opacity:busy?.72:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4,boxShadow:`0 6px 22px rgba(0,0,0,.5),0 0 0 1px rgba(200,146,42,.18)`}}>
                {busy?<Spinner/>:mode==="login"?<><Ic name="arrowright" size={15} color="#fff"/>Sign In</>:<><Ic name="check" size={15} color="#fff"/>Create Account</>}
              </button>
              <p style={{textAlign:"center",marginTop:17,fontSize:13,color:T.dim}}>
                {mode==="login"?"Don't have an account? ":"Already registered? "}
                <button onClick={()=>{setMode(mode==="login"?"register":"login");setErrs({});}} style={{background:"none",border:"none",cursor:"pointer",color:BRAND.gold,fontWeight:700,fontSize:13,fontFamily:"'Inter',sans-serif"}}>
                  {mode==="login"?"Create one":"Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MAIN APP SHELL
// ════════════════════════════════════════════════════════════════════
export default function EventPortal() {
  const [screen,setScreen] = useState("role");
  const [roleKey,setRoleKey] = useState(null);
  const [user,setUser] = useState(null);
  const [tab,setTab] = useState("dashboard");
  const [events,setEvents] = useState([]);
  const [notifs,setNotifs] = useState([]);
  const [auditMap,setAuditMap] = useState({});
  const [allUsers,setAllUsers] = useState([]);
  const [loading,setLoading] = useState(false);
  const [modal,setModal] = useState(null);
  const [viewEv,setViewEv] = useState(null);
  const [rreason,setRR] = useState("");
  const [rcomment,setRC] = useState("");
  const [toasts,setToasts] = useState([]);
  const [sideOpen,setSide] = useState(false);
  const [isMob,setMob] = useState(window.innerWidth<768);
  const [tmpl,setTmpl] = useState(null);
  const [srch,setSrch] = useState("");
  const [stFil,setStFil] = useState("all");
  const SW = 248;

  useEffect(()=>{const h=()=>setMob(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  useEffect(()=>{if(!sideOpen)return;const h=e=>{if(!e.target.closest("[data-sb]")&&!e.target.closest("[data-hb]"))setSide(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[sideOpen]);

  const toast = useCallback((title,msg,type="success")=>{const id=genId();setToasts(t=>[...t,{id,title,msg,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);},[]);

  // ── Data loading ──────────────────────────────────────────────────
  const loadEvents = useCallback(async () => {
    if(!user) return;
    setLoading(true);
    let q = supabase.from("events").select("*, profiles(full_name,email,department)").order("created_at",{ascending:false});
    const {data,error} = await q;
    if(!error) setEvents(data||[]);
    setLoading(false);
  },[user]);

  const loadNotifs = useCallback(async () => {
    if(!user) return;
    const {data} = await supabase.from("notifications").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(30);
    setNotifs(data||[]);
  },[user]);

  const loadAudit = useCallback(async (evId) => {
    const {data} = await supabase.from("event_audit_log").select("*").eq("event_id",evId).order("created_at",{ascending:false});
    setAuditMap(m=>({...m,[evId]:data||[]}));
  },[]);

  const loadAllUsers = useCallback(async () => {
    const {data} = await supabase.from("profiles").select("id,full_name,email,role");
    setAllUsers(data||[]);
  },[]);

  // ── Event reminders — check once on load ──────────────────────────
  const checkReminders = useCallback(async (evList, uList) => {
    if(!user||user.role!=="organiser") return;
    const now = new Date();
    const todayStr = now.toDateString();
    const tomorrowStr = new Date(now.getTime()+864e5).toDateString();
    const myEvs = evList.filter(e=>e.organiser_id===user.id&&["approved","awaiting_media"].includes(e.status));
    for(const ev of myEvs){
      const start = new Date(ev.start_date||ev.start);
      const startStr = start.toDateString();
      const isToday = startStr===todayStr;
      const isTomorrow = startStr===tomorrowStr;
      if(!isToday&&!isTomorrow) continue;
      const daysAway = isToday?0:1;
      const key = `reminded_${ev.id}_${daysAway}`;
      if(sessionStorage.getItem(key)) continue;
      sessionStorage.setItem(key,"1");
      // In-app notification
      await pushN(user.id,ev.id,"reminder",
        isToday?"🌟 Your event is TODAY!":"📅 Event Tomorrow!",
        `"${ev.title}" — Remember to capture photos & videos!`);
      // Email reminder
      const orgUser = uList.find(u=>u.id===user.id)||user;
      const tpl = emailTemplates.eventReminder(ev.title,orgUser.full_name,daysAway,
        `${fmtDate(ev.start_date||ev.start)} ${fmtTime(ev.start_date||ev.start)}`,ev.venue||"");
      await sendEmail(orgUser.email,tpl.subject,tpl.html);
    }
  },[user]);

  useEffect(()=>{if(user){loadEvents();loadNotifs();loadAllUsers();}}, [user]);

  // ── Real-time subscriptions ────────────────────────────────────────
  useEffect(()=>{
    if(!user) return;
    const evSub = supabase.channel("events").on("postgres_changes",{event:"*",schema:"public",table:"events"},()=>loadEvents()).subscribe();
    const nfSub = supabase.channel("notifs").on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:`user_id=eq.${user.id}`},()=>loadNotifs()).subscribe();
    // Check reminders once subscriptions are live
    loadAllUsers().then(()=>{
      supabase.from("events").select("*,profiles(full_name)").then(({data})=>{
        if(data&&allUsers.length>0) checkReminders(data,allUsers);
      });
    });
    return ()=>{supabase.removeChannel(evSub);supabase.removeChannel(nfSub);};
  },[user]);

  // ── Helpers ────────────────────────────────────────────────────────
  const pushN = async (userId, eventId, type, title, msg) => {
    await supabase.from("notifications").insert({user_id:userId,event_id:eventId,type,title,message:msg,is_read:false});
  };

  const addAudit = async (eventId, action, note) => {
    await supabase.from("event_audit_log").insert({event_id:eventId,user_id:user.id,action,note});
  };

  // ── Actions ────────────────────────────────────────────────────────
  const submitEv = async (f) => {
    const payload = {...f,organiser_id:user.id,status:"pending",department:f.department,college:f.college||"GSSS IET for Women"};
    const {data:ev,error} = await supabase.from("events").insert(payload).select().single();
    if(error){toast("Error","Could not submit event.","error");return;}
    await addAudit(ev.id,"submitted","Event proposal submitted.");
    const admins = allUsers.filter(u=>u.role==="admin");
    for(const a of admins){
      await pushN(a.id,ev.id,"submitted","New Event Submission",`${ev.title} by ${user.full_name}`);
      const tpl = emailTemplates.newSubmission(ev.title,a.full_name,user.full_name,ev.department);
      await sendEmail(a.email,tpl.subject,tpl.html);
    }
    setModal(null);
    toast("🎉 Proposal Submitted!","Admin will review it soon.","success");
    loadEvents();
  };

  const approveEv = async (ev) => {
    const dl = new Date(Date.parse(ev.start_date||ev.start)+864e5).toISOString();
    const {error} = await supabase.from("events").update({status:"approved",approved_at:new Date().toISOString(),media_deadline:dl}).eq("id",ev.id);
    if(error){toast("Error","Could not approve event.","error");return;}
    await addAudit(ev.id,"approved","Approved by Admin.");
    const organiser = allUsers.find(u=>u.id===ev.organiser_id);
    if(organiser){
      await pushN(organiser.id,ev.id,"approved","Event Approved! 🎉",`Your event "${ev.title}" has been approved.`);
      const tpl = emailTemplates.approved(ev.title,organiser.full_name);
      await sendEmail(organiser.email,tpl.subject,tpl.html);
    }
    toast("✅ Approved!",`${ev.title} approved.`,"success");
    loadEvents();
  };

  const rejectEv = async (ev) => {
    if(!rreason.trim()) return;
    const {error} = await supabase.from("events").update({status:"rejected",rejection_reason:rreason,rejection_comment:rcomment}).eq("id",ev.id);
    if(error){toast("Error","Could not reject event.","error");return;}
    await addAudit(ev.id,"rejected",`Rejected: ${rreason}`);
    const organiser = allUsers.find(u=>u.id===ev.organiser_id);
    if(organiser){
      await pushN(organiser.id,ev.id,"rejected","Event Rejected",`"${ev.title}": ${rreason}`);
      const tpl = emailTemplates.rejected(ev.title,organiser.full_name,rreason,rcomment);
      await sendEmail(organiser.email,tpl.subject,tpl.html);
    }
    setModal(null);setRR("");setRC("");
    toast("Event Rejected",`${ev.title} rejected.`,"error");
    loadEvents();
  };

  const uploadMedia = async (ev, files) => {
    const {error} = await supabase.from("events").update({status:"media_uploaded"}).eq("id",ev.id);
    if(error){toast("Error","Could not update status.","error");return;}
    await addAudit(ev.id,"media_uploaded",`${files.length} media file(s) uploaded.`);
    const route = ev.media_route||ev.route||"both";
    const targets = allUsers.filter(u=>(route==="both"&&(u.role==="admin"||u.role==="social_media_admin"))||(route==="admin"&&u.role==="admin")||(route==="social_media_admin"&&u.role==="social_media_admin"));
    for(const t of targets){
      await pushN(t.id,ev.id,"media","Media Uploaded 📸",`Media for "${ev.title}" is ready.`);
      const tpl = emailTemplates.mediaUploaded(ev.title,t.full_name);
      await sendEmail(t.email,tpl.subject,tpl.html);
    }
    setModal(null);
    toast("📸 Media Uploaded!",`${files.length} file(s) for ${ev.title}.`,"success");
    loadEvents();
  };

  const markPosted = async (ev, plats, postDesc, postLinks, sendWhatsApp) => {
    const {error} = await supabase.from("events").update({
      status:"media_posted",
      social_platforms:plats,
      post_description:postDesc||null,
      post_links:postLinks||null
    }).eq("id",ev.id);
    if(error){toast("Error","Could not update status.","error");return;}
    await addAudit(ev.id,"media_posted",`Posted to: ${plats.join(", ")}. Links shared.`);
    // Notify admin
    const admins = allUsers.filter(u=>u.role==="admin");
    for(const a of admins) await pushN(a.id,ev.id,"posted","📣 Media Posted!",`${ev.title} is now live on ${plats.join(", ")}.`);
    // Notify all staff & employees
    const staff = allUsers.filter(u=>["staff","principal","organiser"].includes(u.role));
    for(const s of staff){
      await pushN(s.id,ev.id,"social_share","📣 Event on Social Media!",`${ev.title} has been posted. ${postDesc||""}`);
      const tpl = emailTemplates.socialPostShared(ev.title,postDesc,postLinks,s.full_name);
      await sendEmail(s.email,tpl.subject,tpl.html);
    }
    // WhatsApp channel share (opens wa.me link in new tab if enabled)
    if(sendWhatsApp){
      const waMsg=encodeURIComponent(`📣 *${ev.title}* has been posted on our social media!\n${postDesc?`\n${postDesc}\n`:""}\n${(postLinks||[]).filter(l=>l.url).map(l=>`🔗 ${l.platform}: ${l.url}`).join("\n")}\n\n— GSSS IET for Women`);
      window.open(`https://wa.me/?text=${waMsg}`,"_blank");
    }
    setModal(null);
    toast("🚀 Posted!",`${ev.title} on ${plats.join(", ")}. Staff notified.`,"success");
    loadEvents();
  };

  const markWebsite = async (ev) => {
    const {error} = await supabase.from("events").update({status:"completed"}).eq("id",ev.id);
    if(error){toast("Error","Could not update status.","error");return;}
    await addAudit(ev.id,"website_updated","Website updated. Event marked complete.");
    const organiser = allUsers.find(u=>u.id===ev.organiser_id);
    if(organiser) await pushN(organiser.id,ev.id,"completed","Event Complete! 🎊",`"${ev.title}" is fully complete.`);
    toast("🎊 Complete!",`${ev.title} is fully complete.`,"success");
    loadEvents();
  };

  const onAction = (action,ev) => {
    if(action==="approve") approveEv(ev);
    else if(action==="reject") setModal({type:"reject",ev});
    else if(action==="upload_media") setModal({type:"media",ev});
    else if(action==="mark_posted") setModal({type:"posted",ev});
    else if(action==="mark_website") markWebsite(ev);
    else if(action==="use_template"){setTmpl(ev);setModal({type:"submit"});}
  };

  const cfg = user ? ROLES[user.role] : ROLES.admin;

  const NAV = {
    admin:             [{id:"dashboard",label:"Dashboard",icon:"home"},{id:"events",label:"Event Approvals",icon:"calendar"},{id:"reports",label:"Reports",icon:"chart"},{id:"users",label:"User Management",icon:"users"},{id:"profile",label:"Profile",icon:"user"}],
    organiser:         [{id:"dashboard",label:"Dashboard",icon:"home"},{id:"events",label:"My Events",icon:"calendar"},{id:"reports",label:"Reports",icon:"chart"},{id:"profile",label:"Profile",icon:"user"}],
    social_media_admin:[{id:"dashboard",label:"Dashboard",icon:"home"},{id:"events",label:"Media Queue",icon:"image"},{id:"reports",label:"Reports",icon:"chart"},{id:"profile",label:"Profile",icon:"user"}],
    staff:             [{id:"dashboard",label:"Dashboard",icon:"home"},{id:"announcements",label:"Announcements",icon:"announce"},{id:"reports",label:"Reports",icon:"chart"},{id:"profile",label:"Profile",icon:"user"}],
    principal:         [{id:"dashboard",label:"Dashboard",icon:"home"},{id:"events",label:"All Events",icon:"calendar"},{id:"reports",label:"Reports",icon:"chart"},{id:"calendar",label:"Calendar",icon:"calendar"},{id:"profile",label:"Profile",icon:"user"}],
  };
  const nav = user ? (NAV[user.role]||[]) : [];

  const visEvs = events.filter(e=>{
    let ok = true;
    if(user?.role==="organiser") ok = e.organiser_id===user.id;
    if(user?.role==="social_media_admin") ok = ["media_uploaded","media_posted"].includes(e.status);
    if(user?.role==="staff") ok = ["approved","awaiting_media","media_uploaded","media_posted","completed"].includes(e.status);
    if(srch){const q=srch.toLowerCase();if(!e.title?.toLowerCase().includes(q)&&!(e.department||"").toLowerCase().includes(q)&&!(e.venue||"").toLowerCase().includes(q))return false;}
    if(stFil!=="all"&&e.status!==stFil) return false;
    return ok;
  });

  const st = {
    total:events.length,
    pending:events.filter(e=>e.status==="pending").length,
    approved:events.filter(e=>["approved","awaiting_media","media_uploaded","media_posted","completed"].includes(e.status)).length,
    rejected:events.filter(e=>e.status==="rejected").length,
    completed:events.filter(e=>e.status==="completed").length,
    today:events.filter(e=>new Date(e.start_date||e.start).toDateString()===new Date().toDateString()).length,
    upcoming:events.filter(e=>new Date(e.start_date||e.start)>new Date()&&e.status==="approved").length,
    mine:user?events.filter(e=>e.organiser_id===user.id).length:0,
  };

  // ── Page renderer ──────────────────────────────────────────────────
  const renderPage = () => {
    if(!user) return null;
    const isAdmin=user.role==="admin",isOrg=user.role==="organiser",isSoc=user.role==="social_media_admin",isStaff=user.role==="staff",isPrinc=user.role==="principal";

    if(tab==="dashboard") return (
      <div style={{animation:"fadeUp .3s ease"}}>
        {/* Hero banner */}
        <div className="card" style={{background:`linear-gradient(135deg,${BRAND.navyD},${BRAND.navy} 50%,${BRAND.goldD})`,borderRadius:18,padding:"22px 26px",marginBottom:22,position:"relative",overflow:"hidden",border:`1px solid ${BRAND.navy}30`}}>
          <div style={{position:"absolute",right:-10,top:-10,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
          <div style={{position:"absolute",right:30,bottom:-20,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif"}}>Welcome, {user.full_name.split(" ")[0]}! 👋</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.65)",marginTop:3}}>{cfg.tagline} · GSSS IET for Women</div>
            {st.pending>0&&isAdmin&&<div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.14)",borderRadius:9,padding:"5px 14px",fontSize:12,fontWeight:700,color:"#fff"}}><span style={{width:7,height:7,borderRadius:"50%",background:T.yellow,animation:"pulse 2s infinite"}}/>{st.pending} event{st.pending!==1?"s":""} awaiting review</div>}
          </div>
        </div>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:22}}>
          {isAdmin&&<><StatCard label="Pending" value={st.pending} icon="clock" accent={T.yellow} loading={loading}/><StatCard label="Approved" value={st.approved} icon="check" accent={T.green} loading={loading}/><StatCard label="Rejected" value={st.rejected} icon="x" accent={T.red} loading={loading}/><StatCard label="Completed" value={st.completed} icon="shield" accent={BRAND.navy} loading={loading}/><StatCard label="Today" value={st.today} icon="zap" accent={BRAND.gold} loading={loading}/></>}
          {isOrg&&<><StatCard label="My Events" value={st.mine} icon="calendar" accent={BRAND.gold} loading={loading}/><StatCard label="Approved" value={events.filter(e=>e.organiser_id===user.id&&["approved","awaiting_media","media_uploaded","completed"].includes(e.status)).length} icon="check" accent={T.green} loading={loading}/><StatCard label="Pending" value={events.filter(e=>e.organiser_id===user.id&&e.status==="pending").length} icon="clock" accent={T.yellow} loading={loading}/></>}
          {isSoc&&<><StatCard label="Media Queue" value={events.filter(e=>e.status==="media_uploaded").length} icon="image" accent={BRAND.gold} loading={loading}/><StatCard label="Posted" value={events.filter(e=>["media_posted","completed"].includes(e.status)).length} icon="send" accent={T.green} loading={loading}/></>}
          {isStaff&&<><StatCard label="Upcoming" value={st.upcoming} icon="calendar" accent={BRAND.gold} loading={loading}/><StatCard label="Approved" value={st.approved} icon="check" accent={T.green} loading={loading}/></>}
          {isPrinc&&<><StatCard label="Total" value={st.total} icon="calendar" accent={BRAND.gold} loading={loading}/><StatCard label="Approved" value={st.approved} icon="check" accent={T.green} loading={loading}/><StatCard label="Pending" value={st.pending} icon="clock" accent={T.yellow} loading={loading}/><StatCard label="Upcoming" value={st.upcoming} icon="trending" accent={BRAND.navy} loading={loading}/></>}
        </div>
        {/* Principal Netflix-style carousels with search */}
        {isPrinc&&!loading&&<PrincipalDashboard events={events} onView={ev=>{setViewEv(ev);loadAudit(ev.id);}}/>}
        {isAdmin&&st.pending>0&&(
          <div className="card" style={{background:T.card,borderRadius:15,border:`1px solid ${T.border}`,padding:18,marginBottom:22}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:12,display:"flex",gap:7,alignItems:"center"}}><Ic name="zap" size={14} color={BRAND.gold}/>Quick Actions</div>
            <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
              <Btn v="outline" sm onClick={()=>{setTab("events");setStFil("pending");}}><Ic name="clock" size={12}/>Pending ({st.pending})</Btn>
              <Btn v="outline" sm onClick={()=>{setTab("events");setStFil("all");}}><Ic name="calendar" size={12}/>All Events</Btn>
              <Btn v="outline" sm onClick={()=>{setTab("events");setStFil("all");setSrch(new Date().toDateString());}}><Ic name="zap" size={12}/>Today ({st.today})</Btn>
            </div>
          </div>
        )}
        {isOrg&&<Btn v="coral" onClick={()=>{setTmpl(null);setModal({type:"submit"});}} sx={{marginBottom:20}}><Ic name="plus" size={15}/>Submit New Event Proposal</Btn>}
        {!isPrinc&&<div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12,display:"flex",gap:7,alignItems:"center"}}>
          <Ic name="calendar" size={15} color={BRAND.gold}/>
          {isAdmin?"Recent Submissions":isOrg?"My Events":isSoc?"Media Queue":"Campus Events"}
        </div>}
        {!isPrinc&&(loading
          ?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>{[1,2,3].map(i=><div key={i} className="skel" style={{height:200,borderRadius:16}}/>)}</div>
          :visEvs.length===0
            ?<div className="card" style={{background:T.card,borderRadius:15,border:`1px solid ${T.border}`,padding:"40px 18px",textAlign:"center"}}><div style={{fontSize:34,marginBottom:10}}>📭</div><div style={{fontSize:14,fontWeight:700,color:T.sub}}>No events yet</div><div style={{fontSize:12,color:T.dim,marginTop:3}}>{isOrg?"Click above to submit your first event.":"Events will appear here."}</div></div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>{visEvs.slice(0,4).map(e=><EventCard key={e.id} ev={e} user={user} onAction={onAction} onView={ev=>{setViewEv(ev);loadAudit(ev.id);}}/>)}</div>)}
      </div>
    );

    if(tab==="events"){
      const pending = visEvs.filter(e=>e.status==="pending");
      return (
        <div style={{animation:"fadeUp .3s ease"}}>
          <div style={{display:"flex",gap:11,marginBottom:18,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div style={{flex:1,minWidth:190,position:"relative"}}>
              <div style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic name="search" size={14} color={T.dim}/></div>
              <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Search by title, department, venue..."
                style={{width:"100%",padding:"10px 13px 10px 34px",border:`1.5px solid ${T.border}`,borderRadius:10,fontSize:13,background:"rgba(255,255,255,.04)",color:T.text,fontFamily:"'Inter',sans-serif",outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor=BRAND.gold} onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {["all","pending","approved","rejected","awaiting_media","media_uploaded","completed"].map(s=>(
                <button key={s} onClick={()=>setStFil(s)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${stFil===s?BRAND.gold:T.border}`,background:stFil===s?`${BRAND.gold}14`:"transparent",color:stFil===s?BRAND.gold:T.sub,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'Inter',sans-serif",transition:"all .14s"}}>
                  {s==="all"?"All":STATUS_META[s]?.label||s}
                </button>
              ))}
            </div>
            {isOrg&&<Btn v="coral" sm onClick={()=>{setTmpl(null);setModal({type:"submit"});}}><Ic name="plus" size={13}/>New Event</Btn>}
          </div>
          {isAdmin&&pending.length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:12}}><div style={{width:7,height:7,borderRadius:"50%",background:T.yellow,animation:"pulse 2s infinite"}}/><span style={{fontSize:13,fontWeight:700,color:T.yellow}}>Pending Review — {pending.length}</span></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:13}}>{pending.map(e=><EventCard key={e.id} ev={e} user={user} onAction={onAction} onView={ev=>{setViewEv(ev);loadAudit(ev.id);}}/>)}</div>
            </div>
          )}
          {visEvs.filter(e=>isAdmin?e.status!=="pending":true).length===0&&(!isAdmin||!pending.length)
            ?<div className="card" style={{background:T.card,borderRadius:15,border:`1px solid ${T.border}`,padding:"40px 18px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:9}}>📭</div><div style={{fontSize:14,fontWeight:700,color:T.sub}}>No events found</div><div style={{fontSize:12,color:T.dim,marginTop:3}}>Try adjusting search or filters.</div></div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:13}}>{visEvs.filter(e=>isAdmin?e.status!=="pending":true).map(e=><EventCard key={e.id} ev={e} user={user} onAction={onAction} onView={ev=>{setViewEv(ev);loadAudit(ev.id);}}/>)}</div>}
        </div>
      );
    }

    if(tab==="reports") return <Reports events={events} userRole={user.role}/>;
    if(tab==="users") return <UserMgmt meId={user.id} onRefresh={loadAllUsers}/>;
    if(tab==="profile") return <ProfilePage user={user} onUpdate={setUser} events={events}/>;
    if(tab==="calendar") return <CalView events={events}/>;
    if(tab==="announcements") return <Announcements events={events}/>;
    return null;
  };

  // ── Screen routing ──────────────────────────────────────────────
  if(screen==="role") return <RoleSelect onSelect={k=>{setRoleKey(k);setScreen("login");}}/>;
  if(screen==="login") return <LoginScreen roleKey={roleKey} onAuth={u=>{setUser(u);setTab("dashboard");setScreen("app");}} onBack={()=>setScreen("role")}/>;

  const isOrg = user?.role==="organiser";

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',sans-serif"}}>
      <style>{CSS+`
        @media(max-width:768px){[data-sb]{transform:${sideOpen?"translateX(0)":"translateX(-100%)"};transition:transform .25s ease;}}
        @media(min-width:769px){[data-sb]{transform:none!important}[data-ov]{display:none!important}}
        [data-ov]{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:98;display:${sideOpen?"block":"none"}}
      `}</style>
      <Toast list={toasts}/>
      <div data-ov onClick={()=>setSide(false)}/>

      {/* ── Sidebar ── */}
      <div data-sb style={{position:"fixed",left:0,top:0,bottom:0,width:SW,background:`rgba(6,13,27,.98)`,zIndex:99,display:"flex",flexDirection:"column",borderRight:`1px solid rgba(200,146,42,.10)`,backdropFilter:"blur(20px)"}}>
        {/* College branding in sidebar */}
        <div style={{padding:"13px 14px 11px",borderBottom:`1px solid rgba(200,146,42,.12)`,background:`linear-gradient(160deg,${BRAND.navyD},${BRAND.navy})`}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:"rgba(255,255,255,.10)",border:"1px solid rgba(255,255,255,.16)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden",padding:2}}>
              <img src={GSSS_LOGO} alt="GSSS" style={{width:32,height:32,objectFit:"contain"}}/>
            </div>
            <div>
              <div style={{fontSize:9.5,fontWeight:800,color:T.text,lineHeight:1.3,fontFamily:"'Playfair Display',Georgia,serif"}}>GSSS IET for Women</div>
              <div style={{fontSize:8,color:T.dim,letterSpacing:.7,marginTop:1,fontWeight:600,textTransform:"uppercase"}}>Event Portal</div>
            </div>
          </div>
          <div style={{background:`linear-gradient(135deg,${cfg.g1},${cfg.g2})`,borderRadius:7,padding:"5px 10px",display:"inline-flex",alignItems:"center",gap:6,boxShadow:`0 2px 8px ${cfg.accent}20`}}>
            <Ic name={cfg.icon} size={11} color="#fff"/><span style={{fontSize:10,fontWeight:700,color:"#fff",fontFamily:"'Inter',sans-serif"}}>{cfg.label}</span>
          </div>
        </div>
        <nav style={{flex:1,padding:"8px",overflowY:"auto"}}>
          {nav.map(n=>(
            <button key={n.id} className="navbtn" onClick={()=>{setTab(n.id);setSide(false);}}
              style={{width:"100%",padding:"10px 12px",borderRadius:9,border:"none",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:9,marginBottom:2,fontSize:13,fontWeight:tab===n.id?700:500,background:tab===n.id?`${BRAND.gold}15`:"transparent",color:tab===n.id?T.text:T.sub,fontFamily:"'Inter',sans-serif",borderLeft:`3px solid ${tab===n.id?BRAND.gold:"transparent"}`,transition:"all .14s"}}>
              <Ic name={n.icon} size={15} color={tab===n.id?BRAND.gold:T.dim}/>{n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"11px 13px 16px",borderTop:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
            <div style={{width:34,height:34,background:`linear-gradient(135deg,${BRAND.navy},${BRAND.gold})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14,flexShrink:0}}>{user?.full_name?.[0]||"?"}</div>
            <div style={{flex:1,overflow:"hidden"}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.full_name}</div>
              <div style={{fontSize:10,color:T.dim,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.email}</div>
            </div>
          </div>
          <button onClick={async()=>{await supabase.auth.signOut();setUser(null);setScreen("role");setTab("dashboard");setEvents([]);setNotifs([]);}}
            style={{width:"100%",padding:"8px",background:"rgba(255,255,255,.04)",border:`1px solid ${T.border}`,borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,color:T.dim,fontSize:12,fontFamily:"'Inter',sans-serif",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,.1)";e.currentTarget.style.color="#fca5a5";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color=T.dim;}}>
            <Ic name="logout" size={13} color="currentColor"/>Sign Out
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mobfull" style={{marginLeft:isMob?0:SW,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {/* College header — same banner as auth pages */}
        <CollegeBanner/>
        {/* Top nav */}
        <div className="card" style={{position:"sticky",top:0,background:`rgba(6,13,27,.96)`,borderBottom:`1px solid rgba(200,146,42,.10)`,padding:"0 22px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:50}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button data-hb className="mobonly" onClick={()=>setSide(s=>!s)} style={{background:"rgba(255,255,255,.05)",border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 7px",cursor:"pointer",color:T.sub,display:"flex",alignItems:"center"}}>
              <Ic name="menu" size={17} color={T.sub}/>
            </button>
            <h2 style={{margin:0,fontSize:15,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',Georgia,serif"}}>{nav.find(n=>n.id===tab)?.label||"Dashboard"}</h2>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {isOrg&&<Btn v="coral" sm onClick={()=>{setTmpl(null);setModal({type:"submit"});}} sx={{display:"flex"}} className="nomob"><Ic name="plus" size={13}/>Submit Event</Btn>}
            <NotifPanel notifs={notifs} onRead={async()=>{await supabase.from("notifications").update({is_read:true}).eq("user_id",user.id);loadNotifs();}}/>
          </div>
        </div>
        <div className="mobpad" style={{padding:"24px",flex:1}}>{renderPage()}</div>
      </div>

      {/* ── Modals ── */}
      <Modal open={modal?.type==="submit"} onClose={()=>{setModal(null);setTmpl(null);}} title={tmpl?"Use as Template — New Event":"Submit Event Proposal"} width={680}>
        <SubmitForm user={user} onSubmit={submitEv} onCancel={()=>{setModal(null);setTmpl(null);}} tmpl={tmpl} events={events}/>
      </Modal>

      <Modal open={modal?.type==="reject"} onClose={()=>{setModal(null);setRR("");setRC("");}} title="Reject Event">
        {modal?.ev&&<div>
          <div style={{background:T.cardH,borderRadius:10,padding:"11px 14px",marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text}}>{modal.ev.title}</div>
            <div style={{fontSize:12,color:T.sub,marginTop:2}}>{modal.ev.department||modal.ev.dept}</div>
          </div>
          <Txta label="Reason for Rejection *" value={rreason} onChange={e=>setRR(e.target.value)} placeholder="Clear reason the organiser can act on..." style={{minHeight:80}}/>
          <Txta label="Comment / Suggestion (optional)" value={rcomment} onChange={e=>setRC(e.target.value)} placeholder='e.g. "Looks good but please change the venue."'/>
          <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
            <Btn v="outline" onClick={()=>{setModal(null);setRR("");setRC("");}}>Cancel</Btn>
            <Btn v="danger" onClick={()=>rejectEv(modal.ev)} disabled={!rreason.trim()}><Ic name="x" size={13}/>Confirm Rejection</Btn>
          </div>
        </div>}
      </Modal>

      <Modal open={modal?.type==="media"} onClose={()=>setModal(null)} title="Upload Event Media">
        {modal?.ev&&<MediaForm ev={modal.ev} onSubmit={files=>uploadMedia(modal.ev,files)} onCancel={()=>setModal(null)}/>}
      </Modal>

      <Modal open={modal?.type==="posted"} onClose={()=>setModal(null)} title="Mark as Posted on Social Media" width={560}>
        {modal?.ev&&<PostedForm ev={modal.ev} onSubmit={(plats,desc,links,wa)=>markPosted(modal.ev,plats,desc,links,wa)} onCancel={()=>setModal(null)}/>}
      </Modal>

      <Modal open={!!viewEv} onClose={()=>setViewEv(null)} title="Event Details" width={600}>
        {viewEv&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,gap:11}}>
            <div><h3 style={{margin:0,fontSize:18,fontWeight:800,color:T.text,fontFamily:"'Playfair Display',Georgia,serif"}}>{viewEv.title}</h3><p style={{margin:"3px 0 0",color:T.sub,fontSize:12}}>{viewEv.department||viewEv.dept} · {viewEv.college||"GSSS IET for Women"}</p></div>
            <Badge status={viewEv.status}/>
          </div>
          <Timeline status={viewEv.status}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 22px",marginTop:14}} className="g1mob">
            {[
              ["📅 Start",`${fmtDate(viewEv.start_date||viewEv.start)} ${fmtTime(viewEv.start_date||viewEv.start)}`],
              ["🏁 End",`${fmtDate(viewEv.end_date||viewEv.end)} ${fmtTime(viewEv.end_date||viewEv.end)}`],
              ["📍 Venue",`${viewEv.venue}${viewEv.room_number?` (${viewEv.room_number})`:""}`],
              ["👥 Attendees",viewEv.expected_attendees||viewEv.attendees||"—"],
              ["📢 Route",(viewEv.media_route||viewEv.route||"N/A").replace(/_/g," ")],
              ["📝 Submitted",fmtDate(viewEv.created_at||viewEv.submitted||new Date())],
              ["👤 Organiser",viewEv.profiles?.full_name||viewEv.organiser_name||"—"],
              viewEv.brochure_name&&["📄 Brochure",viewEv.brochure_name],
            ].filter(Boolean).map(([k,v])=>(
              <div key={k} style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontSize:10,color:T.dim,letterSpacing:.4,fontWeight:600,marginBottom:2}}>{k.toUpperCase()}</div>
                <div style={{fontSize:13,color:T.text,fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>
          {(viewEv.social_platforms||viewEv.platforms||[]).length>0&&<div style={{marginTop:13}}>
            <div style={{fontSize:10,fontWeight:600,color:T.dim,letterSpacing:.4,marginBottom:7}}>POSTED TO</div>
            <div style={{display:"flex",gap:9}}>{(viewEv.social_platforms||viewEv.platforms||[]).map(p=><span key={p} style={{background:"rgba(255,255,255,.05)",border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 9px",fontSize:11,fontWeight:600,color:T.sub,display:"flex",gap:5,alignItems:"center"}}><Ic name={p} size={12}/>{p.charAt(0).toUpperCase()+p.slice(1)}</span>)}</div>
          </div>}
          {viewEv.description&&<div style={{marginTop:14}}><div style={{fontSize:10,fontWeight:600,color:T.dim,letterSpacing:.4,marginBottom:5}}>DESCRIPTION</div><p style={{margin:0,fontSize:13,color:T.sub,lineHeight:1.6}}>{viewEv.description}</p></div>}
          {(viewEv.rejection_reason||viewEv.reason)&&<div style={{background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)",borderRadius:11,padding:"12px 14px",marginTop:14}}>
            <div style={{fontSize:10,fontWeight:700,color:T.red,marginBottom:3}}>REJECTION REASON</div>
            <div style={{fontSize:13,color:"#fca5a5"}}>{viewEv.rejection_reason||viewEv.reason}</div>
            {(viewEv.rejection_comment||viewEv.comment)&&<><div style={{fontSize:10,fontWeight:700,color:T.sub,marginTop:8,marginBottom:3}}>ADMIN COMMENT</div><div style={{fontSize:13,color:T.sub}}>{viewEv.rejection_comment||viewEv.comment}</div></>}
          </div>}
          <div style={{marginTop:18}}>
            <div style={{fontSize:10,fontWeight:700,color:T.dim,letterSpacing:.4,marginBottom:11}}>ACTIVITY LOG</div>
            <AuditLog logs={auditMap[viewEv.id]} users={allUsers}/>
          </div>
        </div>}
      </Modal>
    </div>
  );
}
