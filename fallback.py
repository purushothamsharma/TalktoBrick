from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import openai
import logging
import time

logger = logging.getLogger(__name__)

class ActionDefaultFallback(Action):
    def name(self) -> Text:
        return "action_default_fallback"

    async def run(self, dispatcher: CollectingDispatcher,
                 tracker: Tracker,
                 domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        start_time = time.time()
        
        try:
            # Get conversation context
            messages = [
                {"role": "system", "content": "You are BFF (Brick For Food), an AI assistant for a fine dining restaurant."},
                {"role": "user", "content": tracker.latest_message.get('text', '')}
            ]
            
            # Add recent conversation history
            for event in tracker.events[-5:]:
                if event.get('event') == 'user':
                    messages.append({
                        "role": "user",
                        "content": event.get('text', '')
                    })
                elif event.get('event') == 'bot':
                    messages.append({
                        "role": "assistant",
                        "content": event.get('text', '')
                    })

            # Get OpenAI response
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=150
            )

            # Log response time
            response_time = time.time() - start_time
            logger.info(f"OpenAI fallback response time: {response_time:.2f}s")

            # Send response
            dispatcher.utter_message(
                text=response.choices[0].message.content,
                custom={
                    "fallback_data": {
                        "source": "openai",
                        "response_time": response_time,
                        "confidence": response.choices[0].finish_reason == "stop"
                    }
                }
            )

        except Exception as e:
            logger.error(f"OpenAI fallback error: {e}")
            dispatcher.utter_message(
                text="I apologize, but I'm having trouble understanding. Could you please rephrase your request?",
                custom={
                    "fallback_data": {
                        "source": "default",
                        "error": str(e)
                    }
                }
            )

        return []