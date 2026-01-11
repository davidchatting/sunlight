# Sunlight

A visualization of sunrise and sunset times throughout the year for any location.

## What is this?

This project uses p5.js in the browser to plot sunrise and sunset times as a circular diagram for the current year and your current location. The solar calculations are based on Roger Sinnott’s SUNUP.BAS algorithm, ported to JavaScript.

## Demonstration

1. Open https://davidchatting.github.io/sunlight/
2. Allow the browser to access your location.
3. The sketch will display a circular plot of sunrise and sunset times for your position and timezone.

## Files

- `index.html` — Main HTML entry point, loads p5.js and the sketch.
- `sketch.js` — p5.js sketch: requests geolocation, gets timezone, draws the visualization.
- `SunriseSunset.js` — JavaScript class for sunrise/sunset calculations (ported from Java).

## Notes

- The timezone offset is detected from your browser and includes daylight saving if active.
- The algorithm handles cases where the sun does not rise or set (polar day/night).

## Credits

- Solar calculations: Roger Sinnott, *Sky & Telescope*, August 1994 (SUNUP.BAS).