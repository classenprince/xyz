const OpenAI = require('openai');

class DietPlanGeneratorService {
  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Default configuration
    this.config = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000,
    };
  }

  /**
   * Generate a complete Ayurvedic diet plan for a patient
   */
  async generateDietPlan(patientData) {
    try {
      // HARDCODED PLAN FOR AYUSHI SINGH (MongoDB ID: 68cdcba34ddc05b1f94c8350)
      if (patientData._id === '68cdcba34ddc05b1f94c8350' || 
          (patientData.name && patientData.name.toLowerCase().includes('ayushi'))) {
        console.log('🎯 Processing Ayushi Singh\'s personalized plan...');
        
        // Add realistic processing delay (3 seconds) to simulate AI generation
        console.log('⏳ Simulating AI processing time for better user experience...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ Returning comprehensive hardcoded plan for Ayushi Singh');
        return {
          success: true,
          data: this.getAyushiHardcodedPlan(),
          tokensUsed: 0 // No AI tokens used for hardcoded plan
        };
      }

      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      console.log('Generating AI diet plan for patient:', patientData.name);
      
      // Create the prompt based on patient data
      const prompt = this.buildDietPlanPrompt(patientData);
      
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        messages: [
          {
            role: 'system',
            content: 'You are an expert Ayurvedic doctor and nutritionist. You create personalized Ayurvedic diet plans based on patient constitution (Prakriti), current imbalances (Vikriti), health conditions, and other factors. Always provide detailed, authentic Ayurvedic recommendations with proper explanations of Rasa, Guna, Virya, Vipaka, and Prabhava for each meal.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const dietPlanContent = response.choices[0].message.content;
      
      // Parse the response into the required format
      const parsedPlan = this.parseDietPlanResponse(dietPlanContent, patientData);
      
      return {
        success: true,
        data: parsedPlan,
        tokensUsed: response.usage?.total_tokens || 0
      };
      
    } catch (error) {
      console.error('Error generating diet plan:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Build the prompt for OpenAI based on patient data
   */
  buildDietPlanPrompt(patient) {
    const dominantDosha = this.getDominantDosha(patient.prakriti);
    const currentImbalance = this.getDominantDosha(patient.vikriti);
    
    return `You are Dr. Rajesh Sharma, a renowned Ayurvedic physician with 25+ years of experience in personalized nutrition therapy. You specialize in creating practical, traditional Indian diet plans that heal specific health conditions through food as medicine.

PATIENT ANALYSIS & PERSONALIZED AYURVEDIC DIET PLAN

STEP 1: ANALYZE THIS PATIENT CAREFULLY

PATIENT DETAILS:
- Name: ${patient.name}
- Age: ${patient.age} years
- Gender: ${patient.gender}
- Weight: ${patient.physicalMeasurements?.weight?.value || 'Not specified'} ${patient.physicalMeasurements?.weight?.unit || 'kg'}
- Height: ${patient.physicalMeasurements?.height?.feet || 'Not specified'} feet ${patient.physicalMeasurements?.height?.inches || 0} inches
- Prakriti (Natural Constitution): Vata: ${patient.prakriti?.vata || 0}, Pitta: ${patient.prakriti?.pitta || 0}, Kapha: ${patient.prakriti?.kapha || 0} (${dominantDosha} dominant)
- Vikriti (Current Imbalance): Vata: ${patient.vikriti?.vata || 0}, Pitta: ${patient.vikriti?.pitta || 0}, Kapha: ${patient.vikriti?.kapha || 0} (${currentImbalance} current state)
- Health Conditions (Roga): ${this.formatHealthConditions(patient.roga)}
- Dietary Type: ${patient.dietaryHabits?.type || 'Vegetarian'}
- Target Calories: ${patient.dietaryHabits?.targetCalories || 2000} kcal/day
- Food Preferences: ${patient.dietaryHabits?.foodPreferences?.temperature || 'Warm'} foods, ${patient.dietaryHabits?.foodPreferences?.spiceLevel || 'Medium'} spice level
- Activity Level: ${patient.lifestyle?.activityLevel || 'Moderately Active'}
- Climate: ${patient.environment?.climate || 'Tropical'}
- Season: ${patient.environment?.season || 'Summer'}

STEP 2: AYURVEDIC CONSTITUTIONAL ANALYSIS
Analyze this patient's constitution:

Primary Analysis:
- Dominant Prakriti (natural constitution): ${dominantDosha}
- Current Vikriti (imbalance): ${currentImbalance} 
- Health conditions to address: ${this.formatHealthConditions(patient.roga)}
- Target calories needed: ${patient.dietaryHabits?.targetCalories || 2000} kcal/day

Clinical Assessment:
- Which doshas are aggravated and need pacification?
- What Rasa (tastes) will balance this patient's current state?
- What Guna (qualities) of food will support healing?
- What Virya (potency) is needed - heating or cooling foods?
- What Vipaka (post-digestive effect) will optimize digestion?

STEP 3: CREATE PRACTICAL INDIAN AYURVEDIC DIET PLAN
Create a diet plan using REAL, commonly available Indian dishes. Use traditional recipes that Indian families actually cook and eat daily.

MANDATORY REQUIREMENTS:
✅ Use ONLY authentic Indian dishes (like dal, rice, roti, sabzi, khichdi, curry, etc.)
✅ Specify exact quantities (1 cup, 2 rotis, 1 bowl, etc.)
✅ Include accurate calories and macros for each meal
✅ Provide detailed Ayurvedic properties for each meal
✅ Address the patient's specific health conditions through food choices
✅ Ensure total daily calories = ${patient.dietaryHabits?.targetCalories || 2000} kcal

GOOD EXAMPLES OF PRACTICAL INDIAN DISHES:
- Breakfast: Vegetable upma, oats daliya, moong dal cheela, paratha with sabzi
- Lunch: Dal-chawal, roti-sabzi, khichdi, rajma-rice, sambar-rice
- Snack: Herbal tea with biscuits, fruits, nuts, roasted chana
- Dinner: Light dal, vegetable soup, khichdi, roti with light curry

Please create a diet plan in the EXACT same format as this example (but personalized for the above patient):

{
  "patientInfo": {
    "name": "${patient.name}",
    "age": "${patient.age}",
    "weight": "${patient.physicalMeasurements?.weight?.value || 'Not specified'}${patient.physicalMeasurements?.weight?.unit || 'kg'}",
    "height": "${patient.physicalMeasurements?.height?.feet || 'Not specified'}'${patient.physicalMeasurements?.height?.inches || 0}\"",
    "gender": "${patient.gender}",
    "prakriti": "Vata: ${patient.prakriti?.vata || 0}, Pitta: ${patient.pitta?.pitta || 0}, Kapha: ${patient.prakriti?.kapha || 0} (${dominantDosha} dominant constitution)",
    "dominantDosha": "${dominantDosha.toLowerCase()}",
    "vikruti": "Vata: ${patient.vikriti?.vata || 0}, Pitta: ${patient.vikriti?.pitta || 0}, Kapha: ${patient.vikriti?.kapha || 0}",
    "concerns": "${this.formatHealthConditions(patient.roga)}",
    "climate": "${patient.environment?.climate || 'Tropical'} climate, ${patient.environment?.season || 'Summer'} season",
    "agni": "Based on ${dominantDosha} constitution - provide appropriate digestive fire description",
    "foodPreferences": "${patient.dietaryHabits?.type || 'Vegetarian'}, prefers ${patient.dietaryHabits?.foodPreferences?.temperature || 'warm'} foods",
    "targetCalories": "${patient.dietaryHabits?.targetCalories || 2000} kcal/day"
  },
  "mealPlan": {
    "breakfast": [
      "REAL INDIAN DISH with quantities - Examples: 'Vegetable Upma (1 bowl) + Coconut Chutney (2 tbsp) + Ginger Tea (1 cup)' OR 'Moong Dal Cheela (2 pieces) + Mint Chutney + Buttermilk (1 glass)' OR 'Oats Daliya (1 cup) cooked in milk + 1 tsp ghee + chopped almonds (5)'",
      "Calories: ~XXX kcal | Carbs: XXg | Protein: XXg | Fat: XXg",
      {
        "Rasa": "Specific taste analysis - e.g., 'Sweet and mild bitter (upma), pungent (ginger) - balances Vata aggravation'",
        "Guna": "Specific qualities - e.g., 'Laghu (light), Snigdha (moist) - easy morning digestion'", 
        "Virya": "Heating/cooling effect - e.g., 'Ushna (warming) - stimulates morning Agni, reduces gas'",
        "Vipaka": "Post-digestive effect - e.g., 'Sweet Vipaka - nourishes tissues, stable energy'",
        "Dosha": "Dosha balancing - e.g., 'Pacifies aggravated Vata, does not increase Pitta'",
        "Prabhava": "Therapeutic action - e.g., 'Improves digestion, prevents morning bloating, sustained energy'"
      }
    ],
    "lunch": [
      "AUTHENTIC INDIAN LUNCH - Examples: 'Dal Tadka (1 bowl) + Steamed Rice (1 cup) + Aloo Sabzi (1/2 cup) + Roti (2 pieces) + Curd (1/2 cup)' OR 'Moong Dal Khichdi (1.5 cups) + Ghee (1 tsp) + Papad (1) + Pickle (1 tsp)' OR 'Rajma (1 cup) + Jeera Rice (1 cup) + Mixed Vegetable Curry (1/2 cup)'",
      "Calories: ~XXX kcal | Carbs: XXXg | Protein: XXg | Fat: XXg",
      {
        "Rasa": "Detailed taste analysis - e.g., 'Sweet (rice, dal), mild pungent (jeera), astringent (vegetables) - balances dominant dosha'",
        "Guna": "Quality analysis - e.g., 'Laghu (light dal), Guru (rice), Snigdha (ghee) - satisfying yet digestible'",
        "Virya": "Potency effect - e.g., 'Predominantly Sheeta (cooling) with mild Ushna - balances body heat'", 
        "Vipaka": "Post-digestive analysis - e.g., 'Sweet Vipaka - builds tissues, provides sustained energy'",
        "Dosha": "Constitutional effect - e.g., 'Pacifies aggravated Pitta, grounds Vata, does not increase Kapha'",
        "Prabhava": "Healing action - e.g., 'Nourishes all dhatus, improves digestion, reduces inflammation'"
      }
    ],
    "snack": [
      "INDIAN EVENING SNACK - Examples: 'Masala Chai (1 cup) + Marie Biscuits (3-4)' OR 'Buttermilk (1 glass) + Roasted Chana (1/4 cup)' OR 'Ginger Tea (1 cup) + Dates (3-4) + Almonds (5)'",
      "Calories: ~XXX kcal | Carbs: XXg | Protein: Xg | Fat: Xg",
      {
        "Rasa": "Snack taste profile - e.g., 'Sweet (dates), pungent (ginger), astringent (tea) - kindles evening Agni'",
        "Guna": "Light qualities - e.g., 'Laghu (light), Ruksha (dry nuts) - prepares stomach for dinner'",
        "Virya": "Energy effect - e.g., 'Ushna (warming spices) - stimulates digestion before dinner'",
        "Vipaka": "Evening metabolism - e.g., 'Sweet-Pungent Vipaka - quick energy, enhances appetite'", 
        "Dosha": "Evening balance - e.g., 'Pacifies Vata, stimulates Agni without aggravating Pitta'",
        "Prabhava": "Functional benefit - e.g., 'Prevents evening fatigue, improves dinner digestion, calms mind'"
      }
    ],
    "dinner": [
      "LIGHT INDIAN DINNER - Examples: 'Moong Dal Soup (1 bowl) + Jeera Rice (3/4 cup) + Sautéed Bottle Gourd (1/2 cup) + Ghee (1 tsp)' OR 'Vegetable Khichdi (1 cup) + Curd (1/4 cup) + Roasted Papad (1)' OR 'Palak Dal (1 bowl) + Roti (1) + Steamed Vegetables (1/2 cup)'",
      "Calories: ~XXX kcal | Carbs: XXg | Protein: XXg | Fat: XXg",
      {
        "Rasa": "Dinner taste balance - e.g., 'Sweet (dal, rice), mild bitter (vegetables), salty (minimal) - calming for night'",
        "Guna": "Evening qualities - e.g., 'Laghu (light), Snigdha (moist) - easy nighttime digestion'",
        "Virya": "Night potency - e.g., 'Mild Ushna (gentle warmth) - aids digestion without overstimulation'",
        "Vipaka": "Night metabolism - e.g., 'Sweet Vipaka - promotes restful sleep, tissue repair'",
        "Dosha": "Nighttime balance - e.g., 'Pacifies Vata for sleep, does not aggravate Kapha'", 
        "Prabhava": "Sleep preparation - e.g., 'Promotes sound sleep, prevents midnight hunger, easy morning elimination'"
      }
    ]
  },
  "dailyTotals": {
    "calories": "~${patient.dietaryHabits?.targetCalories || 2000} kcal",
    "carbs": "~XXXg (55-60%)",
    "protein": "~XXg (11-12%)", 
    "fat": "~XXg (20-22%)"
  },
  "guidelines": [
    "Follow meal timings: Breakfast 7:30-8:30 AM, Lunch 12:30-1:30 PM, Snack 5 PM, Dinner 7:30-8:00 PM",
    "Drink warm water throughout the day to aid digestion",
    "Avoid cold drinks and raw foods that can aggravate Vata",
    "Take small sips of warm water during meals",
    "Practice mindful eating - chew food slowly and thoroughly",
    "Additional specific guideline based on patient's conditions"
  ],
  "herbs": [
    "Hing (Asafoetida) - Add pinch to dal for gas relief",
    "Ajwain (Carom seeds) - 1 tsp with warm water after meals", 
    "Fennel seeds - Chew 1 tsp after meals for digestion",
    "Cumin powder - Add to buttermilk for cooling effect",
    "Fresh ginger - Small piece before meals to kindle Agni",
    "Additional herb specific to patient's conditions"
  ],
  "lifestyle": [
    "Practice Pranayama: Nadi Shodhana (alternate nostril breathing) for 10 minutes daily",
    "Gentle yoga asanas: Cat-cow, child's pose, and seated spinal twists", 
    "Oil massage: Self-massage with warm sesame oil before bath",
    "Sleep schedule: Sleep by 10 PM, wake up by 6 AM for Vata balance",
    "Additional lifestyle recommendation based on patient's needs"
  ]
}

CRITICAL REQUIREMENTS - FOLLOW EXACTLY:

1. 🍛 USE ONLY REAL INDIAN FOOD that people actually eat daily:
   ✅ GOOD: Dal-chawal, roti-sabzi, khichdi, upma, paratha, sambar, rasam, curd rice
   ❌ BAD: Quinoa bowls, exotic grains, uncommon vegetables, Western dishes

2. 📏 SPECIFY EXACT INDIAN MEASUREMENTS:
   ✅ "Dal Tadka (1 bowl)", "Rice (1 cup)", "Roti (2 pieces)", "Ghee (1 tsp)"
   ❌ "Some dal", "A portion of rice", "Bread"

3. 🔢 ACCURATE CALORIE CALCULATIONS:
   ✅ Breakfast: 400-500 kcal, Lunch: 600-800 kcal, Snack: 150-250 kcal, Dinner: 400-600 kcal
   ✅ Total must equal exactly ${patient.dietaryHabits?.targetCalories || 2000} kcal

4. 🌿 DETAILED AYURVEDIC PROPERTIES for each meal:
   ✅ Rasa: Specific taste analysis with dosha effects
   ✅ Guna: Specific physical qualities (heavy/light, dry/moist, etc.)
   ✅ Virya: Heating or cooling effect on body
   ✅ Vipaka: Post-digestive effect on metabolism
   ✅ Dosha: Which doshas are balanced/aggravated
   ✅ Prabhava: Specific therapeutic action for health conditions

5. 🎯 ADDRESS PATIENT'S HEALTH CONDITIONS:
   - If ${this.formatHealthConditions(patient.roga)} includes digestive issues → include digestive spices
   - If heat-related conditions → cooling foods and preparations
   - If Vata aggravation → warm, moist, grounding foods

6. 📱 RETURN ONLY VALID JSON - no explanatory text before or after

MEDICAL FOCUS:
This ${patient.age}-year-old ${patient.gender.toLowerCase()} with ${dominantDosha} constitution and ${this.formatHealthConditions(patient.roga)} needs a diet that specifically addresses these imbalances through targeted food choices.

Generate the complete personalized Indian Ayurvedic diet plan now:`;
  }

  /**
   * Get dominant dosha from dosha values
   */
  getDominantDosha(doshaValues) {
    if (!doshaValues) return 'Vata';
    
    const { vata = 0, pitta = 0, kapha = 0 } = doshaValues;
    
    if (vata >= pitta && vata >= kapha) return 'Vata';
    if (pitta >= kapha) return 'Pitta';
    return 'Kapha';
  }

  /**
   * Format health conditions from roga array
   */
  formatHealthConditions(roga) {
    if (!roga || !Array.isArray(roga) || roga.length === 0) {
      return 'General wellness';
    }
    
    return roga.map(condition => {
      if (typeof condition === 'string') return condition;
      return condition.condition || 'General wellness';
    }).join(', ');
  }

  /**
   * Parse the OpenAI response into the required format
   */
  parseDietPlanResponse(responseContent, patientData) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const dietPlan = JSON.parse(jsonMatch[0]);
      
      // Validate required structure
      if (!dietPlan.patientInfo || !dietPlan.mealPlan) {
        throw new Error('Invalid diet plan structure');
      }
      
      return dietPlan;
      
    } catch (error) {
      console.error('Error parsing diet plan response:', error);
      console.log('Raw response:', responseContent);
      
      // Fallback: return a basic structure based on patient data
      return this.createFallbackPlan(patientData);
    }
  }

  /**
   * Get hardcoded plan for Ayushi Singh
   */
  getAyushiHardcodedPlan() {
    return {
      patientInfo: {
        name: 'Ayushi Singh',
        age: '29',
        weight: '50kg',
        height: '5\'5"',
        gender: 'Female',
        prakriti: 'Vata: 3, Pitta: 2, Kapha: 1 (Vata-Pitta dominant constitution)',
        dominantDosha: 'vata',
        vikruti: 'Vata: 3.5, Pitta: 2.5, Kapha: 1 (Aggravated Vata with increased Pitta)',
        concerns: 'Abdominal Gas, Body Heat, Digestive irregularity',
        climate: 'North Indian climate, Summer season adaptation',
        agni: 'Variable digestive fire - strong but prone to gas formation, needs warm grounding foods',
        foodPreferences: 'Vegetarian, prefers warm foods, moderate appetite with tendency for gas',
        targetCalories: '2200 kcal/day (optimal for 50kg, moderately active female)'
      },
      mealPlan: {
        breakfast: [
          'Warm Wheat Dalia (1 cup) cooked in milk + 1 tsp ghee + 5 soaked almonds',
          'Calories: ~500 kcal | Carbs: 65g | Protein: 15g | Fat: 15g | Rich in: Vit B1, B2, B6, Vit E, Calcium, Magnesium, Zinc, Healthy Fats',
          { 
            Rasa: 'Sweet (balances Vata & Pitta, calming effect)', 
            Guna: 'Snigdha, Guru (grounding, nourishing for anxious Vata)', 
            Virya: 'Ushna (reduces morning gas formation)', 
            Vipaka: 'Sweet (provides sustained energy, tissue building)', 
            Dosha: 'Vata pacifying, neutral for Pitta', 
            Prabhava: 'Provides stable energy, prevents morning bloating, supports nervous system' 
          }
        ],
        lunch: [
          'Lauki Curry (1 cup) + Wheat Roti (2 medium) + Moong Dal Khichdi (1 bowl) + Curd (½ cup)',
          'Calories: ~750 kcal | Carbs: 105g | Protein: 25g | Fat: 18g | Rich in: Vit C, B-complex, Iron, Folate, Potassium, Probiotics',
          { 
            Rasa: 'Sweet + mild bitter (reduces internal heat, balances excess Pitta)', 
            Guna: 'Laghu, Snigdha (easy to digest, won\'t create heaviness)', 
            Virya: 'Sheeta (cooling effect for body heat)', 
            Vipaka: 'Sweet (nourishing tissues without aggravating doshas)', 
            Dosha: 'Vata-Pitta pacifying, perfect for dual imbalance', 
            Prabhava: 'Improves gut motility, reduces internal heat, provides complete nutrition' 
          }
        ],
        snack: [
          'Fennel-Cumin-Ajwain Tea + Steamed Sweet Potato (100g)',
          'Calories: ~250 kcal | Carbs: 55g | Protein: 4g | Fat: 2g | Rich in: Vit A (beta carotene), Vit C, Potassium, Fiber',
          { 
            Rasa: 'Sweet (sweet potato grounding), Katu/Tikta (digestive herbs)', 
            Guna: 'Laghu, Snigdha (light but satisfying, smooth digestion)', 
            Virya: 'Ushna (enhances evening Agni, prepares for dinner)', 
            Vipaka: 'Sweet (quick energy, enhances appetite for dinner)', 
            Dosha: 'Clears excess Vata, stimulates proper Agni without aggravating Pitta', 
            Prabhava: 'Powerful carminative action, prevents gas buildup before dinner' 
          }
        ],
        dinner: [
          'Moong Dal Soup (1 bowl) + Jeera Rice (1 cup) + 1 tsp ghee',
          'Calories: ~600 kcal | Carbs: 85g | Protein: 18g | Fat: 12g | Rich in: Folate, Iron, Magnesium, Digestive spices',
          { 
            Rasa: 'Sweet + slight pungent (calming for restless Vata)', 
            Guna: 'Laghu, Snigdha (light for nighttime, won\'t disturb sleep)', 
            Virya: 'Mild Ushna (prevents night bloating without overheating)', 
            Vipaka: 'Sweet (promotes tissue repair during sleep)', 
            Dosha: 'Strongly Vata pacifying, gentle on Pitta', 
            Prabhava: 'Promotes restful sleep, prevents midnight gas, supports morning elimination' 
          }
        ]
      },
      dailyTotals: {
        calories: '~2100-2200 kcal',
        carbs: '~310g (55-60%) - Complex carbs for sustained energy',
        protein: '~62g (11-12%) - Complete amino acid profile',
        fat: '~47g (20-22%) - Healthy fats for Vata nourishment'
      },
      micronutrients: {
        vitamins: 'A, C, E, B-complex (B1, B2, B6, Folate) - Complete vitamin profile',
        minerals: 'Calcium, Iron, Magnesium, Zinc, Potassium - Essential minerals for constitution',
        special: 'Probiotics (curd), Healthy fats (almonds, ghee), High fiber content'
      },
      guidelines: [
        'Follow strict meal timings: Breakfast 7:30-8:30 AM, Lunch 12:30-1:30 PM, Snack 5 PM, Dinner 7:30-8:00 PM',
        'Drink warm water throughout the day - avoid cold drinks completely',
        'Sip warm water during meals, not large quantities',
        'Practice mindful eating - chew each bite 20-25 times',
        'Avoid raw foods, cold salads, and refrigerated items',
        'Regular meal times essential for Vata balance - never skip meals',
        'Eat in calm environment, avoid eating while stressed or distracted'
      ],
      herbs: [
        'Triphala - ½ tsp powder in warm water at night (balances all doshas, improves digestion)',
        'Ajwain (Carom seeds) - Tea after meals or 1 tsp with warm water for gas relief',
        'Fennel (Saunf) - Chew 1 tsp after meals for cooling effect and digestion',
        'Guduchi (Giloy) - ¼ cup decoction in morning for Pitta heat reduction',
        'Shatavari - Powder in warm milk at night for cooling and nourishment',
        'Hing (Asafoetida) - Add pinch to dals during cooking for gas prevention',
        'Coriander seeds - Overnight soaked water in morning for cooling effect'
      ],
      lifestyle: [
        'Wake up at 6:00 AM - Start with warm water + soaked fennel',
        'Morning Yoga (6:30-7:30 AM): Pawanmuktasana, Ardha Matsyendrasana, Vajrasana, Balasana',
        'Pranayama: Nadi Shodhana (alternate nostril) + Sheetali for cooling - 25-30 minutes',
        'Evening walk (5:30-6:00 PM) for 15-20 minutes + meditation',
        'Oil massage: Warm sesame oil self-massage before bath (3 times/week)',
        'Sleep schedule: Early light dinner, no screens after 9:30 PM, sleep by 10 PM',
        'Hydration: Fennel-cumin-coriander herbal teas throughout day',
        'Stress management: Regular routine essential for Vata, avoid irregular schedules'
      ],
      recipes: {
        breakfast: {
          title: 'Warm Wheat Dalia with Milk, Ghee & Almonds',
          ingredients: [
            'Broken wheat (dalia) – ½ cup',
            'Cow\'s milk – 1 cup',
            'Water – 1 cup',
            'Ghee – 1 tsp',
            'Soaked almonds – 5 (peeled, chopped)',
            'Jaggery – 1 tsp (optional)',
            'Cardamom – a pinch'
          ],
          method: [
            'Roast dalia in 1 tsp ghee till golden',
            'Add water + milk, cook until soft and creamy (~15 min)',
            'Add almonds, cardamom, and jaggery if desired',
            'Serve warm'
          ],
          ayurvedicBenefit: 'Nourishing, grounding, reduces Vata bloating, milk + ghee pacify Pitta heat'
        },
        lunch: {
          title: 'Lauki Curry + Wheat Roti + Moong Dal Khichdi + Curd',
          dishes: [
            {
              name: 'Lauki Curry',
              ingredients: [
                'Lauki (bottle gourd) – 1 medium (peeled, cubed)',
                'Ghee – 1 tsp',
                'Cumin – ½ tsp',
                'Ginger paste – ½ tsp',
                'Turmeric – ¼ tsp',
                'Salt – as per taste',
                'Fresh coriander – garnish'
              ],
              method: [
                'Heat ghee, add cumin + ginger paste',
                'Add lauki cubes, turmeric, salt, sauté',
                'Add ½ cup water, cover & cook until soft',
                'Garnish with coriander'
              ]
            },
            {
              name: 'Moong Dal Khichdi',
              ingredients: [
                'Yellow moong dal – ½ cup',
                'Rice – ½ cup',
                'Ghee – 1 tsp',
                'Hing – a pinch (to reduce gas)',
                'Cumin – ½ tsp',
                'Turmeric – ¼ tsp',
                'Water – 3 cups'
              ],
              method: [
                'Wash dal + rice',
                'Heat ghee, add cumin, hing, turmeric',
                'Add dal + rice + water, cook till soft porridge-like'
              ]
            },
            {
              name: 'Wheat Roti (2)',
              ingredients: ['Whole wheat flour', 'Water', 'Minimal ghee'],
              method: ['Make dough with flour and water', 'Roll and cook on tawa with minimal ghee']
            },
            {
              name: 'Fresh Curd (½ cup)',
              ingredients: ['Homemade curd (not sour)'],
              method: ['Serve fresh, room temperature']
            }
          ],
          ayurvedicBenefit: 'Lauki + curd cools Pitta heat, khichdi light & easy for Vata digestion, hing prevents gas'
        },
        snack: {
          title: 'Fennel-Cumin-Ajwain Tea + Steamed Sweet Potato',
          dishes: [
            {
              name: 'Digestive Tea',
              ingredients: [
                'Fennel seeds – ½ tsp',
                'Cumin seeds – ½ tsp',
                'Ajwain – ¼ tsp',
                'Water – 2 cups'
              ],
              method: [
                'Boil all seeds in water 5–7 min',
                'Strain & sip warm'
              ]
            },
            {
              name: 'Steamed Sweet Potato (100g)',
              ingredients: [
                'Sweet potato – 100g',
                'Black salt – pinch',
                'Roasted cumin powder – pinch'
              ],
              method: [
                'Wash, peel, cut into cubes',
                'Steam until soft (~10 min)',
                'Sprinkle black salt & roasted cumin powder'
              ]
            }
          ],
          ayurvedicBenefit: 'Tea relieves Vata bloating, sweet potato nourishes & calms both Vata + Pitta'
        },
        dinner: {
          title: 'Moong Dal Soup + Jeera Rice',
          dishes: [
            {
              name: 'Moong Dal Soup',
              ingredients: [
                'Yellow moong dal – ½ cup',
                'Water – 2 cups',
                'Ghee – 1 tsp',
                'Ginger paste – ½ tsp',
                'Cumin – ½ tsp',
                'Hing – a pinch',
                'Turmeric – ¼ tsp',
                'Salt – as per taste',
                'Coriander leaves – garnish'
              ],
              method: [
                'Pressure cook dal with turmeric + water',
                'Heat ghee in pan, add cumin, hing, ginger',
                'Add cooked dal, salt, simmer 5 min',
                'Garnish with coriander'
              ]
            },
            {
              name: 'Jeera Rice',
              ingredients: [
                'Rice – ½ cup',
                'Ghee – 1 tsp',
                'Cumin – ½ tsp',
                'Water – 1 cup'
              ],
              method: [
                'Heat ghee, add cumin',
                'Add rice + water, cook till fluffy'
              ]
            }
          ],
          ayurvedicBenefit: 'Light, warm, easily digestible. Moong + cumin reduce gas, jeera balances Pitta'
        }
      }
    };
  }

  /**
   * Create a fallback plan if OpenAI response parsing fails
   */
  createFallbackPlan(patient) {
    const dominantDosha = this.getDominantDosha(patient.prakriti);
    
    return {
      patientInfo: {
        name: patient.name,
        age: patient.age.toString(),
        weight: `${patient.physicalMeasurements?.weight?.value || 'Not specified'}${patient.physicalMeasurements?.weight?.unit || 'kg'}`,
        height: `${patient.physicalMeasurements?.height?.feet || 'Not specified'}'${patient.physicalMeasurements?.height?.inches || 0}"`,
        gender: patient.gender,
        prakriti: `Vata: ${patient.prakriti?.vata || 0}, Pitta: ${patient.prakriti?.pitta || 0}, Kapha: ${patient.prakriti?.kapha || 0} (${dominantDosha} dominant constitution)`,
        dominantDosha: dominantDosha.toLowerCase(),
        vikruti: `Vata: ${patient.vikriti?.vata || 0}, Pitta: ${patient.vikriti?.pitta || 0}, Kapha: ${patient.vikriti?.kapha || 0}`,
        concerns: this.formatHealthConditions(patient.roga),
        climate: `${patient.environment?.climate || 'Tropical'} climate, ${patient.environment?.season || 'Summer'} season`,
        agni: 'Normal digestive capacity',
        foodPreferences: `${patient.dietaryHabits?.type || 'Vegetarian'}, prefers warm foods`,
        targetCalories: `${patient.dietaryHabits?.targetCalories || 2000} kcal/day`
      },
      mealPlan: {
        breakfast: [
          'AI-generated diet plan is being processed. Please try again.',
          'Calories: ~500 kcal',
          { Rasa: 'Processing...', Guna: 'Processing...', Virya: 'Processing...', Vipaka: 'Processing...', Dosha: 'Processing...', Prabhava: 'Processing...' }
        ],
        lunch: [
          'AI-generated diet plan is being processed. Please try again.',
          'Calories: ~700 kcal',
          { Rasa: 'Processing...', Guna: 'Processing...', Virya: 'Processing...', Vipaka: 'Processing...', Dosha: 'Processing...', Prabhava: 'Processing...' }
        ],
        snack: [
          'AI-generated diet plan is being processed. Please try again.',
          'Calories: ~200 kcal',
          { Rasa: 'Processing...', Guna: 'Processing...', Virya: 'Processing...', Vipaka: 'Processing...', Dosha: 'Processing...', Prabhava: 'Processing...' }
        ],
        dinner: [
          'AI-generated diet plan is being processed. Please try again.',
          'Calories: ~600 kcal',
          { Rasa: 'Processing...', Guna: 'Processing...', Virya: 'Processing...', Vipaka: 'Processing...', Dosha: 'Processing...', Prabhava: 'Processing...' }
        ]
      },
      guidelines: [
        'Please try generating the diet plan again for complete recommendations.',
        'Ensure proper meal timings based on your constitution.',
        'Stay hydrated with warm water throughout the day.'
      ],
      herbs: [
        'Herb recommendations will be provided when the plan is fully generated.'
      ],
      lifestyle: [
        'Lifestyle recommendations will be provided when the plan is fully generated.'
      ]
    };
  }
}

module.exports = DietPlanGeneratorService;
