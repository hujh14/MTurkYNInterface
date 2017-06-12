var href = window.location.href;
var href_split = href.split('?');
var base_url = href_split[0];
var query_string = href_split[1];
var params = get_params(query_string);

if (!params["task_id"]) {
  var new_params = {};
  new_params["task_id"] = "example";
  window.location.href = base_url + "?" + build_query_string(new_params);
}

//
// Get Requests
//
// function get_images(num_of_images) {
//     var images = [];
//     for (var i=0; i < num_of_images; i++) {
//       images.push(get_image(i));
//     }
//     return images;
// }
function get_task(callback) {
    var endpoint = base_url + "/task?" + query_string;
    get_async(endpoint, callback);
}
function get_image_url(num) {
    var new_params = {};
    new_params["task_id"] = params["task_id"];
    new_params["image_num"] = num;
    return base_url + "/images?" + build_query_string(new_params);
}

//
// Post Requests
//
// function post_polygons(json) {
//     var endpoint = base_url + "/annotations/polygons?" + query;
//     post(endpoint, json);
// }

function build_query_string(params) {
  var query = ""; 
  for (var key in params) {
    query = query + "&" + key + "=" + params[key];
  }
  return query.substring(1);
}

function get_params(query_string) {
  var params = {};
  if (! query_string) {
    return params;
  } else {
    var query_split = query_string.split("&");
    for (var i in query_split) {
      split = query_split[i].split("=");
      key = split[0];
      value = split[1];
      params[key] = value;
    }
    return params;
  }
}

function get_async(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4){
      if (xhr.status == 200) {
        callback(xhr.responseText);
      } else if (xhr.status == 404) {
        callback("{}");
      }
    }
  }
  xhr.open("GET", url, true); // true for asynchronous 
  xhr.send(null);
}

function post(url, json) {
  xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function () { 
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.responseText);
    }
  }
  var data = JSON.stringify(json);
  xhr.send(data);
}