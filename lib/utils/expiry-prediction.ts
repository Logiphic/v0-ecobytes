interface SensorData {
  ph?: number;
  temperature?: number;
  humidity?: number;
}

/**
 * Calculate predicted expiry date based on declared expiry and sensor data
 * @param declaredExpiryDate - The manufacturer's declared expiry date
 * @param sensorData - Sensor readings (pH, temperature, humidity)
 * @returns Predicted expiry date (may be earlier than declared if conditions are poor)
 */
export function calculatePredictedExpiry(
  declaredExpiryDate: string,
  sensorData?: SensorData | null
): string {
  const declaredDate = new Date(declaredExpiryDate);
  
  // If no sensor data, return declared date
  if (!sensorData) {
    return declaredExpiryDate;
  }

  let penaltyDays = 0;

  // Temperature penalty (ideal: 0-7°C for most fresh foods)
  if (sensorData.temperature !== undefined) {
    if (sensorData.temperature > 25) {
      penaltyDays += 5; // Very hot - significant spoilage
    } else if (sensorData.temperature > 15) {
      penaltyDays += 3; // Warm - moderate spoilage
    } else if (sensorData.temperature > 10) {
      penaltyDays += 1; // Slightly warm
    }
  }

  // Humidity penalty (ideal: 50-70% for most foods)
  if (sensorData.humidity !== undefined) {
    if (sensorData.humidity > 85) {
      penaltyDays += 4; // Very high - mold risk
    } else if (sensorData.humidity > 75) {
      penaltyDays += 2; // High - some risk
    } else if (sensorData.humidity < 30) {
      penaltyDays += 1; // Too dry - may dehydrate
    }
  }

  // pH penalty (ideal: 6.0-7.0 for most foods)
  if (sensorData.ph !== undefined) {
    const phDiff = Math.abs(sensorData.ph - 6.5);
    if (phDiff > 2) {
      penaltyDays += 3; // Significant pH change
    } else if (phDiff > 1) {
      penaltyDays += 1; // Moderate pH change
    }
  }

  // Calculate predicted date
  const predictedDate = new Date(declaredDate);
  predictedDate.setDate(predictedDate.getDate() - penaltyDays);

  // Ensure predicted date is not after declared date
  if (predictedDate > declaredDate) {
    return declaredExpiryDate;
  }

  return predictedDate.toISOString().split('T')[0];
}

/**
 * Calculate status based on predicted or declared expiry date
 */
export function calculateStatus(expiryDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "near-expiry";
  return "fresh";
}
