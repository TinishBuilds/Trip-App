# RoamTogether

RoamTogether is a social travel app for turning shared inspiration into group itineraries, small adventures, badges, and shareable trip recaps.

## Mobile app

The production-direction React Native app is in [`mobile`](./mobile). It supports iOS, Android, English, Japanese, native maps, persistent trip state, social sharing, and RevenueCat-ready subscriptions. See [`mobile/README.md`](./mobile/README.md) for setup and build instructions.

## Legacy browser prototype

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Included demo interactions

- Create the preloaded Tokyo trip from the home screen
- Add travel-video locations from the simulated link extraction flow
- Vote Must Visit / Into it / Skip on the trip board
- Open the map and generated three-day itinerary
- Toggle cheaper options or swap the stay on the budget screen
- Filter opportunity cards and open a verified local exchange detail page
- Pin nearby recommendations and request to join an opportunity

The prototype uses mock data and remote Unsplash imagery. It intentionally has no authentication, booking, payment, scraping, or live notification dependencies.
