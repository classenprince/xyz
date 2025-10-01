# Ayurvedic Diet Management System

A comprehensive AI-powered system for managing patient data and generating personalized Ayurvedic diet recommendations based on patient constitution (Prakriti), current state (Vikriti), and health conditions.

## 🌟 Features

### Patient Management
- **Complete Patient Profiles**: Store detailed patient information including personal details, constitution analysis, health conditions, and lifestyle factors
- **Ayurvedic Constitution Assessment**: Track both Prakriti (natural constitution) and Vikriti (current state) with Vata, Pitta, and Kapha scores
- **Health Condition Tracking**: Monitor multiple health conditions (Roga) with severity levels
- **Physical Measurements**: BMI calculation, weight, height tracking
- **Dietary Preferences**: Comprehensive dietary habit analysis including food preferences, allergies, and target calories

### Backend Features
- **MongoDB Integration**: Robust data storage with proper schema validation
- **RESTful API**: Complete CRUD operations for patient management
- **Data Validation**: Comprehensive validation using Joi for data integrity
- **Error Handling**: Proper error responses and validation messages
- **Search & Pagination**: Efficient patient search and data pagination

### Frontend Features
- **Modern React Interface**: Clean, responsive UI with multiple theme support
- **Real-time Patient Form**: Dynamic form with validation and error handling
- **Patient Dashboard**: Overview of patient data with constitution analysis
- **Server Status Monitoring**: Real-time backend connection status

## 🏗️ Architecture

```
SIH/
├── src/                    # Frontend (React)
│   ├── components/         # React components
│   ├── services/          # API service layer
│   └── ...
├── server/                # Backend (Node.js + Express)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── config/            # Database configuration
│   └── ...
└── package.json           # Root package configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIH
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```
   This installs both frontend and backend dependencies.

3. **Set up environment variables**
   ```bash
   # Create .env file in server directory
   cd server
   cp .env.example .env
   
   # Edit .env with your MongoDB connection string
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ayurvedic_diet_db
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Ensure your connection string is correct in .env

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend only
   npm run server:dev
   
   # Frontend only (in another terminal)
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

## 📊 Patient Data Structure

The system stores comprehensive patient data in the following format:

```json
{
  "name": "Patient Name",
  "age": 29,
  "gender": "Female",
  "prakriti": {
    "vata": 3.0,
    "pitta": 2.0,
    "kapha": 1.0
  },
  "vikriti": {
    "vata": 3.5,
    "pitta": 2.5,
    "kapha": 1.0
  },
  "roga": [
    {
      "condition": "Abdominal Gas",
      "severity": "Moderate"
    }
  ],
  "physicalMeasurements": {
    "weight": { "value": 50, "unit": "kg" },
    "height": { "feet": 5, "inches": 5 }
  },
  "dietaryHabits": {
    "type": "Vegetarian",
    "appetite": "Moderate",
    "targetCalories": 2200,
    "mealFrequency": {
      "mainMeals": 3,
      "snacks": 1
    }
  }
}
```

## 🔌 API Endpoints

### Patient Management
- `GET /api/patients` - Get all patients (with pagination and search)
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Soft delete patient
- `GET /api/patients/:id/summary` - Get patient summary

### System
- `GET /health` - Server health check
- `GET /` - API information

## 🎨 Themes

The application supports multiple themes:
- **Dark** - Modern dark theme
- **Light** - Clean light theme
- **Coal** - Dark with warm accents
- **Paper** - Warm light theme
- **Gray** - Neutral gray theme

## 🧪 Sample Data

Check `server/sample-patient-data.json` for example patient data structure that matches your requirements:

- Name, Age, Gender
- Prakriti scores (Vata: 3, Pitta: 2, Kapha: 1)
- Vikriti scores (Vata: 3.5, Pitta: 2.5, Kapha: 1)
- Health conditions (Abdominal Gas, Heat in body)
- Physical measurements (50kg, 5'5")
- Dietary preferences (Vegetarian, moderate appetite, warm foods)
- Target calories (2200 kcal/day)

## 🔧 Development

### Backend Development
```bash
cd server
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
npm start    # Runs React development server
```

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
npm test
```

## 📱 Mobile Responsiveness

The application is fully responsive and works well on:
- Desktop computers
- Tablets
- Mobile phones

## 🔐 Security Features

- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js security headers
- Environment variable protection

## 🚀 Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   ```

3. **Start production server**
   ```bash
   npm run server
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes: `lsof -ti:5000 | xargs kill -9`

3. **Dependencies Issues**
   - Clear node_modules: `rm -rf node_modules package-lock.json`
   - Reinstall: `npm install`

### Getting Help

- Check the console for error messages
- Verify all environment variables are set correctly
- Ensure both frontend and backend are running
- Check MongoDB connection status

## 🎯 Future Enhancements

- [ ] AI-powered diet recommendation engine
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with hospital management systems
- [ ] Mobile app development
- [ ] Herb database integration
- [ ] Meal planning automation
- [ ] Patient progress tracking