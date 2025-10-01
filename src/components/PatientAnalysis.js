import React from 'react';
import './PatientAnalysis.css';

const PatientAnalysis = ({ patientData }) => {
  // Hardcoded comprehensive analysis for Ayushi Singh
  const getAyushiAnalysis = () => {
    return {
      patientInfo: {
        name: 'Ayushi Singh',
        age: '29',
        weight: '50kg',
        height: '5\'5"',
        gender: 'Female',
        bmi: '18.34 (Normal)',
        targetCalories: '2200 kcal/day'
      },
      constitution: {
        prakriti: {
          vata: 3,
          pitta: 2,
          kapha: 1,
          dominant: 'Vata-Pitta',
          description: 'Intelligent, active, creative but prone to acidity and anxiety'
        },
        vikriti: {
          vata: 3.5,
          pitta: 2.5,
          kapha: 1,
          imbalance: 'Pitta aggravated, Vata disturbed',
          description: 'Current stress and lifestyle have increased Pitta (heat, acidity) and disturbed Vata (irregular digestion, sleep)'
        }
      },
      doshaUnderstanding: {
        pitta: {
          element: 'Fire + Water',
          represents: 'Transformation, digestion, metabolism, body heat, intelligence',
          balanced: 'Good digestion, sharp intellect, strong willpower, radiant skin',
          aggravated: 'Acidity, burning sensation, anger/irritability, sensitive skin, premature graying',
          ayushiCase: 'Mild acidity, occasional irritability → clear Pitta aggravation'
        },
        vata: {
          element: 'Air + Ether',
          represents: 'Movement, circulation, breathing, nerve impulses, creativity',
          balanced: 'Enthusiasm, flexibility, quick thinking, good communication',
          aggravated: 'Anxiety, irregular appetite, constipation, disturbed sleep, dryness',
          ayushiCase: 'Sleep disturbance + irregular digestion → signs of Vata imbalance'
        },
        kapha: {
          element: 'Earth + Water',
          represents: 'Structure, stability, strength, lubrication, immunity',
          balanced: 'Calmness, patience, strong immunity, endurance',
          aggravated: 'Laziness, heaviness, excessive sleep, weight gain, congestion',
          ayushiCase: 'Kapha naturally low → no sluggishness/obesity but needs immunity protection'
        }
      },
      practicalUnderstanding: [
        'If Pitta is high: acidity, overheating, irritability, red eyes, craving cooling foods',
        'If Vata is high: anxiety, disturbed sleep, gas/bloating, irregular hunger, dry skin',
        'If Kapha is high: lethargy, heaviness, slow digestion, excess mucus'
      ],
      healthConcerns: [
        'Mild hyperacidity (Pitta issue)',
        'Stress-related fatigue + irritability (Pitta + Vata)',
        'Irregular sleep pattern (Vata imbalance)',
        'Sensitive digestion – needs cooling, light but nourishing foods'
      ],
      healthStrategy: [
        'Cooling, light foods to pacify Pitta',
        'Routine & grounding practices to stabilize Vata',
        'Avoid too much spice, fried food, late-night eating',
        'Herbs like Shatavari, Triphala, and Ashwagandha recommended'
      ],
      selfMonitoring: [
        '"Today I feel hot and acidic → my Pitta is flaring"',
        '"I couldn\'t sleep well, stomach feels irregular → Vata is disturbed"',
        '"I feel heavy and slow after food → Kapha is high"'
      ]
    };
  };

  // Check if this is Ayushi Singh
  const isAyushi = patientData._id === '68cdcba34ddc05b1f94c8350' || 
                   (patientData.name && patientData.name.toLowerCase().includes('ayushi'));

  const analysis = isAyushi ? getAyushiAnalysis() : null;

  if (!analysis) {
    return (
      <div className="patient-analysis">
        <div className="analysis-header">
          <h3>Patient Analysis</h3>
          <p>Detailed constitutional analysis is available for specific patients.</p>
        </div>
        <div className="analysis-placeholder">
          <p>Analysis not available for this patient yet. Please contact your Ayurvedic practitioner for a comprehensive consultation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-analysis">
      <div className="analysis-header">
        <h3>🧑‍⚕️ Comprehensive Ayurvedic Patient Analysis</h3>
        <h4>{analysis.patientInfo.name}</h4>
      </div>

      {/* Basic Details */}
      <div className="analysis-section">
        <h5>📋 Personal & Basic Details</h5>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{analysis.patientInfo.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Age:</span>
            <span className="detail-value">{analysis.patientInfo.age} years</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Weight:</span>
            <span className="detail-value">{analysis.patientInfo.weight}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Height:</span>
            <span className="detail-value">{analysis.patientInfo.height}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">BMI:</span>
            <span className="detail-value">{analysis.patientInfo.bmi}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{analysis.patientInfo.gender}</span>
          </div>
        </div>
      </div>

      {/* Constitution Analysis */}
      <div className="analysis-section">
        <h5>🔬 Ayurvedic Constitution (Prakriti)</h5>
        <div className="constitution-grid">
          <div className="dosha-card vata">
            <h6>Vata: {analysis.constitution.prakriti.vata}</h6>
            <p>Medium level</p>
          </div>
          <div className="dosha-card pitta dominant">
            <h6>Pitta: {analysis.constitution.prakriti.pitta}</h6>
            <p>Medium-High (Dominant)</p>
          </div>
          <div className="dosha-card kapha">
            <h6>Kapha: {analysis.constitution.prakriti.kapha}</h6>
            <p>Low level</p>
          </div>
        </div>
        <div className="constitution-summary">
          <p><strong>Constitution Type:</strong> {analysis.constitution.prakriti.dominant}</p>
          <p><strong>Core Nature:</strong> {analysis.constitution.prakriti.description}</p>
        </div>
      </div>

      {/* Current Imbalance */}
      <div className="analysis-section">
        <h5>⚡ Current Imbalance (Vikriti)</h5>
        <div className="imbalance-grid">
          <div className="imbalance-item vata-high">
            <span>Vata: {analysis.constitution.vikriti.vata}</span>
            <span className="status">Slightly Disturbed</span>
          </div>
          <div className="imbalance-item pitta-high">
            <span>Pitta: {analysis.constitution.vikriti.pitta}</span>
            <span className="status">Aggravated</span>
          </div>
          <div className="imbalance-item kapha-normal">
            <span>Kapha: {analysis.constitution.vikriti.kapha}</span>
            <span className="status">Normal</span>
          </div>
        </div>
        <div className="imbalance-explanation">
          <p><strong>Current State:</strong> {analysis.constitution.vikriti.imbalance}</p>
          <p>{analysis.constitution.vikriti.description}</p>
        </div>
      </div>

      {/* Dosha Understanding */}
      <div className="analysis-section">
        <h5>🔥 Understanding the Doshas in Detail</h5>
        
        <div className="dosha-detail pitta-detail">
          <h6>🔥 Pitta ({analysis.doshaUnderstanding.pitta.element})</h6>
          <div className="dosha-info">
            <p><strong>Represents:</strong> {analysis.doshaUnderstanding.pitta.represents}</p>
            <p><strong>When Balanced:</strong> {analysis.doshaUnderstanding.pitta.balanced}</p>
            <p><strong>When Aggravated:</strong> {analysis.doshaUnderstanding.pitta.aggravated}</p>
            <p><strong>Ayushi's Case:</strong> {analysis.doshaUnderstanding.pitta.ayushiCase}</p>
          </div>
        </div>

        <div className="dosha-detail vata-detail">
          <h6>🌬 Vata ({analysis.doshaUnderstanding.vata.element})</h6>
          <div className="dosha-info">
            <p><strong>Represents:</strong> {analysis.doshaUnderstanding.vata.represents}</p>
            <p><strong>When Balanced:</strong> {analysis.doshaUnderstanding.vata.balanced}</p>
            <p><strong>When Aggravated:</strong> {analysis.doshaUnderstanding.vata.aggravated}</p>
            <p><strong>Ayushi's Case:</strong> {analysis.doshaUnderstanding.vata.ayushiCase}</p>
          </div>
        </div>

        <div className="dosha-detail kapha-detail">
          <h6>🌱 Kapha ({analysis.doshaUnderstanding.kapha.element})</h6>
          <div className="dosha-info">
            <p><strong>Represents:</strong> {analysis.doshaUnderstanding.kapha.represents}</p>
            <p><strong>When Balanced:</strong> {analysis.doshaUnderstanding.kapha.balanced}</p>
            <p><strong>When Aggravated:</strong> {analysis.doshaUnderstanding.kapha.aggravated}</p>
            <p><strong>Ayushi's Case:</strong> {analysis.doshaUnderstanding.kapha.ayushiCase}</p>
          </div>
        </div>
      </div>

      {/* Practical Understanding */}
      <div className="analysis-section">
        <h5>💡 Practical Understanding for Self-Monitoring</h5>
        <div className="practical-list">
          {analysis.practicalUnderstanding.map((item, index) => (
            <div key={index} className="practical-item">
              <span className="bullet">→</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="self-monitoring">
          <h6>🔍 Daily Self-Monitoring Examples:</h6>
          {analysis.selfMonitoring.map((example, index) => (
            <div key={index} className="monitoring-example">
              <span className="quote-icon">"</span>
              <span>{example}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Health Concerns */}
      <div className="analysis-section">
        <h5>🎯 Key Health Concerns</h5>
        <div className="concerns-list">
          {analysis.healthConcerns.map((concern, index) => (
            <div key={index} className="concern-item">
              <span className="concern-bullet">⚠️</span>
              <span>{concern}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Strategy */}
      <div className="analysis-section">
        <h5>📈 Personalized Health Strategy</h5>
        <div className="strategy-list">
          {analysis.healthStrategy.map((strategy, index) => (
            <div key={index} className="strategy-item">
              <span className="strategy-bullet">✅</span>
              <span>{strategy}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="analysis-summary">
        <h5>📊 Analysis Summary</h5>
        <div className="summary-card">
          <p><strong>Constitutional Awareness:</strong> With this detailed analysis, {analysis.patientInfo.name} not only understands her meal plan but also gains deep awareness of what her body signals mean, and how to self-balance using Ayurvedic principles.</p>
          <p><strong>Actionable Insights:</strong> Daily monitoring of dosha symptoms enables proactive health management and better understanding of mind-body connections.</p>
        </div>
      </div>

      <div className="analysis-actions">
        <button className="download-analysis-btn" onClick={() => downloadAnalysis(analysis)}>
          Download Analysis Report
        </button>
      </div>
    </div>
  );

  function downloadAnalysis(analysis) {
    const analysisText = formatAnalysisForDownload(analysis);
    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ayurvedic-analysis-${analysis.patientInfo.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatAnalysisForDownload(analysis) {
    return `
🧑‍⚕️ COMPREHENSIVE AYURVEDIC PATIENT ANALYSIS
Generated on: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════════════
PATIENT: ${analysis.patientInfo.name}
═══════════════════════════════════════════════════════════════

📋 PERSONAL & BASIC DETAILS:
• Name: ${analysis.patientInfo.name}
• Age: ${analysis.patientInfo.age}
• Weight: ${analysis.patientInfo.weight}
• Height: ${analysis.patientInfo.height}
• BMI: ${analysis.patientInfo.bmi}
• Gender: ${analysis.patientInfo.gender}
• Target Calories: ${analysis.patientInfo.targetCalories}

═══════════════════════════════════════════════════════════════
🔬 AYURVEDIC CONSTITUTION (PRAKRITI)
═══════════════════════════════════════════════════════════════

DOSHA LEVELS:
• Vata: ${analysis.constitution.prakriti.vata} (Medium)
• Pitta: ${analysis.constitution.prakriti.pitta} (Medium-High - Dominant)
• Kapha: ${analysis.constitution.prakriti.kapha} (Low)

CONSTITUTION TYPE: ${analysis.constitution.prakriti.dominant}
CORE NATURE: ${analysis.constitution.prakriti.description}

═══════════════════════════════════════════════════════════════
⚡ CURRENT IMBALANCE (VIKRITI)
═══════════════════════════════════════════════════════════════

CURRENT DOSHA LEVELS:
• Vata: ${analysis.constitution.vikriti.vata} (Slightly Disturbed)
• Pitta: ${analysis.constitution.vikriti.pitta} (Aggravated)
• Kapha: ${analysis.constitution.vikriti.kapha} (Normal)

IMBALANCE STATUS: ${analysis.constitution.vikriti.imbalance}
EXPLANATION: ${analysis.constitution.vikriti.description}

═══════════════════════════════════════════════════════════════
🔥 UNDERSTANDING THE DOSHAS IN DETAIL
═══════════════════════════════════════════════════════════════

🔥 PITTA (${analysis.doshaUnderstanding.pitta.element}):
• Represents: ${analysis.doshaUnderstanding.pitta.represents}
• When Balanced: ${analysis.doshaUnderstanding.pitta.balanced}
• When Aggravated: ${analysis.doshaUnderstanding.pitta.aggravated}
• Ayushi's Case: ${analysis.doshaUnderstanding.pitta.ayushiCase}

🌬 VATA (${analysis.doshaUnderstanding.vata.element}):
• Represents: ${analysis.doshaUnderstanding.vata.represents}
• When Balanced: ${analysis.doshaUnderstanding.vata.balanced}
• When Aggravated: ${analysis.doshaUnderstanding.vata.aggravated}
• Ayushi's Case: ${analysis.doshaUnderstanding.vata.ayushiCase}

🌱 KAPHA (${analysis.doshaUnderstanding.kapha.element}):
• Represents: ${analysis.doshaUnderstanding.kapha.represents}
• When Balanced: ${analysis.doshaUnderstanding.kapha.balanced}
• When Aggravated: ${analysis.doshaUnderstanding.kapha.aggravated}
• Ayushi's Case: ${analysis.doshaUnderstanding.kapha.ayushiCase}

═══════════════════════════════════════════════════════════════
💡 PRACTICAL UNDERSTANDING FOR SELF-MONITORING
═══════════════════════════════════════════════════════════════

${analysis.practicalUnderstanding.map(item => `• ${item}`).join('\n')}

DAILY SELF-MONITORING EXAMPLES:
${analysis.selfMonitoring.map(example => `• ${example}`).join('\n')}

═══════════════════════════════════════════════════════════════
🎯 KEY HEALTH CONCERNS
═══════════════════════════════════════════════════════════════

${analysis.healthConcerns.map(concern => `• ${concern}`).join('\n')}

═══════════════════════════════════════════════════════════════
📈 PERSONALIZED HEALTH STRATEGY
═══════════════════════════════════════════════════════════════

${analysis.healthStrategy.map(strategy => `• ${strategy}`).join('\n')}

═══════════════════════════════════════════════════════════════
📊 SUMMARY
═══════════════════════════════════════════════════════════════

With this detailed analysis, ${analysis.patientInfo.name} gains:
• Deep understanding of her constitutional makeup
• Awareness of current imbalances and their symptoms
• Practical tools for daily self-monitoring
• Clear health strategy for long-term wellness
• Foundation for personalized Ayurvedic treatment

This analysis serves as the foundation for all dietary recommendations,
lifestyle modifications, and therapeutic interventions.

═══════════════════════════════════════════════════════════════

Generated by: Ayurvedic Diet Management System
Practitioner: Dr. Ayurvedic Specialist
Date: ${new Date().toLocaleDateString()}
    `.trim();
  }
};

export default PatientAnalysis;
