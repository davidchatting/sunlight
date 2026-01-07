import processing.pdf.*;
import java.util.Calendar;
import java.util.TimeZone;

long millisecsInAnHour=1000*60*60;
long millisecsInADay=millisecsInAnHour*24;

float latitude=54.98743f;  //52.059444f;  //ipswich
float longitide=-1.601233;  //1.155556f;  //

int timezone=0;              //
int year=2012;
int yearImageWidth=300;
int yearImageHeight=300;

int globeWidth=300, globeHeight=300;
float globeRadius;

PImage globe;
boolean[] bmask;
float[][] euclid;
float[][] cbuffer;
float[][] sincbuffer;
float[][] coscbuffer;

int[] globepixels;
int globenum=0;

float lt=52.059444f,ln=1.155556f;
float lastLt=0,lastLn=0;

void setup() {
  size(500,500,PDF,"joberg.pdf");
  //size(1000, 500);
  //hint(ENABLE_OPENGL_4X_SMOOTH);
  //stroke(255);
  //drawYear(-26.204444f,28.045556f,2012);  //Johannesburg
  //drawYear(40.4f,-3.683333f,2012);  //Madrid
  //drawYear(52.059444f, 1.155556f,0,2012);          //Ipswich
  //drawYear(50.068611f, -5.716111f,0,2012);          //Land's End
  //drawYear(58.64f, -3.07f,0,2012);          //John o'Groats
  //drawYear(57.1311f,-2.12248f,2012);  //Aberdeen
  //drawYear(40.714623f,-74.006605f,-4,2012);  //New York
  //drawYear(67.0f,24.0f,2012);
  //drawYear(57.45f,-4.25f,2012);  //inverness
  //drawYear(50.3697f,-4.1399f,2012);    //plymouth
  globeSetup(globeWidth,globeHeight);
  
  //drawYear(54.98743f,-1.601233f,0,2015);   //jesmond
  drawYear(33.925395, -161.576216,0,2015);   //cape town
  exit();
}

void globeSetup(int w,int h){
  globeRadius=min(w,h)/2; // radius
  
  // lookup tables, used to speed up framerate
  bmask=new boolean[w*h];
  euclid=new float[w][h];
  cbuffer=new float[w][h];
  sincbuffer=new float[w][h];
  coscbuffer=new float[w][h];
    
  // euclidean distance lookup tables (pixel distance from center of sketch)
  for (int x=0;x<globeWidth;x++) {
    for (int y=0;y<globeHeight;y++) {
      euclid[x][y]=mag(globeRadius-x,globeRadius-y);
      cbuffer[x][y]=asin(euclid[x][y]/globeRadius);
      sincbuffer[x][y]=sin(cbuffer[x][y]);
      coscbuffer[x][y]=cos(cbuffer[x][y]);
    }
  }
  
  // mask lookup table - true if pixel position is inside the globe
  for (int ix=0;ix<globeWidth*globeHeight;ix++) {
    int y=ix/globeWidth;
    int x=ix%globeHeight;
    bmask[ix]=abs(mag(globeRadius-x,globeRadius-y))<globeRadius;
  }
  
  // equirectangular image 
  changeImage(0);
}

void changeImage(int _globe) {
  globenum=_globe;
  switch(globenum) {
    case 0:
      //globe=loadImage("nasa globe equirectangular.jpg");
      globe=loadImage("BlankMap-Equirectangular.png");
      break;
    case 1:
      globe=loadImage("light.jpg");
      break;
    default:
      ;
  }
  globepixels=globe.pixels;
}


void draw() {
  background(255, 255, 255, 0);
  smooth();

  int dx=mouseX-(yearImageWidth/2);
  int dy=-1*(mouseY-(yearImageHeight/2));

  drawYear(latitude+dy, longitide+dx, timezone, year);
  drawGlobe(0,300,200,200,0,0);
}

void drawYear(double lt, double ln, int tz, int yr) {
  if(ln<-180)  ln=-180;
  if(ln>180)  ln=180;

  if(lt<-90)  lt=-90;
  if(lt>90)  lt=90;

  println(lt + "  " + ln);

  noStroke();
  fill(60);
  ellipse((yearImageWidth/2), (yearImageHeight/2), yearImageWidth-2, yearImageHeight-2);

  drawSunset(lt, ln, tz, yr);
  drawSunrise(lt, ln, tz, yr);

  //stroke(30);
  //noFill();
  //ellipse(100,100,100,100);

  noStroke();
  fill(100);
  ellipse((yearImageWidth/2), (yearImageHeight/2), 1, 1);
}


void drawSunset(double lt, double ln, int tz, int yr) {
  Calendar c=Calendar.getInstance();
  c.set(yr, 0, 1, 0, 0, 0);

  noFill();
  //fill(255);
  beginShape();

  stroke(200);
  //noStroke();
  float a=0;
  for (int n=0;n<365;++n) {
    a=((n/365.0f)*PI*2)-HALF_PI;

    try {
      SunriseSunset s=new SunriseSunset(lt, ln, c.getTime(), 0);
      long sunset=(s.getSunset().getTime())-(c.getTime().getTime());

      if (TimeZone.getDefault().inDaylightTime(c.getTime())) {
        sunset-=(1000*60*60);
      }
      sunset-=(tz*millisecsInAnHour);

      float st=sunset/(float)millisecsInADay;
      if (st<0) st=1.0f+st;

      point((yearImageWidth/2)+(((yearImageWidth/2)*st)*cos(a)), (yearImageHeight/2)+(((yearImageHeight/2)*st)*sin(a)));
    }
    catch(Exception e) {
    }

    c.add(Calendar.DATE, 1);
  }
  endShape(CLOSE);
}

void drawSunrise(double lt, double ln, int tz, int yr) {
  Calendar c=Calendar.getInstance();
  c.set(yr, 0, 1, 0, 0, 0);

  noFill();
  //fill(60);
  //noStroke();
  stroke(200);
  beginShape();

  //stroke(255);
  float a=0;
  for (int n=0;n<365;++n) {
    a=((n/365.0f)*PI*2)-HALF_PI;

    try {
      SunriseSunset s=new SunriseSunset(lt, ln, c.getTime(), 0);
      long sunrise=(s.getSunrise().getTime())-(c.getTime().getTime());

      if (TimeZone.getDefault().inDaylightTime(c.getTime())) {
        sunrise-=(1000*60*60);
      }
      sunrise-=(tz*millisecsInAnHour);

      float rs=sunrise/(float)millisecsInADay;
      if (rs<0) rs=1.0f+rs;

      point((yearImageWidth/2)+(((yearImageWidth/2)*rs)*cos(a)), (yearImageHeight/2)+(((yearImageHeight/2)*rs)*sin(a)));
    }
    catch(Exception e) {
    }

    c.add(Calendar.DATE, 1);
  }
  endShape(CLOSE);
}

void drawGlobe(int xo,int yo,int globeWidth,int globeHeight,float lt,float ln) {
  lt%=90.0f;
  ln%=180.0f;
  
  println(lt + "  " + ln);
  
  noStroke();

  float lambda0=radians(ln*-1);
  float theta1=radians(lt);

  loadPixels();
  
  fill(0,255,255);
  
  float sint1=sin(theta1);
  float cost1=cos(theta1);
          
  for (int ix=0;ix<globeWidth*globeHeight;ix++) {
        
      if (bmask[ix]) {
        // pixel is inside globe..
        
        int y=ix/globeWidth;
        int x=ix%globeHeight;
      
        int yy=int(globeRadius-y);
        int xx=int(globeRadius-x);
        
        // use inverse functions to work out latitude (theta) and longitude (lambda)
        // from screen coords (xx,yy)
        
        float rho=euclid[x][y];   
        float c=cbuffer[x][y];
        float sinc=sincbuffer[x][y];
        float cosc=coscbuffer[x][y];
        float theta=asin((cosc*sint1)+(((yy*sinc*cost1)/rho)));
        float lambda=lambda0+atan2(xx*sinc,((rho*cost1*cosc)-(yy*sint1*sinc)));
        if (lambda<-TWO_PI) lambda+=TWO_PI;
        if (lambda>TWO_PI) lambda-=TWO_PI;
        if (theta<-TWO_PI) theta+=TWO_PI;
        if (theta>TWO_PI) theta-=TWO_PI;
        
        // work out position in equirectangular source image
        float xget=(globe.height-(globe.height*(lambda/PI)));
        float yget=((globe.height/2)-((globe.height/2)*(theta/PI*2)));
        if (xget<0) xget+=globe.width;
        if (xget>globe.width) xget-=globe.width;
        if (yget<0) yget+=globe.height;
        if (yget>globe.height) yget-=globe.height;
        int ixx=((int)yget)*globe.width+(int)xget;
        
        // next two lines is a hack.. need to investigate ArrayOutOfBoundsExceptions
        if (ixx<0) ixx=0; 
        color colWithAlpha=globepixels[ixx%(globe.width*globe.height)];
        color col=color(red(colWithAlpha), green(colWithAlpha), blue(colWithAlpha), 255);
        
        pixels[ix]=col;
          
      }
  }
  updatePixels();
}

