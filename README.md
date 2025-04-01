# Brick Restaurant Assistant

## Rasa Pro Configuration

This directory contains the Rasa Pro configuration for the Brick restaurant assistant. The assistant is designed to handle complex restaurant interactions including ordering, recommendations, and reservations.

### Features

- Multi-language support (English/Spanish)
- Menu management
- Order processing
- Wine pairing recommendations
- Reservation handling
- Special occasion management

### Project Structure

```
rasa-brick/
├── actions/          # Custom actions
├── data/            # Training data
│   ├── nlu.yml      # NLU training examples
│   ├── rules.yml    # Conversation rules
│   └── stories.yml  # Conversation flows
├── models/          # Trained model files
├── tests/           # Test conversations
└── config.yml       # Model configuration
```

### Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Train the model:
   ```bash
   rasa train
   ```

3. Test the model:
   ```bash
   rasa test
   ```

4. Start the services:
   ```bash
   # Start Rasa server
   rasa run --enable-api --cors "*"

   # Start actions server
   rasa run actions
   ```

### Custom Actions

1. `ActionProcessOrder`:
   - Handles order processing
   - Manages quantities and customizations
   - Suggests wine pairings

2. `ActionShowRecommendations`:
   - Provides context-aware recommendations
   - Considers time of day
   - Highlights chef's specials

3. `ActionSuggestWine`:
   - Offers wine pairing suggestions
   - Based on cuisine and dish selection
   - Includes sommelier recommendations

4. `ActionHandleReservation`:
   - Manages table reservations
   - Handles special occasions
   - Coordinates seating preferences

### Testing

1. NLU Testing:
   ```bash
   rasa test nlu
   ```

2. Core Testing:
   ```bash
   rasa test core
   ```

3. Interactive Learning:
   ```bash
   rasa interactive
   ```

### Deployment

1. Using Docker:
   ```bash
   docker-compose up -d
   ```

2. Manual deployment:
   ```bash
   # Start Rasa server
   rasa run --enable-api --cors "*" --port 5005

   # Start actions server
   rasa run actions --port 5055
   ```

### Environment Variables

```env
RASA_MODEL_SERVER=https://brick-rasa-pro.onrender.com
RASA_MODEL_TOKEN=your_token
RASA_DB_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Run tests
5. Submit a pull request

### License

© 2024 ViLa Ventures. All rights reserved.