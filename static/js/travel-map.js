/* travel-map.js — read inlined pin JSON, render Leaflet map. */
(function () {
    "use strict";

    function init() {
        const dataNode = document.getElementById("travel-pins");
        const mapNode = document.getElementById("travel-map-canvas");
        if (!dataNode || !mapNode) {
            return;
        }
        const pins = JSON.parse(dataNode.textContent);
        if (!Array.isArray(pins) || pins.length === 0) {
            return;
        }

        const map = L.map(mapNode, {
            worldCopyJump: true,
            zoomControl: true,
            preferCanvas: true,
        });

        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            {
                subdomains: "abcd",
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }
        ).addTo(map);

        const markerStyle = {
            radius: 4,
            fillColor: "#ffa86a", // terminus accent
            color: "#ffa86a",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.85,
        };

        const layer = L.layerGroup();
        const bounds = L.latLngBounds([]);
        pins.forEach((p) => {
            const marker = L.circleMarker([p.lat, p.lng], markerStyle);
            marker.bindPopup(escapeHtml(p.name));
            layer.addLayer(marker);
            bounds.extend([p.lat, p.lng]);
        });

        layer.addTo(map);
        map.fitBounds(bounds, { padding: [20, 20] });
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
