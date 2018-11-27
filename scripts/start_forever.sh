#!/bin/bash
# ========================================================================
# $File: start_forever.sh $
# $Date: 2018-10-04 21:33:12 $
# $Revision: $
# $Creator: Jen-Chieh Shen $
# $Notice: See LICENSE.txt for modification and distribution information
#                   Copyright © 2018 by Shen, Jen-Chieh $
# ========================================================================


# Back to root directory.
if ! [[ -n "$TRAVIS" ]]; then
    cd ..
fi

# Run the server.
forever start main.js -o log.txt
