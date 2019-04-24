/*
 * Drop click navigation menus
 * The user HTML should place the following HTML:
 *
      <a id="click-first" title = "Click for commands menu." href="#{top-menu}"  class="dropclick" > &#x2630; </a>
 * menu panels should have class 
 */
(function (){
  var menus;		// list of menu panels
  var clickFirst;	// clcik to make top menu visible
  var topMenu;
  var alert_fun = window.alert;
  var head = document.getElementsByTagName('head')[0];

  function initialize(){
    try{
      if( window.DIALOGS )
	alert_fun = window.DIALOGS.alertDialog;

      menus = document.getElementsByClassName( "menu-panel" );
      clickFirst = document.getElementById( "click-first" );
      topMenu = selfTarget( clickFirst );
    }catch( err ){
      alert_fun( err );
    }
  }
  
  function visibleMenu(){
    for( var i = 0; i < menus.length; i++ ){
      var display = menus[i].style.display;
      if( display == "none" || display == "" )
	;
      else
	return menus[i];
    }
    return null;
  }

  function clicked( event ){
    try{
      var clicked = event.target;
      var curMenu = visibleMenu();
      if( curMenu )
	curMenu.style.display = "none";

      if( clicked == clickFirst ){
	if( ! curMenu )
	  topMenu.style.display = "block";
	return;
      }

      var target;
      if( clicked.matches( "a" ))
	target = selfTarget( clicked );
      else if( clicked.matches( "a>*" ))
	target = selfTarget( clicked.parentElement );

      if( target && target.matches( ".menu-panel" ))
	target.style.display = "block";

    }catch( err ){
      alert_fun( err );
    }
  }

  // Load CSS
  var css = document.createElement( 'link' );
  css.type = 'text/css';
  css.href = 'lib/clickNav.css';
  css.rel  = 'stylesheet';
  head.appendChild(css);


  // Attach event handlers
  document.addEventListener( "DOMContentLoaded", initialize );
  window.addEventListener( "click", clicked, false );

}());
