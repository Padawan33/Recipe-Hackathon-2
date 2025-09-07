import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Corrected path to your Supabase client

interface UserProfile {
  is_premium: boolean;
}

export const CalorieCounter: React.FC = () => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();
        if (profile && profile.is_premium) {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } else {
        setIsPremium(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
        setImagePreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogMeal = async () => {
    if (!imageData) {
      setStatus('Please select an image first.');
      return;
    }

    setStatus('Analyzing meal... Please wait.');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const jwt = session?.access_token;
      
      const response = await fetch('https://your-project-id.supabase.co/functions/v1/log-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({ imageData }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus(`Meal logged successfully: ${result.data.food_name} (${result.data.calories} calories)`);
        // Optionally clear image and preview after successful log
        setImageData(null);
        setImagePreviewUrl(null);
      } else {
        setStatus(`Error: ${result.error}`);
      }

    } catch (error) {
      console.error('Error logging meal:', error);
      setStatus('An error occurred. Please try again.');
    }
  };

  if (isPremium === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-400">Loading premium status...</p>
      </div>
    );
  }

  // Non-premium content (Call to Action)
  if (!isPremium) {
    return (
      <div className="premium-upsell-container">
        <h2 className="premium-upsell-title">Unlock Your Personal Nutritionist!</h2>
        <p className="premium-upsell-text">
          Upgrade to premium to get instant calorie estimates from photos, track your meals, and
          receive personalized insights into your eating habits.
        </p>
        <p className="premium-upsell-benefits">
          <span className="premium-benefit-item">📊 Track Calories Easily</span>
          <span className="premium-benefit-item">📅 View Meal Calendar</span>
          <span className="premium-benefit-item">💡 Get Personalized Insights</span>
        </p>
        <button className="premium-upsell-button">Upgrade to Premium Now!</button>
        <p className="premium-upsell-note">
          Already premium? Log in to access your features.
        </p>
      </div>
    );
  }

  // Premium content (Calorie Counter UI + Instructions)
  return (
    <div className="journal-page-container">
      <h1 className="journal-title">My Food Journal</h1>
      <p className="journal-description">
        Effortlessly track your meals with a snap! Get instant calorie estimates and build your personalized meal diary.
      </p>

      <div className="instructions-section">
        <h2 className="instructions-title">How It Works:</h2>
        <div className="instruction-step">
          <span className="step-number">1</span>
          <p>Tap "Take a Picture" to snap your meal.</p>
          <div className="instruction-image-placeholder">
            <img src="https://via.placeholder.com/150?text=Step+1" alt="Step 1" className="w-full h-auto rounded-md shadow-md" />
            
          </div>
        </div>
        <div className="instruction-step">
          <span className="step-number">2</span>
          <p>Review the image and tap "Log Meal".</p>
          <div className="instruction-image-placeholder">
            <img src="https://via.placeholder.com/150?text=Step+2" alt="Step 2" className="w-full h-auto rounded-md shadow-md" />
            
          </div>
        </div>
        <div className="instruction-step">
          <span className="step-number">3</span>
          <p>Get instant calorie insights and track your progress!</p>
          <div className="instruction-image-placeholder">
            <img src="https://via.placeholder.com/150?text=Step+3" alt="Step 3" className="w-full h-auto rounded-md shadow-md" />
            
          </div>
        </div>
      </div>

      <div className="calorie-input-section">
        <h2 className="calorie-input-title">Log Your Meal:</h2>
        
        {imagePreviewUrl && (
          <div className="image-preview-container">
            <img src={imagePreviewUrl} alt="Food Preview" className="image-preview" />
          </div>
        )}

        <label htmlFor="image-input" className="camera-button">
          <input type="file" id="image-input" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          Take a Picture
        </label>
        
        {imageData && (
          <button onClick={handleLogMeal} className="log-meal-button">Log Meal</button>
        )}

        {status && <div className="status-message">{status}</div>}
      </div>

      {/* Placeholder for future Meal Calendar and Insights */}
      <div className="mt-12 text-center text-gray-500">
        <h3>Coming Soon: Your Personalized Meal Calendar & Insights!</h3>
        <p>Stay tuned for advanced tracking and dietary analysis.</p>
      </div>
    </div>
  );
};