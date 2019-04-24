/*
 * Kitchen sink library (kSink) 
 */

/*
 * Fixes to overcome MS bugs go here
 */
(function () {
      
      /* Internet Explorer 11 may have trouble retrieving the number type
       *     of an input value. This short script performs a quick test, and repairs
       *         the functionality if necessary. Load before attempting to use the
       *             `valueAsNumber` property on input elements. */

      "use strict";

      var a = document.createElement( "input" );

      a.setAttribute( "type", "number" );
      a.setAttribute( "value", 2319 );

      if ( "valueAsNumber" in a && a.value != a.valueAsNumber ) {
	if ( "defineProperty" in Object && "getPrototypeOf" in Object ) {
	  Object.defineProperty( Object.getPrototypeOf( a ), "valueAsNumber", {
	    get: function () { return Number( this.value ); }
	  });
	}
      }

}());

function hasLocalStorage(){
  var rv = true;
  try{
    if( ! window.localStorage )
      rv = false;
    // check for local storage corruption
    else
      var dummy = localStorage.anyValue;
  }catch( e ){
    console.log( e );
    rv = false;
    if( e.name == "NS_ERROR_FILE_CORRUPTED" ){
      var alert_fun = DIALOGS.alertDialog || alert;
      alert_fun( "Your browser's storage may be corrupted." +
	" search NS_ERROR_FILE_CORRUPTED for how to fix this." );
    }
  }
  return rv;
}


/*
 * a rounding routine that rouds 5 up
 */
function deciRound( deciNumb, places ){
  if( places === undefined )
    places = 2;
  var factor = Math.pow( 10, places );
  return Math.round( deciNumb * factor ) / factor;
}

function deciString( deciNumb, places ){
  places = places || 2;
  return deciNumb.toLocaleString( [],
    {minimumFractionDigits: places, maximumFractionDigits: places });
}

function createGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
	return v.toString(16);
      });
}

function mkScript( str ){ return "<scr" + "ipt> " + str + " </scr" + "ipt>"; }

/*
 * if anchor element is a link to a location within current document,
 * it returns the the element pointed to
 */
function selfTarget( anchor ){
  var href = anchor.href;
  var uri;
  uri = document.location.href || document.baseURI;
  var n = uri.indexOf( "#" )

  if( n >= 0 )
    uri = uri.substr( 0, n )

  if( ! href.startsWith( uri ))
    return null;

  var idBegins = href.indexOf( "#" );
  if( idBegins < 0 )
    return null;

  var id = href.substr( idBegins + 1 )
  if( id == "" )
    return null;

  return document.getElementById( id );
}

/*
 * save the object in a local file
 */
function saveObject( fileName, data ){
  if( ! fileName )
    fileName = "new calc"
  
  var a_elm = document.createElement( "a" );
  a_elm.style.display = "none";
  a_elm.setAttribute( "download", fileName );

  var toSave;
  switch( typeof data ){
    case  "object" :
      toSave = "data:application/json;charset=utf-8," + 
	        encodeURIComponent( JSON.stringify( data ));
      break;
    case "string":
      toSave = 'data:text/plain;charset=utf-8,' + 
	encodeURIComponent( data );
      break;

    default:
      toSave = String( data );
  }
  a_elm.setAttribute( "href", toSave );
  document.body.appendChild( a_elm );
  try{
    a_elm.click();
  }finally{
    document.body.removeChild( a_elm );
  }
}

/* create a new date object out of a string
 * or an existing date, since dates are mutable.
 * And set the hour to 0 hours local
 */
function makeDate( d ){
  // Check for a Date object
  var dat;
  if( typeof( d ) == "string" ){
    if( ! d.match( /T[0-9]{2}:[0-9]{2}:[0-9]{2}/ ))
      d = d + "T00:00:00";

    dat = new Date( d );
  }else{
    if( d )
      dat = new Date( d );
    else
      dat = new Date();

    dat.setHours( 0, 0, 0, 0 );
  } 

  return dat;
}
/*
 * Read object from a local file
 * doOnRead is the call back function invoked after the file is read.
 * err_fun is the error reporting function
 * time out is optional in milsecs
 */
function readObject( doOnRead, err_fun, timeout ){
  var reader;
  var input_elm;
  var timer;

  if( ! timeout )
    timeout = 500;

  function cleanup(){
    if( timer )
      clearTimeout( timer );
    if( input_elm )
      document.body.removeChild( input_elm );
  }

  function tooLong(){
    reader.abort();
    cleanup();
    err_fun( "File took too long to read." );
  }

  function readFile(){
    try{
      var read = reader.result;
      var obj = JSON.parse( read );
      doOnRead( obj );
    }catch( err ){
      err_fun( err );
    }finally{
      cleanup();
    }
  }

  function pickFile(){
    try{
      if( input_elm.files.length < 0 )
	throw "No files picked";

      var picked = input_elm.files[0];
      if( ! picked.type.match( /js|json|txt|text|^$/ ))
	throw "File type not recognized.";

      reader = new FileReader();
      reader.onloadend = readFile;
      timer = setTimeout( tooLong, timeout );
      reader.readAsText( picked );

    }catch( err ){
      err_fun( err );
      cleanup();
    }
  }

  input_elm = document.createElement( "input" );
  input_elm.style.display = "none";
  input_elm.setAttribute( "type", "file" );
  input_elm.onchange = pickFile;
  input_elm.click();
}
