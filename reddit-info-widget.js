//NOTE: this requires jQuery
function loadRedditInfo(template) {
  function processResponse(json) {
    if(json.kind != "Listing" ||
       json.data.children.size == 0) {
      // don't show anything if this url hasn't been submitted to reddit
      return;
    }

    // we only care about the first entry
    var entry = json.data.children[0].data;

    template = $(template);

    template.html(template.html().
      replace("$score", entry.score).
      replace("$downvotes", entry.downs).
      replace("$upvotes", entry.ups).
      replace("$score", entry.score).
      replace("$comment_link", "http://reddit.com" + entry.permalink).
      replace("$comment_count", entry.num_comments));
    template.show();
  };
  $.ajax({ url: "http://www.reddit.com/api/info.json?url=" + encodeURI(location.href),
           jsonp: "jsonp",
           dataType: "jsonp",
           // the try/catch is ugly, but necessary in case reddit changes their API
           success: function(json) { try { processResponse(json); } catch(e) { }; }
  });
}
