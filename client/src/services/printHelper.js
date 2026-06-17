export function printDegreeCertificate(degree) {
  // Support both DegreeRequest objects (student?.name) and Degree objects (studentName)
  const resolvedName = degree.studentName || degree.student?.name || "Student";
  degree = { ...degree, studentName: resolvedName };
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the certificate.");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>Degree Certificate - ${degree.studentName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Montserrat:wght@400;500;700&display=swap');
          body {
            margin: 0;
            padding: 0;
            background: #f3f4f6;
            font-family: 'Montserrat', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .certificate-container {
            width: 100%;
            max-width: 840px;
            padding: 50px;
            border: 12px double #1e3a8a;
            background-color: #fdfbf7;
            position: relative;
            text-align: center;
            box-sizing: border-box;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-radius: 8px;
            background-image: radial-gradient(circle, rgba(30,58,138,0.02) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .header {
            margin-bottom: 30px;
          }
          .logo {
            height: 95px;
            margin-bottom: 15px;
          }
          .univ-name {
            font-family: 'Cinzel', serif;
            font-size: 32px;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: 2px;
            margin: 5px 0;
          }
          .tagline {
            font-size: 11px;
            letter-spacing: 5px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 25px;
            font-weight: 500;
          }
          .cert-title {
            font-family: 'Cinzel', serif;
            font-size: 28px;
            font-weight: 700;
            color: #b45309;
            margin: 25px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .cert-text {
            font-size: 16px;
            line-height: 1.8;
            color: #374151;
            margin: 30px 20px;
          }
          .student-name {
            font-size: 26px;
            font-weight: 700;
            color: #111827;
            margin: 15px 0;
            font-family: 'Cinzel', serif;
            border-bottom: 2px solid #b45309;
            display: inline-block;
            padding-bottom: 4px;
          }
          .degree-title {
            font-size: 22px;
            font-weight: 700;
            color: #1e3a8a;
            margin: 15px 0;
            font-family: 'Cinzel', serif;
          }
          .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 60px;
            padding: 0 40px;
          }
          .signature-box {
            text-align: center;
            width: 180px;
          }
          .signature-line {
            border-top: 1.5px solid #9ca3af;
            margin-top: 45px;
            font-size: 11px;
            color: #4b5563;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .qr-box {
            text-align: center;
          }
          .qr-image {
            height: 100px;
            width: 100px;
            border: 1px solid #e5e7eb;
            padding: 6px;
            background: #fff;
            border-radius: 4px;
          }
          .hash-info {
            font-family: monospace;
            font-size: 9px;
            color: #6b7280;
            margin-top: 35px;
            word-break: break-all;
            padding: 10px 30px 0 30px;
            border-top: 1px dashed #e5e7eb;
          }
          .actions-bar {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
          }
          .print-btn {
            background-color: #1e3a8a;
            color: white;
            border: none;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.2s;
          }
          .print-btn:hover {
            background-color: #1d4ed8;
          }
          @media print {
            body {
              background: none;
              padding: 0;
              margin: 0;
            }
            .certificate-container {
              box-shadow: none;
              margin: 0;
              border: 12px double #1e3a8a;
              width: 100%;
              max-width: 100%;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 40px;
            }
            .actions-bar {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="actions-bar">
          <button class="print-btn" onclick="window.print()">Print Certificate</button>
        </div>
        <div class="certificate-container">
          <div class="header">
            <img class="logo" src="/logoiqra.png" alt="Iqra University" />
            <div class="univ-name">IQRA UNIVERSITY</div>
            <div class="tagline">Where Lives Empower</div>
          </div>
          <div class="cert-title">Degree Certificate</div>
          <div class="cert-text">
            This is to certify that the academic credentials of
            <br/>
            <div class="student-name">${degree.studentName || degree.student?.name}</div>
            <br/>
            have been verified and approved by the Academic Council.
            The candidate is hereby conferred the degree of
            <br/>
            <div class="degree-title">${degree.degreeTitle}</div>
            with all the rights, honors, and privileges appertaining thereto.
            <br/>
            Department: <strong>${degree.department}</strong> | Graduation Year: <strong>${degree.graduationYear}</strong>
          </div>
          <div class="footer-section">
            <div class="signature-box">
              <div class="signature-line">Registrar</div>
            </div>
            <div class="qr-box">
              ${degree.qrCodeDataUrl ? `<img class="qr-image" src="${degree.qrCodeDataUrl}" alt="QR Verification" />` : '<div style="height:100px;width:100px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:10px;color:#999;background:#fff;">QR Code</div>'}
              <div style="font-size: 8px; margin-top: 5px; color:#4b5563; font-weight:bold; letter-spacing:1px;">SCAN TO VERIFY</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Vice Chancellor</div>
            </div>
          </div>
          <div class="hash-info">
            Blockchain verification Hash: ${degree.degreeHash || 'N/A'}<br/>
            Secured via Decentralized Blockchain Technology
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
}
