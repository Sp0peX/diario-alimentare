// Configurazione API per il calcolo delle calorie
// Utilizziamo API Ninjas Nutrition API che offre un piano gratuito

const API_CONFIG = {
    // API Ninjas Nutrition API
    NUTRITION_API: {
        BASE_URL: 'https://api.api-ninjas.com/v1/nutrition',
        // Per ottenere una chiave API gratuita, registrati su: https://api.api-ninjas.com/
        API_KEY: '2KKZ5BmThL5FCdhc7fFACw==fUfHUN9LeiENHaWI', // Sostituire con la propria chiave API
        RATE_LIMIT: 1000, // Richieste gratuite al mese
        FEATURES: {
            NATURAL_LANGUAGE: true,
            CUSTOM_PORTIONS: true,
            MULTIPLE_FOODS: true
        }
    },
    
    // Backup: FatSecret API (alternativa gratuita)
    FATSECRET_API: {
        BASE_URL: 'https://platform.fatsecret.com/rest/server.api',
        CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
        CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE',
        FEATURES: {
            BARCODE_SCANNING: true,
            MULTILINGUAL: true,
            RECIPES: true
        }
    },
    
    // Fallback: Database locale per alimenti comuni
    LOCAL_DATABASE: {
        // Calorie per 100g di alimenti comuni (italiani)
        FOODS: {
            // Cereali e derivati
            'pasta': 350,
            'spaghetti': 350,
            'penne': 350,
            'fusilli': 350,
            'riso': 130,
            'risotto': 150,
            'pane': 265,
            'pane integrale': 247,
            'pizza': 266,
            'pizza margherita': 270,
            'focaccia': 300,
            'grissini': 433,
            'crackers': 428,
            'biscotti': 500,
            'cornflakes': 378,
            'avena': 389,
            
            // Carne e pesce
            'pollo': 165,
            'petto di pollo': 165,
            'tacchino': 135,
            'manzo': 250,
            'vitello': 107,
            'maiale': 242,
            'prosciutto': 335,
            'salame': 425,
            'mortadella': 317,
            'tonno': 144,
            'salmone': 208,
            'merluzzo': 82,
            'branzino': 82,
            'gamberi': 85,
            'calamari': 68,
            
            // Latticini
            'latte': 42,
            'latte intero': 64,
            'latte scremato': 36,
            'yogurt': 59,
            'yogurt greco': 97,
            'formaggio': 400,
            'parmigiano': 392,
            'mozzarella': 253,
            'ricotta': 146,
            'gorgonzola': 330,
            'burro': 717,
            'panna': 337,
            
            // Uova
            'uova': 155,
            'uovo': 155,
            'albume': 52,
            'tuorlo': 322,
            
            // Frutta
            'mela': 52,
            'banana': 89,
            'arancia': 47,
            'pera': 57,
            'pesca': 39,
            'fragole': 32,
            'kiwi': 61,
            'ananas': 50,
            'uva': 69,
            'limone': 29,
            'melone': 34,
            'anguria': 30,
            'ciliegie': 63,
            'albicocche': 48,
            
            // Verdura
            'insalata': 15,
            'lattuga': 15,
            'pomodoro': 18,
            'pomodori': 18,
            'cetriolo': 16,
            'carote': 41,
            'zucchine': 17,
            'melanzane': 25,
            'peperoni': 31,
            'broccoli': 34,
            'cavolfiore': 25,
            'spinaci': 23,
            'rucola': 25,
            'patate': 77,
            'patate lesse': 86,
            'patate fritte': 312,
            'cipolle': 40,
            'aglio': 149,
            
            // Legumi
            'fagioli': 102,
            'lenticchie': 116,
            'ceci': 164,
            'piselli': 81,
            'fave': 88,
            
            // Frutta secca e semi
            'noci': 654,
            'mandorle': 579,
            'nocciole': 628,
            'pistacchi': 562,
            'pinoli': 673,
            'semi di girasole': 584,
            
            // Condimenti e oli
            'olio': 884,
            'olio oliva': 884,
            'olio extravergine': 884,
            'aceto': 19,
            'sale': 0,
            'zucchero': 387,
            'miele': 304,
            
            // Dolci e snack
            'cioccolato': 546,
            'cioccolato fondente': 515,
            'gelato': 207,
            'torta': 350,
            'biscotti secchi': 416,
            'merendine': 400,
            'patatine': 536,
            'pop corn': 387,
            
            // Bevande
            'caffè': 2,
            'tè': 1,
            'acqua': 0,
            'coca cola': 42,
            'aranciata': 42,
            'birra': 43,
            'vino': 83,
            'succo frutta': 45
        }
    }
};

// Funzione per ottenere le calorie tramite API
async function getCaloriesFromAPI(foodName, quantity = 100) {
    try {
        // Prova prima con API Ninjas
        if (API_CONFIG.NUTRITION_API.API_KEY !== 'YOUR_API_KEY_HERE') {
            const response = await fetch(
                `${API_CONFIG.NUTRITION_API.BASE_URL}?query=${quantity}g ${foodName}`,
                {
                    headers: {
                        'X-Api-Key': API_CONFIG.NUTRITION_API.API_KEY
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    return {
                        calories: Math.round(data[0].calories),
                        protein: data[0].protein_g || 0,
                        carbs: data[0].carbohydrates_total_g || 0,
                        fat: data[0].fat_total_g || 0,
                        source: 'API Ninjas'
                    };
                }
            }
        }
        
        // Fallback al database locale
        return getCaloriesFromLocalDB(foodName, quantity);
        
    } catch (error) {
        console.error('Errore API:', error);
        // Fallback al database locale
        return getCaloriesFromLocalDB(foodName, quantity);
    }
}

// Funzione per ottenere le calorie dal database locale
function getCaloriesFromLocalDB(foodName, quantity = 100) {
    const foods = API_CONFIG.LOCAL_DATABASE.FOODS;
    const normalizedName = foodName.toLowerCase().trim();
    
    // Cerca corrispondenza esatta
    let caloriesPer100g = foods[normalizedName];
    
    // Se non trova corrispondenza esatta, cerca parole chiave
    if (!caloriesPer100g) {
        for (const [food, calories] of Object.entries(foods)) {
            if (normalizedName.includes(food) || food.includes(normalizedName)) {
                caloriesPer100g = calories;
                break;
            }
        }
    }
    
    // Se ancora non trova nulla, usa un valore di default
    if (!caloriesPer100g) {
        caloriesPer100g = 200; // Valore di default
    }
    
    const totalCalories = Math.round((caloriesPer100g * quantity) / 100);
    
    return {
        calories: totalCalories,
        protein: 0, // Non disponibile nel DB locale
        carbs: 0,   // Non disponibile nel DB locale
        fat: 0,     // Non disponibile nel DB locale
        source: 'Database Locale'
    };
}

// Funzione per analizzare testo con linguaggio naturale
function parseNaturalLanguageFood(text) {
    const patterns = [
        // "100g di pasta"
        /(\d+)\s*g\s+di\s+(.+)/i,
        // "pasta 100g"
        /(.+?)\s+(\d+)\s*g/i,
        // "una mela" -> assume 150g
        /una?\s+(.+)/i,
        // "due banane" -> assume 200g
        /due\s+(.+)/i,
        // Solo il nome del cibo
        /^(.+)$/i
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            if (pattern.source.includes('\\d+')) {
                // Ha quantità specificata
                const quantity = parseInt(match[1] || match[2]);
                const food = (match[2] || match[1]).trim();
                return { food, quantity };
            } else if (match[0].startsWith('una')) {
                // "una mela" -> 150g
                return { food: match[1].trim(), quantity: 150 };
            } else if (match[0].startsWith('due')) {
                // "due banane" -> 200g
                return { food: match[1].trim(), quantity: 200 };
            } else {
                // Solo nome cibo -> 100g default
                return { food: match[1].trim(), quantity: 100 };
            }
        }
    }
    
    return { food: text.trim(), quantity: 100 };
}

// Esporta le funzioni per l'uso nell'app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        getCaloriesFromAPI,
        getCaloriesFromLocalDB,
        parseNaturalLanguageFood
    };
}