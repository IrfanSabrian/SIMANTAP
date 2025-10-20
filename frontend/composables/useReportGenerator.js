// Dynamic imports to avoid SSR issues

export const useReportGenerator = () => {
  const generatePDF = async (reportData) => {
    const { reportInfo, data } = reportData;

    // Debug: Check if data is available
    console.log("PDF Generation - Report Info:", reportInfo);
    console.log("PDF Generation - Data:", data);

    // Ensure data structure exists
    if (!data) {
      console.error("No data provided for PDF generation");
      return { success: false, error: "No data provided" };
    }

    if (!data.roads || data.roads.length === 0) {
      console.warn("No roads data found, using empty array");
      data.roads = [];
    }

    // Use html2pdf.js for better A3 landscape support
    const html2pdf = await import("html2pdf.js");

    // Create HTML content for the report
    const createHTMLContent = () => {
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <!-- CSS sudah di-inline untuk menghindari MIME type error -->
          <style>
            /* Additional inline styles for PDF generation */
            @page {
              size: A3 landscape;
              margin: 0.5in 0.5in 1in 0.5in;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              margin: 0;
              padding: 0;
            }
            
            .report-header-section {
              page-break-inside: avoid;
              break-inside: avoid;
              -webkit-break-inside: avoid;
            }
            
            .header {
              text-align: center;
              margin-bottom: 10px;
              page-break-inside: avoid;
              break-inside: avoid;
              page-break-after: avoid;
              break-after: avoid;
            }
            
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .subtitle {
              font-size: 18px;
              margin-bottom: 5px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .date {
              font-size: 14px;
              color: #666;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            /* Allow table internals to break normally so only wrapper is kept intact */
            .data-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin: 5px 0;
              table-layout: fixed;
              page-break-inside: auto !important;
              break-inside: auto !important;
              -webkit-break-inside: auto !important;
            }
            
            .data-table th {
              background-color: #f0f0f0;
              border: 1px solid #ddd;
              padding: 6px;
              text-align: center;
              font-weight: bold;
              font-size: 9px;
            }
            
            .data-table td {
              border: 1px solid #ddd;
              padding: 5px;
              text-align: left;
              vertical-align: top;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            .data-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .condition-baik {
              color: #166534;
              font-weight: bold;
            }
            .condition-sedang {
              color: #854d0e;
              font-weight: bold;
            }
            .condition-rusak-ringan {
              color: #9a3412;
              font-weight: bold;
            }
            .condition-rusak-berat {
              color: #991b1b;
              font-weight: bold;
            }
            
            .road-group-wrapper {
              display: block !important;
              margin-bottom: 20px !important;
              padding: 10px !important;
              border: 1px solid #e0e0e0 !important;
              background-color: #fafafa !important;
              page-break-inside: auto !important;
              break-inside: auto !important;
            }
            
            /* Wrapper khusus untuk kesatuan header sampai ringkasan */
            .road-summary-section {
              display: flex !important;
              flex-direction: column !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              -webkit-column-break-inside: avoid !important;
              -webkit-region-break-inside: avoid !important;
              orphans: 999 !important;
              widows: 999 !important;
              overflow: visible !important;
              flex-wrap: nowrap !important;
            }
            
            /* Pastikan elemen dalam summary section tidak terpotong */
            .road-summary-section .road-header,
            .road-summary-section .road-info {
              display: block !important;
              flex-shrink: 0 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: avoid !important;
              break-before: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            /* Force summary section to stay together */
            .road-summary-section {
              min-height: fit-content !important;
              max-height: none !important;
            }
            
            .road-group {
              margin: 0;
              padding: 5px !important;
            }
            
            .road-header {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #1f2937;
              background-color: #f3f4f6;
              padding: 8px;
              border-radius: 4px;
            }
            
            .road-info {
              font-size: 10px;
              margin-bottom: 10px;
              color: #666;
              background-color: #f9fafb;
              padding: 5px;
              border-radius: 3px;
            }
            
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 10px;
              color: #666;
              page-break-after: avoid;
              break-after: avoid;
              -webkit-break-after: avoid;
            }
            
            /* Prevent empty pages at the end */
            body {
              page-break-after: avoid;
              break-after: avoid;
            }
            
            /* Ensure last element doesn't create empty pages */
            .road-group-wrapper:last-child {
              page-break-after: avoid;
              break-after: avoid;
              margin-bottom: 0;
            }
            
            /* CSS sudah di-inline untuk menghindari MIME type error */
          </style>
        </head>
        <body>
          <div class="report-header-section">
            <div class="header">
              <div class="title">LAPORAN ${reportInfo.label.toUpperCase()}</div>
              <div class="subtitle">${
                getLocationText(reportInfo.location) || "Kabupaten Kubu Raya"
              }</div>
              <div class="date">${new Date().toLocaleDateString("id-ID")}</div>
            </div>

            <div class="section-title">RINGKASAN EKSEKUTIF</div>
            <div class="summary-cards">
              <div class="summary-card card-blue">
                <div class="card-number">${formatNumber(
                  data?.summary?.totalJalan || 0
                )}</div>
                <div class="card-label">Total Jalan</div>
              </div>
              <div class="summary-card card-green">
                <div class="card-number">${formatNumber(
                  data?.summary?.totalRuas || 0
                )}</div>
                <div class="card-label">Total Ruas</div>
              </div>
              <div class="summary-card card-orange">
                <div class="card-number">${formatDistance(
                  data?.summary?.totalLength || 0
                )}</div>
                <div class="card-label">Total Panjang</div>
              </div>
              <div class="summary-card card-purple">
                <div class="card-number">${
                  data?.summary?.kecamatan || "N/A"
                }</div>
                <div class="card-label">Kecamatan</div>
              </div>
            </div>
          </div>
      `;

      // Add detailed road data
      if (data && data.roads && data.roads.length > 0) {
        html += `<div class="section-title">DATA DETAIL JALAN LINGKUNGAN</div>`;

        data.roads.forEach((roadGroup) => {
          html += `
            <div class="road-group-wrapper">
              <div class="road-group">
                <div class="road-summary-section">
                  <div class="road-header">NO. JALAN: ${roadGroup.noJalan}</div>
                  <div class="road-info">Total Ruas: ${
                    roadGroup.totalRuas
                  } | Total Panjang: ${formatDistance(
            roadGroup.totalPanjang
          )}</div>
                </div>
                
                <table class="data-table">
              <thead>
                <tr>
                  <th class="col-no-ruas">NO. RUAS</th>
                  <th class="col-no-provinsi">NO. PROVINSI</th>
                  <th class="col-no-kabupaten">NO. KABUPATEN</th>
                  <th class="col-no-kecamatan">NO. KECAMATAN</th>
                  <th class="col-no-desa">NO. DESA</th>
                  <th class="col-no-jalan">NO. JALAN</th>
                  <th class="col-nama-ruas">NAMA RUAS</th>
                  <th class="col-nama-jalan">NAMA JALAN</th>
                  <th class="col-panjang">PANJANG (M)</th>
                  <th class="col-lebar">LEBAR (M)</th>
                  <th class="col-tahun">TAHUN</th>
                  <th class="col-kondisi">KONDISI JALAN</th>
                  <th class="col-nilai">NILAI</th>
                  <th class="col-bobot">BOBOT</th>
                  <th class="col-keterangan">KETERANGAN</th>
                  <th class="col-kecamatan">KECAMATAN</th>
                  <th class="col-desa">DESA</th>
                  <th class="col-utm-x-awal">UTM X AWAL</th>
                  <th class="col-utm-y-awal">UTM Y AWAL</th>
                  <th class="col-pangkalan-awal">PANGKALAN AWAL</th>
                  <th class="col-utm-x-akhir">UTM X AKHIR</th>
                  <th class="col-utm-y-akhir">UTM Y AKHIR</th>
                  <th class="col-pangkalan-akhir">PANGKALAN AKHIR</th>
                </tr>
              </thead>
              <tbody>
          `;

          roadGroup.ruas.forEach((ruas) => {
            const condition = ruas.kondisi || "";
            let conditionClass = "";
            if (condition.includes("Baik")) conditionClass = "condition-baik";
            else if (condition.includes("Sedang"))
              conditionClass = "condition-sedang";
            else if (condition.includes("Rusak Ringan"))
              conditionClass = "condition-rusak-ringan";
            else if (condition.includes("Rusak Berat"))
              conditionClass = "condition-rusak-berat";

            html += `
              <tr>
                <td class="col-no-ruas">${ruas.noRuas || ""}</td>
                <td class="col-no-provinsi">${ruas.noProv || ""}</td>
                <td class="col-no-kabupaten">${ruas.noKab || ""}</td>
                <td class="col-no-kecamatan">${ruas.noKec || ""}</td>
                <td class="col-no-desa">${ruas.noDesa || ""}</td>
                <td class="col-no-jalan">${roadGroup.noJalan || ""}</td>
                <td class="col-nama-ruas">${ruas.nama || ""}</td>
                <td class="col-nama-jalan">${ruas.namaJalan || ""}</td>
                <td class="col-panjang">${formatNumber(ruas.panjangM || 0)}</td>
                <td class="col-lebar">${formatNumber(ruas.lebarM || 0)}</td>
                <td class="col-tahun">${ruas.tahun || ""}</td>
                <td class="col-kondisi ${conditionClass}">${condition}</td>
                <td class="col-nilai">${ruas.nilai || ""}</td>
                <td class="col-bobot">${ruas.bobot || ""}</td>
                <td class="col-keterangan">${ruas.keterangan || ""}</td>
                <td class="col-kecamatan">${ruas.kecamatan || ""}</td>
                <td class="col-desa">${ruas.desa || ""}</td>
                <td class="col-utm-x-awal">${ruas.utmXAwal || ""}</td>
                <td class="col-utm-y-awal">${ruas.utmYAwal || ""}</td>
                <td class="col-pangkalan-awal">${ruas.pngnlAwal || ""}</td>
                <td class="col-utm-x-akhir">${ruas.utmXAkhi || ""}</td>
                <td class="col-utm-y-akhir">${ruas.utmYAkhi || ""}</td>
                <td class="col-pangkalan-akhir">${ruas.pngnlAkhi || ""}</td>
              </tr>
            `;
          });

          html += `
                </tbody>
              </table>
              <div class="road-summary-section">
                <div class="road-info"><strong>TOTAL PANJANG M: ${formatDistance(
                  roadGroup.totalPanjang
                )}</strong></div>
              </div>
            </div>
          </div>
          `;
        });
      }

      html += `
          <div class="footer">
            <div>Laporan ini dibuat secara otomatis oleh Sistem Informasi Jalan Lingkungan (SIJALI)</div>
            <div>Kabupaten Kubu Raya - ${new Date().toLocaleDateString(
              "id-ID"
            )}</div>
            <div>&nbsp;</div>
          </div>
        </body>
        </html>
      `;

      return html;
    };

    // Generate HTML content
    const htmlContent = createHTMLContent();

    // Create an iframe for PDF generation with proper CORS handling
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.width = "297mm";
    iframe.style.height = "auto";
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";
    iframe.style.overflow = "visible";
    document.body.appendChild(iframe);

    // Write HTML content to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Wait for iframe to load and resize to fit content
    await new Promise((resolve) => {
      iframe.onload = resolve;
      if (iframe.contentDocument.readyState === "complete") {
        resolve();
      }
    });

    // Resize iframe to fit all content
    iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";

    // Debug: Log iframe dimensions
    console.log(
      "Iframe content height:",
      iframe.contentDocument.body.scrollHeight
    );
    console.log(
      "Iframe content width:",
      iframe.contentDocument.body.scrollWidth
    );
    console.log("Iframe actual height:", iframe.style.height);

    // Configure html2pdf options for A3 landscape
    const options = {
      margin: [0.5, 0.5, 1, 0.5], // top, right, bottom, left
      filename: `Laporan_${reportInfo.label.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 1.5, // Reduced scale to avoid zoomed appearance
        useCORS: true,
        allowTaint: false, // Set to false to avoid tainted canvas
        scrollX: 0,
        scrollY: 0,
        logging: false, // Disable logging for better performance
      },
      jsPDF: {
        unit: "in",
        format: "a3",
        orientation: "landscape",
        pageSize: { width: 16.5, height: 11.7 }, // A3 landscape in inches
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      },
      pagebreak: {
        mode: ["css"],
        avoid: [".road-summary-section", ".footer"],
      },
    };

    // Generate PDF from iframe
    console.log("Starting PDF generation...");
    console.log(
      "Iframe body content length:",
      iframe.contentDocument.body.innerHTML.length
    );
    console.log(
      "Iframe body children count:",
      iframe.contentDocument.body.children.length
    );

    // Check if content is very large and adjust settings
    const isLargeContent = iframe.contentDocument.body.scrollHeight > 20000;
    if (isLargeContent) {
      console.log("Large content detected, using optimized settings");
      options.html2canvas.scale = 1; // Reduce scale for large content
      options.html2canvas.height = Math.min(
        iframe.contentDocument.body.scrollHeight,
        50000
      ); // Limit height
    }

    try {
      await html2pdf
        .default()
        .set(options)
        .from(iframe.contentDocument.body)
        .save();
      console.log("PDF generation completed successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      // Fallback: try with different settings
      const fallbackOptions = { ...options };
      fallbackOptions.html2canvas.scale = 0.8;
      fallbackOptions.html2canvas.allowTaint = true;
      fallbackOptions.html2canvas.height = Math.min(
        iframe.contentDocument.body.scrollHeight,
        30000
      );
      await html2pdf
        .default()
        .set(fallbackOptions)
        .from(iframe.contentDocument.body)
        .save();
      console.log("PDF generation completed with fallback settings");
    }

    // Clean up the iframe safely
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);

    return { success: true };
  };

  const generatePreviewHTML = (reportData) => {
    const { reportInfo, data } = reportData;

    // Debug: Check if data is available
    console.log("Preview Generation - Report Info:", reportInfo);
    console.log("Preview Generation - Data:", data);

    // Ensure data structure exists
    if (!data) {
      console.error("No data provided for preview generation");
      return null;
    }

    if (!reportInfo) {
      console.error("No reportInfo provided for preview generation");
      return null;
    }

    if (!data.roads || data.roads.length === 0) {
      console.warn("No roads data found, using empty array");
      data.roads = [];
    }

    // Create HTML content for the preview
    const createHTMLContent = () => {
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page {
              size: A3 landscape;
              margin: 0.5in 0.5in 1in 0.5in;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              margin: 0;
              padding: 0;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .report-header-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .subtitle {
              font-size: 18px;
              margin-bottom: 5px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .date {
              font-size: 14px;
              color: #666;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin: 10px 0 5px 0;
            }
            .summary-cards {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              gap: 10px;
            }
            .summary-card {
              flex: 1;
              padding: 15px;
              text-align: center;
              color: white;
              border-radius: 5px;
            }
            .card-blue { background-color: #4272C4; }
            .card-green { background-color: #70AD47; }
            .card-orange { background-color: #FFC000; }
            .card-purple { background-color: #7030A0; }
            .card-number {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .card-label {
              font-size: 12px;
            }
            .road-group-wrapper {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: auto !important;
              break-before: auto !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
              display: block !important;
              min-height: fit-content !important;
              margin-bottom: 20px !important;
              padding: 10px !important;
              border: 1px solid #e0e0e0 !important;
              background-color: #fafafa !important;
            }
            .road-group {
              margin: 10px 0;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: avoid !important;
              break-before: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .road-header {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .road-info {
              font-size: 10px;
              margin-bottom: 10px;
              color: #666;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin: 5px 0;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            .data-table th {
              background-color: #f0f0f0;
              border: 1px solid #ddd;
              padding: 6px;
              text-align: center;
              font-weight: bold;
              font-size: 9px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .data-table td {
              border: 1px solid #ddd;
              padding: 5px;
              text-align: left;
              vertical-align: top;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            .data-table tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            .data-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .condition-baik { color: #166534; font-weight: bold; }
            .condition-sedang { color: #854d0e; font-weight: bold; }
            .condition-rusak-ringan { color: #9a3412; font-weight: bold; }
            .condition-rusak-berat { color: #991b1b; font-weight: bold; }
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 10px;
              color: #666;
            }
            .col-no-ruas { width: 3%; }
            .col-no-provinsi { width: 3%; }
            .col-no-kabupaten { width: 3%; }
            .col-no-kecamatan { width: 3%; }
            .col-no-desa { width: 3%; }
            .col-no-jalan { width: 3%; }
            .col-nama-ruas { width: 5%; }
            .col-nama-jalan { width: 5%; }
            .col-panjang { width: 3%; }
            .col-lebar { width: 3%; }
            .col-tahun { width: 2%; }
            .col-kondisi { width: 4%; }
            .col-nilai { width: 2%; }
            .col-bobot { width: 2%; }
            .col-keterangan { width: 5%; }
            .col-kecamatan { width: 4%; }
            .col-desa { width: 4%; }
            .col-utm-x-awal { width: 3%; }
            .col-utm-y-awal { width: 3%; }
            .col-pangkalan-awal { width: 4%; }
            .col-utm-x-akhir { width: 3%; }
            .col-utm-y-akhir { width: 3%; }
            .col-pangkalan-akhir { width: 4%; }
            
            /* Additional page break prevention */
            .section-title {
              page-break-before: avoid !important;
              page-break-after: avoid !important;
              break-before: avoid !important;
              break-after: avoid !important;
            }
            .summary-cards {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .road-header {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .road-info {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .footer {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            .header {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .title, .subtitle, .date {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Force page breaks and prevent text splitting */
            .data-table tbody tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              orphans: 3;
              widows: 3;
            }
            
            /* Ensure table cells don't break */
            .data-table td, .data-table th {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              overflow: visible !important;
            }
            
            /* Force table to stay together */
            .data-table {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            
            /* Add spacing to prevent tight breaks */
            .road-group {
              margin-bottom: 10px;
              padding-bottom: 5px;
            }
            
            /* Comprehensive text protection */
            * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            
            /* Force all table rows to stay together */
            .data-table tbody tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              orphans: 0 !important;
              widows: 0 !important;
            }
            
            /* Specific element protection */
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            p, div, span {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Remove forced page breaks - let content flow naturally */
            .section-title {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            
            /* Prevent orphaned text */
            p, div {
              orphans: 3 !important;
              widows: 3 !important;
            }
            
            /* Additional table protection */
            .data-table thead tr {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            .data-table tbody tr:first-child {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            
            /* Force page break before road group if needed */
            .road-group-wrapper {
              page-break-before: auto !important;
              break-before: auto !important;
            }
            
            /* Ensure all elements within road group stay together */
            .road-group-wrapper * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            
            /* Specific protection for road group elements */
            .road-group-wrapper .road-header,
            .road-group-wrapper .road-info,
            .road-group-wrapper .data-table,
            .road-group-wrapper .data-table thead,
            .road-group-wrapper .data-table tbody,
            .road-group-wrapper .data-table tr,
            .road-group-wrapper .data-table th,
            .road-group-wrapper .data-table td {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: avoid !important;
              break-before: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            /* Ensure table headers stay with content */
            .data-table thead {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            .data-table tbody {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
          </style>
        </head>
        <body>
          <div class="report-header-section">
            <div class="header">
              <div class="title">LAPORAN ${reportInfo.label.toUpperCase()}</div>
              <div class="subtitle">${
                getLocationText(reportInfo.location) || "Kabupaten Kubu Raya"
              }</div>
              <div class="date">${new Date().toLocaleDateString("id-ID")}</div>
            </div>

            <div class="section-title">RINGKASAN EKSEKUTIF</div>
            <div class="summary-cards">
              <div class="summary-card card-blue">
                <div class="card-number">${formatNumber(
                  data?.summary?.totalJalan || 0
                )}</div>
                <div class="card-label">Total Jalan</div>
              </div>
              <div class="summary-card card-green">
                <div class="card-number">${formatNumber(
                  data?.summary?.totalRuas || 0
                )}</div>
                <div class="card-label">Total Ruas</div>
              </div>
              <div class="summary-card card-orange">
                <div class="card-number">${formatDistance(
                  data?.summary?.totalLength || 0
                )}</div>
                <div class="card-label">Total Panjang</div>
              </div>
              <div class="summary-card card-purple">
                <div class="card-number">${
                  data?.summary?.kecamatan || "N/A"
                }</div>
                <div class="card-label">Kecamatan</div>
              </div>
            </div>
          </div>
      `;

      // Add detailed road data
      if (data && data.roads && data.roads.length > 0) {
        html += `<div class="section-title">DATA DETAIL JALAN LINGKUNGAN</div>`;

        data.roads.forEach((roadGroup) => {
          html += `
            <div class="road-group-wrapper">
              <div class="road-group">
                <div class="road-summary-section">
                  <div class="road-header">NO. JALAN: ${roadGroup.noJalan}</div>
                  <div class="road-info">Total Ruas: ${
                    roadGroup.totalRuas
                  } | Total Panjang: ${formatDistance(
            roadGroup.totalPanjang
          )}</div>
                </div>
                
                <table class="data-table">
              <thead>
                <tr>
                  <th class="col-no-ruas">NO. RUAS</th>
                  <th class="col-no-provinsi">NO. PROVINSI</th>
                  <th class="col-no-kabupaten">NO. KABUPATEN</th>
                  <th class="col-no-kecamatan">NO. KECAMATAN</th>
                  <th class="col-no-desa">NO. DESA</th>
                  <th class="col-no-jalan">NO. JALAN</th>
                  <th class="col-nama-ruas">NAMA RUAS</th>
                  <th class="col-nama-jalan">NAMA JALAN</th>
                  <th class="col-panjang">PANJANG (M)</th>
                  <th class="col-lebar">LEBAR (M)</th>
                  <th class="col-tahun">TAHUN</th>
                  <th class="col-kondisi">KONDISI JALAN</th>
                  <th class="col-nilai">NILAI</th>
                  <th class="col-bobot">BOBOT</th>
                  <th class="col-keterangan">KETERANGAN</th>
                  <th class="col-kecamatan">KECAMATAN</th>
                  <th class="col-desa">DESA</th>
                  <th class="col-utm-x-awal">UTM X AWAL</th>
                  <th class="col-utm-y-awal">UTM Y AWAL</th>
                  <th class="col-pangkalan-awal">PANGKALAN AWAL</th>
                  <th class="col-utm-x-akhir">UTM X AKHIR</th>
                  <th class="col-utm-y-akhir">UTM Y AKHIR</th>
                  <th class="col-pangkalan-akhir">PANGKALAN AKHIR</th>
                </tr>
              </thead>
              <tbody>
          `;

          roadGroup.ruas.forEach((ruas) => {
            const condition = ruas.kondisi || "";
            let conditionClass = "";
            if (condition.includes("Baik")) conditionClass = "condition-baik";
            else if (condition.includes("Sedang"))
              conditionClass = "condition-sedang";
            else if (condition.includes("Rusak Ringan"))
              conditionClass = "condition-rusak-ringan";
            else if (condition.includes("Rusak Berat"))
              conditionClass = "condition-rusak-berat";

            html += `
              <tr>
                <td class="col-no-ruas">${ruas.noRuas || ""}</td>
                <td class="col-no-provinsi">${ruas.noProv || ""}</td>
                <td class="col-no-kabupaten">${ruas.noKab || ""}</td>
                <td class="col-no-kecamatan">${ruas.noKec || ""}</td>
                <td class="col-no-desa">${ruas.noDesa || ""}</td>
                <td class="col-no-jalan">${roadGroup.noJalan || ""}</td>
                <td class="col-nama-ruas">${ruas.nama || ""}</td>
                <td class="col-nama-jalan">${ruas.namaJalan || ""}</td>
                <td class="col-panjang">${formatNumber(ruas.panjangM || 0)}</td>
                <td class="col-lebar">${formatNumber(ruas.lebarM || 0)}</td>
                <td class="col-tahun">${ruas.tahun || ""}</td>
                <td class="col-kondisi ${conditionClass}">${condition}</td>
                <td class="col-nilai">${ruas.nilai || ""}</td>
                <td class="col-bobot">${ruas.bobot || ""}</td>
                <td class="col-keterangan">${ruas.keterangan || ""}</td>
                <td class="col-kecamatan">${ruas.kecamatan || ""}</td>
                <td class="col-desa">${ruas.desa || ""}</td>
                <td class="col-utm-x-awal">${ruas.utmXAwal || ""}</td>
                <td class="col-utm-y-awal">${ruas.utmYAwal || ""}</td>
                <td class="col-pangkalan-awal">${ruas.pngnlAwal || ""}</td>
                <td class="col-utm-x-akhir">${ruas.utmXAkhi || ""}</td>
                <td class="col-utm-y-akhir">${ruas.utmYAkhi || ""}</td>
                <td class="col-pangkalan-akhir">${ruas.pngnlAkhi || ""}</td>
              </tr>
            `;
          });

          html += `
                </tbody>
              </table>
              <div class="road-summary-section">
                <div class="road-info"><strong>TOTAL PANJANG M: ${formatDistance(
                  roadGroup.totalPanjang
                )}</strong></div>
              </div>
            </div>
          </div>
          `;
        });
      }

      html += `
          <div class="footer">
            <div>Laporan ini dibuat secara otomatis oleh Sistem Informasi Jalan Lingkungan (SIJALI)</div>
            <div>Kabupaten Kubu Raya - ${new Date().toLocaleDateString(
              "id-ID"
            )}</div>
            <div>&nbsp;</div>
          </div>
        </body>
        </html>
      `;

      return html;
    };

    return createHTMLContent();
  };

  const generateDOCX = async (reportData) => {
    const { reportInfo, data } = reportData;

    // Generate PDF first using html2pdf.js
    const html2pdf = await import("html2pdf.js");

    // Create HTML content for the report (same as PDF)
    const createHTMLContent = () => {
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page {
              size: A3 landscape;
              margin: 0.5in 0.5in 1in 0.5in;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              margin: 0;
              padding: 0;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .report-header-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .subtitle {
              font-size: 18px;
              margin-bottom: 5px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .date {
              font-size: 14px;
              color: #666;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin: 10px 0 5px 0;
            }
            .summary-cards {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              gap: 10px;
            }
            .summary-card {
              flex: 1;
              padding: 15px;
              text-align: center;
              color: white;
              border-radius: 5px;
            }
            .card-blue { background-color: #4272C4; }
            .card-green { background-color: #70AD47; }
            .card-orange { background-color: #FFC000; }
            .card-purple { background-color: #7030A0; }
            .card-number {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .card-label {
              font-size: 12px;
            }
            .road-group-wrapper {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: auto !important;
              break-before: auto !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
              display: block !important;
              min-height: fit-content !important;
              margin-bottom: 20px !important;
              padding: 10px !important;
              border: 1px solid #e0e0e0 !important;
              background-color: #fafafa !important;
            }
            .road-group {
              margin: 10px 0;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: avoid !important;
              break-before: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .road-header {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .road-info {
              font-size: 10px;
              margin-bottom: 10px;
              color: #666;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin: 5px 0;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            .data-table th {
              background-color: #f0f0f0;
              border: 1px solid #ddd;
              padding: 6px;
              text-align: center;
              font-weight: bold;
              font-size: 9px;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .data-table td {
              border: 1px solid #ddd;
              padding: 5px;
              text-align: left;
              vertical-align: top;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            .data-table tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            .data-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .condition-baik { color: #166534; font-weight: bold; }
            .condition-sedang { color: #854d0e; font-weight: bold; }
            .condition-rusak-ringan { color: #9a3412; font-weight: bold; }
            .condition-rusak-berat { color: #991b1b; font-weight: bold; }
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 10px;
              color: #666;
            }
            .col-no-ruas { width: 3%; }
            .col-no-provinsi { width: 3%; }
            .col-no-kabupaten { width: 3%; }
            .col-no-kecamatan { width: 3%; }
            .col-no-desa { width: 3%; }
            .col-no-jalan { width: 3%; }
            .col-nama-ruas { width: 5%; }
            .col-nama-jalan { width: 5%; }
            .col-panjang { width: 3%; }
            .col-lebar { width: 3%; }
            .col-tahun { width: 2%; }
            .col-kondisi { width: 4%; }
            .col-nilai { width: 2%; }
            .col-bobot { width: 2%; }
            .col-keterangan { width: 5%; }
            .col-kecamatan { width: 4%; }
            .col-desa { width: 4%; }
            .col-utm-x-awal { width: 3%; }
            .col-utm-y-awal { width: 3%; }
            .col-pangkalan-awal { width: 4%; }
            .col-utm-x-akhir { width: 3%; }
            .col-utm-y-akhir { width: 3%; }
            .col-pangkalan-akhir { width: 4%; }
            
            /* Additional page break prevention */
            .section-title {
              page-break-before: avoid !important;
              page-break-after: avoid !important;
              break-before: avoid !important;
              break-after: avoid !important;
            }
            .summary-cards {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .road-header {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .road-info {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .footer {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            .header {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            .title, .subtitle, .date {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Force page breaks and prevent text splitting */
            .data-table tbody tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              orphans: 3;
              widows: 3;
            }
            
            /* Ensure table cells don't break */
            .data-table td, .data-table th {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              overflow: visible !important;
            }
            
            /* Force table to stay together */
            .data-table {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            
            /* Add spacing to prevent tight breaks */
            .road-group {
              margin-bottom: 10px;
              padding-bottom: 5px;
            }
            
            /* Comprehensive text protection */
            * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            
            /* Force all table rows to stay together */
            .data-table tbody tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              orphans: 0 !important;
              widows: 0 !important;
            }
            
            /* Specific element protection */
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            p, div, span {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Remove forced page breaks - let content flow naturally */
            .section-title {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            
            /* Prevent orphaned text */
            p, div {
              orphans: 3 !important;
              widows: 3 !important;
            }
            
            /* Additional table protection */
            .data-table thead tr {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            .data-table tbody tr:first-child {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            
            /* Force page break before road group if needed */
            .road-group-wrapper {
              page-break-before: auto !important;
              break-before: auto !important;
            }
            
            /* Ensure all elements within road group stay together */
            .road-group-wrapper * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
            }
            
            /* Specific protection for road group elements */
            .road-group-wrapper .road-header,
            .road-group-wrapper .road-info,
            .road-group-wrapper .data-table,
            .road-group-wrapper .data-table thead,
            .road-group-wrapper .data-table tbody,
            .road-group-wrapper .data-table tr,
            .road-group-wrapper .data-table th,
            .road-group-wrapper .data-table td {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-break-inside: avoid !important;
              page-break-before: avoid !important;
              break-before: avoid !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            /* Ensure table headers stay with content */
            .data-table thead {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            .data-table tbody {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
          </style>
        </head>
        <body>
          <div class="report-header-section">
            <div class="header">
              <div class="title">LAPORAN ${reportInfo.label.toUpperCase()}</div>
              <div class="subtitle">${
                getLocationText(reportInfo.location) || "Kabupaten Kubu Raya"
              }</div>
              <div class="date">${new Date().toLocaleDateString("id-ID")}</div>
            </div>

            <div class="section-title">RINGKASAN EKSEKUTIF</div>
            <div class="summary-cards">
              <div class="summary-card card-blue">
                <div class="card-number">${formatNumber(
                  data?.summary?.totalJalan || 0
                )}</div>
                <div class="card-label">Total Jalan</div>
              </div>
              <div class="summary-card card-green">
                <div class="card-number">${formatNumber(
                  data?.summary?.totalRuas || 0
                )}</div>
                <div class="card-label">Total Ruas</div>
              </div>
              <div class="summary-card card-orange">
                <div class="card-number">${formatDistance(
                  data?.summary?.totalLength || 0
                )}</div>
                <div class="card-label">Total Panjang</div>
              </div>
              <div class="summary-card card-purple">
                <div class="card-number">${
                  data?.summary?.kecamatan || "N/A"
                }</div>
                <div class="card-label">Kecamatan</div>
              </div>
            </div>
          </div>
      `;

      // Add detailed road data
      if (data && data.roads && data.roads.length > 0) {
        html += `<div class="section-title">DATA DETAIL JALAN LINGKUNGAN</div>`;

        data.roads.forEach((roadGroup) => {
          html += `
            <div class="road-group-wrapper">
              <div class="road-group">
                <div class="road-summary-section">
                  <div class="road-header">NO. JALAN: ${roadGroup.noJalan}</div>
                  <div class="road-info">Total Ruas: ${
                    roadGroup.totalRuas
                  } | Total Panjang: ${formatDistance(
            roadGroup.totalPanjang
          )}</div>
                </div>
                
                <table class="data-table">
              <thead>
                <tr>
                  <th class="col-no-ruas">NO. RUAS</th>
                  <th class="col-no-provinsi">NO. PROVINSI</th>
                  <th class="col-no-kabupaten">NO. KABUPATEN</th>
                  <th class="col-no-kecamatan">NO. KECAMATAN</th>
                  <th class="col-no-desa">NO. DESA</th>
                  <th class="col-no-jalan">NO. JALAN</th>
                  <th class="col-nama-ruas">NAMA RUAS</th>
                  <th class="col-nama-jalan">NAMA JALAN</th>
                  <th class="col-panjang">PANJANG (M)</th>
                  <th class="col-lebar">LEBAR (M)</th>
                  <th class="col-tahun">TAHUN</th>
                  <th class="col-kondisi">KONDISI JALAN</th>
                  <th class="col-nilai">NILAI</th>
                  <th class="col-bobot">BOBOT</th>
                  <th class="col-keterangan">KETERANGAN</th>
                  <th class="col-kecamatan">KECAMATAN</th>
                  <th class="col-desa">DESA</th>
                  <th class="col-utm-x-awal">UTM X AWAL</th>
                  <th class="col-utm-y-awal">UTM Y AWAL</th>
                  <th class="col-pangkalan-awal">PANGKALAN AWAL</th>
                  <th class="col-utm-x-akhir">UTM X AKHIR</th>
                  <th class="col-utm-y-akhir">UTM Y AKHIR</th>
                  <th class="col-pangkalan-akhir">PANGKALAN AKHIR</th>
                </tr>
              </thead>
              <tbody>
          `;

          roadGroup.ruas.forEach((ruas) => {
            const condition = ruas.kondisi || "";
            let conditionClass = "";
            if (condition.includes("Baik")) conditionClass = "condition-baik";
            else if (condition.includes("Sedang"))
              conditionClass = "condition-sedang";
            else if (condition.includes("Rusak Ringan"))
              conditionClass = "condition-rusak-ringan";
            else if (condition.includes("Rusak Berat"))
              conditionClass = "condition-rusak-berat";

            html += `
              <tr>
                <td class="col-no-ruas">${ruas.noRuas || ""}</td>
                <td class="col-no-provinsi">${ruas.noProv || ""}</td>
                <td class="col-no-kabupaten">${ruas.noKab || ""}</td>
                <td class="col-no-kecamatan">${ruas.noKec || ""}</td>
                <td class="col-no-desa">${ruas.noDesa || ""}</td>
                <td class="col-no-jalan">${roadGroup.noJalan || ""}</td>
                <td class="col-nama-ruas">${ruas.nama || ""}</td>
                <td class="col-nama-jalan">${ruas.namaJalan || ""}</td>
                <td class="col-panjang">${formatNumber(ruas.panjangM || 0)}</td>
                <td class="col-lebar">${formatNumber(ruas.lebarM || 0)}</td>
                <td class="col-tahun">${ruas.tahun || ""}</td>
                <td class="col-kondisi ${conditionClass}">${condition}</td>
                <td class="col-nilai">${ruas.nilai || ""}</td>
                <td class="col-bobot">${ruas.bobot || ""}</td>
                <td class="col-keterangan">${ruas.keterangan || ""}</td>
                <td class="col-kecamatan">${ruas.kecamatan || ""}</td>
                <td class="col-desa">${ruas.desa || ""}</td>
                <td class="col-utm-x-awal">${ruas.utmXAwal || ""}</td>
                <td class="col-utm-y-awal">${ruas.utmYAwal || ""}</td>
                <td class="col-pangkalan-awal">${ruas.pngnlAwal || ""}</td>
                <td class="col-utm-x-akhir">${ruas.utmXAkhi || ""}</td>
                <td class="col-utm-y-akhir">${ruas.utmYAkhi || ""}</td>
                <td class="col-pangkalan-akhir">${ruas.pngnlAkhi || ""}</td>
              </tr>
            `;
          });

          html += `
                </tbody>
              </table>
              <div class="road-summary-section">
                <div class="road-info"><strong>TOTAL PANJANG M: ${formatDistance(
                  roadGroup.totalPanjang
                )}</strong></div>
              </div>
            </div>
          </div>
          `;
        });
      }

      html += `
          <div class="footer">
            <div>Laporan ini dibuat secara otomatis oleh Sistem Informasi Jalan Lingkungan (SIJALI)</div>
            <div>Kabupaten Kubu Raya - ${new Date().toLocaleDateString(
              "id-ID"
            )}</div>
            <div>&nbsp;</div>
          </div>
        </body>
        </html>
      `;

      return html;
    };

    // Generate HTML content
    const htmlContent = createHTMLContent();

    // Create a temporary element to hold the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Configure html2pdf options for A3 landscape
    const options = {
      margin: [0.5, 0.5, 1, 0.5], // top, right, bottom, left
      filename: `Laporan_${reportInfo.label.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 1.5, // Reduced scale to avoid zoomed appearance
        useCORS: true,
        allowTaint: false, // Set to false to avoid tainted canvas
        scrollX: 0,
        scrollY: 0,
        logging: false, // Disable logging for better performance
      },
      jsPDF: {
        unit: "in",
        format: "a3",
        orientation: "landscape",
        pageSize: { width: 16.5, height: 11.7 }, // A3 landscape in inches
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      },
      pagebreak: {
        mode: ["css"],
        avoid: [".road-summary-section", ".footer"],
      },
    };

    // Generate PDF first
    const pdfBlob = await html2pdf
      .default()
      .set(options)
      .from(tempDiv)
      .outputPdf("blob");

    // Convert PDF to DOCX using a different approach
    // Since direct PDF to DOCX conversion is complex, we'll use a workaround
    // by creating a DOCX with the PDF embedded as an object

    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      Table,
      TableRow,
      TableCell,
      WidthType,
      AlignmentType,
      PageOrientation,
      ExternalHyperlink,
      ImageRun,
    } = await import("docx");

    // Helper function to create table with optimized column widths
    const createTable = (headers, data) => {
      // Define optimized column widths for A3 landscape (23 columns)
      const columnWidths = [
        3, // NO. RUAS
        3, // NO. PROVINSI
        3, // NO. KABUPATEN
        3, // NO. KECAMATAN
        3, // NO. DESA
        3, // NO. JALAN
        5, // NAMA RUAS
        5, // NAMA JALAN
        3, // PANJANG (M)
        3, // LEBAR (M)
        2, // TAHUN
        4, // KONDISI JALAN
        2, // NILAI
        2, // BOBOT
        5, // KETERANGAN
        4, // KECAMATAN
        4, // DESA
        3, // UTM X AWAL
        3, // UTM Y AWAL
        4, // PANGKALAN AWAL
        3, // UTM X AKHIR
        3, // UTM Y AKHIR
        4, // PANGKALAN AKHIR
      ];

      const tableRows = [
        new TableRow({
          children: headers.map(
            (header, index) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: header, bold: true, size: 16 }), // Reduced font size
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                width: {
                  size: columnWidths[index] || 4,
                  type: WidthType.PERCENTAGE,
                },
              })
          ),
        }),
      ];

      data.forEach((row) => {
        tableRows.push(
          new TableRow({
            children: row.map((cell, index) => {
              const cellText = cell ? cell.toString() : "";
              let textColor = "000000"; // Default black

              // Check if this is the KONDISI JALAN column (index 11)
              if (index === 11) {
                const condition = cellText.toLowerCase();
                if (condition.includes("Baik")) {
                  textColor = "166534"; // Green-800 (#166534)
                } else if (condition.includes("Sedang")) {
                  textColor = "854d0e"; // Yellow-800 (#854d0e)
                } else if (condition.includes("Rusak Ringan")) {
                  textColor = "9a3412"; // Orange-800 (#9a3412)
                } else if (condition.includes("Rusak Berat")) {
                  textColor = "991b1b"; // Red-800 (#991b1b)
                }
              }

              return new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cellText,
                        size: 14, // Reduced font size (14 = 7pt)
                        color: textColor,
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                width: {
                  size: columnWidths[index] || 4,
                  type: WidthType.PERCENTAGE,
                },
              });
            }),
          })
        );
      });

      return new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: "fixed", // Use fixed layout for better control in landscape
      });
    };

    const docxChildren = [];

    // Title
    docxChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `LAPORAN ${reportInfo.label.toUpperCase()}`,
            bold: true,
            size: 28, // Reduced from 32
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );
    docxChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: getLocationText(reportInfo.location) || "Kabupaten Kubu Raya",
            size: 20, // Reduced from 24
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );
    docxChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: new Date().toLocaleDateString("id-ID"),
            size: 16, // Reduced from 20
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );
    docxChildren.push(new Paragraph({ children: [new TextRun({ text: "" })] })); // Spacing

    // Executive Summary
    docxChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "RINGKASAN EKSEKUTIF",
            bold: true,
            size: 24, // Reduced from 32
          }),
        ],
        spacing: { after: 300 }, // Reduced spacing
      })
    );

    if (data && data.summary) {
      // Create table for card layout
      const summaryTable = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              // Card 1: Total Jalan
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: formatNumber(data.summary.totalJalan || 0),
                        bold: true,
                        size: 36, // Reduced from 48
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Total Jalan",
                        size: 18, // Reduced from 24
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: {
                  fill: "4272C4", // Blue
                },
                width: { size: 25, type: WidthType.PERCENTAGE },
              }),
              // Card 2: Total Ruas
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: formatNumber(data.summary.totalRuas || 0),
                        bold: true,
                        size: 36, // Reduced from 48
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Total Ruas",
                        size: 18, // Reduced from 24
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: {
                  fill: "70AD47", // Green
                },
                width: { size: 25, type: WidthType.PERCENTAGE },
              }),
              // Card 3: Total Panjang
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: formatDistance(data.summary.totalLength || 0),
                        bold: true,
                        size: 36, // Reduced from 48
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Total Panjang",
                        size: 18, // Reduced from 24
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: {
                  fill: "FFC000", // Orange
                },
                width: { size: 25, type: WidthType.PERCENTAGE },
              }),
              // Card 4: Kecamatan
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: data.summary.kecamatan || "N/A",
                        bold: true,
                        size: 36, // Reduced from 48
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Kecamatan",
                        size: 18, // Reduced from 24
                        color: "FFFFFF",
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: {
                  fill: "7030A0", // Purple
                },
                width: { size: 25, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        ],
      });

      docxChildren.push(summaryTable);
      docxChildren.push(
        new Paragraph({
          children: [new TextRun({ text: "" })],
          spacing: { after: 400 },
        })
      );
    }
    docxChildren.push(new Paragraph({ children: [new TextRun({ text: "" })] })); // Spacing

    // Detailed Road Data
    if (data && data.roads && data.roads.length > 0) {
      docxChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "DATA DETAIL JALAN LINGKUNGAN",
              bold: true,
              size: 20, // Reduced from 24
            }),
          ],
        })
      );
      data.roads.forEach((roadGroup) => {
        docxChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `NO. JALAN: ${roadGroup.noJalan}`,
                bold: true,
                size: 16, // Reduced from 20
              }),
            ],
          })
        );

        docxChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Total Ruas: ${
                  roadGroup.totalRuas
                } | Total Panjang: ${formatDistance(roadGroup.totalPanjang)}`,
                size: 14, // Reduced from 18
              }),
            ],
          })
        );
        const segmentHeaders = [
          "NO. RUAS",
          "NO. PROVINSI",
          "NO. KABUPATEN",
          "NO. KECAMATAN",
          "NO. DESA",
          "NO. JALAN",
          "NAMA RUAS",
          "NAMA JALAN",
          "PANJANG (M)",
          "LEBAR (M)",
          "TAHUN",
          "KONDISI JALAN",
          "NILAI",
          "BOBOT",
          "KETERANGAN",
          "KECAMATAN",
          "DESA",
          "UTM X AWAL",
          "UTM Y AWAL",
          "PANGKALAN AWAL",
          "UTM X AKHIR",
          "UTM Y AKHIR",
          "PANGKALAN AKHIR",
        ];
        const segmentData = roadGroup.ruas.map((ruas) => [
          ruas.noRuas || "",
          ruas.noProv || "",
          ruas.noKab || "",
          ruas.noKec || "",
          ruas.noDesa || "",
          roadGroup.noJalan || "",
          ruas.nama || "",
          ruas.namaJalan || "",
          formatNumber(ruas.panjangM || 0),
          formatNumber(ruas.lebarM || 0),
          ruas.tahun || "",
          ruas.kondisi || "",
          ruas.nilai || "",
          ruas.bobot || "",
          ruas.keterangan || "",
          ruas.kecamatan || "",
          ruas.desa || "",
          ruas.utmXAwal || "",
          ruas.utmYAwal || "",
          ruas.pngnlAwal || "",
          ruas.utmXAkhi || "",
          ruas.utmYAkhi || "",
          ruas.pngnlAkhi || "",
        ]);
        docxChildren.push(createTable(segmentHeaders, segmentData));
        docxChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `TOTAL PANJANG M: ${formatDistance(
                  roadGroup.totalPanjang
                )}`,
                bold: true,
                size: 14, // Reduced from 18
              }),
            ],
          })
        );
        docxChildren.push(
          new Paragraph({ children: [new TextRun({ text: "" })] })
        ); // Spacing
      });
    }

    docxChildren.push(new Paragraph({ children: [new TextRun({ text: "" })] })); // Spacing before footer

    // Footer
    docxChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Laporan ini dibuat secara otomatis oleh Sistem Informasi Jalan Lingkungan (SIJALI)",
            size: 14, // Reduced from 16
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );
    docxChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Kabupaten Kubu Raya - ${new Date().toLocaleDateString(
              "id-ID"
            )}`,
            size: 14, // Reduced from 16
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
                width: 16838, // A3 landscape width in twips (420mm = 42cm)
                height: 11906, // A3 landscape height in twips (297mm = 29.7cm)
              },
              margins: {
                top: 720, // 0.5 inch in twips for better space utilization
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: docxChildren,
        },
      ],
    });

    return doc;
  };

  const generateExcel = async (reportData) => {
    const { reportInfo, data } = reportData;

    // Dynamic import for client-side only
    const XLSX = await import("xlsx");

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      [`LAPORAN ${reportInfo.label.toUpperCase()}`],
      [getLocationText(reportInfo.location) || "Kabupaten Kubu Raya"],
      [new Date().toLocaleDateString("id-ID")],
      [""],
      ["RINGKASAN EKSEKUTIF"],
    ];
    if (data && data.summary) {
      summaryData.push(
        ["Total Jalan", data.summary.totalJalan || 0],
        ["Total Ruas", data.summary.totalRuas || 0],
        ["Total Panjang", formatDistance(data.summary.totalLength || 0)],
        ["Kecamatan", data.summary.kecamatan || "N/A"],
        ["Desa", data.summary.desa || "N/A"]
      );
    }
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

    // Add styling to summary sheet
    const range = XLSX.utils.decode_range(wsSummary["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!wsSummary[cellAddress]) continue;

        // Style header row
        if (R === 0) {
          wsSummary[cellAddress].s = {
            font: { bold: true, size: 16, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4472C4" } },
            alignment: { horizontal: "center" },
          };
        }
        // Style title rows
        else if (R <= 3) {
          wsSummary[cellAddress].s = {
            font: { bold: true, size: 14 },
            alignment: { horizontal: "center" },
          };
        }
        // Style summary section
        else if (R === 4) {
          wsSummary[cellAddress].s = {
            font: { bold: true, size: 12, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "70AD47" } },
          };
        }
        // Style data rows
        else {
          wsSummary[cellAddress].s = {
            font: { size: 11 },
            fill: { fgColor: { rgb: "F2F2F2" } },
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, wsSummary, "Ringkasan");

    // Detailed Road Data Sheet
    if (data && data.roads && data.roads.length > 0) {
      let detailedData = [
        [
          `DATA DETAIL JALAN LINGKUNGAN - ${
            getLocationText(reportInfo.location) || "Kabupaten Kubu Raya"
          }`,
        ],
        [],
        // Headers
        [
          "NO. RUAS",
          "NO. PROVINSI",
          "NO. KABUPATEN",
          "NO. KECAMATAN",
          "NO. DESA",
          "NO. JALAN",
          "NAMA RUAS",
          "NAMA JALAN",
          "PANJANG (M)",
          "LEBAR (M)",
          "TAHUN",
          "KONDISI JALAN",
          "NILAI",
          "BOBOT",
          "KETERANGAN",
          "KECAMATAN",
          "DESA",
          "UTM X AWAL",
          "UTM Y AWAL",
          "PANGKALAN AWAL",
          "UTM X AKHIR",
          "UTM Y AKHIR",
          "PANGKALAN AKHIR",
        ],
      ];

      // Add all road segments data
      data.roads.forEach((roadGroup) => {
        roadGroup.ruas.forEach((ruas) => {
          detailedData.push([
            ruas.noRuas || "",
            ruas.noProv || "",
            ruas.noKab || "",
            ruas.noKec || "",
            ruas.noDesa || "",
            roadGroup.noJalan || "",
            ruas.nama || "",
            ruas.namaJalan || "",
            formatNumber(ruas.panjangM || 0),
            formatNumber(ruas.lebarM || 0),
            ruas.tahun || "",
            ruas.kondisi || "",
            ruas.nilai || "",
            ruas.bobot || "",
            ruas.keterangan || "",
            ruas.kecamatan || "",
            ruas.desa || "",
            ruas.utmXAwal || "",
            ruas.utmYAwal || "",
            ruas.pngnlAwal || "",
            ruas.utmXAkhi || "",
            ruas.utmYAkhi || "",
            ruas.pngnlAkhi || "",
          ]);
        });
      });

      const wsDetailed = XLSX.utils.aoa_to_sheet(detailedData);

      // Add styling to detailed sheet
      const detailRange = XLSX.utils.decode_range(wsDetailed["!ref"]);
      for (let R = detailRange.s.r; R <= detailRange.e.r; ++R) {
        for (let C = detailRange.s.c; C <= detailRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!wsDetailed[cellAddress]) continue;

          // Style title row
          if (R === 0) {
            wsDetailed[cellAddress].s = {
              font: { bold: true, size: 16, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "4472C4" } },
              alignment: { horizontal: "center" },
            };
          }
          // Style header row (row 2)
          else if (R === 2) {
            wsDetailed[cellAddress].s = {
              font: { bold: true, size: 10, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "70AD47" } },
              alignment: { horizontal: "center" },
            };
          }
          // Style data rows
          else if (R > 2) {
            // Check if this is the KONDISI JALAN column (index 11)
            if (C === 11) {
              const cellValue = wsDetailed[cellAddress].v;
              if (cellValue) {
                const condition = cellValue.toString().toLowerCase();
                let fillColor = "FFFFFF";
                let textColor = "000000";

                if (condition.includes("Baik")) {
                  fillColor = "C6EFCE";
                  textColor = "006100";
                } else if (condition.includes("Sedang")) {
                  fillColor = "FFEB9C";
                  textColor = "9C5700";
                } else if (condition.includes("Rusak Ringan")) {
                  fillColor = "FFC7CE";
                  textColor = "9C0006";
                } else if (condition.includes("Rusak Berat")) {
                  fillColor = "FFB6C1";
                  textColor = "9C0006";
                }

                wsDetailed[cellAddress].s = {
                  font: { size: 9, color: { rgb: textColor } },
                  fill: { fgColor: { rgb: fillColor } },
                  alignment: { horizontal: "center" },
                };
              }
            } else {
              // Alternate row colors
              const fillColor = R % 2 === 0 ? "F2F2F2" : "FFFFFF";
              wsDetailed[cellAddress].s = {
                font: { size: 9 },
                fill: { fgColor: { rgb: fillColor } },
                alignment: { horizontal: "center" },
              };
            }
          }
        }
      }

      XLSX.utils.book_append_sheet(workbook, wsDetailed, "Detail Jalan");
    }

    return workbook;
  };

  const downloadReport = async (reportData, format) => {
    try {
      let file, filename;

      // Generate filename with new format: Laporan_Jalan_Lingkungan - (kabupaten) - (desa) - (tanggal)
      const generateFilename = (extension) => {
        const reportType = reportData.reportInfo.label.replace(/\s+/g, "_");
        const kabupaten =
          reportData.reportInfo.location?.kecamatan || "Unknown";
        const desa = reportData.reportInfo.location?.desa || "Unknown";
        const tanggal = new Date().toISOString().split("T")[0];

        return `Laporan_${reportType}_-_${kabupaten}_-_${desa}_-_${tanggal}.${extension}`;
      };

      switch (format) {
        case "pdf":
          await generatePDF(reportData);
          filename = generateFilename("pdf");
          break;

        case "xlsx":
          file = await generateExcel(reportData);
          filename = generateFilename("xlsx");
          const XLSX = await import("xlsx");
          XLSX.writeFile(file, filename);
          break;

        default:
          throw new Error(`Format ${format} tidak didukung`);
      }

      return { success: true, filename };
    } catch (error) {
      console.error("Error generating report:", error);
      return { success: false, error: error.message };
    }
  };

  // Helper functions
  const formatNumber = (num) => {
    if (!num) return "0";
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const formatDistance = (meters) => {
    if (!meters) return "0 m";
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  const getPercentage = (value, total) => {
    if (!total || total === 0) return "0";
    return ((value / total) * 100).toFixed(1);
  };

  const getLocationText = (location) => {
    if (!location) return "";
    const { kecamatan, desa } = location;
    if (kecamatan && desa) {
      return `${kecamatan} - ${desa}`;
    } else if (kecamatan) {
      return kecamatan;
    } else if (desa) {
      return desa;
    }
    return "";
  };

  return {
    generatePDF,
    generateDOCX,
    generateExcel,
    downloadReport,
    generatePreviewHTML,
  };
};
