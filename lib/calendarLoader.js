// Single function to load datepicker and custom overrides
// Expect the kSink lib to be loaded
//--------------------------------------------------------------------------------
function loadDatePicker( runAfterLoad ){
  //--------------------------------------------------------------------------------
  var ipt_elm = null;		// current active date input
  var ipt_id;			// current input id
  var iptChanged;		// flag for changes to input
  var head = document.getElementsByTagName('head')[0];

  // test for the existance of the DIALOGS lib
  var errAlert = DIALOGS ? DIALOGS.alertDialog : alert;

  // Call-back to load css customizations after the
  // default css is loaded.
  var custom_css = function() {
    var css = document.createElement( 'link' );
    css.type = 'text/css';
    css.href = 'lib/custom_datepicker.css';
    css.rel  = 'stylesheet';
    head.appendChild(css);
  }

  var css = document.createElement( 'link' );
  css.type = 'text/css';
  css.href = 'lib/datepicker.css';
  css.rel  = 'stylesheet';
  css.onload = custom_css;
  head.appendChild(css);

  function replaceDateParser(){
    var originalParser = parseMyDate;

    function replacement( d ){
      var ipt = document.getElementById( ipt_id );
      var format = ipt.attributes[ "format" ].value;

      try{
	var rv;
	var regex = /dd[ \-\/]mon(|th),{0,1}[ \-\/](yyyy|year)/i;
	if( regex.test( format ))
	  rv = originalParser( d );
	else{
	  var local = true;
	  rv = dateValue( d, format );
	}
	return rv;
      }catch(e){
	return new Date( d );
      }
    }
    parseMyDate = replacement;
  }

  var script = document.createElement('script');
  script.type='text/javascript';
  script.src ='lib/datepicker.js';
  script.onload = function(){ 
    attachPicker( icon_fn, picker_fn, format_fn ); 
    replaceDateParser();
    if( runAfterLoad )
      runAfterLoad();
  }
  head.appendChild(script);

  /*
   * Callback function when a calendar anchor is 
   * associated with a date input.
   *
   * It is used here to resize the click icon and the input field.
   */
  var icon_fn = function( ipt, anch ){

    var height = ipt.offsetHeight;
    anch.firstChild.style.width = String( height ) + "px";
    anch.firstChild.style.height= String( height ) + "px";
    anch.firstChild.src = "Images/calendar-512-.png";

    var oldWid = ipt.offsetWidth;
    var difWid = anch.offsetWidth;
    ipt.style.width = String( oldWid - difWid ) + "px";
    ipt.style.cssFloat = "left";

    // ipt.value = formatDate( ipt.attributes.format.value, ipt.value );
    ipt.setValue = function( val ){
      this.value = formatDate( this.attributes.format.value, val );
    }
    ipt.setValue( ipt.value );

    if( anch.onclick ){
      var oldClick = anch.onclick;
      anch.onclick = function(){
	ipt_id = ipt.id;
	oldClick( arguments );
      }
    }else{
      anch.addEventListener( "click", function(){ ipt_id = ipt.id; });
    }
    ipt.getDateValue =
      function(){ return dateValue( this.value, this.attributes.format.value ); }

    ipt.setFormat = 
      function( format ){
	if( this.value != "" ){
	  d = this.getDateValue();
	  d_str = formatDate( format, d );
	  this.value = d_str;
	}
	this.setAttribute( "format", format);
      }
    ipt.setDateValue =
      function( dat ){
	var format = this.attributes.format.value;
	this.value = formatDate( format, dat );
      }
    ipt.addEventListener( "change", function(){
	this.value = valiDate( this.attributes.format.value, this.value );
      }
    )
  }

  // callback after picker is created to give us a chance to
  // customize it. div_elm is the <div> container.

  var picker_fn = function( div_elm, ipt_id ){

    if( ipt_elm != null )
      removeIpt_elm( ipt_elm.nextSibling );

    iptChanged = false;
    ipt_elm = document.getElementById( ipt_id );

    var top = ipt_elm.offsetTop + ipt_elm.offsetHeight;
    var left = ipt_elm.nextSibling.offsetLeft +
               ipt_elm.nextSibling.offsetWidth -
	       ipt_elm.offsetWidth;

    div_elm.style.display = "block";
    div_elm.style.position = "absolute";
    div_elm.style.top = top + "px";
    div_elm.style.left = left + "px";
    div_elm.style.zIndex = "1";

    document.addEventListener( "click", documentClicked );
  }


  function removeIpt_elm( sibling ){
    var iconClick_func = sibling.nextElementSibling.onclick;
    if( iconClick_func != null ) 	// clicked some other place
      iconClick_func();	// simulate a click to get rid of calendar

    if( iptChanged && ipt_elm.onchange )
      ipt_elm.onchange();

    // hara-kiri
    ipt_elm = null;		// no longer valid
    document.removeEventListener( "click", documentClicked );
  }

  /*
   * Close the picker if any part of the page other than the picker
   * icon or calendar was clicked. Bit of a presumptuous function.
   */

  function documentClicked( event ){
    var sibling = ipt_elm.nextSibling;
    var target = event.target;

    function clicked( elm ){ return( elm == target || elm.contains( target )); }
    function calIsVisible(){ return !( sibling.classList[0] == 'datepickershow' ); }

    if( calIsVisible() ){
      if( clicked( sibling.nextSibling ))
	return false;		// just dropped down

      if( ! clicked( document.body ))
	return false;		// new calendar
    }
    removeIpt_elm( sibling );
    return true;
  }

  /*
   * callback for formatting a date
   * expect date as either a date object or milliseconds Number
   * Valid Masks:
   * 		Weekday		Sunday
   * 		WEEKDAY		SUNDAY
   * 		Wday		Sun
   * 		WDAY		SUN
   * 		year/yyyy	2000
   * 		Month		January
   * 		MONTH		JANUARY
   * 		Mon		Jan
   * 		MON		JAN
   * 		mm		01
   * 		dd		01
   *
   */

  function format_fn( anyDate ){
    var format = ( ipt_elm.attributes.format.value || 'Mon dd, yyyy' );

    // we *assume* that this function is called so a formatted value
    // will be placed in the input. iptChanged flag is set so onchange event
    // is called before the drop-down is removed;
    iptChanged = true;
    return formatDate( format, Number( anyDate ));
  }

  /*
   * validate string value of date input field and reformat to
   * fit the currnet format requirement
   */
  function valiDate( format, anyDate ){
    try{
      function notValid( aDate ){ return isNaN( Number( aDate )); }

      try{
	var date = dateValue( anyDate, format );
      }catch(e){;}

      // if not valid maybe the browser can detect it.
      if( notValid( date )){
	date = new Date( anyDate );
	if( notValid( date ))
	  throw "Not a valid date";
      }
      return formatDate( format, date );

    }catch( e ){
      errAlert( e );
    }
  }

  /*
   * format and date are required
   */
  function formatDate( format, anyDate ){
    result = format;
    var date = makeDate( anyDate );

    if( isNaN( date ))
      return "";

    var dw = date.getDay();
    result = result.replace( "Weekday", [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday" ][ dw ]);
    result = result.replace( "WEEKDAY", [ "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SUNDAY" ][ dw ]);
    result = result.replace( "Wday", [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ][ dw ]);
    result = result.replace( "WDAY", [ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" ][ dw ]);

    result = result.replace( /(Year|YEAR|yyyy|YYYY)/, date.getFullYear() );

    var mn = date.getMonth();
    result = result.replace( "Month", [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ][ mn ]);
    result = result.replace( "MONTH", [ "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ][ mn ]);
    result = result.replace( "Mon", [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ][ mn ]);
    result = result.replace( "MON", [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ][ mn ]);
    result = result.replace( "mm", ( mn < 9 ? "0" : "" )+ (mn + 1 ));

    var dd = date.getUTCDate()
    result = result.replace( "dd", ( dd < 10 ? "0" : "" )+ dd );

    return result;
  }

  /*
   * parse a date d according to the format and reutrn either local
   * or UTC time
   */
  function dateValue( d, format ){

    function isBuiltin(){
      regex = /(yyyy|year)-mm-dd/i;
      return( regex.test( format ))
    }

    function l0Pad( num ){
      var str = ( num < 10 ? "0" + String( num ) : String( num ));
      return str.substr( str.length -2, 2 );
    }

    if( ! d )
      return makeDate();

    if( !format || isBuiltin() ){
      var rv = makeDate( d );
      if( rv.getTime() == NaN )
	rv = makeDate();
      return rv;
    }

    //Need to parse the format and break out values accoridingly
    var year, month, day;

    // replace any all / with space in result and format
    d = d.replace( /\//g, " " ); 
    format = format.replace( /\//g, " " );

    // get rid of day of week
    var regex = /[a-z]+day/i;
    if( regex.test( format )){
      d = d.replace( /(SUN|MON|TUE|WED|THU|FRI|SAT).*(DAY)*/i, "" );
      format = format.replace( /w.*day/i, "" );
    }

    // Take care of the case where only numbers are give eg 20131231 or 31122013 etc...
    regex = /[0-9]{8}/;
    if( regex.test( d )){
      var yearPos = format.search( /(year|yyyy)/i );
      var montPos = format.search( /mm/i );
      var datePos = format.search( /dd/i );

      year = d.slice( yearPos, 4 );
      mont = d.slice( montPos, 2 );
      date = d.slice( datePos, 2 );

    }else{
      var yearFmt, montFmt, dateFmt;
      var monRegx, monRepl;
      var numMonth = false;
      // find out if month is numeric
      regex = /mon(|th)/i;
      if( regex.test( format )){
	monRegx = new RegExp( "mon[\\S]*", "i" );
	monRepl = "[JFMASOND][A-Za-z]+";
      } else {
	monRegx = new RegExp( "mm", "i" );
	monRepl = "[0-9]{2}";
	numMonth = true;
      }

      yearFmt = format.replace( /(year|yyyy)/i, "([0-9]{4})" );
      yearFmt = yearFmt.replace( /dd/i, "[0-9]{2}" );
      yearFmt = yearFmt.replace( monRegx, monRepl );
      regex = new RegExp( yearFmt, "i" );
      year = d.match( regex )[1];

      montFmt = format.replace( new RegExp( monRegx, "i" ), "(" + monRepl + ")" );
      montFmt = montFmt.replace( /(year|yyyy)/i, "[0-9]{4}" );
      montFmt = montFmt.replace( /dd/i, "[0-9]{2}" );
      regex = new RegExp( montFmt, "i" );
      mont = d.match( regex )[1];

      dateFmt = format.replace( /dd/i, "([0-9]{2})" );
      dateFmt = dateFmt.replace( /(year|yyyy)/i, "[0-9]{4}" );
      dateFmt = dateFmt.replace( monRegx, monRepl );
      regex = new RegExp( dateFmt );
      date = d.match( regex )[1];
    }
    if( ! numMonth ){
      var months = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 
		     'SEP', 'OCT', 'NOV', 'DEC' ];
      var numeric = months.indexOf( mont.toUpperCase().substr( 0, 3 )) + 1;
      mont = l0Pad( numeric );
    }
    return makeDate(  year + "-" + mont + "-" + l0Pad( date ));
  }
};
