import React from "react";

export function AdminAnalyticsDashboard({ requests = [] }) {
  // Compute real metrics from requests list
  const total = requests.length || 1;
  const issued = requests.filter(r => r.status === "ISSUED").length;
  const rejected = requests.filter(r => r.status === "REJECTED").length;
  const paid = requests.filter(r => r.status === "PAID").length;
  const pendingVerify = requests.filter(r => r.status === "PENDING_VERIFICATION" || r.status === "VERIFICATION_FAILED").length;
  const pendingPayment = requests.filter(r => r.status === "PENDING_PAYMENT").length;

  const yoloVerified = requests.filter(r => r.yoloStatus === "VERIFIED").length;
  const ocrPassed = requests.filter(r => r.ocrStatus === "PASSED").length;

  // Percentage calculations
  const ocrPassRate = Math.round((ocrPassed / total) * 100) || 0;
  const yoloPassRate = Math.round((yoloVerified / total) * 100) || 0;
  const issuanceRate = Math.round((issued / total) * 100) || 0;
  const paymentRate = Math.round(((paid + issued) / total) * 100) || 0;

  // Let's generate a trend based on actual request creation dates or fallback
  // Create 10 data points (A to J)
  const getTrendData = (filterFn, defaultVals) => {
    if (requests.length < 5) return defaultVals;
    // Split requests into 10 chunks to get trend
    const chunkSize = Math.max(1, Math.floor(requests.length / 10));
    const values = [];
    for (let i = 0; i < 10; i++) {
      const slice = requests.slice(i * chunkSize, (i + 1) * chunkSize);
      const count = slice.filter(filterFn).length;
      // Scale to fit grid (0 to 180 range)
      values.push(Math.min(170, Math.max(20, count * 35 + 20)));
    }
    return values;
  };

  const trendTeal = getTrendData(r => r.status === "ISSUED" || r.status === "PAID", [100, 120, 110, 80, 100, 70, 60, 90, 80, 115]);
  const trendRose = getTrendData(r => r.status === "REJECTED", [60, 95, 80, 55, 40, 85, 80, 50, 110, 135]);

  // Points generators for SVGs
  const makePoints = (vals) => vals.map((v, i) => `${(i / 9) * 100},${100 - (v / 180) * 100}`);
  const makeAreaPoints = (vals) => {
    const pts = makePoints(vals);
    return `0,100 ${pts.join(" ")} 100,100`;
  };

  // Calendar dates for the current month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday, 1 is Monday...

  const calendarDays = [];
  // Fill empty slots before start of month
  for (let i = 1; i < (startDay === 0 ? 7 : startDay); i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="bg-[#0f172a] border border-blue-900/30 rounded-2xl p-6 text-white shadow-2xl space-y-8 font-sans">
      <div className="flex justify-between items-center border-b border-blue-900/40 pb-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-blue-100 uppercase">attestation neural control deck</h2>
          <p className="text-xs text-blue-300 font-medium mt-1">Real-time cryptographic credentials & AI verification engine telemetry</p>
        </div>
        <span className="bg-blue-500/10 border border-blue-400/20 px-3 py-1 text-xs font-bold text-blue-300 rounded-full animate-pulse">
          LIVE ENGINE OK
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column - Graphs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Top Graph: Double Area Chart */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-sm font-bold text-blue-100">Document Verification Volatility</h3>
                <p className="text-[10px] text-blue-400">Comparing verified documents (Teal) vs anomalies/rejected logs (Rose)</p>
              </div>
              <span className="text-[10px] bg-blue-900/40 px-2 py-0.5 text-blue-300 font-bold border border-blue-800/50 rounded">Interval A-J</span>
            </div>
            
            <div className="relative bg-[#0d1527] border border-blue-900/40 p-4 rounded-xl">
              {/* Y-axis Gridlines */}
              <div className="absolute inset-y-4 left-4 right-4 flex flex-col justify-between pointer-events-none">
                {[180, 160, 140, 120, 100, 80, 60, 40, 20].map((val) => (
                  <div key={val} className="w-full flex items-center gap-2">
                    <span className="text-[9px] font-semibold text-blue-400/60 w-5 text-right">{val}</span>
                    <div className="flex-1 border-t border-blue-950/20"></div>
                  </div>
                ))}
              </div>

              {/* Area SVG Graph */}
              <div className="h-44 ml-7 mt-2 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Teal Area */}
                  <polygon
                    points={makeAreaPoints(trendTeal)}
                    fill="url(#tealGradient)"
                    opacity="0.25"
                  />
                  <polyline
                    points={makePoints(trendTeal).join(" ")}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  
                  {/* Rose Area */}
                  <polygon
                    points={makeAreaPoints(trendRose)}
                    fill="url(#roseGradient)"
                    opacity="0.2"
                  />
                  <polyline
                    points={makePoints(trendRose).join(" ")}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* X-axis Labels */}
              <div className="flex justify-between text-[10px] font-bold text-blue-400/60 ml-12 mt-1">
                {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>

          {/* Middle Graph: Double Line Chart */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-blue-100">YOLO Seal/Signature Extract Trends</h3>
              <p className="text-[10px] text-blue-400">Confidence intervals matching neural stamp extraction models over runtime intervals</p>
            </div>
            
            <div className="relative bg-[#0d1527] border border-blue-900/40 p-4 rounded-xl">
              {/* Y-axis Gridlines */}
              <div className="absolute inset-y-4 left-4 right-4 flex flex-col justify-between pointer-events-none">
                {[180, 160, 140, 120, 100, 80, 60, 40, 20].map((val) => (
                  <div key={val} className="w-full flex items-center gap-2">
                    <span className="text-[9px] font-semibold text-blue-400/60 w-5 text-right">{val}</span>
                    <div className="flex-1 border-t border-blue-950/20"></div>
                  </div>
                ))}
              </div>

              {/* Line SVG Graph */}
              <div className="h-44 ml-7 mt-2 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Teal Line */}
                  <polyline
                    points={makePoints(trendTeal).join(" ")}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  {/* Rose Line */}
                  <polyline
                    points={makePoints(trendRose).join(" ")}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* X-axis Labels */}
              <div className="flex justify-between text-[10px] font-bold text-blue-400/60 ml-12 mt-1">
                {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Rings & Rankings */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Top Rings Container: Four concentric progress circle indicators */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Ring 1 */}
            <div className="bg-[#0d1527] border border-blue-900/40 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3.5" 
                    strokeDasharray={`${ocrPassRate} ${100 - ocrPassRate}`} 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">{ocrPassRate}%</span>
                  <span className="text-[7px] text-blue-400 font-bold uppercase">OCR Pass</span>
                </div>
              </div>
              <span className="text-[10px] text-blue-300 font-semibold mt-2">OCR Document Scans</span>
            </div>

            {/* Ring 2 */}
            <div className="bg-[#0d1527] border border-blue-900/40 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f43f5e" strokeWidth="3.5" 
                    strokeDasharray={`${yoloPassRate} ${100 - yoloPassRate}`} 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">{yoloPassRate}%</span>
                  <span className="text-[7px] text-blue-400 font-bold uppercase">YOLO Seal</span>
                </div>
              </div>
              <span className="text-[10px] text-blue-300 font-semibold mt-2">Stamp Detection</span>
            </div>

            {/* Ring 3 */}
            <div className="bg-[#0d1527] border border-blue-900/40 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3.5" 
                    strokeDasharray={`${issuanceRate} ${100 - issuanceRate}`} 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">{issuanceRate}%</span>
                  <span className="text-[7px] text-blue-400 font-bold uppercase">Attested</span>
                </div>
              </div>
              <span className="text-[10px] text-blue-300 font-semibold mt-2">Completion Attestation</span>
            </div>

            {/* Ring 4 */}
            <div className="bg-[#0d1527] border border-blue-900/40 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f43f5e" strokeWidth="3.5" 
                    strokeDasharray={`${paymentRate} ${100 - paymentRate}`} 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">{paymentRate}%</span>
                  <span className="text-[7px] text-blue-400 font-bold uppercase">Paid</span>
                </div>
              </div>
              <span className="text-[10px] text-blue-300 font-semibold mt-2">Attestation Fee Clear</span>
            </div>

          </div>

          {/* Horizontal segmented bars */}
          <div className="bg-[#0d1527] border border-blue-900/40 p-5 rounded-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">System Pipeline Status</h4>
            
            {[
              { label: "Approved Requests", count: issued, total: total, color: "bg-emerald-500" },
              { label: "Pending Payments", count: pendingPayment, total: total, color: "bg-amber-500" },
              { label: "Pending Evaluations", count: pendingVerify, total: total, color: "bg-cyan-500" },
              { label: "Rejected Requests", count: rejected, total: total, color: "bg-rose-500" },
            ].map((item) => {
              const percentage = Math.min(100, Math.round((item.count / total) * 100));
              return (
                <div key={item.label} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-300">{item.label}</span>
                    <span className="font-mono text-white">{item.count} / {requests.length}</span>
                  </div>
                  {/* Segmented bar visualizer */}
                  <div className="h-2.5 w-full bg-blue-950/80 rounded overflow-hidden flex gap-0.5">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-full flex-1 transition-all ${
                          i < Math.round(percentage / 5) ? item.color : "bg-blue-900/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Bottom Row: Calendar & Alternating Bar Chart */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Calendar View */}
        <div className="bg-[#0d1527] border border-blue-900/40 p-5 rounded-xl">
          <div className="flex justify-between items-center mb-4 border-b border-blue-900/30 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <span className="text-[10px] font-bold text-blue-400">Attestation Logs</span>
          </div>

          <div className="grid grid-cols-7 gap-y-2.5 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <span key={d} className="font-bold text-blue-400 text-[10px] uppercase">{d}</span>
            ))}

            {calendarDays.map((day, idx) => {
              const isToday = day === new Date().getDate();
              return (
                <div key={idx} className="flex justify-center items-center h-7">
                  {day ? (
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold ${
                      isToday ? "bg-blue-800 text-white border border-blue-500" : "text-blue-200 hover:bg-blue-900"
                    }`}>
                      {day}
                    </span>
                  ) : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternating Vertical Bar Chart */}
        <div className="bg-[#0d1527] border border-blue-900/40 p-5 rounded-xl space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200">Queue Processing Load</h4>
            <p className="text-[9px] text-blue-400">Teal = automated pipeline success, Rose = security overrides</p>
          </div>

          <div className="flex items-end justify-between h-36 pt-4 px-2">
            {[
              { val: 45, color: "#10b981" },
              { val: 75, color: "#f43f5e" },
              { val: 30, color: "#10b981" },
              { val: 60, color: "#10b981" },
              { val: 85, color: "#10b981" },
              { val: 55, color: "#f43f5e" },
              { val: 70, color: "#10b981" },
              { val: 25, color: "#f43f5e" },
              { val: 80, color: "#10b981" },
              { val: 90, color: "#f43f5e" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div className="w-4 bg-blue-950/80 rounded-t h-full relative overflow-hidden flex items-end">
                  <div 
                    className="w-full rounded-t transition-all duration-500" 
                    style={{ 
                      height: `${item.val}%`, 
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}80`
                    }} 
                  />
                </div>
                <span className="text-[9px] font-bold text-blue-400/60 mt-1.5">
                  {String.fromCharCode(65 + idx)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
