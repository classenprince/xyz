const mongoose = require('mongoose');

// Schema for Dosha scores (Vata, Pitta, Kapha)
const doshaSchema = new mongoose.Schema({
  vata: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  pitta: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  kapha: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
}, { _id: false });

// Schema for physical measurements
const physicalMeasurementsSchema = new mongoose.Schema({
  weight: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  height: {
    feet: Number,
    inches: Number,
    cm: Number
  },
  bmi: {
    type: Number,
    min: 10,
    max: 50
  }
}, { _id: false });

// Schema for dietary habits
const dietaryHabitsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian'],
    required: true
  },
  appetite: {
    type: String,
    enum: ['Poor', 'Moderate', 'Good', 'Excessive'],
    default: 'Moderate'
  },
  foodPreferences: {
    temperature: {
      type: String,
      enum: ['Cold', 'Warm', 'Hot', 'Room Temperature'],
      default: 'Warm'
    },
    taste: [{
      type: String,
      enum: ['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent']
    }],
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Spicy', 'Very Spicy'],
      default: 'Medium'
    }
  },
  mealFrequency: {
    mainMeals: {
      type: Number,
      min: 1,
      max: 6,
      default: 3
    },
    snacks: {
      type: Number,
      min: 0,
      max: 5,
      default: 1
    }
  },
  targetCalories: {
    type: Number,
    min: 800,
    max: 5000,
    required: true
  },
  allergies: [{
    type: String
  }],
  dislikes: [{
    type: String
  }]
}, { _id: false });

// Main Patient Schema
const patientSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  
  // Contact Information
  contactInfo: {
    phone: {
      type: String,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'India'
      }
    }
  },

  // Ayurvedic Constitution
  prakriti: {
    type: doshaSchema,
    required: [true, 'Prakriti assessment is required']
  },
  vikriti: {
    type: doshaSchema,
    required: [true, 'Vikriti assessment is required']
  },

  // Health Information
  roga: [{
    condition: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe'],
      default: 'Moderate'
    },
    duration: String,
    notes: String
  }],

  // Physical Measurements
  physicalMeasurements: {
    type: physicalMeasurementsSchema,
    required: true
  },

  // Dietary Information
  dietaryHabits: {
    type: dietaryHabitsSchema,
    required: true
  },

  // Lifestyle Factors
  lifestyle: {
    activityLevel: {
      type: String,
      enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'],
      default: 'Moderately Active'
    },
    sleepPattern: {
      averageHours: {
        type: Number,
        min: 3,
        max: 12,
        default: 7
      },
      quality: {
        type: String,
        enum: ['Poor', 'Fair', 'Good', 'Excellent'],
        default: 'Good'
      }
    },
    stressLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Very High'],
      default: 'Moderate'
    },
    occupation: String,
    smokingStatus: {
      type: String,
      enum: ['Never', 'Former', 'Current'],
      default: 'Never'
    },
    alcoholConsumption: {
      type: String,
      enum: ['None', 'Occasional', 'Moderate', 'Heavy'],
      default: 'None'
    }
  },

  // Environmental Factors
  environment: {
    climate: {
      type: String,
      enum: ['Tropical', 'Subtropical', 'Temperate', 'Cold', 'Arid', 'Humid'],
      default: 'Tropical'
    },
    season: {
      type: String,
      enum: ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'],
      default: 'Summer'
    }
  },

  // Medical History
  medicalHistory: {
    currentMedications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date
    }],
    pastIllnesses: [{
      condition: String,
      year: Number,
      treatment: String
    }],
    familyHistory: [{
      relation: String,
      condition: String
    }],
    surgeries: [{
      procedure: String,
      date: Date,
      hospital: String
    }]
  },

  // Diet Plans and Consultations
  dietPlans: [{
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DietPlan'
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  consultations: [{
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation'
    },
    date: {
      type: Date,
      default: Date.now
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    notes: String
  }],

  // System Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for BMI calculation
patientSchema.virtual('calculatedBMI').get(function() {
  if (this.physicalMeasurements.weight && this.physicalMeasurements.height) {
    const weightInKg = this.physicalMeasurements.weight.unit === 'lbs' 
      ? this.physicalMeasurements.weight.value * 0.453592 
      : this.physicalMeasurements.weight.value;
    
    let heightInM;
    if (this.physicalMeasurements.height.cm) {
      heightInM = this.physicalMeasurements.height.cm / 100;
    } else if (this.physicalMeasurements.height.feet) {
      const totalInches = (this.physicalMeasurements.height.feet * 12) + (this.physicalMeasurements.height.inches || 0);
      heightInM = totalInches * 0.0254;
    }
    
    if (heightInM) {
      return Math.round((weightInKg / (heightInM * heightInM)) * 100) / 100;
    }
  }
  return null;
});

// Virtual for dominant dosha in Prakriti
patientSchema.virtual('dominantPrakriti').get(function() {
  const { vata, pitta, kapha } = this.prakriti;
  if (vata >= pitta && vata >= kapha) return 'Vata';
  if (pitta >= kapha) return 'Pitta';
  return 'Kapha';
});

// Virtual for dominant dosha in Vikriti
patientSchema.virtual('dominantVikriti').get(function() {
  const { vata, pitta, kapha } = this.vikriti;
  if (vata >= pitta && vata >= kapha) return 'Vata';
  if (pitta >= kapha) return 'Pitta';
  return 'Kapha';
});

// Pre-save middleware to calculate BMI
patientSchema.pre('save', function(next) {
  if (this.calculatedBMI) {
    this.physicalMeasurements.bmi = this.calculatedBMI;
  }
  this.lastUpdated = new Date();
  next();
});

// Index for better query performance
patientSchema.index({ name: 1, createdBy: 1 });
patientSchema.index({ 'contactInfo.phone': 1 });
patientSchema.index({ 'contactInfo.email': 1 });
patientSchema.index({ createdAt: -1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
