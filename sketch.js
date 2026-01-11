let userLat = null;
let userLon = null;

let bgFill, dayFill, nightFill;

function setup() {
  createCanvas(400, 400);
  clear();

  bgFill = color(220);
  dayFill = color(255);
  nightFill = color(0);

  // Request geolocation from the browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat = pos.coords.latitude;
        userLon = pos.coords.longitude;
      },
      (err) => {}
    );
  }
}

function draw() {
  clear(); // Ensure each frame is fully transparent before drawing

  const currentYear = new Date().getFullYear();
  const tz = 0; //-new Date().getTimezoneOffset() / 60;  //but should ignore daylight saving time?
  drawYear(userLat, userLon, tz, currentYear, width / 2, height / 2, min(width, height) / 2 - 20);
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

  // Draw center point
  fill(bgFill);
  ellipse(cx, cy, 2, 2);
}