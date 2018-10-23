@echo off
:: ========================================================================
:: $File: start_forever.bat $
:: $Date: 2018-10-04 21:34:01 $
:: $Revision: $
:: $Creator: Jen-Chieh Shen $
:: $Notice: See LICENSE.txt for modification and distribution information
::                   Copyright © 2018 by Shen, Jen-Chieh $
:: ========================================================================


:: Back to root directory.
cd ..

:: Run the server.
forever start main.js -o log.txt
