/**
 * Clock Module - Digital and Analog clock display
 * Displays current time in 12/24 hour formats with analog visualization
 */

const Clock = (() => {
    let currentFormat = "24"; // '24' or '12'
    let updateInterval = null;

    // DOM elements
    const digitalClockEl = document.getElementById("digitalClock");
    const dateInfoEl = document.getElementById("dateInfo");
    const toggleFormatBtn = document.getElementById("toggleFormatBtn");
    const hourHand = document.getElementById("hourHand");
    const minHand = document.getElementById("minHand");
    const secHand = document.getElementById("secHand");

    /**
     * Update the digital and analog clock display
     */
    const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let period = "";

        if (currentFormat === "12") {
            period = hours >= 12 ? " PM" : " AM";
            let hour12 = hours % 12;
            hour12 = hour12 === 0 ? 12 : hour12;
            hours = hour12;
        }

        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMins = minutes.toString().padStart(2, "0");
        const formattedSecs = seconds.toString().padStart(2, "0");
        
        let timeString = `${formattedHours}:${formattedMins}:${formattedSecs}`;
        if (currentFormat === "12") timeString += period;
        if (digitalClockEl) digitalClockEl.textContent = timeString;
        
        // Update date info
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        if (dateInfoEl) dateInfoEl.textContent = now.toLocaleDateString(undefined, options);
        
        // Update analog clock hands
        updateAnalogHands(now);
    };

    /**
     * Update the analog clock hands positions
     */
    const updateAnalogHands = (now) => {
        const totalHours24 = now.getHours() + now.getMinutes() / 60;
        const hourDeg = (totalHours24 % 12) * 30; // 360/12 = 30
        const minuteDeg = now.getMinutes() * 6 + now.getSeconds() * 0.1;
        const secondDeg = now.getSeconds() * 6;
        
        if (hourHand && minHand && secHand) {
            const centerX = 100, centerY = 100;
            const hourLen = 45, minLen = 65, secLen = 78;
            
            const hourRad = (hourDeg - 90) * Math.PI / 180;
            const minRad = (minuteDeg - 90) * Math.PI / 180;
            const secRad = (secondDeg - 90) * Math.PI / 180;
            
            hourHand.setAttribute("x2", centerX + hourLen * Math.cos(hourRad));
            hourHand.setAttribute("y2", centerY + hourLen * Math.sin(hourRad));
            
            minHand.setAttribute("x2", centerX + minLen * Math.cos(minRad));
            minHand.setAttribute("y2", centerY + minLen * Math.sin(minRad));
            
            secHand.setAttribute("x2", centerX + secLen * Math.cos(secRad));
            secHand.setAttribute("y2", centerY + secLen * Math.sin(secRad));
        }
    };

    /**
     * Draw clock hour markers
     */
    const drawClockMarkers = () => {
        const markersGroup = document.getElementById("markers");
        if (!markersGroup) return;
        markersGroup.innerHTML = "";
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const radius = 82;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const innerRadius = 74;
            const x1 = innerRadius * Math.cos(angle);
            const y1 = innerRadius * Math.sin(angle);
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x);
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "currentColor");
            line.setAttribute("stroke-width", i % 3 === 0 ? "3" : "1.5");
            line.setAttribute("stroke-linecap", "round");
            markersGroup.appendChild(line);
        }
    };

    /**
     * Toggle between 12 and 24 hour format
     */
    const toggleFormat = () => {
        currentFormat = currentFormat === "24" ? "12" : "24";
        if (toggleFormatBtn) {
            toggleFormatBtn.textContent = currentFormat === "24" ? "Switch to 12-Hour" : "Switch to 24-Hour";
        }
        Storage.set('clockFormat', currentFormat);
        updateClock();
    };

    /**
     * Initialize the clock module
     */
    const init = () => {
        // Load saved format preference
        const savedFormat = Storage.get('clockFormat', '24');
        currentFormat = savedFormat;
        
        if (toggleFormatBtn) {
            toggleFormatBtn.textContent = currentFormat === "24" ? "Switch to 12-Hour" : "Switch to 24-Hour";
            toggleFormatBtn.addEventListener("click", toggleFormat);
        }

        drawClockMarkers();
        updateClock();
        
        // Update clock every 250ms for smooth display
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(updateClock, 250);
    };

    /**
     * Destroy the clock module (cleanup)
     */
    const destroy = () => {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
        if (toggleFormatBtn) {
            toggleFormatBtn.removeEventListener("click", toggleFormat);
        }
    };

    return {
        init,
        destroy,
        toggleFormat,
        getFormat: () => currentFormat
    };
})();
