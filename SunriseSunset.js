/******************************************************************************
*
*							SunriseSunset.js
*
*******************************************************************************
* 
* JavaScript Class: SunriseSunset
* 
*	This JavaScript class is a direct conversion from the original Java version
*	(SunriseSunset.java) to JavaScript, performed by Claude 4.5.
*	All logic, variable names, and comments have been preserved as closely as
*	possible to the original Java source.
*
*	This class is part of a collection of classes developed for the 
*	reading and processing of oceanographic and meteorological data collected 
*	since 1970 by environmental buoys and stations.  This dataset is 
*	maintained by the National Oceanographic Data Center and is publicly 
*	available.  The original Java classes were written for the US Environmental 
*	Protection Agency's National Exposure Research Laboratory under Contract 
*	No. GS-10F-0073K with Neptune and Company of Los Alamos, New Mexico.
* 
* Purpose:
* 
* 	This JavaScript class performs calculations to determine the time of 
*	sunrise and sunset given lat, long, and date.
* 
* Inputs:
* 
* 	Latitude, longitude, date/time, and time zone.
* 
* Outputs:
* 
* 	Local time of sunrise and sunset as calculated by the 
*	  program.
*	If no sunrise or no sunset occurs, or if the sun is up all day 
*	  or down all day, appropriate boolean values are set.
*	A boolean is provided to identify if the time provided is during the day.
*
*	The above values are accessed by the following methods:
*
*		Date	getSunrise()	returns date/time of sunrise
*		Date	getSunset()		returns date/time of sunset
*		boolean	isSunrise()		returns true if there was a sunrise, else false
*		boolean	isSunset()		returns true if there was a sunset, else false
*		boolean	isSunUp()		returns true if sun is up all day, else false
*		boolean	isSunDown()		returns true if sun is down all day, else false
*		boolean	isDaytime()		returns true if sun is up at the time 
*									specified, else false
* 
* Known limitations:
* 
*	It is assumed that the data provided are within valid ranges
*	(i.e. latitude between -90 and +90, longitude between 0 and 360,
*	a valid date, and time zone between -14 and +14.
* 
* References:
*	
*	The mathematical algorithms used in this program are patterned 
*	after those developed by Roger Sinnott in his BASIC program, 
*	SUNUP.BAS, published in Sky & Telescope magazine:
*	Sinnott, Roger W. "Sunrise and Sunset: A Challenge"
*	Sky & Telescope, August, 1994 p.84-85
* 
*	The following is a cross-index of variables used in SUNUP.BAS.
*	A single definition from multiple reuse of variable names in 
*	SUNUP.BAS was clarified with various definitions in this program.
*
*	SUNUP.BAS	this class
* 
*	A			dfA
*	A(2)		dfAA1, dfAA2
*	A0			dfA0
*	A2			dfA2
*	A5			dfA5
*	AZ			Not used
*	C			dfCosLat
*	C0			dfC0
*	D			iDay
*	D(2)		dfDD1, dfDD2
*	D0			dfD0
*	D1			dfD1
*	D2			dfD2
*	D5			dfD5
*	D7			Not used
*	DA			dfDA
*	DD			dfDD
*	G			bGregorian, dfGG
*	H			dfTimeZone
*	H0			dfH0
*	H1			dfH1
*	H2			dfH2
*	H3			dfHourRise, dfHourSet
*	H7			Not used
*	J			dfJ
*	J3			dfJ3
*	K1			dfK1
*	L			dfLL
*	L0			dfL0
*	L2			dfL2
*	L5			dfLon
*	M			iMonth
*	M3			dfMinRise, dfMinSet
*	N7			Not used
*	P			dfP
*	S			iSign, dfSinLat, dfSS
*	T			dfT
*	T0			dfT0
*	T3			not used
*	TT			dfTT
*	U			dfUU
*	V			dfVV
*	V0			dfV0
*	V1			dfV1
*	V2			dfV2
*	W			dfWW
*	Y			iYear
*	Z			dfZenith
*	Z0			dfTimeZone
*	
*  
* Author/Company:
* 
* 	JDT: John Tauxe, Neptune and Company
*	JMG: Jo Marie Green
*   DJC: David Chatting
* 
* Change log:
*  
*	date       ver    by	description of change
*	_________  _____  ___	______________________________________________
*	 5 Jan 01  0.006  JDT	Excised from ssapp.java v. 0.005.
*	11 Jan 01  0.007  JDT	Minor modifications to comments based on 
*							  material from Sinnott, 1994.
*	 7 Feb 01  0.008  JDT	Fixed backwards time zone.  The standard is that 
*							  local time zone is specified in hours EAST of 
*							  Greenwich, so that EST would be -5, for example.
*							  For some reason, SUNUP.BAS does this backwards 
*							  (probably an americocentric perspective) and 
*							  SunriseSunset adopted that convention.  Oops.
*							  So the sign in the math is changed.
*	 7 Feb 01  0.009  JDT	Well, that threw off the azimuth calculation...
*							  Removed the azimuth calculations.
*	14 Feb 01  0.010  JDT	Added ability to accept a time (HH:mm) in 
*							  dateInput, and decide if that time is daytime 
*							  or nighttime.
*	27 Feb 01  0.011  JDT	Added accessor methods in place of having public 
*							  variables to get results. 
*	28 Feb 01  0.012  JDT	Cleaned up list of imported classes. 
*	28 Mar 01  1.10   JDT	Final version accompanying deliverable 1b.
*    4 Apr 01  1.11   JDT	Moved logic supporting .isDaytime into method.
*							  Moved calculations out of constructor.
*   01 May 01  1.12   JMG   Added 'GMT' designation and testing lines.
*   16 May 01  1.13   JDT   Added setLenient( false ) and setTimeZone( tz )
*                           to dfmtDay, dfmtMonth, and dfmtYear in 
*							doCalculations.
*   27 Jun 01  1.14   JDT	Removed reliance on StationConstants (GMT).
*	13 Aug 01  1.20   JDT	Final version accompanying deliverable 1c.
*	 6 Sep 01  1.21   JDT	Thorough code and comment review.
*	21 Sep 01  1.30   JDT	Final version accompanying deliverable 2.
*	17 Dec 01  1.40   JDT	Version accompanying final deliverable.
*	8 Jan 26   1.41   DJC   Direct Java-to-JavaScript port, preserving logic and comments.
*				
*----------------------------------------------------------------------------*/


/******************************************************************************
*	class:					SunriseSunset class
*******************************************************************************
*
* 	This JavaScript class performs calculations to determine the time of 
*	sunrise and sunset given lat, long, and date.
*
*	It is assumed that the data provided are within valid ranges
*	(i.e. latitude between -90 and +90, longitude between 0 and 360,
*	a valid date, and time zone between -14 and +14.
*  
*----------------------------------------------------------------------------*/
class SunriseSunset {
    
    // Declare and initialize variables
    // private double	dfLat;					// latitude from user
    // private double	dfLon;					// latitude from user
    // private Date	dateInput;				// date/time from user
    // private double	dfTimeZone;				// time zone from user

    // private Date	dateSunrise;			// date and time of sunrise
    // private Date	dateSunset;				// date and time of sunset
    // private boolean	bSunriseToday  = false;	// flag for sunrise on this date
    // private boolean	bSunsetToday   = false;	// flag for sunset on this date
    // private boolean	bSunUpAllDay   = false;	// flag for sun up all day
    // private boolean	bSunDownAllDay = false;	// flag for sun down all day
    // private boolean	bDaytime	   = false;	// flag for daytime, given 
    // 										// hour and min in dateInput
    // private boolean	bSunrise = false;		// sunrise during hour checked
    // private boolean	bSunset  = false;		// sunset during hour checked
    // private boolean	bGregorian = false;		// flag for Gregorian calendar
    // private int		iJulian;				// Julian day
    // private	int		iYear;					// year of date of interest
    // private	int		iMonth;					// month of date of interest
    // private	int		iDay;					// day of date of interest
    // private	int		iCount;					// a simple counter
    // private	int		iSign;					// SUNUP.BAS: S
    // private double	dfHourRise, dfHourSet;	// hour of event: SUNUP.BAS H3
    // private double	dfMinRise, dfMinSet;	// minute of event: SUNUP.BAS M3
    // private	double	dfSinLat, dfCosLat;		// sin and cos of latitude
    // private	double	dfZenith;				// SUNUP.BAS Z: Zenith
    // Many variables in SUNUP.BAS have undocumented meanings, 
    // and so are translated rather directly to avoid confusion:
    // private	double	dfAA1 = 0, dfAA2 = 0;	// SUNUP.BAS A(2)
    // private	double	dfDD1 = 0, dfDD2 = 0;	// SUNUP.BAS D(2)
    // private	double	dfC0;					// SUNUP.BAS C0
    // private	double	dfK1;					// SUNUP.BAS K1
    // private	double	dfP;					// SUNUP.BAS P
    // private	double	dfJ;					// SUNUP.BAS J
    // private	double	dfJ3;					// SUNUP.BAS J3
    // private	double	dfA;					// SUNUP.BAS A
    // private	double	dfA0, dfA2, dfA5;		// SUNUP.BAS A0, A2, A5
    // private	double	dfD0, dfD1, dfD2, dfD5;	// SUNUP.BAS D0, D1, D2, D5
    // private	double	dfDA, dfDD;				// SUNUP.BAS DA, DD
    // private	double	dfH0, dfH1, dfH2;		// SUNUP.BAS H0, H1, H2
    // private	double	dfL0, dfL2;				// SUNUP.BAS L0, L2
    // private	double	dfT, dfT0, dfTT;		// SUNUP.BAS T, T0, TT
    // private	double	dfV0, dfV1, dfV2;		// SUNUP.BAS V0, V1, V2
    
    
/******************************************************************************
*	method:					SunriseSunset
*******************************************************************************
*
*	Constructor for SunriseSunset class.
* 
*----------------------------------------------------------------------------*/
    constructor( 
                  dfLatIn,				// latitude 
                  dfLonIn,				// longitude 
                  dateInputIn,			// date
                  dfTimeZoneIn			// time zone
                  ) 
    {
        // Initialize instance variables
        this.dfLat = 0;					// latitude from user
        this.dfLon = 0;					// latitude from user
        this.dateInput = null;			// date/time from user
        this.dfTimeZone = 0;			// time zone from user

        this.dateSunrise = null;		// date and time of sunrise
        this.dateSunset = null;			// date and time of sunset
        this.bSunriseToday = false;		// flag for sunrise on this date
        this.bSunsetToday = false;		// flag for sunset on this date
        this.bSunUpAllDay = false;		// flag for sun up all day
        this.bSunDownAllDay = false;	// flag for sun down all day
        this.bDaytime = false;			// flag for daytime, given 
                                        // hour and min in dateInput
        this.bSunrise = false;			// sunrise during hour checked
        this.bSunset = false;			// sunset during hour checked
        this.bGregorian = false;		// flag for Gregorian calendar
        this.iJulian = 0;				// Julian day
        this.iYear = 0;					// year of date of interest
        this.iMonth = 0;				// month of date of interest
        this.iDay = 0;					// day of date of interest
        this.iCount = 0;				// a simple counter
        this.iSign = 0;					// SUNUP.BAS: S
        this.dfHourRise = 0;			// hour of event: SUNUP.BAS H3
        this.dfHourSet = 0;				// hour of event: SUNUP.BAS H3
        this.dfMinRise = 0;				// minute of event: SUNUP.BAS M3
        this.dfMinSet = 0;				// minute of event: SUNUP.BAS M3
        this.dfSinLat = 0;				// sin of latitude
        this.dfCosLat = 0;				// cos of latitude
        this.dfZenith = 0;				// SUNUP.BAS Z: Zenith
        // Many variables in SUNUP.BAS have undocumented meanings, 
        // and so are translated rather directly to avoid confusion:
        this.dfAA1 = 0;					// SUNUP.BAS A(2)
        this.dfAA2 = 0;					// SUNUP.BAS A(2)
        this.dfDD1 = 0;					// SUNUP.BAS D(2)
        this.dfDD2 = 0;					// SUNUP.BAS D(2)
        this.dfC0 = 0;					// SUNUP.BAS C0
        this.dfK1 = 0;					// SUNUP.BAS K1
        this.dfP = 0;					// SUNUP.BAS P
        this.dfJ = 0;					// SUNUP.BAS J
        this.dfJ3 = 0;					// SUNUP.BAS J3
        this.dfA = 0;					// SUNUP.BAS A
        this.dfA0 = 0;					// SUNUP.BAS A0
        this.dfA2 = 0;					// SUNUP.BAS A2
        this.dfA5 = 0;					// SUNUP.BAS A5
        this.dfD0 = 0;					// SUNUP.BAS D0
        this.dfD1 = 0;					// SUNUP.BAS D1
        this.dfD2 = 0;					// SUNUP.BAS D2
        this.dfD5 = 0;					// SUNUP.BAS D5
        this.dfDA = 0;					// SUNUP.BAS DA
        this.dfDD = 0;					// SUNUP.BAS DD
        this.dfH0 = 0;					// SUNUP.BAS H0
        this.dfH1 = 0;					// SUNUP.BAS H1
        this.dfH2 = 0;					// SUNUP.BAS H2
        this.dfL0 = 0;					// SUNUP.BAS L0
        this.dfL2 = 0;					// SUNUP.BAS L2
        this.dfT = 0;					// SUNUP.BAS T
        this.dfT0 = 0;					// SUNUP.BAS T0
        this.dfTT = 0;					// SUNUP.BAS TT
        this.dfV0 = 0;					// SUNUP.BAS V0
        this.dfV1 = 0;					// SUNUP.BAS V1
        this.dfV2 = 0;					// SUNUP.BAS V2

        // Copy values supplied as arguments to local variables.
        this.dfLat = dfLatIn;
        this.dfLon = dfLonIn;
        this.dateInput = dateInputIn;
        this.dfTimeZone = dfTimeZoneIn;
        
        // Call the method to do the calculations.
        this.doCalculations();

    } // end of class constructor

    
/******************************************************************************
*	method:					doCalculations
*******************************************************************************
*
*	Method for performing the calculations done in SUNUP.BAS.
* 
*----------------------------------------------------------------------------*/
    doCalculations()
    {
        try
        {
            // Break out day, month, and year from date provided.
            // (This is necessary for the math algorithms.)

            // In JavaScript, we use the Date object methods directly
            // Note: getMonth() returns 0-11, so we add 1
            // Note: getUTCMonth() and getUTCDate() etc. are used for GMT
            this.iYear = this.dateInput.getUTCFullYear();
            this.iMonth = this.dateInput.getUTCMonth() + 1;
            this.iDay = this.dateInput.getUTCDate();
                    
            // Convert time zone hours to decimal days (SUNUP.BAS line 50)
            this.dfTimeZone = this.dfTimeZone / 24.0;

            // NOTE: (7 Feb 2001) Here is a non-standard part of SUNUP.BAS:
            // It (and this algorithm) assumes that the time zone is 
            // positive west, instead of the standard negative west.
            // Classes calling SunriseSunset will be assuming that 
            // times zones are specified in negative west, so here the 
            // sign is changed so that the SUNUP algorithm works:
            this.dfTimeZone = -this.dfTimeZone;

            // Convert longitude to fraction (SUNUP.BAS line 50)
            this.dfLon = this.dfLon / 360.0;

            // Convert calendar date to Julian date:
            // Check to see if it's later than 1583: Gregorian calendar
            // When declared, bGregorian is initialized to false.
            // ** Consider making a separate class of this function. **
            if( this.iYear >= 1583 ) this.bGregorian = true;
            // SUNUP.BAS 1210
            this.dfJ = -Math.floor( 7.0		// SUNUP used INT, not floor
                             * ( Math.floor( 
                                            ( this.iMonth + 9.0 )
                                            / 12.0
                                           ) + this.iYear
                                ) / 4.0
                             )
                // add SUNUP.BAS 1240 and 1250 for G = 0
                + Math.floor( this.iMonth * 275.0 / 9.0 )
                + this.iDay
                + 1721027.0
                + this.iYear * 367.0;
                
            if ( this.bGregorian )
            {
                // SUNUP.BAS 1230
                if ( ( this.iMonth - 9.0 ) < 0.0 ) this.iSign = -1;
                else this.iSign = 1;
                this.dfA = Math.abs( this.iMonth - 9.0 );
                // SUNUP.BAS 1240 and 1250
                this.dfJ3 = -Math.floor(
                                  (
                         Math.floor(
                     	  Math.floor( this.iYear 
                                     + this.iSign 
                                       * Math.floor( this.dfA / 7.0 )
                                    )
                                    / 100.0
                                   ) + 1.0
                                  ) * 0.75
                                 );
                // correct dfJ as in SUNUP.BAS 1240 and 1250 for G = 1
                this.dfJ = this.dfJ + this.dfJ3 + 2.0;
            }
            // SUNUP.BAS 1290
            this.iJulian = Math.floor(this.dfJ) - 1;
            
            // SUNUP.BAS 60 and 70 (see also line 1290)
            this.dfT = this.iJulian - 2451545.0 + 0.5;
            this.dfTT = this.dfT / 36525.0 + 1.0;				// centuries since 1900
    
            // Calculate local sidereal time at 0h in zone time
            // SUNUP.BAS 410 through 460
            this.dfT0 = ( this.dfT * 8640184.813 / 36525.0
                    + 24110.5
                    + this.dfTimeZone * 86636.6
                    + this.dfLon * 86400.0
                  )
                  / 86400.0;
            this.dfT0 = this.dfT0 - Math.floor( this.dfT0 );	// NOTE: SUNUP.BAS uses INT()
            this.dfT0 = this.dfT0 * 2.0 * Math.PI;
            // SUNUP.BAS 90
            this.dfT = this.dfT + this.dfTimeZone;

            // SUNUP.BAS 110: Get Sun's position
            for( this.iCount=0; this.iCount<=1; this.iCount++ )	// Loop thru only twice
            {
                // Calculate Sun's right ascension and declination
                //   at the start and end of each day.
                // SUNUP.BAS 910 - 1160: Fundamental arguments
                //   from van Flandern and Pulkkinen, 1979
                
                // declare local temporary doubles for calculations
                let	dfGG;						// SUNUP.BAS G
                let	dfLL;						// SUNUP.BAS L
                let	dfSS;						// SUNUP.BAS S
                let	dfUU;						// SUNUP.BAS U
                let	dfVV;						// SUNUP.BAS V
                let	dfWW;						// SUNUP.BAS W
    
                dfLL = 0.779072 + 0.00273790931 * this.dfT;
                dfLL = dfLL - Math.floor( dfLL );
                dfLL = dfLL * 2.0 * Math.PI;
    
                dfGG = 0.993126 + 0.0027377785 * this.dfT;
                dfGG = dfGG - Math.floor( dfGG );
                dfGG = dfGG * 2.0 * Math.PI;
    
                dfVV =   0.39785 * Math.sin( dfLL )
                        - 0.01000 * Math.sin( dfLL - dfGG )
                        + 0.00333 * Math.sin( dfLL + dfGG )
                        - 0.00021 * Math.sin( dfLL ) * this.dfTT;
                        
                dfUU = 1
                        - 0.03349 * Math.cos( dfGG )
                        - 0.00014 * Math.cos( dfLL * 2.0 )
                        + 0.00008 * Math.cos( dfLL );
        
                dfWW = - 0.00010
                        - 0.04129 * Math.sin( dfLL * 2.0 )
                        + 0.03211 * Math.sin( dfGG )
                        - 0.00104 * Math.sin( 2.0 * dfLL - dfGG )
                        - 0.00035 * Math.sin( 2.0 * dfLL + dfGG )
                        - 0.00008 * Math.sin( dfGG ) * this.dfTT;
                        
                // Compute Sun's RA and Dec; SUNUP.BAS 1120 - 1140
                dfSS = dfWW / Math.sqrt( dfUU - dfVV * dfVV );
                this.dfA5 = dfLL 
                       + Math.atan( dfSS / Math.sqrt( 1.0 - dfSS * dfSS ));
                    
                dfSS = dfVV / Math.sqrt( dfUU );
                this.dfD5 = Math.atan( dfSS / Math.sqrt( 1 - dfSS * dfSS ));					
                    
                // Set values and increment t
                if ( this.iCount == 0 )		// SUNUP.BAS 125
                {
                    this.dfAA1 = this.dfA5;
                    this.dfDD1 = this.dfD5;
                }
                else					// SUNUP.BAS 145
                {
                    this.dfAA2 = this.dfA5;
                    this.dfDD2 = this.dfD5;
                }
                this.dfT = this.dfT + 1.0;		// SUNUP.BAS 130
            }	// end of Get Sun's Position for loop
                
            if ( this.dfAA2 < this.dfAA1 ) this.dfAA2 = this.dfAA2 + 2.0 * Math.PI;
                                                            // SUNUP.BAS 150
    
            this.dfZenith = Math.PI * 90.833 / 180.0;			// SUNUP.BAS 160
            this.dfSinLat = Math.sin( this.dfLat * Math.PI / 180.0 );	// SUNUP.BAS 170
            this.dfCosLat = Math.cos( this.dfLat * Math.PI / 180.0 );	// SUNUP.BAS 170
                
            this.dfA0 = this.dfAA1;									// SUNUP.BAS 190
            this.dfD0 = this.dfDD1;									// SUNUP.BAS 190
            this.dfDA = this.dfAA2 - this.dfAA1;							// SUNUP.BAS 200
            this.dfDD = this.dfDD2 - this.dfDD1;							// SUNUP.BAS 200
                
            this.dfK1 = 15.0 * 1.0027379 * Math.PI / 180.0;		// SUNUP.BAS 330
    
            // Initialize sunrise and sunset times, and other variables
            // hr and min are set to impossible times to make errors obvious
            this.dfHourRise = 99.0;
            this.dfMinRise  = 99.0;
            this.dfHourSet  = 99.0;
            this.dfMinSet   = 99.0;
            this.dfV0 = 0.0;		// initialization implied by absence in SUNUP.BAS
            this.dfV2 = 0.0;		// initialization implied by absence in SUNUP.BAS
                
            // Test each hour to see if the Sun crosses the horizon
            //   and which way it is heading.
            for( this.iCount=0; this.iCount<24; this.iCount++ )			// SUNUP.BAS 210
            {
                let	tempA;								// SUNUP.BAS A
                let	tempB;								// SUNUP.BAS B
                let	tempD;								// SUNUP.BAS D
                let	tempE;								// SUNUP.BAS E
                    
                this.dfC0 = this.iCount;
                this.dfP = ( this.dfC0 + 1.0 ) / 24.0;				// SUNUP.BAS 220
                this.dfA2 = this.dfAA1 + this.dfP * this.dfDA;					// SUNUP.BAS 230
                this.dfD2 = this.dfDD1 + this.dfP * this.dfDD;					// SUNUP.BAS 230
                this.dfL0 = this.dfT0 + this.dfC0 * this.dfK1;					// SUNUP.BAS 500
                this.dfL2 = this.dfL0 + this.dfK1;							// SUNUP.BAS 500
                this.dfH0 = this.dfL0 - this.dfA0;							// SUNUP.BAS 510
                this.dfH2 = this.dfL2 - this.dfA2;							// SUNUP.BAS 510
                // hour angle at half hour
                this.dfH1 = ( this.dfH2 + this.dfH0 ) / 2.0;				// SUNUP.BAS 520
                // declination at half hour
                this.dfD1 = ( this.dfD2 + this.dfD0 ) / 2.0;				// SUNUP.BAS 530
                    
                // Set value of dfV0 only if this is the first hour, 
                // otherwise, it will get set to the last dfV2 (SUNUP.BAS 250)
                if ( this.iCount == 0 )							// SUNUP.BAS 550
                {	
                    this.dfV0 = this.dfSinLat * Math.sin( this.dfD0 )
                         + this.dfCosLat * Math.cos( this.dfD0 ) * Math.cos( this.dfH0 )
                         - Math.cos( this.dfZenith );			// SUNUP.BAS 560
                }
                else
                    this.dfV0 = this.dfV2;	// That is, dfV2 from the previous hour.
                
                this.dfV2 = this.dfSinLat * Math.sin( this.dfD2 )
                         + this.dfCosLat * Math.cos( this.dfD2 ) * Math.cos( this.dfH2 )
                         - Math.cos( this.dfZenith );			// SUNUP.BAS 570
                    
                // if dfV0 and dfV2 have the same sign, then proceed to next hr
                if ( 
                     ( this.dfV0 >= 0.0 && this.dfV2 >= 0.0 )		// both are positive
                     ||								// or
                     ( this.dfV0 < 0.0 && this.dfV2 < 0.0 ) 		// both are negative
                   )
                {
                    // Break iteration and proceed to test next hour
                    this.dfA0 = this.dfA2;							// SUNUP.BAS 250
                    this.dfD0 = this.dfD2;							// SUNUP.BAS 250
                    continue;								// SUNUP.BAS 610
                }
                    
                this.dfV1 = this.dfSinLat * Math.sin( this.dfD1 )
                     + this.dfCosLat * Math.cos( this.dfD1 ) * Math.cos( this.dfH1 )
                     - Math.cos( this.dfZenith );				// SUNUP.BAS 590
    
                tempA = 2.0 * this.dfV2 - 4.0 * this.dfV1 + 2.0 * this.dfV0;
                                                            // SUNUP.BAS 600
                tempB = 4.0 * this.dfV1 - 3.0 * this.dfV0 - this.dfV2;		// SUNUP.BAS 600
                tempD = tempB * tempB - 4.0 * tempA * this.dfV0;	// SUNUP.BAS 610
                    
                if ( tempD < 0.0 ) 
                {
                    // Break iteration and proceed to test next hour
                    this.dfA0 = this.dfA2;							// SUNUP.BAS 250
                    this.dfD0 = this.dfD2;							// SUNUP.BAS 250
                    continue;								// SUNUP.BAS 610
                }
                    
                tempD = Math.sqrt( tempD );					// SUNUP.BAS 620
    
                // Determine occurence of sunrise or sunset.
                    
                // Flags to identify occurrence during this day are 
                // bSunriseToday and bSunsetToday, and are initialized false.
                // These are set true only if sunrise or sunset occurs 
                // at any point in the hourly loop. Never set to false.
    
                // Flags to identify occurrence during this hour:
                this.bSunrise = false;				// reset before test
                this.bSunset  = false;				// reset before test
                    
                if ( this.dfV0 < 0.0 && this.dfV2 > 0.0 )	// sunrise occurs this hour
                {
                    this.bSunrise = true;			// SUNUP.BAS 640
                    this.bSunriseToday = true;		// sunrise occurred today
                }
    
                if ( this.dfV0 > 0.0 && this.dfV2 < 0.0 )	// sunset occurs this hour
                {
                    this.bSunset = true;				// SUNUP.BAS 660
                    this.bSunsetToday = true;		// sunset occurred today
                }
                    
                tempE = ( tempD - tempB ) / ( 2.0 * tempA );
                if ( tempE > 1.0 || tempE < 0.0 )	// SUNUP.BAS 670, 680
                    tempE = ( -tempD - tempB ) / ( 2.0 * tempA );					
                    
                // Set values of hour and minute of sunset or sunrise
                // only if sunrise/set occurred this hour.
                if ( this.bSunrise )
                {
                    this.dfHourRise = Math.floor( this.dfC0 + tempE + 1.0/120.0 );
                    this.dfMinRise  = Math.floor( 
                                             ( this.dfC0 + tempE + 1.0/120.0 
                                                - this.dfHourRise 
                                             )
                                             * 60.0
                                            );
                }
    
                if ( this.bSunset )
                {
                    this.dfHourSet  = Math.floor( this.dfC0 + tempE + 1.0/120.0 );
                    this.dfMinSet   = Math.floor( 
                                             ( this.dfC0 + tempE + 1.0/120.0
                                                - this.dfHourSet 
                                             ) 
                                             * 60.0
                                            );
                }
    
                // Change settings of variables for next loop
                this.dfA0 = this.dfA2;								// SUNUP.BAS 250
                this.dfD0 = this.dfD2;								// SUNUP.BAS 250
                    
            }	// end of loop testing each hour for an event	
                
            // After having checked all hours, set flags if no rise or set
            // bSunUpAllDay and bSundownAllDay are initialized as false
            if ( !this.bSunriseToday && !this.bSunsetToday )
            {
                if ( this.dfV2 < 0.0 )
                    this.bSunDownAllDay = true;
                else
                    this.bSunUpAllDay = true;
            }
    
            // Load dateSunrise with data
            if( this.bSunriseToday )
            {
                this.dateSunrise = new Date(Date.UTC(
                    this.iYear,
                    this.iMonth - 1,  // JavaScript months are 0-indexed
                    this.iDay,
                    Math.floor(this.dfHourRise),
                    Math.floor(this.dfMinRise),
                    0
                ));
            }
        
            // Load dateSunset with data
            if( this.bSunsetToday )
            {
                this.dateSunset = new Date(Date.UTC(
                    this.iYear,
                    this.iMonth - 1,  // JavaScript months are 0-indexed
                    this.iDay,
                    Math.floor(this.dfHourSet),
                    Math.floor(this.dfMinSet),
                    0
                ));
            }
        } // end of try

        // Catch errors
        catch( e )
        {
            console.log( "\nCannot parse date" );
            console.log( e );
        } // end of catch

    }
    
    
/******************************************************************************
*	method:					getSunrise()
*******************************************************************************
*
*   Gets the date and time of sunrise.  If there is no sunrise, returns null.
*				
*	Member of SunriseSunset class
*				
* -------------------------------------------------------------------------- */
    getSunrise()
    {
        if ( this.bSunriseToday )
            return( this.dateSunrise );
        else
            return( null );
    }

    
/******************************************************************************
*	method:					getSunset()
*******************************************************************************
*
*   Gets the date and time of sunset.  If there is no sunset, returns null.
*				
*	Member of SunriseSunset class
*				
* -------------------------------------------------------------------------- */
    getSunset()
    {
        if ( this.bSunsetToday )
            return( this.dateSunset );
        else
            return( null );
    }

    
/******************************************************************************
*	method:					isSunrise()
*******************************************************************************
*
*   Returns a boolean identifying if there was a sunrise.
*				
*	Member of SunriseSunset class
*				
* -------------------------------------------------------------------------- */
    isSunrise()
    {
        return( this.bSunriseToday );
    }

    
/******************************************************************************
*	method:					isSunset()
*******************************************************************************
*
*   Returns a boolean identifying if there was a sunset.
*				
*	Member of SunriseSunset class
*				
* -------------------------------------------------------------------------- */
    isSunset()
    {
        return( this.bSunsetToday );
    }

    
/******************************************************************************
*	method:					isSunUp()
*******************************************************************************
*
*   Returns a boolean identifying if the sun is up all day.
*				
*	Member of SunriseSunset class
*				
* -------------------------------------------------------------------------- */
    isSunUp()
    {
        return( this.bSunUpAllDay );
    }

    
/******************************************************************************
*	method:					isSunDown()
*******************************************************************************
*
*   Returns a boolean identifying if the sun is down all day.
*				
*	Member of SunriseSunset class
*				
* -------------------------------------------------------------------------- */
    isSunDown()
    {
        return( this.bSunDownAllDay );
    }

    
/******************************************************************************
*	method:					isDaytime()
*******************************************************************************
*
*   Returns a boolean identifying if it is daytime at the hour contained in 
*	the Date object passed to SunriseSunset on construction.
*				
*	Member of SunriseSunset class
*				
* -------------------------------------------------------------------------- */
    isDaytime()
    {
        // Determine if it is daytime (at sunrise or later) 
        //	or nighttime (at sunset or later) at the location of interest
        //	but expressed in the time zone requested.
        if ( this.bSunriseToday && this.bSunsetToday ) 	// sunrise and sunset
        {
            if ( this.dateSunrise < this.dateSunset )	// sunrise < sunset
            {
                if ( 
                     (	
                        this.dateInput > this.dateSunrise 
                        ||
                        this.dateInput.getTime() === this.dateSunrise.getTime() 
                     )
                     &&
                     this.dateInput < this.dateSunset
                   )
                    this.bDaytime = true;
                else
                this.bDaytime = false;
                }
            else 	// sunrise comes after sunset (in opposite time zones)
            {
                if ( 
                     (	
                        this.dateInput > this.dateSunrise 
                        ||
                        this.dateInput.getTime() === this.dateSunrise.getTime() 
                     )
                     ||			// use OR rather than AND
                     this.dateInput < this.dateSunset
                   )
                    this.bDaytime = true;
                else
                this.bDaytime = false;
                }
        }
        else if ( this.bSunUpAllDay ) 				// sun is up all day
            this.bDaytime = true;
        else if ( this.bSunDownAllDay )				// sun is down all day
            this.bDaytime = false;
        else if ( this.bSunriseToday ) 				// sunrise but no sunset
        {
            if ( this.dateInput < this.dateSunrise )
                this.bDaytime = false;
            else
                this.bDaytime = true;
        }
        else if ( this.bSunsetToday ) 				// sunset but no sunrise
        {
            if ( this.dateInput < this.dateSunset )
                this.bDaytime = true;
            else
                this.bDaytime = false;
        }
        else this.bDaytime = false;					// this should never execute

        return( this.bDaytime );
    }

    
} // end of class 

/*-----------------------------------------------------------------------------
*							end of class
*----------------------------------------------------------------------------*/

// Export for use as a module (Node.js/ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SunriseSunset;
}