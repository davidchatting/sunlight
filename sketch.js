let thisLat = null;
let thisLon = null;

let bgFill, dayFill, nightFill;

let locationRequested = false;

function setup() {
  createCanvas(400, 400).parent('p5js');
  frameRate(1);
  clear();

  bgFill = color(220);
  dayFill = color(255);
  nightFill = color(0);

  const inputBox = document.getElementById('locationInput');
  inputBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      parseInput();
    }
  });
}

function onLocationChanged(lat, lon) {
  console.log(`Location changed: ${lat}, ${lon}`);
  if (lat !== null && lon !== null) {
    thisLat = lat;
    thisLon = lon;
    document.getElementById('locationInput').value = `${thisLat.toFixed(3)}, ${thisLon.toFixed(3)}`;
  }
}

function requestLocation() {
  if (!locationRequested && navigator.geolocation) {
    locationRequested = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChanged(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {}
    );
  }
}

function parseInput() {
  const inputBox = document.getElementById('locationInput');
  const value = inputBox.value.trim();
  try {
    let parts = value.split(/[\s,]+/);
    let lat = parseFloat(parts[0]);
    let lon = parseFloat(parts[1]);
    if(isNaN(lat) || isNaN(lon)) throw new Error();
    onLocationChanged(lat, lon);
  } catch (e) {
    requestLocation();
  }
}

function draw() {
  clear(); // Ensure each frame is fully transparent before drawing

  const currentYear = new Date().getFullYear();
  const tz = 0; //-new Date().getTimezoneOffset() / 60;  //but should ignore daylight saving time?
  drawYear(thisLat, thisLon, tz, currentYear, width / 2, height / 2, min(width, height) / 2 - 20);
}

function drawYear(lt, ln, tz, yr, cx, cy, r) {
  if (ln < -180) ln = -180;
  if (ln > 180) ln = 180;
  if (lt < -90) lt = -90;
  if (lt > 90) lt = 90;

  // Draw background circle
  noStroke();
  fill(nightFill);
  ellipse(cx, cy, r * 2 - 2, r * 2 - 2);

  let sunrisePoints = [];
  let sunsetPoints = [];
  let noonPoints = [];

  let c = new Date(Date.UTC(yr, 0, 1, 0, 0, 0));
  for (let n = 0; n < 365; ++n) {
    let a = ((n / 365.0) * TWO_PI) - HALF_PI;
    try {
      let s = new SunriseSunset(lt, ln, new Date(c), 0);
      let baseDate = new Date(c);

      // Sunrise
      let sunriseDate = s.getSunrise();
      let sunrise = sunriseDate ? sunriseDate.getTime() - baseDate.getTime() : (24 * 60 * 60 * 1000);
      sunrise -= (tz * 60 * 60 * 1000);
      let rs = sunrise / (24 * 60 * 60 * 1000);
      if (rs < 0) rs = 1.0 + rs;
      let pxRise = cx + ((r * rs) * Math.cos(a));
      let pyRise = cy + ((r * rs) * Math.sin(a));
      sunrisePoints.push([pxRise, pyRise]);

      // Sunset
      let sunsetDate = s.getSunset();
      let sunset = sunsetDate ? sunsetDate.getTime() - baseDate.getTime() : (24 * 60 * 60 * 1000);
      sunset -= (tz * 60 * 60 * 1000);
      let st = sunset / (24 * 60 * 60 * 1000);
      if (st < 0) st = 1.0 + st;
      let pxSet = cx + ((r * st) * Math.cos(a));
      let pySet = cy + ((r * st) * Math.sin(a));
      sunsetPoints.push([pxSet, pySet]);

      // Estimate apparent noon (midway between sunrise and sunset)
      let noon = (rs + (st - rs) / 2);
      // Handle wrap-around at midnight
      if (st < rs) noon = (rs + ((st + 1) - rs) / 2);
      if (noon > 1) noon -= 1;
      let pxNoon = cx + ((r * noon) * Math.cos(a));
      let pyNoon = cy + ((r * noon) * Math.sin(a));
      noonPoints.push([pxNoon, pyNoon]);
    } catch (e) {
      // Ignore errors for missing sun events
    }
    c.setUTCDate(c.getUTCDate() + 1);
  }

  noStroke();
  fill(dayFill);

  beginShape();
    // Outer edge (sunrise)
    for (let i = 0; i < sunrisePoints.length; i++) {
      vertex(sunrisePoints[i][0], sunrisePoints[i][1]);
    }
    // Inner edge (sunset) as a contour (hole)
    beginContour();
      for (let i = sunsetPoints.length - 1; i >= 0; i--) {
        vertex(sunsetPoints[i][0], sunsetPoints[i][1]);
      }
    endContour();
  endShape(CLOSE);

  // Draw apparent noon as a dotted line
  stroke(0);
  strokeWeight(1);
  drawingContext.setLineDash([4, 6]);
  noFill();
  beginShape();
    for (let i = 0; i < noonPoints.length; i++) {
      vertex(noonPoints[i][0], noonPoints[i][1]);
    }
  endShape(CLOSE);
  drawingContext.setLineDash([]); // Reset dash

  // Draw center point
  noStroke();
  fill(bgFill);
  ellipse(cx, cy, 2, 2);
}