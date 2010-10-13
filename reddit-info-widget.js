//NOTE: this requires jQuery
function loadRedditInfo(target) {
  function replaceFields(html, data) {
    for(var prop in data) {
      html = html.replace("$" + prop, data[prop]);
    }
    return html;
  };
  function processResponse(json) {
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
  $.ajax({ url: "http://www.reddit.com/api/info.json?url=" + encodeURI(location.href),
           jsonp: "jsonp",
           dataType: "jsonp",
           // the try/catch is ugly, but necessary in case reddit changes their API
           success: function(json) {
             try { processResponse(json); }
             catch(e) { };
           }
  });
}
