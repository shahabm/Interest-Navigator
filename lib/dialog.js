var DIALOGS = {};

DIALOGS.qImage = 'data:image/png;base64,' +
  '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'+
  'FNrLdi/9Pz/i82ZxO6PlAAAAAElFTkSuQmCC';

DIALOGS.aImage = 'data:image/png;base64,' +
  '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';

// Set this if styles used by dialog are already defined this is a kludge
// assistance flag.
DIALOGS.hasStyle = false;
/*
 * find out if the selector is defined within styles
 */
//---------------------------------------------------------------------------
DIALOGS.styleDefined = function( selector ){
//---------------------------------------------------------------------------
  // this may not work for some browsers if the style sheet is linked or
  // imported - hence the hasStyle kludge flag.
  var searchSheet = function( styleSheet, selector ){
    var rule, i;
    for( i = 0; i < styleSheet.cssRules.length; i++ ){
      rule = styleSheet.cssRules[i];

      // Check for an imported style sheet
      if( rule.styleSheet ){
	if( searchSheet( rule.styleSheet, selector ))
	  return true;
      }

      if( rule.selectorText == selector )
	return true;
    }
    return false;
  };

  
  if( DIALOGS.hasStyle ) return true;
  var styleSheet;
  var i;

  for( i = 0; i < document.styleSheets.length; i++ ){ 
    styleSheet = document.styleSheets[i];
    if( searchSheet( styleSheet, selector ))
      return true;
  }
  return false;
}

/*
 * attribs - Dialog attributes used by the library and
 * the dialog to store state
 * 	{title: to show in the title bar 
 *       cancel: callback to cancel function}
 *
 * division_elm - accepts a division element from within the document and turns it
 * into a modal dialog
 * if the first element inside division_elm is a <P> and has class="title-bar",
 * then the text is used for the dialog's title bar.
 *
 * over_elm is optional. If given, it is an element that the top
 * left corner of the dialog will cover.
 */
DIALOGS.ModalDialog = function( attribs, division_elm, over_elm ){
  var disableList = [];		// elements to disable when visible
  var elm;
  var pos_elm = over_elm;
  var me = this;
  var firstFocus;

  //---------------------------------------------------------------------------
  var initialize = function(){
  //---------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    var setBackground = function(){
    //-------------------------------------------------------------------------
      var dlgBackground = document.createElement( "DIV" );
      var divParent = division_elm.parentNode;

      var node = document.createDocumentFragment();
      node.appendChild( division_elm );

      divParent.appendChild( dlgBackground );
      dlgBackground.appendChild( node );

      dlgBackground.style.position = "fixed";
      dlgBackground.style.visibility = "hidden";
      dlgBackground.style.zIndex = "1";
      dlgBackground.style.left = "0";
      dlgBackground.style.top = "0";
      dlgBackground.style.width = "100%";
      dlgBackground.style.height = "100%";
      dlgBackground.style.overflow = "auto";
      dlgBackground.style.backgroundColor = "rgba( 0, 0, 0, 0.4 )";

      elm = dlgBackground.firstElementChild;
      elm.style.visibility = "inherit";
    };
    /* add a title bar and a cancel button to it, if needed */
    //-------------------------------------------------------------------------
    var addTitleBar = function(){
    //-------------------------------------------------------------------------
      var content = elm.firstElementChild;
      var titleBar;
      var title = attribs.title;

      if( content.tagName == "P" && content.className == "title-bar" )
	titleBar = content;
      else
	titleBar = document.createElement( "P" );

 
      //-----------------------------------------------------------------------
      var setStyle = function(){
      //-----------------------------------------------------------------------
	if( DIALOGS.styleDefined( ".title-bar" ))
	  titleBar.classList.add( "title-bar" );
	else{	// Define our own style for the title-bar

	  titleBar.style.backgroundColor = "blue";
	  titleBar.style.borderBottom = "1px solid #000";
	  titleBar.style.marginBottom = "0px";
	  titleBar.style.marginLeft = "0px";
	  titleBar.style.marginTop = "0px";
	  titleBar.style.padding = "0";
	  titleBar.style.boxSizing = "border-box";
	  titleBar.style.top = "0";
	  titleBar.style.left = "0";
	  titleBar.style.verticleAlign = "middle";
	  titleBar.style.textAlign = "center"; titleBar.style.height = "1.5em";
	  titleBar.style.verticalAlign = "middle";
	  titleBar.style.textAlign = "center";
	}
      };
      //-----------------------------------------------------------------------
      var addCancelBtn = function(){
      //-----------------------------------------------------------------------
	var cancel_fun = attribs.cancel;
	if( cancel_fun ){
	  var btn = document.createElement( "BUTTON" );
	  var icon = document.createTextNode( "\u2716" );
	  btn.appendChild( icon );
	  btn.style.cssFloat = "right";
	  btn.addEventListener( "click", cancel_fun );
	  titleBar.appendChild( btn );
	}
      };
      //-----------------------------------------------------------------------
      var addDragHandler = function(){
      //-----------------------------------------------------------------------
	var dragging = false;
	var xStart
	var yStart 

	titleBar.style.cursor = "move";
	titleBar.onmousedown = function( e ){
	  dragging = true;
	  xStart = e.clientX;
	  yStart = e.clientY;
	}

	titleBar.onmouseup = function(){ dragging = false; }
	titleBar.onmouseout = function(){ dragging = false; }
	titleBar.onmousemove = function( e ){
	  if( ! dragging ) return;

	  var deltaX = e.clientX - xStart;
	  var deltaY = e.clientY - yStart;
	  xStart = e.clientX;
	  yStart = e.clientY;

	  newTop = elm.offsetTop + deltaY;
	  newLeft = elm.offsetLeft + deltaX;
	  
	  if( newTop < 0 || newLeft < 0 || 
	      newTop > window.innerHeight || newLeft > window.innerWidth )
	    ;
	  else{
	    elm.style.top = newTop + "px";
	    elm.style.left = newLeft + "px";
	  }
	}
      };
      //addDragHandler()------------------------------------------------------

      if( title  && content != titleBar ){
	var titleNode = document.createTextNode( title );
	titleBar.appendChild( titleNode );
      }
      setStyle();
      addCancelBtn();
      addDragHandler();

      if( content != titleBar )
	elm.insertBefore( titleBar, content );
    }; //addTitleBar()-----------------------------------------------------------


    setBackground();
    addTitleBar();
    me.getFirstFocus();

  }; // initialize() ends
  
  //---------------------------------------------------------------------------
  this.getPosition = function( elm ){
  //---------------------------------------------------------------------------

    var getOffset = function( elm ) {
      var rv = { left: 0, top: 0 };
      if( elm.offsetParent === document.body ){
	rv.left = elm.offsetLeft - elm.scrollLeft;
	rv.top  = elm.offsetTop - elm.scrollTop;
      }else{
	var offset = getOffset( elm.offsetParent );
	rv.left = elm.offsetLeft + offset.left;
	rv.top  = elm.offsetTop  + offset.top;
      }
      return rv;
    }
    var offset = getOffset( elm );
    return{
      left: elm.scrollLeft + offset.left,
      top: elm.scrollTop  + offset.top
    }
  }


  /*
   * atPosition is optional object containing the coordinates.
   */
  //---------------------------------------------------------------------------
  this.show = function( atPosition ){
  //---------------------------------------------------------------------------
    // Disable all elements except for this dialog
    disableList = document.body.querySelectorAll( ":enabled" );
    for( var i = 0; i < disableList.length; i++ )
      if( ! elm.contains( disableList[ i ]))
	disableList[ i ].disabled = true;

    //
    if( atPosition ){
      elm.style.left = atPosition.left;
      elm.style.top = atPosition.top;
    } else if( pos_elm ){
      elm_pos = me.getPosition( pos_elm );
      elm.style.position = "fixed";
      elm.style.left = elm_pos.left + "px";
      elm.style.top =  elm_pos.top + "px";
    } else {
      // all else, center
      elm.style.position = "fixed";
      elm.style.left = ( window.innerWidth - elm.offsetWidth ) / 2 + "px";
      elm.style.top  = ( window.innerHeight   - elm.offsetHeight) / 2 + "px";
    }
    elm.parentElement.style.visibility = "visible"; 
    if( me.getFirstFocus )
      firstFocus.focus();
  }

  //---------------------------------------------------------------------------
  this.hide = function(){ 
  //---------------------------------------------------------------------------
    if( disableList.length > 0 ){
      for( var i = 0; i < disableList.length; i++ )
	if( ! elm.contains( disableList[ i ]))
	  disableList[i].disabled = false;

      disableList = [];
    }

    elm.parentElement.style.visibility = "hidden"; 
  }

  //---------------------------------------------------------------------------
  this.setFirstFocus = function( focus_elm ){
  //---------------------------------------------------------------------------
    if( focus_elm && elm.contains( focus_elm ))
      firstFocus = focus_elm;
  }

  //---------------------------------------------------------------------------
  this.getFirstFocus = function(){
  //---------------------------------------------------------------------------
    if( firstFocus && elm.contains( firstFocus ))
      return firstFocus;

    firstFocus = elm.querySelector( "input" );
    if( firstFocus )
      return firstFocus;

    firstFocus = elm.querySelector( "button" );
    if( firstFocus )
      return firstFocus;

    firstFocus = elm.firstElement.child;
  };
  //---------------------------------------------------------------------------


  initialize();
  me.fields = attribs;
};


/*
 * Put up a modal dialog with a few controls
 * controls:	callback function to add interior controls
 * 		(detach: call back of cancel function, elm: to attach to)
 * image:	 optional src of an image hint to display next to 
 */
//---------------------------------------------------------------------------
DIALOGS.infoBox = function( message_txt, title_txt, controls_fun, image ){
//---------------------------------------------------------------------------
  var dialog;
  var outer_div = document.createElement( "DIV" );

  var detach = function(){
    dialog.hide();
    outer_div.parentElement.removeChild( outer_div );
  }

  if( DIALOGS.styleDefined( ".dialog" ))
    outer_div.classList.add( "dialog" );
  else{
    outer_div.style.overflow = "auto";
    outer_div.style.background = "#AAAAAA";
    outer_div.style.border = "2px ridge #DDDDDD";
  }
  outer_div.style.width = "auto";
  outer_div.style.visiblity = "hidden";

  if( image ){
    var img     = document.createElement( "IMG" );
    img.src = image;
    img.style.paddingLeft  = "1em";
    img.style.paddingRight = "0.5em";
    img.style.cssFloat = "left";
    img.style.height = "3em";
    img.style.paddingTop = "1em";
    outer_div.appendChild( img );
  }

  var messg_p = document.createElement( "P" );
  messg_p.style.paddingRight = "1em";
  messg_p.style.paddingLeft = "1em";
  messg_p.appendChild( document.createTextNode( message_txt ));
  outer_div.appendChild( messg_p );
  outer_div.appendChild( document.createElement( "BR" ));

  var firstFocus = controls_fun( detach, outer_div );
  document.body.appendChild( outer_div );
  dialog = new DIALOGS.ModalDialog({ title: title_txt, cancel: detach }, outer_div );
  dialog.setFirstFocus( firstFocus );
  return dialog;
};
/*
 * Put up a modal dialog with just two options for the user to confirm
 * positive_txt: button lable for true
 * negative_txt: button lable for false
 * result_fun:   call back functoin to notify posotive or negative pressed
 * image:	 optional src of an image hint to display next to 
 */
//---------------------------------------------------------------------------
DIALOGS.confirmDialog = function( 
    message_txt, positive_txt, negative_txt, result_fun, image ){
//---------------------------------------------------------------------------

  var layout = function( detach_fun, outer_div ){

    var buttons_div = document.createElement( "DIV" );
    buttons_div.style.leftPadding = "2em";
    buttons_div.style.rightPadding = "2em";
    buttons_div.style.display = "flex";
    buttons_div.style.justifyContent = "space-around";

    var yes_button = document.createElement( "BUTTON" );
    yes_button.innerText = positive_txt;
    buttons_div.appendChild( yes_button );
    yes_button.onclick = function(){ result_fun(true); detach_fun(); };
    yes_button.style.flex = "1";

    var no_button = document.createElement( "BUTTON" );
    no_button.innerText = negative_txt;
    buttons_div.appendChild( no_button );
    no_button.onclick = function(){ result_fun(false); detach_fun(); };
    no_button.style.flex = "1";

    outer_div.appendChild( buttons_div );
    return yes_button;	// firstFocus
  }
  return DIALOGS.infoBox( message_txt, "Confirm", layout, image || DIALOGS.qImage );
};
/*
 * Alert substitute. image is optional
 */
//---------------------------------------------------------------------------
DIALOGS.alertDialog = function( message_txt, image ){
//---------------------------------------------------------------------------
  var layout = function( detach_fun, outer_div ){
    var button;
    var buttons_div = document.createElement( "DIV" );
    buttons_div.style.leftPadding = "2em";
    buttons_div.style.rightPadding = "2em";
    buttons_div.style.display = "flex";
    buttons_div.style.justifyContent = "space-around";

    button = document.createElement( "BUTTON" );
    button.innerText = "OK";
    buttons_div.appendChild( button );
    button.onclick = detach_fun;
    button.style.flex = "1";
    outer_div.appendChild( buttons_div );

    return button;
  };
  DIALOGS.infoBox( message_txt, "Alert", layout, image || DIALOGS.aImage ).show();
};

