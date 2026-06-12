// ==================== CLOCK MODULE ====================
let currentFormat = "24"; // '24' or '12'
const digitalClockEl = document.getElementById("digitalClock");
const dateInfoEl = document.getElementById("dateInfo");
const toggleFormatBtn = document.getElementById("toggleFormatBtn");

// Analog elements
const hourHand = document.getElementById("hourHand");
const minHand = document.getElementById("minHand");
const secHand = document.getElementById("secHand");

function updateClock() {
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
    digitalClockEl.textContent = timeString;
    
    // Date info: weekday, month day, year
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateInfoEl.textContent = now.toLocaleDateString(undefined, options);
    
    // Update Analog Clock Hands (always 24h base for rotation)
    const totalHours24 = now.getHours() + now.getMinutes() / 60;
    const hourDeg = (totalHours24 % 12) * 30; // 360/12 = 30
    const minuteDeg = now.getMinutes() * 6 + now.getSeconds() * 0.1;
    const secondDeg = now.getSeconds() * 6;
    
    if (hourHand && minHand && secHand) {
        // convert polar: from center (100,100) length 45, 70, 85
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
}

function drawClockMarkers() {
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
}

function toggleFormat() {
    currentFormat = currentFormat === "24" ? "12" : "24";
    toggleFormatBtn.textContent = currentFormat === "24" ? "Switch to 12-Hour" : "Switch to 24-Hour";
    updateClock();
}

if (toggleFormatBtn) toggleFormatBtn.addEventListener("click", toggleFormat);
setInterval(updateClock, 250);
updateClock();
drawClockMarkers();

// ==================== STOPWATCH MODULE ====================
let swInterval = null;
let swRunning = false;
let swMilliseconds = 0;   // stored in centiseconds (0-99)
let swSeconds = 0;
let swMinutes = 0;
let swHours = 0;
const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const swStartBtn = document.getElementById("swStartBtn");
const swPauseBtn = document.getElementById("swPauseBtn");
const swResetBtn = document.getElementById("swResetBtn");
const swLapBtn = document.getElementById("swLapBtn");
const lapListDiv = document.getElementById("lapList");

function formatStopwatch(h, m, s, ms) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

function updateStopwatchDisplay() {
    stopwatchDisplay.textContent = formatStopwatch(swHours, swMinutes, swSeconds, swMilliseconds);
}

function stopwatchTick() {
    swMilliseconds++;
    if (swMilliseconds >= 100) {
        swMilliseconds = 0;
        swSeconds++;
        if (swSeconds >= 60) {
            swSeconds = 0;
            swMinutes++;
            if (swMinutes >= 60) {
                swMinutes = 0;
                swHours++;
            }
        }
    }
    updateStopwatchDisplay();
}

function startStopwatch() {
    if (swRunning) return;
    swRunning = true;
    swInterval = setInterval(stopwatchTick, 10); // 10ms => 100 ticks per sec (centiseconds)
}

function pauseStopwatch() {
    if (!swRunning) return;
    swRunning = false;
    clearInterval(swInterval);
    swInterval = null;
}

function resetStopwatch() {
    pauseStopwatch();
    swHours = 0;
    swMinutes = 0;
    swSeconds = 0;
    swMilliseconds = 0;
    updateStopwatchDisplay();
    lapListDiv.innerHTML = '<div class="empty-lap-message">No laps recorded. Press Lap</div>';
}

function addLap() {
    if (!swRunning && (swHours === 0 && swMinutes === 0 && swSeconds === 0 && swMilliseconds === 0)) {
        // allow lap even when paused but only if any time exists? better logic: if any time >0 or running
        if (swHours === 0 && swMinutes === 0 && swSeconds === 0 && swMilliseconds === 0) {
            const emptyMsg = document.querySelector(".empty-lap-message");
            if (lapListDiv.children.length === 1 && emptyMsg) {
                // show temporary toast? ignore.
            }
            return;
        }
    }
    // Remove empty message if present
    if (lapListDiv.children.length === 1 && lapListDiv.children[0].classList?.contains("empty-lap-message")) {
        lapListDiv.innerHTML = "";
    }
    const lapTime = formatStopwatch(swHours, swMinutes, swSeconds, swMilliseconds);
    const lapCount = lapListDiv.children.length + 1;
    const lapItem = document.createElement("div");
    lapItem.className = "lap-item";
    lapItem.innerHTML = `<span>Lap ${lapCount}</span><span>${lapTime}</span>`;
    lapListDiv.prepend(lapItem);
    // limit laps to 20 for performance
    while (lapListDiv.children.length > 20) lapListDiv.removeChild(lapListDiv.lastChild);
}

swStartBtn.addEventListener("click", startStopwatch);
swPauseBtn.addEventListener("click", pauseStopwatch);
swResetBtn.addEventListener("click", resetStopwatch);
swLapBtn.addEventListener("click", addLap);

// ==================== TIMER MODULE ====================
let timerInterval = null;
let timerActive = false;
let timerRemainingSeconds = 0;  // total seconds left
let timerInitialSeconds = 0;
const timerDisplay = document.getElementById("timerDisplay");
const timerHoursInput = document.getElementById("timerHours");
const timerMinutesInput = document.getElementById("timerMinutes");
const timerSecondsInput = document.getElementById("timerSeconds");
const timerStartBtn = document.getElementById("timerStartBtn");
const timerPauseBtn = document.getElementById("timerPauseBtn");
const timerResetBtn = document.getElementById("timerResetBtn");
const timerStatusSpan = document.getElementById("timerStatus");

function updateTimerDisplayFromSeconds(totalSec) {
    if (totalSec < 0) totalSec = 0;
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    timerDisplay.textContent = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getTotalSecondsFromInputs() {
    const hrs = parseInt(timerHoursInput.value) || 0;
    const mins = parseInt(timerMinutesInput.value) || 0;
    const secs = parseInt(timerSecondsInput.value) || 0;
    return (hrs * 3600) + (mins * 60) + secs;
}

function setTimerFromInputs() {
    if (!timerActive) {
        timerRemainingSeconds = getTotalSecondsFromInputs();
        updateTimerDisplayFromSeconds(timerRemainingSeconds);
        timerStatusSpan.textContent = "Timer updated — press Start";
    } else {
        timerStatusSpan.textContent = "Stop timer before changing time";
    }
}

function syncInputsFromRemaining() {
    if (!timerActive) {
        const hrs = Math.floor(timerRemainingSeconds / 3600);
        const mins = Math.floor((timerRemainingSeconds % 3600) / 60);
        const secs = timerRemainingSeconds % 60;
        timerHoursInput.value = hrs;
        timerMinutesInput.value = mins;
        timerSecondsInput.value = secs;
    }
}

function startTimer() {
    if (timerActive) return;
    // if remaining seconds is zero but inputs have new values, update from inputs first
    if (timerRemainingSeconds <= 0) {
        timerRemainingSeconds = getTotalSecondsFromInputs();
        updateTimerDisplayFromSeconds(timerRemainingSeconds);
    }
    if (timerRemainingSeconds <= 0) {
        timerStatusSpan.textContent = "⚠️ Set a time greater than 0";
        return;
    }
    timerActive = true;
    timerInterval = setInterval(() => {
        if (timerRemainingSeconds > 0) {
            timerRemainingSeconds--;
            updateTimerDisplayFromSeconds(timerRemainingSeconds);
            timerStatusSpan.textContent = "⏳ Timer running...";
            if (timerRemainingSeconds === 0) {
                clearInterval(timerInterval);
                timerActive = false;
                timerInterval = null;
                timerStatusSpan.textContent = "✨ Time's up! ✨";
                // optional beep simulation (vibration? but fine)
                if ("vibrate" in navigator) navigator.vibrate(200);
                timerDisplay.style.animation = "fadeSlideUp 0.2s ease";
                setTimeout(() => { timerDisplay.style.animation = ""; }, 400);
                syncInputsFromRemaining();
            }
        } else {
            // safety stop
            if (timerRemainingSeconds === 0) {
                clearInterval(timerInterval);
                timerActive = false;
                timerInterval = null;
                timerStatusSpan.textContent = "Timer finished";
            }
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerActive) return;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerActive = false;
    timerStatusSpan.textContent = "⏸ Paused";
    syncInputsFromRemaining();
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerActive = false;
    timerRemainingSeconds = getTotalSecondsFromInputs();
    updateTimerDisplayFromSeconds(timerRemainingSeconds);
    timerStatusSpan.textContent = "Reset — ready";
}

timerStartBtn.addEventListener("click", startTimer);
timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);
timerHoursInput.addEventListener("input", () => { if (!timerActive) setTimerFromInputs(); });
timerMinutesInput.addEventListener("input", () => { if (!timerActive) setTimerFromInputs(); });
timerSecondsInput.addEventListener("input", () => { if (!timerActive) setTimerFromInputs(); });
setTimerFromInputs(); // initial display

// ==================== TAB SWITCHING & RESPONSIVE UI ====================
const tabBtns = document.querySelectorAll(".tab-btn");
const panels = {
    clock: document.getElementById("clockPanel"),
    stopwatch: document.getElementById("stopwatchPanel"),
    timer: document.getElementById("timerPanel")
};

function switchTab(tabId) {
    Object.values(panels).forEach(panel => {
        if (panel) panel.classList.remove("active-panel");
    });
    if (tabId === "clock") panels.clock.classList.add("active-panel");
    if (tabId === "stopwatch") panels.stopwatch.classList.add("active-panel");
    if (tabId === "timer") panels.timer.classList.add("active-panel");
    
    tabBtns.forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-tab") === tabId) btn.classList.add("active");
    });
}

tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const tab = btn.getAttribute("data-tab");
        if (tab) switchTab(tab);
    });
});

// Initialize first panel active
switchTab("clock");
// preload analog markers properly
window.addEventListener("load", () => {
    updateClock();
    drawClockMarkers();
});