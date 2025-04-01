from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import datetime
import json

class ActionForecastPrep(Action):
    def name(self) -> Text:
        return "action_forecast_prep"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get current date and time
        now = datetime.datetime.now()
        day_of_week = now.strftime('%A').lower()
        hour = now.hour

        # Load historical data (mock data for example)
        historical_data = {
            'monday': {'lunch': 100, 'dinner': 150},
            'tuesday': {'lunch': 90, 'dinner': 130},
            'wednesday': {'lunch': 95, 'dinner': 140},
            'thursday': {'lunch': 110, 'dinner': 160},
            'friday': {'lunch': 130, 'dinner': 200},
            'saturday': {'lunch': 150, 'dinner': 220},
            'sunday': {'lunch': 140, 'dinner': 180}
        }

        # Determine service period
        service = 'lunch' if 6 <= hour < 16 else 'dinner'

        # Get base forecast from historical data
        base_forecast = historical_data[day_of_week][service]

        # Apply adjustments based on weather, events, etc.
        weather_factor = 1.0  # Mock weather adjustment
        event_factor = 1.0    # Mock event adjustment
        
        final_forecast = base_forecast * weather_factor * event_factor

        # Generate prep recommendations
        prep_recommendations = {
            'rice': f"{int(final_forecast * 0.2)}kg",
            'vegetables': f"{int(final_forecast * 0.3)}kg",
            'proteins': f"{int(final_forecast * 0.25)}kg",
            'sauces': f"{int(final_forecast * 0.1)}L"
        }

        response = f"Based on historical data and current factors, here are today's prep recommendations:\n\n"
        for item, amount in prep_recommendations.items():
            response += f"• {item.title()}: {amount}\n"

        response += f"\nExpected covers: {int(final_forecast)}"

        dispatcher.utter_message(text=response)
        return []