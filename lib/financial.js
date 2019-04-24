/*
 * param_o object is
 * {
 * periods:		- number of payments excluding balloon.
 * rate:		- yearly interest rate
 * initial:		- initial loan / or deposit / Principal
 * periodic:		- periodic fixed payments
 * finalAmount:		- balloon
 * startDate:		- loan/investment date if all dates are the same
 * paymentDate:		- Date the first payment is accrued or paid if in advance
 * interestDate:	- Date charging of interest begins on
 * datesAllSame:	- if true only startDate applies.
 * }
 * All dates must be provided as Date objects.
 */

var FINANCIAL = {
  periodsInYear: function(){ 
    return FINANCIAL.frequency.periods[ FINANCIAL.frequency.curIndex ];
  },

  /* return number of periods in between two dates. Can be partial */
  periodsBetween: function( firstDate, secondDate ){
    d1 = firstDate.getTime();
    d2 = secondDate.getTime();
    oneYear = 365 * 24 * 60 * 60 * 1000;
    return FINANCIAL.periodsInYear() * (( d2 - d1 ) / oneYear );
  },
  /*
   * Rate gets converted to %
   */
  periodRate: function( rate ) { return( rate / ( FINANCIAL.periodsInYear() * 100 ));},
  yearRate: function( pRate ) { return( pRate * ( FINANCIAL.periodsInYear() * 100 ));},

  /*
   * return period number of a given date
   */
  period: function( param_o, aDate ){
    var retVal = 0;
    if( aDate ){
      var start_dat = param_o.startDate;
      var target_dat = aDate;
      retVal = Math.round( FINANCIAL.periodsBetween( start_dat, target_dat ));
    }
    return retVal;
  },


  /*
   * return period number first payment is made
   */
  firstPayPeriod: function( param_o ){
    retVal = FINANCIAL.period( param_o, param_o.paymentDate ) || 1;
    if( FINANCIAL.pmtMode.inAdvance() )
      retVal--;
    return retVal;
  },

  firstInterestPeriod: function( param_o ){
    return FINANCIAL.period( param_o, param_o.interestDate ) || 1;
  },

  frequency: { 
    curIndex: 0, 
    list:[ "Monthly",
      "Bimonthly",
      "Quarterly",
      "Semiannual",
      "Annual",
      "Daily",
      "Weekly",
      "Biweekly",
    ],
    periods: [ 12, 6, 4, 2, 1, 365, 365 / 7, 365 / 14 ],
  },

  pmtMode: { 
    curIndex: 0, list:[ "In Arrears", "In Advance" ],
    inAdvance: function(){ return this.curIndex; }
  },
  amortize: { curIndex: 0, list:[ "Compound interest", "Rule of 78s (loans only)" ]},

  /*
   * Calculate the date of Nth period
   */
  calcNthDate: function( param_o, nth ){

    var retVal = makeDate( param_o.startDate.valueOf() );
    var startDate = makeDate( param_o.startDate.valueOf() );
    var i = nth;

    switch( param_o.frequency ){
      case 0:	/* Monthly */
	retVal.setMonth( startDate.getMonth() + i );
	break;

      case 1:	/* Bimonthly */
	retVal.setMonth( startDate.getMonth() + i * 2);
	break;

      case 2:	/* quarterly */
	retVal.setMonth( startDate.getMonth() + i * 4);
	break;

      case 3:	/* semiannual */
	retVal.setMonth( startDate.getMonth() + i * 6 );
	break;

      case 4:	/* annual */
	retVal.setYear( startDate.getFullYear() + i );
	break;

      case 5:	/* Daily */
	retVal.setDate( startDate.getDate() + i );
	break;

      case 6:	/* Weekly */
	retVal.setDate( startDate.getDate() + i * 7 );
	break;

      case 7:	/* Biweekly */
	retVal.setDate( startDate.getDate() + i * 14 );
	break;
    }
    return retVal;
  },


  /*
   * What is future value of a single payment made today
   */
  futureVal: function( presVal, periods, pRate ){
    return presVal * Math.pow( 1 + pRate, periods );
  },

  /*
   * How much is a single payment made today to produce
   * a given future value
   */
  presentVal: function( futureVal, pRate, periods ){
    return futureVal * Math.pow( 1 + pRate, -periods );
  },


  /*
   * How much is the future value of a series of fixed payments
   */
  futureValOfPayments: function( periodic, pRate, periods ){
    return periodic * ( Math.pow( 1 + pRate, periods ) -1 ) / pRate;
  },

  /*
   * What should periodic payments be to achive a certain
   * future value
   */
  paymentsForFutureValue: function( futureVal, pRate, periods ){
    return futureVal * ( pRate / ( Math.pow( 1 + pRate, periods ) - 1));
  },

  /*
   * Present value of a series of payments. Also gives balance / balloon 
   * on a number of periods left.
   */
  presentValOfPayments: function( balloon, pRate, count, payments ){
    var principal = payments * ( 1 - Math.pow( 1 + pRate, -1 * count )) / pRate;
    if( balloon != 0 )
      principal += FINANCIAL.presentVal( balloon, pRate, count );

    return principal;
  },

  /*
   * Balance after nt payment
   * intPerd = number of interest free periods
   * payPerd = number of payment free periods 
   */
  balance: function( principal, payment, pRate, periods, intPerd, payPerd ){
    var principalFV = 0;
    var paymentsFV = 0;
    var iFree = ( intPerd || 0 ) - ( payPerd || 0 );
    if( iFree >=0 ){	// interest free periods
      principalFV = FINANCIAL.futureVal( principal - payment * iFree, 
	periods - iFree, pRate );
      paymentsFV = FINANCIAL.futureValOfPayments( payment, 
	pRate, periods - iFree );
    }else{		// no payments for -iFree periods
      principalFV = FINANCIAL.futureVal( principal, periods - iFree, pRate );
      paymentsFV = FINANCIAL.futureValOfPayments( payment, pRate, periods );
    }
    return principalFV - paymentsFV;
  },

  /*
   * Payments for a present value
   */
  paymentsOfPresentValue: function( param_o ){
    var count = param_o.periods;
    var rate = param_o.rate;
    var effectivePV = param_o.initial;
    var balloon = param_o.finalAmount;
    var pRate = FINANCIAL.periodRate( rate );

    if( count && rate &&( effectivePV || balloon ));
    else
      throw FINANCIAL.fin_err.INF;

    if( balloon )
      // initial period when +compounding or -payment starts
      effectivePV -= FINANCIAL.presentVal( balloon, pRate, count );

    var rv;
    var noPays = FINANCIAL.firstPayPeriod( param_o ) - 
      FINANCIAL.firstInterestPeriod( param_o );
    var noInts = 0;

    if( noPays > 0 )
      effectivePV = effectivePV * Math.pow( 1 + pRate, noPays );
    else
      noInts = - noPays;

    rv = effectivePV * pRate / 
      ( noInts * pRate + 1 - Math.pow( 1 + pRate, noInts - count ));
    return rv;
  },


  /*
   * Number of payments to make for a PV at given interest
   * Formula used:
   *
   *           { balloon - payments / periodic rate      }
   *         ln{ ----------------------------------      }
   *           { loan amount - payments / periodic rate  }
   *  Count = -----------------------------------------------
   *         ln{ 1 + periodic rate }
   *
   *         where periodic rate is yearly rate / number of periods in a year.
   */
  getPayCount: function( param_o ){
    var rate = param_o.rate; 
    var balloon = param_o.finalAmount || 0;
    var presVal = param_o.initial;
    var payment = param_o.periodic;

    if( rate && presVal && ( payment || balloon ));
    else
      throw FINANCIAL.fin_err.INF;

    // initial period when +compounding or -payment starts
    var iPer = FINANCIAL.firstInterestPeriod( param_o ) -
      FINANCIAL.firstPayPeriod( param_o );
    var pRate = FINANCIAL.periodRate( rate );

    if( iPer > 0 )	// no compoundig for iPer periods
      // adjust the loan to the start of compounding periods
      presVal -= iPer * payment;

    if( iPer < 0 )	// no payments for iPer periods
      // value of the loan to the time compoundig starts
      presVal = FINANCIAL.futureVal( presVal, -iPer, pRate );

    // Make sure payments cover the interest and more
    if( payment/pRate <= presVal )
      throw FINANCIAL.fin_err.IPP;

    var count = Math.log(
      ( balloon - payment / pRate ) / ( presVal - payment / pRate )) /
	Math.log( 1 + pRate );

	if( iPer > 0 )
	count += iPer;

	return count;
      },

  interestRateOfPayments: function( param_o, accuracy ){
    var balance = param_o.finalAmount || 0;
    var principal = param_o.initial;
    var payment = param_o.periodic || 0;
    var periods = param_o.periods;
    var iRate;
    var iFree;

    if( principal && periods && ( balance || payment ));
    else
      throw FINANCIAL.fin_err.INF;

    iFree = FINANCIAL.firstInterestPeriod( param_o ) -
      FINANCIAL.firstPayPeriod( param_o );

    var intPaid = function( balance ){ 
      return( periods * payment + balance - principal );
    }

    var interestOn = function( iRate ){
      var estBalance = FINANCIAL.balance( principal, payment, iRate, periods, iFree );
      return intPaid( estBalance );
    }

    var round = function( num ){ 
      var deciPlace = accuracy || 3;
      var factor = Math.pow( 10, deciPlace );
      return( Math.round( FINANCIAL.yearRate( num ) * factor ) / factor );
    }

    var interest = intPaid( balance );	// total interest paid
    if( interest == 0 )
      return 0;

    for( iRate = 
      FINANCIAL.yearRate( interest / (( principal + balance ) * periods / 2 ));
      Math.abs( interestOn( iRate )) < Math.abs( interest );
      iRate *= 2 );


    var lowRate = 0;
    var hiRate = iRate;
    for( ; round( hiRate ) != round( lowRate ); iRate = ( lowRate + hiRate ) / 2 ){
      var estInterest = interestOn( iRate );

      if( estInterest == interest )
	break;

      if( Math.abs( estInterest ) < Math.abs( interest ) ||
	( estInterest / interest ) < 0 )		// also same sign
	lowRate = iRate;
      else
	hiRate = iRate;
    }
    return round( iRate );
  },

  balloon: function( param_o ){
    var principal = param_o.initial;
    var payment = param_o.periodic || 0;
    var periods = param_o.periods;
    var pRate = FINANCIAL.periodRate( param_o.rate || 0 ); 

    if(( principal || payment ) && pRate && periods );
    else
      throw FINANCIAL.fin_err.INF;

    // number of interest free periods
    var iFree = FINANCIAL.firstInterestPeriod( param_o ) -
      FINANCIAL.firstPayPeriod( param_o );
    return FINANCIAL.balance( principal, payment, pRate, periods, iFree );
  },

  /*
   * Returns the amount of interest accrued at the end of nth period.
   * given number of payments left, balloon and interest rate.
   * 
   * Note: nth is the nth loan period not payment.
   */
  nthInterest: function( param_o, nth ){
    nth = nth || 0;

    var firstIntPerd = FINANCIAL.firstInterestPeriod( param_o );
    if( nth < firstIntPerd )
      return 0;

    var prevBalance = FINANCIAL.nthBalance( param_o, nth -1 );
    var pRate = FINANCIAL.periodRate( param_o.rate );
    return( pRate * prevBalance );
  },

  /*
   * Return the balance after the nth payment
   * Note: nth is the nth period not payment
   */
  nthBalance: function( param_o, nth ){
    // nth = nth || 0;
    var nthIsVoid = function(){
      if( typeof nth == "undefined" )
	return true;
      if( nth == null )
	return true;
      return false;
    }


    var balloon = param_o.finalAmount || 0;
    var pRate = FINANCIAL.periodRate( param_o.rate );
    var count = param_o.periods;
    var payments = param_o.periodic;

    if( pRate && count && typeof payments != 'undefined' );
    else
      throw FINANCIAL.fin_err.INF;

    var pay1Perd = FINANCIAL.firstPayPeriod( param_o );
    var int1Perd = FINANCIAL.firstInterestPeriod( param_o );
    if( pay1Perd > count  || int1Perd > count )
      throw FINANCIAL.fin_err.PST;

    if( nthIsVoid() || ( nth < pay1Perd && nth < int1Perd ))
      nth = ( pay1Perd < int1Perd ? pay1Perd : int1Perd ) -1;

    if( pay1Perd == int1Perd ){
      var periods;
      if( nth < pay1Perd )
	periods = count;
      else
	periods = count -nth;
      return FINANCIAL.presentValOfPayments( balloon, pRate, periods, payments );
    }

    if( pay1Perd < int1Perd ){
      var iFree = 0;		// interest free periods
      var periods;
      if( nth < int1Perd ){
	iFree = int1Perd - nth -1;
	periods = pay1Perd + count - int1Perd;
      }else{
	iFree = 0;
	periods = pay1Perd + count - nth -1;
      }
      return iFree * payments +
	FINANCIAL.presentValOfPayments( balloon, pRate, periods, payments );
    }

    if( int1Perd < pay1Perd ){
      if( nth >= pay1Perd ){
	var periods = pay1Perd + count - nth -1;
	return FINANCIAL.presentValOfPayments( balloon, pRate, periods, payments );
      }

      var maxBalance =
	FINANCIAL.presentValOfPayments( balloon, pRate, count, payments );
      var nopayPerds = pay1Perd - ( nth < int1Perd ? int1Perd -1 : nth );
      return FINANCIAL.presentVal( maxBalance, pRate, nopayPerds -1 );
    }

    throw FINANCIAL.fin_err.FUP;
  },

  /*
   * Error list
   */
  fin_err: {
    PMT: "Rate, initial amount, and number of payments are required.",
    INF: "Insufficient information.",
    IPP: "Insufficient periodic payments for the loan to end.",
    PST: "Fix payment start dates or number of payments",
    FUP: "Oops. That's a bug."
  }
};
