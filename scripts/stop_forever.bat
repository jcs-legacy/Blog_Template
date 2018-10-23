@echo off
:: ========================================================================
:: $File: stop_forever.bat $
:: $Date: 2018-10-04 21:35:46 $
:: $Revision: $
:: $Creator: Jen-Chieh Shen $
:: $Notice: See LICENSE.txt for modification and distribution information
::                   Copyright © 2018 by Shen, Jen-Chieh $
:: ========================================================================


:: Back to root directory.
cd ..

:: Stop the server.
forever stop main.js
