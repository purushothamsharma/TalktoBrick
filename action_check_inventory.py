from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import logging
import datetime

logger = logging.getLogger(__name__)

class ActionCheckInventory(Action):
    def name(self) -> Text:
        return "action_check_inventory"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get requested item
        item = next(tracker.get_latest_entity_values("food_item"), None)
        
        # Mock inventory data
        inventory = {
            "proteins": {
                "ribeye": {"quantity": 45, "unit": "steaks", "threshold": 20},
                "salmon": {"quantity": 38, "unit": "fillets", "threshold": 15},
                "chicken": {"quantity": 85, "unit": "breasts", "threshold": 30}
            },
            "produce": {
                "lettuce": {"quantity": 25, "unit": "heads", "threshold": 10},
                "tomatoes": {"quantity": 50, "unit": "kg", "threshold": 20},
                "onions": {"quantity": 75, "unit": "kg", "threshold": 25}
            },
            "dairy": {
                "butter": {"quantity": 40, "unit": "kg", "threshold": 15},
                "cream": {"quantity": 30, "unit": "L", "threshold": 10},
                "cheese": {"quantity": 55, "unit": "kg", "threshold": 20}
            }
        }

        # Log inventory check
        logger.info(f"Inventory check requested for: {item}")
        
        response = ""
        alerts = []
        
        if item:
            # Check specific item
            for category, items in inventory.items():
                if item.lower() in items:
                    item_data = items[item.lower()]
                    response = f"Current inventory for {item}:\n"
                    response += f"• Quantity: {item_data['quantity']} {item_data['unit']}\n"
                    
                    if item_data['quantity'] < item_data['threshold']:
                        alerts.append(f"⚠️ {item} is below reorder threshold!")
        else:
            # General inventory status
            response = "Current inventory status:\n\n"
            for category, items in inventory.items():
                response += f"{category.title()}:\n"
                for item_name, item_data in items.items():
                    response += f"• {item_name.title()}: {item_data['quantity']} {item_data['unit']}\n"
                    
                    if item_data['quantity'] < item_data['threshold']:
                        alerts.append(f"⚠️ {item_name} is below reorder threshold!")
                response += "\n"

        if alerts:
            response += "\nAlerts:\n" + "\n".join(alerts)

        dispatcher.utter_message(
            text=response,
            custom={
                "inventory_data": {
                    "timestamp": datetime.datetime.now().isoformat(),
                    "alerts": alerts,
                    "checked_item": item
                }
            }
        )
        
        return []