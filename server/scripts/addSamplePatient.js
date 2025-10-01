const mongoose = require('mongoose');
require('dotenv').config();
const Patient = require('../models/Patient');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayurvedic_diet_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for data insertion');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Ayushi Singh's patient data
const ayushiData = {
  name: "Ayushi Singh",
  age: 29,
  gender: "Female",
  
  contactInfo: {
    phone: "+91-9876543210",
    email: "ayushi.singh@email.com",
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    }
  },

  prakriti: {
    vata: 3.0,
    pitta: 2.0,
    kapha: 1.0
  },

  vikriti: {
    vata: 3.5,
    pitta: 2.5,
    kapha: 1.0
  },

  roga: [
    {
      condition: "Abdominal Gas",
      severity: "Moderate",
      duration: "3 months",
      notes: "Occurs mainly after meals, especially heavy or cold foods"
    },
    {
      condition: "Heat in Body",
      severity: "Mild",
      duration: "2 weeks",
      notes: "Increased during summer season, feeling of internal heat"
    }
  ],

  physicalMeasurements: {
    weight: {
      value: 50,
      unit: "kg"
    },
    height: {
      feet: 5,
      inches: 5
    }
  },

  dietaryHabits: {
    type: "Vegetarian",
    appetite: "Moderate",
    foodPreferences: {
      temperature: "Warm",
      taste: ["Sweet", "Bitter", "Astringent"],
      spiceLevel: "Medium"
    },
    mealFrequency: {
      mainMeals: 3,
      snacks: 1
    },
    targetCalories: 2200,
    allergies: [],
    dislikes: ["Bitter gourd", "Very spicy food", "Cold drinks"]
  },

  lifestyle: {
    activityLevel: "Moderately Active",
    sleepPattern: {
      averageHours: 7,
      quality: "Good"
    },
    stressLevel: "Moderate",
    occupation: "Software Engineer",
    smokingStatus: "Never",
    alcoholConsumption: "None"
  },

  environment: {
    climate: "Tropical",
    season: "Summer"
  },

  medicalHistory: {
    currentMedications: [],
    pastIllnesses: [
      {
        condition: "Common Cold",
        year: 2023,
        treatment: "Ayurvedic herbs and rest"
      },
      {
        condition: "Digestive issues",
        year: 2022,
        treatment: "Dietary changes and Triphala"
      }
    ],
    familyHistory: [
      {
        relation: "Mother",
        condition: "Diabetes Type 2"
      },
      {
        relation: "Father",
        condition: "Hypertension"
      }
    ],
    surgeries: []
  },

  // Temporary createdBy ID (in production, this would be the doctor's actual ID)
  createdBy: new mongoose.Types.ObjectId("60d5ecb54b24a1234567890a")
};

const addSamplePatient = async () => {
  try {
    await connectDB();
    
    // Check if Ayushi already exists
    const existingPatient = await Patient.findOne({ 
      name: "Ayushi Singh",
      'contactInfo.email': "ayushi.singh@email.com"
    });

    if (existingPatient) {
      console.log('✅ Ayushi Singh already exists in the database!');
      console.log(`Patient ID: ${existingPatient._id}`);
      console.log(`Created: ${existingPatient.createdAt}`);
      console.log(`Dominant Prakriti: ${existingPatient.dominantPrakriti}`);
      console.log(`BMI: ${existingPatient.calculatedBMI}`);
    } else {
      // Create new patient
      const newPatient = new Patient(ayushiData);
      const savedPatient = await newPatient.save();
      
      console.log('🎉 Successfully added Ayushi Singh to the database!');
      console.log(`Patient ID: ${savedPatient._id}`);
      console.log(`Name: ${savedPatient.name}`);
      console.log(`Age: ${savedPatient.age}`);
      console.log(`Gender: ${savedPatient.gender}`);
      console.log(`Dominant Prakriti: ${savedPatient.dominantPrakriti}`);
      console.log(`Dominant Vikriti: ${savedPatient.dominantVikriti}`);
      console.log(`BMI: ${savedPatient.calculatedBMI}`);
      console.log(`Health Conditions: ${savedPatient.roga.map(r => r.condition).join(', ')}`);
      console.log(`Target Calories: ${savedPatient.dietaryHabits.targetCalories} kcal/day`);
    }

  } catch (error) {
    console.error('❌ Error adding patient:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the script
addSamplePatient();
