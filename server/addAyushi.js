const mongoose = require('mongoose');
require('dotenv').config();

// Import the actual Patient model
const Patient = require('./models/Patient');

async function addAyushi() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayurvedic_diet_db');
    console.log('✅ Connected to MongoDB');

    // Ayushi's data
    const ayushiData = {
      name: "Ayushi Singh",
      age: 29,
      gender: "Female",
      contactInfo: {
        phone: "919876543210",
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
          notes: "Occurs mainly after meals"
        },
        {
          condition: "Heat in Body",
          severity: "Mild",
          duration: "2 weeks",
          notes: "Increased during summer season"
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
        dislikes: ["Bitter gourd", "Very spicy food"]
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
          }
        ],
        familyHistory: [
          {
            relation: "Mother",
            condition: "Diabetes Type 2"
          }
        ],
        surgeries: []
      },
      createdBy: new mongoose.Types.ObjectId(),
      isActive: true
    };

    // Check if Ayushi already exists
    const existing = await Patient.findOne({ 
      name: "Ayushi Singh",
      'contactInfo.email': "ayushi.singh@email.com"
    });

    if (existing) {
      console.log('ℹ️  Ayushi Singh already exists in database');
      console.log(`   ID: ${existing._id}`);
      console.log(`   Created: ${existing.createdAt}`);
    } else {
      // Add Ayushi to database
      const newPatient = await Patient.create(ayushiData);
      console.log('🎉 Successfully added Ayushi Singh!');
      console.log(`   ID: ${newPatient._id}`);
      console.log(`   Name: ${newPatient.name}`);
      console.log(`   Age: ${newPatient.age}, Gender: ${newPatient.gender}`);
      console.log(`   Prakriti: Vata=${newPatient.prakriti.vata}, Pitta=${newPatient.prakriti.pitta}, Kapha=${newPatient.prakriti.kapha}`);
      console.log(`   Health Issues: ${newPatient.roga.map(r => r.condition).join(', ')}`);
      console.log(`   Target Calories: ${newPatient.dietaryHabits.targetCalories} kcal/day`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the function
addAyushi();
