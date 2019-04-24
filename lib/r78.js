/*
 * param_o object is
 * {
 * periods:		- number of payments excluding balloon.
 * rate:		- total finance expense
 * initial:		- Principal
 * periodic:		- periodic fixed payments
 * finalAmount:		- balloon
 * startDate:		- loan/investment date if all dates are the same
 * }
 *
 * BASIC FORMULA:
 * 	B= P*d - I * sigma( d ) / sigma( N )
 *
 * Where
 * 	B = Balance
 * 	P = Dollar periodic payment
 * 	d = Number of periods left to full amortize the loan ( N - n )
 * 	I = interest paid if loan allowed to fully amortize
 * 	sigma(x) = sum of digits functoin for 1 to x
 * 	N = Number of periods to fully amortize the loan
 * 	n = Number of periods past
 */
var R78 = {};

R78.error = {
  PAYPARMS : "Finance Charge, Principal and Payment Amount are required inputs.",
  FINCHARG : "Finance charge can be calculated for complete amortization only.\n" +
             "Zero out balloon and enter full number of payments.",
  INTPARMS : "No. of Payments, Principal and Payment Amount are required inputs.",
  PRINPARMS: "No. of Payments, Interest and Payment Amount are required inputs.",
  PAYMNPARMS:"No. of Payments, Interest and Loan Amount are required inputs.",
  BALLNPARMS:"No. of Payments, Interest Loan Amount and Payment Amount are required inputs.",
  NTH_INTR:  "Insufficient information given to calculate the nth interest.",
  NTH_BALN:  "Insufficient information given to calculate the nth balance."
};

//-----------------------------------------------------------------------------
R78.iterator = function( first_fun, second_fun, initial ){
//-----------------------------------------------------------------------------
  var counter=initial;
  var lastDiff;
  var newDiff;
  do{
    var i1 = first_fun( counter );
    var i2 = second_fun( counter ); 
    var result;
    newDiff = Math.abs( i2 - i1 );
    if( lastDiff && lastDiff < newDiff )
      return  result;

    result = i1;
    lastDiff = newDiff;
    counter++;
  }while( true );
};
//-----------------------------------------------------------------------------
R78.balance = function( p, d, i, n ){ 
//-----------------------------------------------------------------------------
  return ( p * d ) - i * R78.sigma( d ) / R78.sigma( n ); 
};
//-----------------------------------------------------------------------------
R78.sigma = function( n ){ return n * ( n + 1 ) / 2 ; }
//-----------------------------------------------------------------------------
R78.getPayCount = function( param_o ){
//-----------------------------------------------------------------------------
  var interest = param_o.rate;
  var balloon = deciRound( param_o.finalAmount || 0 );
  var principal = param_o.initial;
  var payment = param_o.periodic;

  if( interest && principal && payment );
  else
    throw R78.error.PAYPARMS;

  var n = ( interest + principal ) / payment;
  if( balloon == 0 )
    return n;

  var guess; 
  var guessBal;
  var high = n;
  var low = 0;
  do{
    guess = ( high + low ) / 2;
    guessBal = deciRound( R78.balance( payment, n - guess, interest, n ));
    if( guessBal == balloon )
      break;

    if( guessBal < balloon )
      high = guess;
    else
      low = guess;

  }while( true );

  return guess;
};
//-----------------------------------------------------------------------------
R78.getInterest = function( param_o ){
//-----------------------------------------------------------------------------
  var count = param_o.periods;
  var loan = param_o.initial;
  var payment = param_o.periodic;
  var balloon = param_o.finalAmount || 0;

  if( count && loan && payment );
  else
    throw R78.error.INTPARMS;

  if( balloon == 0 )
    return count * payment - loan;

  /* Estimate of interest if period is full amortization period 
   * and count is the payoff period - there is a balloon
   */
  var midInt = function( period ){
    return R78.sigma( period ) * ( payment * count + balloon - loan ) /
           ( R78.sigma( period ) - R78.sigma( period - count ));
  }

  /*
   * Full amortization intrest if period is the las payment number
   */
  var lastInt = function( period ){ return  payment * period - loan;};
  
  return R78.iterator( lastInt, midInt, count );
};
//-----------------------------------------------------------------------------
R78.getPrincipal = function( param_o ){
//-----------------------------------------------------------------------------
  var count = param_o.periods;
  var interest = param_o.rate;
  var payment = param_o.periodic;
  var balloon = param_o.finalAmount || 0;

  if( count && interest && payment );
  else
    throw R78.error.PRINPARMS;

  if( balloon == 0 )
    return count * payment - interest;

  var midPrinc = function( period ){
    return payment * count + balloon - 
      interest * ( 1 - R78.sigma( period - count ) / R78.sigma( period ));
  }

  var lastPrinc = function( period ){ return payment * period - interest; }
  return R78.iterator( lastPrinc, midPrinc, count );
};
//-----------------------------------------------------------------------------
R78.getPayment = function( param_o ){
//-----------------------------------------------------------------------------
  var count = param_o.periods;
  var interest = param_o.rate;
  var loan = param_o.initial;
  var balloon = param_o.finalAmount || 0;

  if( count && interest && loan );
  else
    throw R78.error.PAYMNPARMS;

  if( balloon == 0 )
    return (interest + loan)/count;

  var midPayment = function( period ){
    return ( loan + interest * ( 1 - R78.sigma( period - count ) / 
	  R78.sigma( period )) - balloon ) / count;
  };

  var lastPayment = function( period ){ return ( interest + loan ) / period;};
  return R78.iterator( lastPayment, midPayment, count );
};
//-----------------------------------------------------------------------------
R78.getBalloon = function( param_o ){
//-----------------------------------------------------------------------------
  var count = param_o.periods;
  var interest = param_o.rate;
  var loan = param_o.initial;
  var payment = param_o.periodic;

  if( count && interest && loan && payment );
  else
    throw R78.error.BALLNPARMS;

  var fullCount = Math.round( (interest + loan) / payment );
  if( fullCount == count )
    return interest + loan - count * payment;

  var discount = interest * ( R78.sigma( fullCount - count )) / 
    R78.sigma( fullCount );

  return loan + interest - discount - payment * count;
};

//-----------------------------------------------------------------------------
R78.nthInterest = function( param_o, nth ){
//-----------------------------------------------------------------------------
  var count = param_o.periods;
  var interest = param_o.rate;

  if( count && interest && nth );
  else
    throw R78.error.NTH_INTR;

  return interest * ( count - nth + 1) / R78.sigma( count );
};

//-----------------------------------------------------------------------------
R78.nthBalance = function( param_o, nth ){
//-----------------------------------------------------------------------------
  var fullCount = param_o.periods;
  var interest = param_o.rate;
  var loan = param_o.initial;
  var payment = param_o.periodic;

  if( fullCount && interest && loan && payment && nth );
  else
    throw R78.error.NTH_BALN;

  var discount = interest * ( R78.sigma( fullCount - nth )) / 
    R78.sigma( fullCount );

  return loan + interest - nth * payment - discount;
}

