//In background.js:
// React when a browser action's icon is clicked.

var manageCookies={
    clear_cookies:function()
    {
        chrome.cookies.getAll({}, function(cookies) {
            for(var i=0; i<cookies.length;i++) {
                chrome.cookies.remove({url: "http://" + cookies[i].domain + cookies[i].path, name: cookies[i].name});
                chrome.cookies.remove({url: "https://" + cookies[i].domain + cookies[i].path, name: cookies[i].name});
            }
        });
    }
}

var strategy=1;
var keyword=[];
var links=[];
var getFlag=false;
var linksLen=0;
var clickLen=0;

var inforCapture=function(str){
    console.log(str);
    var arr=str.split("###");
    strategy = arr[0];
    if(strategy == 2){
         (function(keywords){
            var keyarr = keywords.split(" ");
            for(var i=0;i<keyarr.length;i++){
                keyword.push(keyarr[i]);
            }
         })(arr[1]);

    }
    else if (strategy == 1){
        keyword.push(arr[1]);
    }
    for (var i = 2; i < arr.length; i=i+2) {
       links.push({'titile':arr[i],'url':arr[i+1],'clicked':false});
       linksLen++;
    };
}
var send = {
    get:function(){
        var xhr = new XMLHttpRequest();
        var getURL="http://127.0.0.1:37016/ShowMeKey";
        xhr.open('GET',getURL, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    inforCapture(xhr.responseText);
                }
            }
        }
    },
    reportSuccess:function(){
        var xhr = new XMLHttpRequest();
        var getURL="http://127.0.0.1:37016/WeAreSuccess_Chrome";
        xhr.open('GET',getURL, true);
        xhr.send();
    }
       
}
       


window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    manageCookies.clear_cookies();
    send.get();
    //inforCapture("1###周杰伦###周杰伦_互动百科###http://www.baike.com/wiki/%E5%91%A8%E6%9D%B0%E4%BC%A6###周杰伦JayChouMtime时光网###http://people.mtime.com/943799/###周杰伦将与昆凌完婚自认绯闻多不是好男人###http://www.chinanews.com/yl/2014/06-25/6316391.shtml");
    // inforCapture("2###周杰伦 蔡依琳###蔡依林承认与周杰伦旧情###http://ent.qq.com/a/20130801/005070.htm###3月30日周杰伦蔡依林衡阳演唱会###蔡依林周杰伦在一起13年过往点滴和关于涂鸦的浪漫故事###http://www.19lou.com/forum-125-thread-10111387938958928-1-1.html")
}, false);


chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if(request.type=="hostpage"){
           sendResponse({"keyword":keyword[0]});
        }
        else if(request.type=="searchpage"){
            sendResponse({"mode":strategy,"links":links,"keyword":keyword});
        }
        else if(request.type.indexOf("updateLink")>-1){
            if(!getFlag){
                getFlag=true;
                send.reportSuccess();
            }
            var str=request.type;
            links[parseInt(str[str.length-1])].clicked=true;
            clickLen++;
            if(clickLen!=linksLen){
                var intervals=Math.floor(Math.random()*6+2)*1000;//[2-7秒]
                    setTimeout(function() { 
                             var newURL = "http://www.google.com.hk/";
                             chrome.tabs.create({url: newURL});
                          }, intervals);
        
         
            }
        }
    }

    );


