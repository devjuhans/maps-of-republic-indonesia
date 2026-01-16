// Map Initialization
const map = L.map("map").setView([-2.5, 118], 5);

L.control.scale().addTo(map);

//Tiles Layer
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

const esriLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 20,
    }
)

//Basemap Thumbnail
const osmThumb = document.getElementById("osmThumb");
const esriThumb = document.getElementById("esriThumb");

function setActive(el) {
    document.querySelectorAll(".basemap-thumb").forEach(t => t.classList.remove("active"));
    el.classList.add("active");
    }

    osmThumb.onclick = () => {
    map.addLayer(osmLayer);
    map.removeLayer(esriLayer);
    setActive(osmThumb);
};

esriThumb.onclick = () => {
    map.addLayer(esriLayer);
    map.removeLayer(osmLayer);
    setActive(esriThumb);
};

// Activate Default Basemap
setActive(osmThumb);

osmThumb.addEventListener("click", () => {
    if (map.hasLayer(esriLayer)) map.removeLayer(esriLayer);
    osmLayer.addTo(map);
    setActive(osmThumb);
});

esriThumb.addEventListener("click", () => {
    if (map.hasLayer(osmLayer)) map.removeLayer(osmLayer);
    esriLayer.addTo(map);
    setActive(esriThumb);
});


// Global Variables
const BIG_SERVICE_URL =
    "https://kspservices.big.go.id/satupeta/rest/services/PUBLIK/BATAS_WILAYAH/MapServer";
const GARIS_PANTAI_URL =
    "https://geoservices.big.go.id/rbi/rest/services/GARISPANTAI/GarisPantai_25K/MapServer";

let activeLayerIds = [];
let activeLayerUrls = {};

// Duplicate Prevention Flag
let isInitializingLayers = true;

// Collapsible Layer Control
const CollapsibleLayerControl = L.Control.extend({
    options: { position: "topleft" },

    onAdd() {
        const div = L.DomUtil.create("div", "layer-control");

        div.innerHTML = `
            <div class="layer-control-header">
                <span class="title">Layers</span>
            </div>

            <div class="layer-control-body open">

                <div class="layer-group">
                    <div class="layer-group-header" data-group="maritim">
                        <span class="arrow">▾</span> Batas Maritim
                    </div>
                    <div class="layer-group-content open" data-content="maritim">
                        <div class="toggle"><input type="checkbox" id="kontinen" data-layer="kontinen"><label for="kontinen"></label><span>Peta Batas Landas Kontinen</span></div>
                        <div class="toggle"><input type="checkbox" id="teritorial" data-layer="teritorial"><label for="teritorial"></label><span>Peta Batas Teritorial</span></div>
                        <div class="toggle"><input type="checkbox" id="zee" data-layer="zee"><label for="zee"></label><span>Peta Batas ZEE</span></div>
                        <div class="toggle"><input type="checkbox" id="pangkal" data-layer="pangkal"><label for="pangkal"></label><span>Peta Garis Pangkal</span></div>
                        <div class="toggle"><input type="checkbox" id="zona" data-layer="zona"><label for="zona"></label><span>Peta Zona Tambahan</span></div>
                        <div class="toggle"><input type="checkbox" id="mou" data-layer="mou"><label for="mou"></label><span>Peta Batas Laut MOU Fisheries</span></div>
                    </div>
                </div>

                <div class="layer-group">
                    <div class="layer-group-header" data-group="daratan">
                        <span class="arrow">▾</span> Batas Daratan
                    </div>
                    <div class="layer-group-content open" data-content="daratan">
                        <div class="toggle"><input type="checkbox" id="darat" data-layer="darat"><label for="darat"></label><span>Darat Negara</span></div>
                        <div class="toggle"><input type="checkbox" id="provinsi" data-layer="provinsi"><label for="provinsi"></label><span>Provinsi</span></div>
                        <div class="toggle"><input type="checkbox" id="kabkota" data-layer="kabkota"><label for="kabkota"></label><span>Kabupaten/Kota</span></div>
                    </div>
                </div>

                <div class="layer-group">
                    <div class="layer-group-header" data-group="pantai">
                        <span class="arrow">▾</span> Garis Pantai
                    </div>
                    <div class="layer-group-content open" data-content="pantai">
                        <div class="toggle"><input type="checkbox" id="pantai" data-layer="pantai"><label for="pantai"></label><span>Garis Pantai</span></div>
                    </div>
                </div>

            </div>
        `;

        L.DomEvent.disableClickPropagation(div);
        return div;
    }
});

map.addControl(new CollapsibleLayerControl());

// External toggle button
const layerPanel = document.querySelector(".layer-control");
document.getElementById("layerToggleBtn").addEventListener("click", () => {
    layerPanel.classList.toggle("open");
});

// Layer Control Collapsible Groups
document.addEventListener("click", e => {
    const header = e.target.closest(".layer-group-header");
    if (!header) return;

    const group = header.dataset.group;
    const content = document.querySelector(
        `.layer-group-content[data-content="${group}"]`
    );
    const arrow = header.querySelector(".arrow");

    content.classList.toggle("open");
    arrow.textContent = content.classList.contains("open") ? "▾" : "▸";
});

// Layers Definition
// ==============================
// Maritim
const batasLandasKontinen = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [7], opacity: 0.9 });
const batasLandasTeritorial = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [9], opacity: 0.9 });
const batasLandasZEE = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [10], opacity: 0.9 });
const batasLandasGarisPangkal = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [11], opacity: 0.9 });
const batasLandasZonaTambahan = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [12], opacity: 0.9 });
const batasLandasMOUFisheries = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [8], opacity: 0.9 });

// Daratan
const batasLandasDaratNegara = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [5], opacity: 0.9 });
const batasProvinsi = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [0], opacity: 0.9 });
const batasKabupatenKota = L.esri.dynamicMapLayer({ url: BIG_SERVICE_URL, layers: [1], opacity: 0.9 });

// Pantai
const garisPantai = L.esri.dynamicMapLayer({
    url: GARIS_PANTAI_URL,
    layers: [0],
    opacity: 0.9
});

// Layer Registry
const layerMap = {
    kontinen: { layer: batasLandasKontinen, serviceUrl: BIG_SERVICE_URL },
    teritorial: { layer: batasLandasTeritorial, serviceUrl: BIG_SERVICE_URL },
    zee: { layer: batasLandasZEE, serviceUrl: BIG_SERVICE_URL },
    pangkal: { layer: batasLandasGarisPangkal, serviceUrl: BIG_SERVICE_URL },
    zona: { layer: batasLandasZonaTambahan, serviceUrl: BIG_SERVICE_URL },
    mou: { layer: batasLandasMOUFisheries, serviceUrl: BIG_SERVICE_URL },
    darat: { layer: batasLandasDaratNegara, serviceUrl: BIG_SERVICE_URL },
    provinsi: { layer: batasProvinsi, serviceUrl: BIG_SERVICE_URL },
    kabkota: { layer: batasKabupatenKota, serviceUrl: BIG_SERVICE_URL },
    pantai: { layer: garisPantai, serviceUrl: GARIS_PANTAI_URL }
};

const layerIds = {
    kontinen: 7,
    teritorial: 9,
    zee: 10,
    pangkal: 11,
    zona: 12,
    mou: 8,
    darat: 5,
    provinsi: 0,
    kabkota: 1,
    pantai: 0
};

// Toggle Function
function toggleLayer(layerObj, id, key, isOn) {
    if (isOn) {
        layerObj.layer.addTo(map);
        if (!activeLayerIds.includes(id)) activeLayerIds.push(id);
        activeLayerUrls[id] = layerObj.serviceUrl;
    } else {
        map.removeLayer(layerObj.layer);
        activeLayerIds = activeLayerIds.filter(x => x !== id);
        delete activeLayerUrls[id];
    }

    if (!isInitializingLayers) {
        updateLegend();
    }
}

document.addEventListener("change", e => {
    const key = e.target.dataset.layer;
    if (!layerMap[key]) return;
    toggleLayer(layerMap[key], layerIds[key], key, e.target.checked);
});

// Default Active Layers
["kontinen","teritorial","zee","pangkal","zona","mou","darat","pantai","provinsi"].forEach(key => {
    document.querySelector(`input[data-layer="${key}"]`).checked = true;
    toggleLayer(layerMap[key], layerIds[key], key, true);
});

isInitializingLayers = false;
updateLegend();

// Legend Functions
async function loadArcGISLegend(serviceUrl, layerId, containerId) {
    try {
        const res = await fetch(`${serviceUrl}/legend?f=pjson`);
        const data = await res.json();
        const container = document.getElementById(containerId);

        const targetLayer = data.layers.find(l => l.layerId === layerId);
        if (!targetLayer) return;

        const layerContainer = document.createElement("div");
        layerContainer.className = "legend-layer-container";

        const title = document.createElement("div");
        title.className = "legend-layer-title";
        title.textContent = targetLayer.layerName;
        layerContainer.appendChild(title);

        targetLayer.legend.forEach(item => {
            const row = document.createElement("div");
            row.className = "legend-row";
            row.innerHTML = `
                <img src="data:${item.contentType};base64,${item.imageData}">
                <span>${item.label || ""}</span>
            `;
            layerContainer.appendChild(row);
        });

        container.appendChild(layerContainer);
    } catch (err) {
        console.warn("Legend load error:", err);
    }
}

function updateLegend() {
    const container = document.getElementById("server-legend-content");
    container.innerHTML = "";
    if (!activeLayerIds.length) return;

    const serviceGroups = {};

    activeLayerIds.forEach(id => {
        const url = activeLayerUrls[id];
        if (!url) return;
        serviceGroups[url] ??= [];
        if (!serviceGroups[url].includes(id)) {
            serviceGroups[url].push(id);
        }
    });

    Object.entries(serviceGroups).forEach(([url, ids]) => {
        ids.forEach(id => loadArcGISLegend(url, id, "server-legend-content"));
    });
}

// Open Legend Panel on Load
requestAnimationFrame(() => {
    const legendPanel = document.querySelector(".legend-control");
    if (legendPanel) {
        legendPanel.classList.add("open");
    }
});


// Collapsible Legend Control
const CollapsibleLegendControl = L.Control.extend({
    options: { position: "topright" },

    onAdd() {
        const div = L.DomUtil.create("div", "legend-control");

        div.innerHTML = `
            <div class="legend-control-header">
                <span class="title">Legenda</span>
            </div>
            <div class="legend-control-body">
                <div id="server-legend-content"></div>
            </div>
        `;

        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        return div;
    }
});

map.addControl(new CollapsibleLegendControl());

// External legend toggle
const legendPanel = document.querySelector(".legend-control");
document.getElementById("legendToggleBtn").addEventListener("click", () => {
    legendPanel.classList.toggle("open");
});

document.addEventListener("click", e => {
    if (e.target.closest(".toggle-legend")) {
        legendPanel.classList.remove("open");
    }
});


//Get Features Info on Click
map.on("click", handleMapClick);

async function handleMapClick(e) {
    if (!activeLayerIds.length) return;

    const mapSize = map.getSize();
    const bounds = map.getBounds();

    // Layer Grouping by Service URL
    const serviceGroups = {};
    activeLayerIds.forEach(id => {
        const url = activeLayerUrls[id];
        if (!url) return;
        serviceGroups[url] ??= [];
        serviceGroups[url].push(id);
    });

    const results = [];

    for (const [serviceUrl, layerIds] of Object.entries(serviceGroups)) {
        const identifyUrl = `${serviceUrl}/identify`;

        const params = new URLSearchParams({
            f: "json",
            tolerance: 10,
            returnGeometry: false,
            imageDisplay: `${mapSize.x},${mapSize.y},96`,
            mapExtent: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
            geometryType: "esriGeometryPoint",
            geometry: `${e.latlng.lng},${e.latlng.lat}`,
            sr: 4326,
            layers: `all:${layerIds.join(",")}`
        });

        try {
            const res = await fetch(`${identifyUrl}?${params.toString()}`);
            const data = await res.json();

            if (data.results?.length) {
                data.results.forEach(r => {
                    const uid =
                        `${r.layerId}-${r.attributes.OBJECTID ??
                        r.attributes.objectid ??
                        r.attributes.FID ??
                        JSON.stringify(r.attributes)}`;

                    if (!results.some(x =>
                        x.layerId === r.layerId &&
                        (x.attributes.OBJECTID ?? x.attributes.objectid ?? x.attributes.FID) ===
                        (r.attributes.OBJECTID ?? r.attributes.objectid ?? r.attributes.FID)
                    )) {
                        results.push(r);
                    }
    });
}
        } catch (err) {
            console.warn("Identify error:", err);
        }
    }

    showIdentifyPopup(e.latlng, results);
}


//Popup to Show Identify Results
function showIdentifyPopup(latlng, results) {
    if (!results.length) {
        L.popup()
            .setLatLng(latlng)
            .setContent("<div class='identify-empty'>Tidak ada data</div>")
            .openOn(map);
        return;
    }

    let html = `<div class="identify-popup">`;

    results.forEach(item => {
        html += `
            <div class="identify-layer">
                <div class="identify-layer-title">${item.layerName}</div>
                <table class="identify-table">
                    <tbody>
        `;

        Object.entries(item.attributes).forEach(([key, value]) => {
            html += `
                <tr>
                    <td class="identify-key">${key}</td>
                    <td class="identify-value">${value ?? "-"}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
    });

    html += `</div>`;

    L.popup({
        maxWidth: 450,
        maxHeight: 280,
        className: "identify-leaflet-popup"
    })
        .setLatLng(latlng)
        .setContent(html)
        .openOn(map);
}


// Tooltip for Legend Toggle Button
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("legendToggleBtn");
    if (!btn) return;

    // Buat tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "legend-tooltip";
    tooltip.innerText = "Show/Hide Legend";
    document.body.appendChild(tooltip);

    // Fungsi posisi tooltip
    function positionTooltip() {
        const rect = btn.getBoundingClientRect();
        tooltip.style.left =
             rect.left - tooltip.offsetWidth - 8 + "px";
        tooltip.style.top =
            rect.top + rect.height / 2 - tooltip.offsetHeight / 2 + "px";
    }

    // Show tooltip
    function showTooltip() {
        positionTooltip();
        tooltip.classList.add("show");
    }

    // Hide tooltip
    function hideTooltip() {
        tooltip.classList.remove("show");
    }

    // Hover behavior
    btn.addEventListener("mouseenter", showTooltip);
    btn.addEventListener("mouseleave", hideTooltip);

    // Auto show saat pertama load (3 detik)
    setTimeout(() => {
        showTooltip();

        setTimeout(() => {
            hideTooltip();
        }, 3000);
    }, 500);
});
