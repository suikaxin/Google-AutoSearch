var href = window.location.href;


autoRegister();


function nextPage(links){ //links-title url clicked
    var divs=document.getElementsByClassName("rc");
    if(divs.length==0)
    {
      divs=null;
      divs=document.getElementsByClassName("g");
    }
    var index=0;
    var findFlag=false;
    for(index=0;index<divs.length;index++){
        var atag=divs[index].getElementsByTagName("a")[0];
        console.log(atag.href);
        console.log(atag.innerHTML.replace(/[^\u4e00-\u9fa5]/gi,""));
        //change part
        for (var i = 0; i < links.length; i++) {
            if(links[i].clicked)
                continue;
            else
            {
                if(atag.href==links[i].url||atag.innerHTML.replace(/[^\u4e00-\u9fa5]/gi,"").indexOf(links[i].title)>-1)
                {
                   //open this link
                   links[i].clicked=true;
                   atag.click(function(){});
                   //get();
                   send_bg_msg_updatelinks(i);
                   findFlag=true;
                   break;
               }
            }
        }
        if(findFlag)
          break;
       
    }
    if(index==divs.length)
    {

        setTimeout(function() { 
            var spanclick=null;
            var nav=document.getElementById('nav');


            var spans=nav.getElementsByTagName('span');
            for(var j=0;j<spans.length;j++){
                if(spans[j].innerHTML.indexOf('下一页')>-1||(spans[j].innerHTML.indexOf('下一頁')>-1)){
                    spanclick=spans[j];
                    spanclick.click(function(){});
                    break;
                }
            }
        }, 2000);
        //pn.click(function(){});
    }

}
function getElementsByName(tag,names){
    var tags=document.getElementsByTagName(tag);
    for(var i=0;i<tags.length;i++)
    {
        for(var j=0;j<names.length;j++){
            if(tags[i].name==names[j])
                return tags[i];
        }
    }
}

function send_bg_msg_info(){
    chrome.extension.sendRequest({type:"hostpage"},function(response){
        googleHostPage(response.keyword);
    });
}

function send_bg_msg_stratery(){
     chrome.extension.sendRequest({type:"searchpage"},function(response){
       googleSearchPage(response.mode,response.links,response.keyword);
    });
}
function send_bg_msg_updatelinks(index){
     var indexStr=index.toString();
     chrome.extension.sendRequest({type:"updateLink"+index},function(response){
       console.log("123");
    });
}

//only search onne when in http://google.com.hk/ search lw+keyword and submit the form
function googleHostPage(keyword){

    var search_value=keyword;
    var queryText=getElementsByName("input",["q"]);
    if(queryText)queryText.value=search_value;
    setTimeout(function() { 
                            var btn=getElementsByName("input",["btnK","btnG"]);
                            btn.click(function(){
                            });
                          }, 2000);
}

function googleSearchPage(mode,links,keyword){
    if(mode==1){
        setTimeout(function() {
                   nextPage(links);
        },2000);
    }
    else if(mode == 2){
        setTimeout(function(){
             var searchTextValue=getElementsByName("input",["q"]);
             if(searchTextValue.value.indexOf(" ")>-1)
                nextPage(links);
             else{
                if(searchTextValue.value== keyword[0]){
                    setTimeout(function(){
                        searchTextValue.value = keyword[1];
                    },2000);
                }
                else if(searchTextValue.value== keyword[1]){
                     setTimeout(function(){
                        searchTextValue.value= keyword[0]+" "+keyword[1];
                    },2000);
                }
                setTimeout(function(){
                    var form=getElementsByName("button",["btnG"]);
                                         form.click(function(){});
                                     },2000);

             }
        },2000);
       
     } 
}
//search 3 times when in http://googole.com.hk search lw and sumbit

function autoRegister()
{
    if(href=="http://www.google.com.hk/"||href=="https://www.google.com.hk/"||href=="http://www.google.com.hk/?gws_rd=ssl"||href=="https://www.google.com.hk/?gws_rd=ssl")
    {   
        send_bg_msg_info();

    }
    else if(href.indexOf("http://www.google.com.hk/search?")>-1||href.indexOf("https://www.google.com.hk/search?")>-1){
        send_bg_msg_stratery();;
    }
}


function hashCheck() {

    if(location.hash){
        send_bg_msg_stratery();
    }
}
window.addEventListener('hashchange', hashCheck);
