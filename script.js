// Variabili globali
let currentMealType = '';
let dailyData = {};
let currentDate = '';
let currentUser = null;

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    // Controlla se l'utente è loggato
    if (window.auth && window.auth.isLoggedIn()) {
        currentUser = window.auth.getCurrentUser();
        initializeApp();
    } else {
        // Se non è loggato, reindirizza al login
        window.location.href = 'login.html';
    }
});

function initializeApp() {
    // Mostra informazioni utente
    const usernameElement = document.getElementById('currentUsername');
    if (usernameElement && currentUser) {
        usernameElement.textContent = currentUser.username;
    }
    
    // Imposta la data corrente
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('currentDate').value = today;
    currentDate = today;
    
    // Carica i dati salvati
    loadDailyData();
    
    // Event listener per il cambio data
    document.getElementById('currentDate').addEventListener('change', function() {
        currentDate = this.value;
        loadDailyData();
    });
    
    // Chiudi modal cliccando fuori
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('foodModal');
        if (event.target === modal) {
            closeFoodModal();
        }
    });
}

// Gestione del modal per aggiungere alimenti
function openFoodModal(mealType) {
    currentMealType = mealType;
    document.getElementById('foodModal').style.display = 'block';
    document.getElementById('foodName').focus();
    
    // Reset dei campi
    document.getElementById('foodName').value = '';
    document.getElementById('foodQuantity').value = '';
    document.getElementById('foodCalories').value = '';
}

function closeFoodModal() {
    document.getElementById('foodModal').style.display = 'none';
    currentMealType = '';
}

// Aggiunta di un alimento
function addFood() {
    const foodName = document.getElementById('foodName').value.trim();
    const foodQuantity = parseInt(document.getElementById('foodQuantity').value);
    const foodCalories = parseInt(document.getElementById('foodCalories').value) || 0;
    
    if (!foodName || !foodQuantity) {
        alert('Per favore, inserisci il nome dell\'alimento e la quantità.');
        return;
    }
    
    // Se le calorie non sono specificate, usa un calcolo di base
    let calculatedCalories = foodCalories;
    if (calculatedCalories === 0) {
        calculatedCalories = estimateCalories(foodName, foodQuantity);
    }
    
    const foodItem = {
        id: Date.now().toString(),
        name: foodName,
        quantity: foodQuantity,
        calories: calculatedCalories,
        timestamp: new Date().toISOString()
    };
    
    // Aggiungi l'alimento ai dati giornalieri
    if (!dailyData[currentDate]) {
        dailyData[currentDate] = {};
    }
    if (!dailyData[currentDate][currentMealType]) {
        dailyData[currentDate][currentMealType] = [];
    }
    
    dailyData[currentDate][currentMealType].push(foodItem);
    
    // Salva i dati e aggiorna l'interfaccia
    saveDailyData();
    updateMealDisplay(currentMealType);
    updateDailySummary();
    closeFoodModal();
}

// Calcolo automatico delle calorie con AI (simulato)
async function calculateCaloriesWithAI() {
    const foodName = document.getElementById('foodName').value.trim();
    const foodQuantity = parseInt(document.getElementById('foodQuantity').value);
    
    if (!foodName || !foodQuantity) {
        alert('Per favore, inserisci il nome dell\'alimento e la quantità prima di calcolare le calorie.');
        return;
    }
    
    // Mostra loading
    document.getElementById('loadingOverlay').style.display = 'block';
    
    try {
        // Simula chiamata API AI (sostituire con vera API)
        const calories = await simulateAICalorieCalculation(foodName, foodQuantity);
        document.getElementById('foodCalories').value = calories;
    } catch (error) {
        console.error('Errore nel calcolo delle calorie:', error);
        alert('Errore nel calcolo delle calorie. Riprova più tardi.');
    } finally {
        // Nascondi loading
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// Calcolo AI delle calorie con API reale
async function simulateAICalorieCalculation(foodName, quantity) {
    try {
        // Usa la funzione API dal file di configurazione
        const result = await getCaloriesFromAPI(foodName, quantity);
        return result.calories;
    } catch (error) {
        console.error('Errore nel calcolo delle calorie:', error);
        // Fallback al calcolo locale
        return estimateCalories(foodName, quantity);
    }
}

// Stima semplice delle calorie senza AI (fallback)
function estimateCalories(foodName, quantity) {
    // Usa il database locale dal file di configurazione
    if (typeof getCaloriesFromLocalDB !== 'undefined') {
        const result = getCaloriesFromLocalDB(foodName, quantity);
        return result.calories;
    }
    
    // Fallback se il file di configurazione non è caricato
    const basicFoods = {
        'pasta': 350, 'riso': 130, 'pane': 265, 'pollo': 165,
        'manzo': 250, 'pesce': 120, 'mela': 52, 'banana': 89,
        'insalata': 15, 'pomodoro': 18, 'formaggio': 400,
        'latte': 42, 'yogurt': 59, 'pizza': 266
    };
    
    let caloriesPer100g = 200;
    for (const [food, calories] of Object.entries(basicFoods)) {
        if (foodName.toLowerCase().includes(food)) {
            caloriesPer100g = calories;
            break;
        }
    }
    
    return Math.round((caloriesPer100g * quantity) / 100);
}

// Rimozione di un alimento
function removeFood(mealType, foodId) {
    if (!dailyData[currentDate] || !dailyData[currentDate][mealType]) {
        return;
    }
    
    dailyData[currentDate][mealType] = dailyData[currentDate][mealType].filter(
        food => food.id !== foodId
    );
    
    saveDailyData();
    updateMealDisplay(mealType);
    updateDailySummary();
}

// Aggiornamento della visualizzazione di un pasto
function updateMealDisplay(mealType) {
    const foodList = document.querySelector(`#${mealType} .food-list`);
    const caloriesCount = document.querySelector(`#${mealType} .calories-count`);
    
    if (!dailyData[currentDate] || !dailyData[currentDate][mealType]) {
        foodList.innerHTML = '<p style="color: #718096; font-style: italic; text-align: center; padding: 20px;">Nessun alimento aggiunto</p>';
        caloriesCount.textContent = '0';
        return;
    }
    
    const foods = dailyData[currentDate][mealType];
    let totalCalories = 0;
    
    foodList.innerHTML = foods.map(food => {
        totalCalories += food.calories;
        return `
            <div class="food-item">
                <div class="food-info">
                    <div class="food-name">${food.name}</div>
                    <div class="food-details">${food.quantity}g</div>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="food-calories">${food.calories} kcal</div>
                    <button class="delete-food" onclick="removeFood('${mealType}', '${food.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    caloriesCount.textContent = totalCalories;
}

// Aggiornamento del riepilogo giornaliero
function updateDailySummary() {
    let totalCalories = 0;
    let mealsCount = 0;
    
    if (dailyData[currentDate]) {
        Object.values(dailyData[currentDate]).forEach(meal => {
            if (meal && meal.length > 0) {
                mealsCount++;
                meal.forEach(food => {
                    totalCalories += food.calories;
                });
            }
        });
    }
    
    document.getElementById('totalCalories').textContent = `${totalCalories} kcal`;
    document.getElementById('mealsCount').textContent = mealsCount;
}

// Caricamento dei dati giornalieri
function loadDailyData() {
    if (!currentUser) return;
    
    const storageKey = `diarioAlimentare_${currentUser.id}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        dailyData = JSON.parse(savedData);
    }
    
    // Aggiorna tutte le visualizzazioni
    const mealTypes = ['colazione', 'spuntino-mattina', 'pranzo', 'spuntino-pomeriggio', 'cena', 'spuntino-sera'];
    mealTypes.forEach(mealType => {
        updateMealDisplay(mealType);
    });
    
    updateDailySummary();
}

// Salvataggio dei dati giornalieri
function saveDailyData() {
    if (!currentUser) return;
    
    const storageKey = `diarioAlimentare_${currentUser.id}`;
    localStorage.setItem(storageKey, JSON.stringify(dailyData));
}

// Gestione dei tasti di scelta rapida
document.addEventListener('keydown', function(event) {
    // ESC per chiudere il modal
    if (event.key === 'Escape') {
        closeFoodModal();
    }
    
    // Enter per aggiungere alimento (se il modal è aperto)
    if (event.key === 'Enter' && document.getElementById('foodModal').style.display === 'block') {
        event.preventDefault();
        addFood();
    }
});

// Funzioni di utilità
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function exportData() {
    const dataStr = JSON.stringify(dailyData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diario-alimentare-backup.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            dailyData = importedData;
            saveDailyData();
            loadDailyData();
            alert('Dati importati con successo!');
        } catch (error) {
            alert('Errore nell\'importazione dei dati. Verifica che il file sia valido.');
        }
    };
    reader.readAsText(file);
}

// Funzione per ottenere statistiche settimanali
function getWeeklyStats() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let totalCalories = 0;
    let daysWithData = 0;
    
    for (let d = new Date(weekAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (dailyData[dateStr]) {
            daysWithData++;
            Object.values(dailyData[dateStr]).forEach(meal => {
                if (meal && meal.length > 0) {
                    meal.forEach(food => {
                        totalCalories += food.calories;
                    });
                }
            });
        }
    }
    
    return {
        totalCalories,
        averageCalories: daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0,
        daysWithData
    };
}

// Inizializza l'app quando la pagina è caricata
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}