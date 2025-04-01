from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import json
import random

class ActionProcessOrder(Action):
    def name(self) -> Text:
        return "action_process_order"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        food_item = next(tracker.get_latest_entity_values("food_item"), None)
        quantity = next(tracker.get_latest_entity_values("quantity"), 1)
        
        if not food_item:
            dispatcher.utter_message(text="What would you like to order from our menu?")
            return []

        # Get current ordered items
        ordered_items = tracker.get_slot("ordered_items") or []
        ordered_items.append({
            "item": food_item,
            "quantity": quantity
        })

        # Determine cuisine and suggest pairings
        cuisine_mapping = {
            "steak": "Contemporary",
            "salmon": "Seafood",
            "risotto": "Italian",
            "sushi": "Japanese",
            "dosa": "Indian",
            "tacos": "Mexican"
        }
        
        cuisine = cuisine_mapping.get(food_item.lower(), None)
        
        # Craft a luxurious response
        response = f"Excellent choice! I've added {quantity}x {food_item} to your selection."
        
        if cuisine:
            wine_suggestions = {
                "Contemporary": ["Cabernet Sauvignon", "Malbec"],
                "Seafood": ["Chardonnay", "Sauvignon Blanc"],
                "Italian": ["Chianti", "Barolo"],
                "Japanese": ["Junmai Daiginjo Sake", "Riesling"],
                "Indian": ["Gewürztraminer", "Rosé"],
                "Mexican": ["Tempranillo", "Albariño"]
            }
            
            wines = wine_suggestions.get(cuisine, [])
            if wines:
                response += f"\n\nMay I suggest a pairing with our {' or '.join(wines)}?"

        dispatcher.utter_message(
            text=response,
            custom={
                "order_data": ordered_items,
                "cuisine": cuisine,
                "show_customization": True
            }
        )
        
        return [
            SlotSet("ordered_items", ordered_items),
            SlotSet("current_cuisine", cuisine)
        ]

class ActionShowRecommendations(Action):
    def name(self) -> Text:
        return "action_show_recommendations"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get time of day for contextual recommendations
        from datetime import datetime
        hour = datetime.now().hour
        
        recommendations = {
            "morning": [
                "Our signature Eggs Benedict with house-made hollandaise",
                "Artisanal pastry selection from our in-house bakery",
                "Organic steel-cut oatmeal with seasonal berries"
            ],
            "afternoon": [
                "Chef's tasting menu with wine pairings",
                "House-aged prime ribeye with truffle butter",
                "Wild-caught salmon with citrus beurre blanc"
            ],
            "evening": [
                "Seven-course degustation menu",
                "Dry-aged Tomahawk steak for two",
                "Fresh seafood tower with champagne"
            ]
        }
        
        if 6 <= hour < 11:
            time_of_day = "morning"
        elif 11 <= hour < 17:
            time_of_day = "afternoon"
        else:
            time_of_day = "evening"
            
        suggestions = recommendations[time_of_day]
        
        response = "Allow me to present our chef's recommendations:\n\n"
        for suggestion in suggestions:
            response += f"• {suggestion}\n"
            
        response += "\nEach dish is crafted with seasonal ingredients from our local artisanal partners."
        
        dispatcher.utter_message(text=response)
        return []

class ActionSuggestWine(Action):
    def name(self) -> Text:
        return "action_suggest_wine"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        current_cuisine = tracker.get_slot("current_cuisine")
        
        wine_pairings = {
            "Contemporary": {
                "red": ["2018 Château Margaux", "2016 Opus One"],
                "white": ["2019 Puligny-Montrachet"]
            },
            "Seafood": {
                "white": ["2020 Chablis Grand Cru", "2019 Meursault"],
                "sparkling": ["Krug Grande Cuvée"]
            },
            "Italian": {
                "red": ["2015 Barolo Riserva", "2017 Brunello di Montalcino"],
                "white": ["2020 Gavi di Gavi"]
            }
        }
        
        if current_cuisine in wine_pairings:
            wines = wine_pairings[current_cuisine]
            response = "Our sommelier recommends:\n\n"
            
            for wine_type, selections in wines.items():
                response += f"{wine_type.title()} Wines:\n"
                for wine in selections:
                    response += f"• {wine}\n"
        else:
            response = "I'd be happy to have our sommelier suggest the perfect wine pairing for your selection."
        
        dispatcher.utter_message(text=response)
        return []

class ActionHandleReservation(Action):
    def name(self) -> Text:
        return "action_handle_reservation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        party_size = next(tracker.get_latest_entity_values("party_size"), None)
        date = next(tracker.get_latest_entity_values("date"), None)
        occasion = next(tracker.get_latest_entity_values("occasion"), None)
        
        response = "I'd be delighted to assist with your reservation."
        
        if occasion:
            special_touches = {
                "anniversary": "We'll ensure a romantic table setting with complimentary champagne.",
                "birthday": "We'll arrange for a special dessert presentation.",
                "business": "We'll reserve our private dining room for your comfort."
            }
            response += f"\n\n{special_touches.get(occasion, '')}"
        
        if party_size:
            response += f"\n\nFor your party of {party_size}, I recommend:"
            if int(party_size) <= 2:
                response += "\n• Our intimate window tables overlooking the garden"
            elif int(party_size) <= 6:
                response += "\n• Our semi-private alcove seating"
            else:
                response += "\n• Our elegant private dining room"
        
        response += "\n\nWould you like to proceed with the reservation?"
        
        dispatcher.utter_message(text=response)
        return [
            SlotSet("party_size", party_size),
            SlotSet("reservation_date", date),
            SlotSet("occasion", occasion)
        ]