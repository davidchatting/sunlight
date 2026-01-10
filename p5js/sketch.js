let userLat = null;
let userLon = null;
let locationStatus = "Requesting location...";

function setup() {
  createCanvas(400, 400);

  // Request geolocation from the browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat = pos.coords.latitude;
        userLon = pos.coords.longitude;
        locationStatus = "Location found!";
      },
      (err) => {
        locationStatus = "Location unavailable.";
      }
    );
  } else {
    locationStatus = "Geolocation not supported.";
  }
}

function draw() {
  background(220);
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(locationStatus, width / 2, height / 2 - 20);
  if (userLat !== null && userLon !== null) {
    textSize(16);
    text(`Latitude: ${userLat.toFixed(5)}`, width / 2, height / 2 + 10);
    text(`Longitude: ${userLon.toFixed(5)}`, width / 2, height / 2 + 35);
  }

  const currentYear = new Date().getFullYear();
  const tz = 0; //-new Date().getTimezoneOffset() / 60;  //but should ignore daylight saving time?
  drawYear(userLat, userLon, tz, currentYear, width / 2, height / 2, min(width, height) / 2 - 20);

  //noLoop();
}

function drawYear(lt, ln, tz, yr, cx, cy, r) {
  // Clamp longitude and latitude
  if (ln < -180) ln = -180;
  if (ln > 180) ln = 180;
  if (lt < -90) lt = -90;
  if (lt > 90) lt = 90;

  // Draw background circle
  noStroke();
  fill(60);
  ellipse(cx, cy, r * 2 - 2, r * 2 - 2);

  drawSunset(lt, ln, tz, yr, cx, cy, r);
  drawSunrise(lt, ln, tz, yr, cx, cy, r);

  // Draw center point
  noStroke();
  fill(100);
  ellipse(cx, cy, 2, 2);
}

function drawSunset(lt, ln, tz, yr, cx, cy, r) {
  let c = new Date(Date.UTC(yr, 0, 1, 0, 0, 0));
  noFill();
  stroke(200);
  beginShape();
  for (let n = 0; n < 365; ++n) {
    let a = ((n / 365.0) * TWO_PI) - HALF_PI;
    try {
      let s = new SunriseSunset(lt, ln, new Date(c), 0);
      let sunsetDate = s.getSunset();
      let baseDate = new Date(c);

      if (!sunsetDate) continue;

      let sunset = sunsetDate.getTime() - baseDate.getTime();

      // Daylight saving time adjustment (not perfect, but similar logic)
      // Note: JS Date does not have inDaylightTime, so we skip or use a library if needed

      sunset -= (tz * 60 * 60 * 1000);

      let st = sunset / (24 * 60 * 60 * 1000);
      if (st < 0) st = 1.0 + st;

      let px = cx + ((r * st) * Math.cos(a));
      let py = cy + ((r * st) * Math.sin(a));
      vertex(px, py);
    } catch (e) {
      // Ignore errors for missing sun events
    }
    c.setUTCDate(c.getUTCDate() + 1);
  }
  endShape(CLOSE);
}

function drawSunrise(lt, ln, tz, yr, cx, cy, r) {
  let c = new Date(Date.UTC(yr, 0, 1, 0, 0, 0));
  noFill();
  stroke(200);
  beginShape();
  for (let n = 0; n < 365; ++n) {
    let a = ((n / 365.0) * TWO_PI) - HALF_PI;
    try {
      let s = new SunriseSunset(lt, ln, new Date(c), 0);
      let sunriseDate = s.getSunrise();
      let baseDate = new Date(c);

      if (!sunriseDate) continue;

      let sunrise = sunriseDate.getTime() - baseDate.getTime();

      // Daylight saving time adjustment (not perfect, see above)
      sunrise -= (tz * 60 * 60 * 1000);

      let rs = sunrise / (24 * 60 * 60 * 1000);
      if (rs < 0) rs = 1.0 + rs;

      let px = cx + ((r * rs) * Math.cos(a));
      let py = cy + ((r * rs) * Math.sin(a));
      vertex(px, py);
    } catch (e) {
      // Ignore errors for missing sun events
    }
    c.setUTCDate(c.getUTCDate() + 1);
  }
  endShape(CLOSE);
}

function isDaylightSavingTime(date = new Date()) {
  // January (winter, usually no DST)
  const jan = new Date(date.getFullYear(), 0, 1);
  // July (summer, usually DST if observed)
  const jul = new Date(date.getFullYear(), 6, 1);

  // If current offset is less than either Jan or Jul, DST is in effect
  console.log(`Timezone Offsets - Jan: ${jan.getTimezoneOffset()}, Jul: ${jul.getTimezoneOffset()}, Current: ${date.getTimezoneOffset()}`); 
  return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) > date.getTimezoneOffset();
}