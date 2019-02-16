/**
 * $File: main.js $
 * $Date: 2018-09-27 20:38:08 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2018 by Shen, Jen-Chieh $
 */

"use strict";


/**
 * jQuery entry.
 */
(function ($) {

  /* Others */
  var layerNum = -1;

  /* Collect Require Components. */
  var scrollBarTitle = $('#scroll-bar-title');
  var indexPos = $('#index-pos');

  /* Content */
  var content = $('#content');

  /* Buttons */

  /* Regular Decoration */
  var sbContainer = $('#scroll-bar-container');

  /* Search Input */
  var searchForm = $('#search-input-container form');
  var searchInputBorder = $('#search-input-border');
  var searchInputContainer = $('#search-input-container');
  var searchInput = $('#search-input-container input');
  var searchBtn = $('#search-btn');

  /* Search Result */
  var searchRes = null;

  /* Conversion Keywords */
  var slashKey = "_sl_";
  var spaceKey = "_sp_";

  var obKey      = "_ob_";   // open bracket '('.
  var cbKey      = "_cb_";   // close bracket ')'.
  var ocbKey     = "_ocb_";  // open curly bracket '{'.
  var ccbKey     = "_ccb_";  // close curly bracket '}'.
  var osbKey     = "_osb_";  // open square bracket '['.
  var csbKey     = "_csb_";  // close square bracket ']'.

  var atKey      = "_at_";   // At key '@'.
  var caretKey   = "_cr_";   // Caret key '^'.
  var bqKey      = "_bq_";   // Back quote key '`'.
  var tildeKey   = "_tl_";   // Tilde key '~'.
  var hashKey    = "_hs_";   // Hash key '#'.
  var dollarKey  = "_dl_";   // Dollar '$' key.
  var percentKey = "_pc_";   // Percent '%' key.
  var andKey     = "_and_";  // And '&' key.
  var plusKey    = "_pl_";   // And '+' key.
  var quoteKey   = "_qt_";   // Quote ' key.
  var exclaimKey = "_ex_";   // Exclamation mark key '!'.

  var periodKey  = "_pri_";  // Period '.' key.
  var equalKey      = "_eq_";   // Equals ' =' key.
  var commaKey     = "_cma_";  // Comma ',' key.
  var semicolonKey      = "_sc_";   // Semicolon ';' key.


  //---------------------- Functions ---------------------------//

  /* Search Input */
  searchInputContainer.click(function () {
    searchInput.focus();
  });

  searchBtn.click(function () {
    doSearch();
  });


  // Prevent search default submit action.
  searchForm.submit(function(e) { e.preventDefault(); });

  searchInput.keypress(function (e) {
    if (e.which != 13)
      return;

    doSearch();
  });

  /**
   * Do the search.
   */
  function doSearch() {
    let searchKeyword = searchInput.val().trim();

    // If search for nothing just return it.
    if (searchKeyword == "")
      return;

    /* IMPORTANT(jenchieh): Apply conversion rule. */
    // This rule must match the server side.
    searchKeyword = searchKeyword.replace(/ /g, spaceKey);

    // Load to search page.
    addParamToURL('search', searchKeyword, true);
  }

  function showChildren(obj) { obj.children().show(); }
  function hideChildren(obj) { obj.children().hide(); }

  /* Open the SB directory and turn the arrow text off. */
  function openSBDir(items, arrow) {
    showChildren(items);
    arrow.text("-");
  }

  /* Close the SB directory and turn the arrow text on. */
  function closeSBDir(items, arrow) {
    hideChildren(items);
    arrow.text("+");
  }

  /* Toggle the SB directory and turn the arrow text on/off. */
  function toggleSBDir(items, arrow) {
    if (arrow.text() == "+")
      openSBDir(items, arrow);
    else
      closeSBDir(items, arrow);
  }


  /* Register button event */
  function addSBDirButtonEvent() {
    let sbDir = $('.sb-dir');
    let arrows = $('.arrow');
    let arrowsText = $('.arrow + span');

    arrows.click(function (e) {
      // Stop overlaping `li' tag's click event trigger.
      e.stopPropagation();

      let items = $(this).siblings('ul');

      toggleSBDir(items, $(this));
    });

    arrowsText.click(function (e) {
      // Stop overlaping `li' tag's click event trigger.
      e.stopPropagation();

      let items = $(this).siblings('ul');
      let arrow = $(this).siblings('.arrow');

      toggleSBDir(items, arrow);
    });

    let currentContentPage = getUrlParameter('page');

    let pathDir = [];

    if (currentContentPage != null)
      pathDir = currentContentPage.split(slashKey);

    let currentPathDir = pathDir[0];

    let dirLayer = 0;

    // Initialize by URL param.
    sbDir.each(function () {
      let items = $(this).find('ul');
      let arrow = $(this).find('.arrow');

      let path = $(this).attr('id');

      if (currentPathDir == path) {
        openSBDir(items, arrow);

        // Add up directory layer.
        ++dirLayer;

        // Setup the next directory tree.
        currentPathDir += slashKey + pathDir[dirLayer];
      } else {
        // Close the directory as default.
        closeSBDir(items, arrow);
      }
    });
  }
  addSBDirButtonEvent();  // Do it once at initialize time.

  function addSBFileButtonEvent() {
    let sbFile = $('.sb-file');

    sbFile.click(function (e) {
      // Stop overlaping `div' tag's click event trigger.
      e.stopPropagation();

      let contentPage = $(this).attr('id');

      addParamToURL("page", contentPage, true);
    });

    let currentContentPage = getUrlParameter('page');

    let selectedFilename = [];

    if (currentContentPage != null) {
      selectedFilename = currentContentPage.split(slashKey);
      selectedFilename = selectedFilename[selectedFilename.length - 1];
    }

    // Check if current file selected. Highlight it!
    sbFile.each(function () {
      let filePath = $(this).attr('id');

      let filename = filePath.split(slashKey);
      filename = filename[filename.length - 1];

      // Found the selected file?
      if (selectedFilename == filename) {
        $(this).addClass('sb-file-selected');

        // Scroll to that file selected.
        sbContainer.animate({
          /*
           * NOTE(jenchieh): 100 is the height from the header,
           * and plus 10 just to offset a bit more to look better.
           */
          scrollTop: $(this).offset().top - 110
        }, 500);
      }
    });
  }
  addSBFileButtonEvent();  // Do it once at initialize time.

  /* Check if the page id <div> exists? */
  function checkPageFound (pageObj) { return (pageObj.length != 0); }

  /* Initialize the page. */
  function initPage() {
    initGlobalPage();

    initBlogPage();
  }

  /* Initialize components that exists in all pages.*/
  function initGlobalPage() {
    loadCurrentContentPage();

    searchInput.attr('size', si_input_size);
  }

  /* Initialize the script reference page. */
  function initBlogPage() {
    scrollBarTitle.text("Blog Post");
    searchInput.attr('placeholder', si_blog_placeholder);

    /* Make AJAX request. */
    {
      /* Get API index. */
      $.ajax({
        url: '../../blog_index_data',
        type: 'GET',
        contentType: "application/json",
        success : function (data) {
          let dir = JSON.parse(data);

          createIndexWithDir(dir.children, indexPos);

          addSBDirButtonEvent();
          addSBFileButtonEvent();
        },
        error : function (e) {
          console.log(e.message);
        }
      });
    }
  }

  /* Create index with directory. */
  function createIndexWithDir(dir, inParent) {

    inParent.append("<ul></ul>");

    let parent = inParent.find('ul');

    ++layerNum;

    let currentDir = "";

    for (let index = 0;
         index < dir.length;
         ++index)
    {

      let pathObj = dir[index];

      if (pathObj.path.charAt(0) != "/")
        currentDir = pathObj.path;

      let sbType = "sb-dir";
      if (pathObj.type == "file") {
        sbType = "sb-file";
      }

      let isDir = (pathObj.type != "file");

      let newPath = pathObj.path;
      newPath = newPath.replace(/\//g, slashKey);  // slash to key.
      // Remove extension if file.
      if (!isDir)
        newPath = newPath.replace(/\.[^/.]+$/, "");

      /* IMPORTANT(jenchieh): Apply conversion rule. */
      newPath = applyConversionRule(newPath);

      let dirOrFileName = pathObj.name;
      dirOrFileName = dirOrFileName.replace(/\.[^/.]+$/, "");  // Remove extension if there is.


      parent.append("<li class=" + sbType +" id=" + newPath + "></li>");

      let newPathNode = $('#' + newPath);

      let htmlDirOrFileName = "<span>" + dirOrFileName + "</span>";

      if (isDir) {
        htmlDirOrFileName = "<div class='arrow'>+</div>" + htmlDirOrFileName;
      }

      newPathNode.append(htmlDirOrFileName);

      newPathNode.addClass(getLayerByNum(layerNum));

      if (pathObj.children != null && pathObj.children.length != 0) {
        createIndexWithDir(pathObj.children, newPathNode);
      }
    }

    --layerNum;
  }

  /* Get layer number class string. */
  function getLayerByNum(layerNum) { return "sb-layer-" + layerNum; }


  /**
   * Load the current content page if defined. If not load the default
   * content page.
   */
  function loadCurrentContentPage() {
    // Get the current content page in the URL.
    let currentContentPage = getUrlParameter('page');
    // Is the page the search page?
    let searchKeyword = getUrlParameter('search');

    let contentPageName = "";

    // If keyword does not define load load normal page instead of search page.
    if (searchKeyword == null) {
      // If the page does not define load the intro page.
      if (currentContentPage == null)
        contentPageName = intro_content;
      else {
        /* IMPORTANT(jenchieh): Apply conversion rule. */
        contentPageName = applyConversionRule(currentContentPage, true);
      }
    } else {
      contentPageName = search_content;

      /* IMPORTANT(jenchieh): Apply conversion rule. */
      searchKeyword = applyConversionRule(searchKeyword, true);

      searchInput.attr('value', searchKeyword);
    }

    loadContentPage(contentPageName);
  }

  /**
   * Load the content HTML file.
   * @param { typename } contentPage : Content page name.
   */
  function loadContentPage(contentPage) {
    let fullPath = contentPage + content_extension;

    // Load content page base on the current page tab.
    if (contentPage == intro_content) {
      cleanParamFromURL();
    } else if (contentPage == search_content) {

      let searchKeyword = getUrlParameter('search');
      let reqUrl = '';

      reqUrl = '../../search_blog/' + searchKeyword;

      $.ajax({
        url: reqUrl,
        type: 'GET',
        contentType: "application/json",
        success : function (data) {
          searchRes = JSON.parse(data);

          // Try to append search result.
          appendSearchResult();
        },
        error : function (e) {
          console.log(e.message);
        }
      });
    }
    // Else we load either blog page.
    else {
      fullPath = "./doc/" + fullPath;
    }

    content.load(
      // NOTE(jenchieh): This allow url have spaces.
      //
      // TOPIC(jenchieh): jquery “load” for path contain spaces - Need help !
      // SOURCE(jenchieh): https://stackoverflow.com/questions/3741672/jquery-load-for-path-contain-spaces-need-help
      encodeURIComponent(fullPath),
      // Done loading callback.
      function () {
        /* Reload possible changing variables. */
        {
          let manualName = $('.blog-name');
          let copyright = $('.copyright');
          let announcement = $('.announcement-text');
          let homepageLink = $('.homepage-link');

          manualName.text(blog_name);
          copyright.text(copyright_text);
          announcement.text(announcement_text);
          homepageLink.text(homepage_text);
          homepageLink.attr('href', homepage_url);

          let searchKeyword = getUrlParameter('search');
          if (searchKeyword != null) {
            let searchKeywordText = $('.search-keyword');

            searchKeyword = searchKeyword.split(spaceKey).join(" ");

            searchKeywordText.text(searchKeyword);

            // Try to append search result.
            appendSearchResult();
          }
        }

        /* Code block logic here.. */
        {
          let codeBlocks = $('.code-block');

          codeBlocks.each(function (index) {
            let codeText = $(this).text();

            // Add certain rules
            codeText = codeAreaRule(codeText);

            // Clean the text.
            $(this).text("");

            // Turn it into HTML.
            $(this).html(codeText);
          });
        }

        /* Code inline logic here.. */
        {
          let codeInline = $('.code-inline');

          codeInline.each(function (index) {
            let codeText = $(this).text();

            // Add certain rules
            codeText = codeAreaRule(codeText);

            // Clean the text.
            $(this).text("");

            // Turn it into HTML.
            $(this).html(codeText);
          });
        }
      });
  }

  /**
   * Convert the plain text to HTML.
   *
   * @param { typename } codeText : code plain text.
   */
  function codeAreaRule(codeText) {
    // Replace all line break to '<br/>'.
    codeText = codeText.replace(/(?:\r\n|\r|\n)/g, '<br/>');

    // Replace all space to &nbsp.
    codeText = codeText.replace(/\s/g, '&nbsp;');

    // Add certain rules
    codeText = codeText.replace(/-<-/g, '&lt;');
    codeText = codeText.replace(/->-/g, '&gt;');

    return codeText;
  }

  /**
   * Add a parameter to current URL.
   *
   * @param { string } paramName : parameter name.
   * @param { string } paramValue : parameter value.
   * @param { boolean } clean : Clean param?
   */
  function addParamToURL(paramName, paramValue, clean) {
    let url = document.location.href;

    // Remove all parameters?
    if (clean)
      url = url.split('?')[0];

    if (url.indexOf('?') != -1) {
      url += "&";
    } else {
      url += "?";
    }

    url += paramName + "=" + paramValue;

    // Set URL and reload the page.
    document.location = url;
  }

  /**
   * Apply search result visual client.
   */
  function appendSearchResult() {
    let searchResDiv = $('#search-result-block');

    // Check is the HTML page loaded?
    if (searchResDiv == null ||
        // Check if the data come in?
        searchRes == null)
    {
      return;
    }

    for (let index = 0;
         index < searchRes.length;
         ++index)
    {
      let pathObj = searchRes[index];

      // Remove extension from show path.
      let showPath = pathObj.path;
      showPath = showPath.replace(/.html/g, '');

      /* IMPORTANT(jenchieh): Apply conversion rule. */
      let urlPath = applyConversionRule(showPath);

      /* Here to design the HTML content for search result. */
      let resultHTML =
          '<div class="search-result-one">' +
          '<a href="?page=' + urlPath + '">' +
          showPath +
          '</a>' +
          '</div>';

      searchResDiv.append(resultHTML);
    }
  }

  /**
   * Apply conversion rules.
   * @param { string } rawStr : Unrefined string that have not apply
   * conversion rules.
   * @param { boolean } revert : Convert back.
   */
  function applyConversionRule(rawStr, revert = false) {
    if (revert) {
      rawStr = rawStr.split(slashKey).join("/");
      rawStr = rawStr.split(spaceKey).join(" ");

      rawStr = rawStr.split(obKey).join("(");
      rawStr = rawStr.split(cbKey).join(")");
      rawStr = rawStr.split(ocbKey).join("{");
      rawStr = rawStr.split(ccbKey).join("}");
      rawStr = rawStr.split(osbKey).join("[");
      rawStr = rawStr.split(csbKey).join("]");

      rawStr = rawStr.split(atKey).join("@");
      rawStr = rawStr.split(bqKey).join("`");
      rawStr = rawStr.split(caretKey).join("^");
      rawStr = rawStr.split(tildeKey).join("~");
      rawStr = rawStr.split(hashKey).join("#");
      rawStr = rawStr.split(dollarKey).join("$");
      rawStr = rawStr.split(percentKey).join("%");
      rawStr = rawStr.split(andKey).join("&");
      rawStr = rawStr.split(plusKey).join("+");
      rawStr = rawStr.split(quoteKey).join("'");
      rawStr = rawStr.split(exclaimKey).join("!");

      rawStr = rawStr.split(periodKey).join(".");
      rawStr = rawStr.split(equalKey).join("=");
      rawStr = rawStr.split(commaKey).join(",");
      rawStr = rawStr.split(semicolonKey).join(";");
    } else {
      rawStr = rawStr.replace(/\//g, slashKey);
      rawStr = rawStr.replace(/ /g, spaceKey);

      rawStr = rawStr.replace(/\(/g, obKey);
      rawStr = rawStr.replace(/\)/g, cbKey);
      rawStr = rawStr.replace(/\{/g, ocbKey);
      rawStr = rawStr.replace(/\}/g, ccbKey);
      rawStr = rawStr.replace(/\[/g, osbKey);
      rawStr = rawStr.replace(/\]/g, csbKey);

      rawStr = rawStr.replace(/\@/g, atKey);
      rawStr = rawStr.replace(/\`/g, bqKey);
      rawStr = rawStr.replace(/\^/g, caretKey);
      rawStr = rawStr.replace(/\~/g, tildeKey);
      rawStr = rawStr.replace(/\#/g, hashKey);
      rawStr = rawStr.replace(/\$/g, dollarKey);
      rawStr = rawStr.replace(/\%/g, percentKey);
      rawStr = rawStr.replace(/\&/g, andKey);
      rawStr = rawStr.replace(/\+/g, plusKey);
      rawStr = rawStr.replace(/\'/g, quoteKey);
      rawStr = rawStr.replace(/\!/g, exclaimKey);

      rawStr = rawStr.replace(/\./g, periodKey);
      rawStr = rawStr.replace(/\=/g, equalKey);
      rawStr = rawStr.replace(/\,/g, commaKey);
      rawStr = rawStr.replace(/\;/g, semicolonKey);
    }
    return rawStr;
  }


  /**
   * jQuery program entry.
   */
  function jQueryMain() {
    initPage();
  }
  jQueryMain();  // Execute the program entry.

}(this.jQuery));


/**
 * Get URL parameter.
 *
 * SOURCE(jenchieh): https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
 * @param { string } paramName : name of the parameter.
 */
function getUrlParameter(paramName) {
  let sPageURL = decodeURIComponent(window.location.search.substring(1));
  let sURLVariables = sPageURL.split('&');

  for (let index = 0; index < sURLVariables.length; index++) {
    let sParameterName = sURLVariables[index].split('=');

    if (sParameterName[0] === paramName) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }

  return null;
}

/**
 * Clean all URL parameters.
 */
function cleanParamFromURL() {
  let url = document.location.href;

  let splitUrl = url.split('?');
  url = splitUrl[0];

  // Make sure there are not param after url.
  if (splitUrl.length == 2)
    document.location = url;
}
