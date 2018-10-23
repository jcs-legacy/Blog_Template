#!/bin/bash
# ========================================================================
# $File: setup.sh $
# $Date: 2018-09-27 17:04:56 $
# $Revision: $
# $Creator: Jen-Chieh Shen $
# $Notice: See LICENSE.txt for modification and distribution information
#                   Copyright © 2018 by Shen, Jen-Chieh $
# ========================================================================


# Back to root directory.
cd ..

# Install global dependecies.
npm install forever -g

# Install project dependecies.
npm install express --save
npm install directory-tree --save
