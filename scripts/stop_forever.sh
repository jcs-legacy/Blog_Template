#!/bin/bash
# ========================================================================
# $File: stop_forever.sh $
# $Date: 2018-10-04 21:35:10 $
# $Revision: $
# $Creator: Jen-Chieh Shen $
# $Notice: See LICENSE.txt for modification and distribution information
#                   Copyright © 2018 by Shen, Jen-Chieh $
# ========================================================================


# Back to root directory.
if ! [[ -n "$TRAVIS" ]]; then
    cd ..
fi

# Stop the server.
forever stop main.js
