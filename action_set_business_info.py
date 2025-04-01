from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import json

class ActionSetBusinessInfo(Action):
    def name(self) -> Text:
        return "action_set_business_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Extract business information from entities
        business_name = next(tracker.get_latest_entity_values("business_name"), None)
        cuisine_type = next(tracker.get_latest_entity_values("cuisine_type"), None)
        
        # Default operating hours
        default_hours = {
            "monday": {"open": "09:00", "close": "22:00"},
            "tuesday": {"open": "09:00", "close": "22:00"},
            "wednesday": {"open": "09:00", "close": "22:00"},
            "thursday": {"open": "09:00", "close": "22:00"},
            "friday": {"open": "09:00", "close": "23:00"},
            "saturday": {"open": "10:00", "close": "23:00"},
            "sunday": {"open": "10:00", "close": "22:00"}
        }

        # Default AI features
        default_features = {
            "autoUpsell": True,
            "allergyWarnings": True,
            "dietaryRecommendations": True,
            "smartPairing": True
        }

        # Create business settings
        business_info = {
            "name": business_name or "New Restaurant",
            "type": "restaurant",
            "cuisine": cuisine_type or "contemporary",
            "operating_hours": default_hours,
            "ai_features": default_features
        }

        response = f"I've set up your restaurant profile:\n\n"
        response += f"• Name: {business_info['name']}\n"
        response += f"• Cuisine: {business_info['cuisine'].title()}\n"
        response += f"• Type: {business_info['type'].title()}\n\n"
        response += "I've configured standard operating hours and enabled all AI features. "
        response += "You can customize these settings anytime through the dashboard."

        dispatcher.utter_message(
            text=response,
            custom={
                "business_info": business_info
            }
        )

        return [
            SlotSet("business_name", business_info["name"]),
            SlotSet("cuisine_type", business_info["cuisine"])
        ]