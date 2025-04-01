from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import datetime
import json

class ActionAdjustPrice(Action):
    def name(self) -> Text:
        return "action_adjust_price"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get current time and demand factors
        now = datetime.datetime.now()
        hour = now.hour
        day = now.strftime('%A').lower()

        # Define peak hours and pricing factors
        peak_hours = {
            'lunch': (11, 14),
            'dinner': (18, 21)
        }

        day_factors = {
            'monday': 0.9,
            'friday': 1.2,
            'saturday': 1.3,
            'sunday': 1.1
        }

        # Calculate current demand
        is_peak = False
        for period, (start, end) in peak_hours.items():
            if start <= hour <= end:
                is_peak = True
                break

        # Get base price from tracker
        food_item = next(tracker.get_latest_entity_values("food_item"), None)
        base_price = 20.0  # Mock base price

        # Calculate adjusted price
        day_factor = day_factors.get(day, 1.0)
        peak_factor = 1.2 if is_peak else 1.0
        
        adjusted_price = base_price * day_factor * peak_factor

        # Format response
        response = f"Current pricing for {food_item if food_item else 'menu items'}:\n\n"
        response += f"Base price: ${base_price:.2f}\n"
        
        if day_factor != 1.0:
            response += f"Day adjustment: {(day_factor - 1) * 100:+.0f}%\n"
        
        if peak_factor != 1.0:
            response += f"Peak hour adjustment: {(peak_factor - 1) * 100:+.0f}%\n"
        
        response += f"\nFinal price: ${adjusted_price:.2f}"

        dispatcher.utter_message(
            text=response,
            custom={
                "price_data": {
                    "base": base_price,
                    "adjusted": adjusted_price,
                    "factors": {
                        "day": day_factor,
                        "peak": peak_factor
                    }
                }
            }
        )
        return []