# Sunlight

A Processing sketch that visualizes sunrise and sunset times throughout the year for any location on Earth.

## Description

This project generates circular visualizations showing the daily sunrise and sunset times across an entire year. The radial plot displays time of day (as distance from center) against day of year (as angle), creating a visual representation of how daylight hours change with the seasons.

## Files

- [sunlight.pde](sunlight.pde) - Main Processing sketch
- [SunriseSunset.java](SunriseSunset.java) - Java class for calculating sunrise/sunset times based on latitude, longitude, and date

## Usage

1. Open `sunlight.pde` in Processing
2. Modify the `drawYear()` call in `setup()` to specify your location:
   - Latitude (degrees, positive north)
   - Longitude (degrees, positive east)
   - Timezone offset
   - Year
3. Run the sketch to generate a PDF output

## Example Locations

The sketch includes commented examples for various cities:
- Johannesburg, Ipswich, Land's End, John o'Groats, Madrid, New York, Inverness, Plymouth, and more

## Output

Generates PDF files showing the sunrise/sunset patterns for the specified location and year.

## Dependencies

- Processing with PDF export library
- Java standard libraries (Date, Calendar, TimeZone)

## Credits

The sunrise/sunset calculations are based on Roger Sinnott's SUNUP.BAS algorithm published in *Sky & Telescope* magazine