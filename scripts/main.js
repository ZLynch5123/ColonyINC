// Game state
const gameState = {
    resources: {
        gold: 0,
        wood: 0,
        goldPerSecond: 0,
        woodPerSecond: 0
    },
    buildings: {
        woodcutter: { count: 0, baseCost: 10, baseProduction: 0.1 },
        mine: { count: 0, baseCost: 15, baseProduction: 0.2 }
    },
    currentTab: 'buildings'
};

// UI update functions
function updateResources() {
    document.getElementById('gold').textContent = Math.floor(gameState.resources.gold);
    document.getElementById('wood').textContent = Math.floor(gameState.resources.wood);
    document.getElementById('goldPerSecond').textContent = gameState.resources.goldPerSecond.toFixed(1);
    document.getElementById('woodPerSecond').textContent = gameState.resources.woodPerSecond.toFixed(1);
}

function calculateCost(baseCost, count) {
    return Math.floor(baseCost * Math.pow(1.15, count));
}

function addToLog(message) {
    const log = document.getElementById('game-log');
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    log.insertBefore(entry, log.firstChild);
    if (log.children.length > 100) {
        log.removeChild(log.lastChild);
    }
}

// Tab content generators
const tabContents = {
    buildings: () => {
        let html = '<div class="buildings-container">';
        
        // Woodcutter
        const woodcutterCost = calculateCost(gameState.buildings.woodcutter.baseCost, gameState.buildings.woodcutter.count);
        html += `
            <div class="building">
                <div>
                    <h3>Woodcutter</h3>
                    <div>Count: ${gameState.buildings.woodcutter.count}</div>
                    <div>Cost: ${woodcutterCost} gold</div>
                    <div>Production: ${(gameState.buildings.woodcutter.baseProduction * gameState.buildings.woodcutter.count).toFixed(1)} wood/s</div>
                </div>
                <button onclick="buyBuilding('woodcutter')" ${gameState.resources.gold < woodcutterCost ? 'disabled' : ''}>Buy</button>
            </div>
        `;

        // Mine
        const mineCost = calculateCost(gameState.buildings.mine.baseCost, gameState.buildings.mine.count);
        html += `
            <div class="building">
                <div>
                    <h3>Mine</h3>
                    <div>Count: ${gameState.buildings.mine.count}</div>
                    <div>Cost: ${mineCost} gold</div>
                    <div>Production: ${(gameState.buildings.mine.baseProduction * gameState.buildings.mine.count).toFixed(1)} gold/s</div>
                </div>
                <button onclick="buyBuilding('mine')" ${gameState.resources.gold < mineCost ? 'disabled' : ''}>Buy</button>
            </div>
        `;

        html += '</div>';
        return html;
    },
    research: () => `
        <div>
            <h2>Research</h2>
            <p>Research features coming soon...</p>
        </div>
    `,
    achievements: () => `
        <div>
            <h2>Achievements</h2>
            <p>Achievements coming soon...</p>
        </div>
    `
};

// Game mechanics
function buyBuilding(type) {
    const building = gameState.buildings[type];
    const cost = calculateCost(building.baseCost, building.count);
    
    if (gameState.resources.gold >= cost) {
        gameState.resources.gold -= cost;
        building.count++;
        updateProductionRates();
        updateUI();
        addToLog(`Purchased 1 ${type}`);
    }
}

function updateProductionRates() {
    gameState.resources.woodPerSecond = gameState.buildings.woodcutter.count * gameState.buildings.woodcutter.baseProduction;
    gameState.resources.goldPerSecond = gameState.buildings.mine.count * gameState.buildings.mine.baseProduction;
}

// Game loop
setInterval(() => {
    gameState.resources.wood += gameState.resources.woodPerSecond;
    gameState.resources.gold += gameState.resources.goldPerSecond;
    updateResources();
}, 1000);

// UI setup
function updateUI() {
    const content = document.getElementById('main-content');
    content.innerHTML = tabContents[gameState.currentTab]();
    updateResources();
}

// Navigation setup
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update content
            gameState.currentTab = button.dataset.tab;
            updateUI();
        });
    });

    // Initial UI update
    updateUI();
});
