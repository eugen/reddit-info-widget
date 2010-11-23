//NOTE: this requires jQuery
reddit = (function() {
  function replaceFields(html, data) {
    for(var prop in data) {
      html = html.replace("$" + prop, data[prop]);
    }
    return html;
  };
  function renderWidgetResponse(json, target) {
    if(json.kind != "Listing" ||
       json.data.children.size == 0) {
      // don't show anything if this url hasn't been submitted to reddit
      return;
    }
    // we only care about the first entry
    var entry = json.data.children[0].data;

    target = $(target);
    target.html(replaceFields(target.html(), entry));
    target.show();
  };

  function renderTopLinksResponse(json, target) {
    target = $(target);
    var template = target.html();
    var children = [];
    $.each(json.data.children, function(idx, entry) {
      //hack so that we have an index
      entry.data.num = idx;
      children.push(replaceFields(template, entry.data));
    });
    target.html(children.join(""));
  };

  return {
    info: function(target) {
      $.ajax({ url: "http://www.reddit.com/api/info.json?url=" + encodeURI(location.href),
        jsonp: "jsonp",
        dataType: "jsonp",
        // the try/catch is ugly, but necessary in case reddit changes their API
        success: function(json) {
          try { renderWidgetResponse(json, target); }
          catch(e) { };
        }
      });
    },
    topPostsForDomain: function(domain, target) {
      $.ajax({ url: "http://www.reddit.com/domain/"+encodeURI(domain)+"/top.json?t=week",
        jsonp: "jsonp",
        dataType: "jsonp",
        // the try/catch is ugly, but necessary in case reddit changes their API or reddit is down
        success: function(json) {
          try { renderTopLinksResponse(json, target); }
          catch(e) { };
        }
      });
    }
  }
})();
