// Nellore District Portal - Chart.js Visualization Suite

let chartInstances = {};

function initCharts() {
    // 1. Demographics Gender Chart
    const ctxGender = document.getElementById('genderChart');
    if (ctxGender) {
        if (chartInstances.gender) chartInstances.gender.destroy();
        chartInstances.gender = new Chart(ctxGender, {
            type: 'doughnut',
            data: {
                labels: ['Male Population (14.93L)', 'Female Population (14.70L)'],
                datasets: [{
                    data: [1493254, 1470303],
                    backgroundColor: ['#1e40af', '#ec4899'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter' } } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = 2963557;
                                const pct = ((context.raw / total) * 100).toFixed(1);
                                return ` ${context.label}: ${context.raw.toLocaleString()} (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    // 2. Demographics Rural vs Urban
    const ctxUrbanRural = document.getElementById('urbanRuralChart');
    if (ctxUrbanRural) {
        if (chartInstances.urbanRural) chartInstances.urbanRural.destroy();
        chartInstances.urbanRural = new Chart(ctxUrbanRural, {
            type: 'doughnut',
            data: {
                labels: ['Rural Population (70.9%)', 'Urban Population (29.1%)'],
                datasets: [{
                    data: [2100347, 863210],
                    backgroundColor: ['#10b981', '#f59e0b'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter' } } }
                },
                cutout: '68%'
            }
        });
    }

    // 3. Land Use Distribution Chart
    const ctxLand = document.getElementById('landDistributionChart');
    if (ctxLand) {
        if (chartInstances.land) chartInstances.land.destroy();
        chartInstances.land = new Chart(ctxLand, {
            type: 'pie',
            data: {
                labels: [
                    'Agricultural Land (5.83L Ha)',
                    'Forest Reserves (2.64L Ha)',
                    'Water Bodies & Wetlands (1.24L Ha)',
                    'Fallow & Cultivable Waste (0.76L Ha)',
                    'Residential Settlement (0.49L Ha)',
                    'Industrial & Port Zones (0.34L Ha)',
                    'Pastures & Barren (1.77L Ha)'
                ],
                datasets: [{
                    data: [583200, 263800, 124500, 76400, 48900, 34200, 176600],
                    backgroundColor: [
                        '#10b981', // Agri green
                        '#047857', // Forest dark green
                        '#0284c7', // Water blue
                        '#fbbf24', // Fallow amber
                        '#6366f1', // Residential indigo
                        '#ef4444', // Industrial red
                        '#94a3b8'  // Barren grey
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } } },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const total = 1307600;
                                const pct = ((ctx.raw / total) * 100).toFixed(1);
                                return ` ${ctx.label}: ${ctx.raw.toLocaleString()} Ha (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 4. Crop Production Volumes
    const ctxCrops = document.getElementById('cropsChart');
    if (ctxCrops) {
        if (chartInstances.crops) chartInstances.crops.destroy();
        chartInstances.crops = new Chart(ctxCrops, {
            type: 'bar',
            data: {
                labels: [
                    'Paddy (Rice)',
                    'Sugarcane',
                    'Vannamei Shrimp',
                    'Gudur Lemons',
                    'Coconut & Nuts',
                    'Groundnut',
                    'Red Chillies',
                    'Black Gram'
                ],
                datasets: [{
                    label: 'Annual Production (Metric Tonnes)',
                    data: [1485000, 2137500, 432000, 363000, 196800, 84600, 73600, 38600],
                    backgroundColor: [
                        '#059669', '#10b981', '#0ea5e9', '#eab308',
                        '#14b8a6', '#f97316', '#dc2626', '#8b5cf6'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` Production: ${ctx.raw.toLocaleString()} Metric Tonnes`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: (val) => (val >= 1000000 ? `${(val/1000000).toFixed(1)}M MT` : `${(val/1000).toFixed(0)}K MT`)
                        },
                        grid: { color: '#f1f5f9' }
                    },
                    y: { grid: { display: false } }
                }
            }
        });
    }

    // 5. Export Growth Trend 2020 - 2026
    const ctxExports = document.getElementById('exportTrendChart');
    if (ctxExports) {
        if (chartInstances.exports) chartInstances.exports.destroy();
        chartInstances.exports = new Chart(ctxExports, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026 (Est.)'],
                datasets: [
                    {
                        label: 'Merchandise Exports (₹ in Crores)',
                        data: [14200, 15800, 17950, 19800, 21100, 22450, 24800],
                        borderColor: '#0284c7',
                        backgroundColor: 'rgba(2, 132, 199, 0.1)',
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#0284c7',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        borderWidth: 3
                    },
                    {
                        label: 'Krishnapatnam Port Cargo (Million MT)',
                        data: [38.2, 40.5, 43.1, 46.0, 47.8, 48.6, 52.0],
                        borderColor: '#f59e0b',
                        borderDash: [5, 5],
                        tension: 0.3,
                        pointBackgroundColor: '#f59e0b',
                        pointRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter' } } }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Exports Value (₹ Crores)' },
                        ticks: { callback: (v) => `₹${v.toLocaleString()} Cr` },
                        grid: { color: '#f1f5f9' }
                    },
                    y1: {
                        position: 'right',
                        title: { display: true, text: 'Cargo (MMT)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // 6. Export Commodity Shares
    const ctxExpCommodities = document.getElementById('exportCommoditiesChart');
    if (ctxExpCommodities) {
        if (chartInstances.expCommodities) chartInstances.expCommodities.destroy();
        chartInstances.expCommodities = new Chart(ctxExpCommodities, {
            type: 'doughnut',
            data: {
                labels: [
                    'Frozen Shrimp & Aqua (₹11,400 Cr)',
                    'Non-Basmati Rice (₹3,850 Cr)',
                    'Specialty Footwear (₹2,450 Cr)',
                    'Processed Mica (₹1,250 Cr)',
                    'Silica Sand & Quartz (₹890 Cr)',
                    'Polished Granite (₹780 Cr)',
                    'Bulk Drugs & APIs (₹730 Cr)',
                    'Gudur Lemons (₹620 Cr)',
                    'Venkatagiri Sarees (₹480 Cr)'
                ],
                datasets: [{
                    data: [11400, 3850, 2450, 1250, 890, 780, 730, 620, 480],
                    backgroundColor: [
                        '#0284c7', '#10b981', '#8b5cf6', '#f59e0b',
                        '#64748b', '#ec4899', '#06b6d4', '#84cc16', '#d97706'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ₹${ctx.raw.toLocaleString()} Cr`
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // 7. Nellore 2036 Vision Projections
    const ctxVision = document.getElementById('visionProjectionsChart');
    if (ctxVision) {
        if (chartInstances.vision) chartInstances.vision.destroy();
        chartInstances.vision = new Chart(ctxVision, {
            type: 'line',
            data: {
                labels: ['2026', '2028', '2030', '2032', '2034', '2036'],
                datasets: [
                    {
                        label: 'Projected District GDP (₹ in Thousand Crores)',
                        data: [78, 92, 110, 132, 158, 190],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.35,
                        pointRadius: 5,
                        pointBackgroundColor: '#10b981',
                        borderWidth: 3
                    },
                    {
                        label: 'Projected Population (Lakhs)',
                        data: [32.1, 32.8, 33.5, 34.2, 34.8, 35.4],
                        borderColor: '#1e40af',
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: '#1e40af',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter' } } }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'District GDP (₹ Thousand Cr)' },
                        ticks: { callback: (v) => `₹${v}K Cr` },
                        grid: { color: '#f1f5f9' }
                    },
                    y1: {
                        position: 'right',
                        title: { display: true, text: 'Population (in Lakhs)' },
                        ticks: { callback: (v) => `${v}L` },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}
