from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import logging

logger = logging.getLogger(__name__)

class ActionHandleFeedback(Action):
    def name(self) -> Text:
        return "action_handle_feedback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Extract sentiment from the message
        message = tracker.latest_message.get('text', '')
        
        # Log feedback for analytics
        logger.info(f"Feedback received: {message}")
        
        # Analyze feedback content
        positive_keywords = ['great', 'excellent', 'amazing', 'good', 'love', 'perfect']
        negative_keywords = ['bad', 'poor', 'terrible', 'slow', 'cold', 'wrong']
        
        is_positive = any(word in message.lower() for word in positive_keywords)
        is_negative = any(word in message.lower() for word in negative_keywords)
        
        if is_positive:
            response = "Thank you for your wonderful feedback! We're delighted to hear you enjoyed your experience."
            if 'service' in message.lower():
                response += " Our team takes great pride in providing exceptional service."
            elif 'food' in message.lower():
                response += " Our chef will be thrilled to hear your appreciation."
        elif is_negative:
            response = "I sincerely apologize for any disappointment. Your feedback is invaluable to us."
            response += " Would you like to speak with a manager to address your concerns?"
        else:
            response = "Thank you for sharing your feedback. We value your input and continuously strive to improve."

        dispatcher.utter_message(
            text=response,
            custom={
                "feedback_data": {
                    "sentiment": "positive" if is_positive else "negative" if is_negative else "neutral",
                    "timestamp": tracker.get_slot("timestamp"),
                    "user_id": tracker.sender_id
                }
            }
        )
        
        return []