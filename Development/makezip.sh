#!/usr/bin/sh
#-----------------------------------------------------------------------------
#
# create a zip file in project root directory called <date-time>install.zip
#
# Application can be installed by unpacking the generated zip file in a
# directory of your choice while maintaing the directory higherarchy.
#
# To load the applicatoin, point your browser to in.html in the applicaton's
# root directory
#
#-----------------------------------------------------------------------------
ZIPFILE=`date -Iseconds`.install.zip
cd ..;zip -r $ZIPFILE *.htm *.html *.css Images/* HELP_files/* lib/* -x lib/tags \*.64
