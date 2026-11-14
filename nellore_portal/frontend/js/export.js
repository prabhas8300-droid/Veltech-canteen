// Nellore District Portal - Data Export Suite (CSV, Excel & PDF Report)
// Works both with live REST server and offline browser client via Data Blobs

function downloadCSV(type) {
    let filename = '';
    let csvContent = '';

    if (type === 'mandals') {
        filename = 'Nellore_District_Mandals_Report.csv';
        const mandals = (typeof state !== 'undefined' && state.mandals && state.mandals.length > 0) ? state.mandals : FALLBACK_DATA.mandals;
        const lines = ["Mandal,Telugu Name,Revenue Division,Total Villages,Total Panchayats,Population,Male Pop,Female Pop,Area (sq.km),Density (per sq.km),Literacy Rate (%),Agri Land (Ha),Schools,Hospitals"];
        mandals.forEach(m => {
            lines.push(`"${m.name}","${m.telugu_name}","${m.revenue_division}",${m.total_villages},${m.total_panchayats},${m.population},${m.male_pop},${m.female_pop},${m.area_sqkm},${m.density},${m.literacy_rate},${m.agricultural_land_ha},${m.schools_count},${m.hospitals_count}`);
        });
        csvContent = lines.join("\n");
    } else if (type === 'agriculture') {
        filename = 'Nellore_Agriculture_Land_Report.csv';
        const crops = FALLBACK_DATA.crops;
        const lines = ["Crop / Commodity,Telugu Name,Area (Ha),Production (MT),Yield (Kg/Ha),Notes"];
        crops.forEach(c => {
            lines.push(`"${c.item_name}","${c.telugu_name}",${c.area_ha},${c.production_mt},${c.yield_kg_ha || 0},"${c.notes}"`);
        });
        csvContent = lines.join("\n");
    } else if (type === 'exports') {
        filename = 'Nellore_Trade_Exports_Imports.csv';
        const exports = FALLBACK_DATA.exports;
        const imports = FALLBACK_DATA.imports;
        const lines = ["Trade Type,Commodity,Value (Rs Crores),Volume (MT),Partner Countries,Key Players / Port"];
        exports.forEach(e => {
            lines.push(`"Export","${e.product_name}",${e.export_value_cr},${e.volume_mt},"${e.top_destinations}","${e.major_companies}"`);
        });
        imports.forEach(i => {
            lines.push(`"Import","${i.product_name}",${i.import_value_cr},${i.volume_mt},"${i.source_countries}","${i.port_handled}"`);
        });
        csvContent = lines.join("\n");
    }

    if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function generateDistrictPDF() {
    const printWindow = window.open('', '_blank');
    const now = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Nellore District Executive Dossier 2026</title>
        <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; line-height: 1.5; }
            .header { border-bottom: 3px solid #0f2b5c; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .title { color: #0f2b5c; font-size: 26px; font-weight: bold; margin: 0; }
            .subtitle { color: #475569; font-size: 14px; margin-top: 4px; }
            .badge { background: #059669; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
            .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
            .card-val { font-size: 18px; font-weight: bold; color: #0f2b5c; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background: #0f2b5c; color: white; padding: 8px 10px; text-align: left; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
            .section-title { font-size: 16px; font-weight: bold; color: #0f2b5c; margin-top: 30px; margin-bottom: 10px; border-left: 4px solid #f59e0b; padding-left: 10px; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
            @media print {
                body { padding: 20px; }
                button { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1 class="title">NELLORE DISTRICT DIGITAL PORTAL</h1>
                <div class="subtitle">Sri Potti Sriramulu Nellore District, Andhra Pradesh | Official Executive Dossier</div>
            </div>
            <div>
                <span class="badge">OFFICIAL VERIFIED REPORT</span>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Generated: ${now}</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <div class="card-title">Total Population</div>
                <div class="card-val">29.64 Lakhs</div>
            </div>
            <div class="card">
                <div class="card-title">Geographical Area</div>
                <div class="card-val">13,076 km²</div>
            </div>
            <div class="card">
                <div class="card-title">Revenue Mandals</div>
                <div class="card-val">38 Mandals</div>
            </div>
            <div class="card">
                <div class="card-title">Gram Panchayats</div>
                <div class="card-val">672 Panchayats</div>
            </div>
            <div class="card">
                <div class="card-title">Agricultural Land</div>
                <div class="card-val">5.83 Lakh Ha</div>
            </div>
            <div class="card">
                <div class="card-title">Annual Exports</div>
                <div class="card-val">₹22,450 Crores</div>
            </div>
            <div class="card">
                <div class="card-title">Literacy Rate</div>
                <div class="card-val">68.9%</div>
            </div>
            <div class="card">
                <div class="card-title">Per-Person Land</div>
                <div class="card-val">0.44 Hectares</div>
            </div>
        </div>

        <div class="section-title">Key Economic & Agro Strengths</div>
        <p style="font-size: 12px; color: #334155; line-height: 1.6;">
            Nellore District is recognized as the <b>Shrimp Capital of India</b> contributing 24.5% to the national marine exports. It is home to the world-renowned <b>Nellore Molagolukulu</b> paddy variety, Asia's premier <b>Gudur Sour Lemon market</b>, world-class <b>Gudur Mica and Silica belt</b>, and the strategic <b>Adani Krishnapatnam Deep-Water Port</b> with 18.5m draft capacity.
        </p>

        <div class="section-title">Nellore 2036 Strategic Milestones</div>
        <table>
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Strategic Project</th>
                    <th>Category</th>
                    <th>Investment (₹ Cr)</th>
                    <th>Projected Employment</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2026</td>
                    <td>Smart Rural Fiber Grid & Digital Village Secretariats</td>
                    <td>Smart Villages</td>
                    <td>₹350 Cr</td>
                    <td>4,500 Jobs</td>
                    <td>Ongoing</td>
                </tr>
                <tr>
                    <td>2027</td>
                    <td>Dagadarthi Greenfield Airport & Perishable Air Cargo</td>
                    <td>Aviation & Cargo</td>
                    <td>₹680 Cr</td>
                    <td>6,200 Jobs</td>
                    <td>Under Execution</td>
                </tr>
                <tr>
                    <td>2028</td>
                    <td>Nellore-Krishnapatnam CBIC Industrial Mega Node</td>
                    <td>Manufacturing</td>
                    <td>₹4,200 Cr</td>
                    <td>38,000 Jobs</td>
                    <td>Approved Phase 1</td>
                </tr>
                <tr>
                    <td>2030</td>
                    <td>Krishnapatnam Green Hydrogen & Offshore Wind Port</td>
                    <td>Clean Energy</td>
                    <td>₹6,500 Cr</td>
                    <td>22,000 Jobs</td>
                    <td>Feasibility Completed</td>
                </tr>
                <tr>
                    <td>2036</td>
                    <td>Nellore Net-Zero Carbon Neutral & High-Tech Agritech District</td>
                    <td>Vision 2036</td>
                    <td>₹12,000 Cr</td>
                    <td>50,000 Jobs</td>
                    <td>Vision Target</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <div>Data Source: Census of India, Directorate of Economics & Statistics AP, MPEDA</div>
            <div>Nellore District Digital Development Portal &copy; 2026</div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="background: #0f2b5c; color: white; padding: 8px 24px; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
        </div>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
}
