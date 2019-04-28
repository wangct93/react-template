/// <reference path="jquery-1.4.1.min.js" />
var DM5_NEXT = "";
var DM5_TT;
var DM5_IV = 0;
var DM5_PAGE = 1;
var DM5_REFRESH = false;
var cookiedm = '';
var nextpage = "";
var prepage = "";
var _imagerealwidth = 0;
var _imagerealheight = 0;
var autosite = false;
var ajaxobject = null;
var errorimage;
var nosethistory = false;
$(function () {
  $("#checkAdult").click(function () {
    $.cookie("isAdult", 1, { path: "/", expires: 1 });
    window.location.reload();
  });
  $(':input').focus(function () { DM5_CURRENTFOCUS = 0; }).blur(function () { DM5_CURRENTFOCUS = 1; });

  $("#cp_fun_post").click(function () {
      newreply($(this).attr("val"));
    }
  );
  $(".chapterpager").find("a").each(function () {
    $(this).click(function () {
      if (DM5_REFRESH) {
        window.location.href = $(this).attr("href");
        return false;
      }
      else {
        DM5_PAGE = parseInt($(this).text());
        console.log(DM5_PAGE);
        SetReadHistory(DM5_CID, DM5_MID, DM5_PAGE, DM5_USERID);
        getimage();
        SetFace();
        SetUrl();
        return false;
      }
    });
  });
  if (DM5_USERID <= 0) {
    $.cookie('firsturl', window.location.href, { expires: 1, path: '/', domain: cookiedm });
  }
  else {
    var firsturl = $.cookie('firsturl');
    if (firsturl != null && firsturl != '') {
      var url = window.location.href;
      if (url.indexOf(firsturl)>=0) {
        $.cookie('firsturl', "", { expires: 1, path: '/', domain: cookiedm });
        nosethistory = true;
      }
    }
  }
  if (nosethistory)
  {
    $.ajax({
      url: "dm5.ashx",
      dataType: 'json',
      data: { mid: DM5_MID, lt: 1, action: 'gethistory' },
      type: 'GET',
      success: function (msg) {
        if (msg) {
          if (msg.ChapterId != DM5_CID) {
            $(".win-history-name").html(msg.ChapterName);
            $(".win-history-url").attr("href", '/' + msg.UrlKey + '/');
            $("#win-history").show();
          }
        }
      }
    });
  }
  $(".win-historyclose").click(function () {
    $("#win-history").hide();
    nosethistory = false;
  });
});

function setcookiedm() {
  if (typeof (DM5_COOKIEDOMAIN) != 'undefined' && DM5_COOKIEDOMAIN != '') {
    cookiedm = DM5_COOKIEDOMAIN;
  }
  else {
    cookiedm = '1kkk.com';
  }
}

function SetReadHistory(cid, mid, p, uid) {
  if (!nosethistory)
  {
    if (DM5_USERID > 0) {
      var firsturl = $.cookie('firsturl');
      if (firsturl != null && firsturl != '') {
        var url = window.location.href;
        if (url.indexOf(firsturl) >= 0) {
          $.cookie('firsturl', "", { expires: 1, path: '/', domain: cookiedm });
          nosethistory = true;
        }
      }
    }
  }
  if (nosethistory) {
    return;
  }
  var url = "";
  if (DM5_USERID > 0) {
    url = 'readHistory.ashx';
  }
  else {
    url = "history.ashx";
  }
  //记录阅读历史
  $.ajax({
    url: url,
    dataType: 'json',
    data: { cid: cid, mid: mid, page: p, uid: uid, language: 1 },
    type: 'GET',
    success: function (msg) {
    }
  });
}

function chapterload2(cpid, cptitle, croot, cend) {
  setcookiedm();
  var cpf = $("#cp_img");
  if (cpf.length > 0) {
    $(".cp_tbimg").bind("contextmenu", function (e) {
      return false;
    });
  }
  else {
    $("#showimage").bind("contextmenu", function (e) {
      return false;
    });
  }
  if (typeof (DM5_ADAPTIVE) != 'undefined' && !DM5_ADAPTIVE) {
    //$.cookie("nautosize", null, { path: "/", domain: cookiedm });
  }
  if (typeof (DM5_FAST) != 'undefined' && !DM5_FAST) {
    $.cookie("fastshow", null, { path: "/", domain: cookiedm });
  }

  if (typeof (DM5_ISTABLE) != 'undefined' && DM5_ISTABLE) {
    settablefun();
  }
  else {
    setnotablefun();
  }
  croot = croot.substring(0, croot.length - 1) + "-p";
  var url = window.location.href;
  url = url.split("?")[0];
  var re = /ch\d+-\d+-p(\d+)\/?/;
  var mat = url.match(re);
  if (mat != null && mat.length > 1) {
    DM5_PAGE = parseInt(mat[1])
  };
  if (!DM5_PAGE) {
    DM5_PAGE = 1;
  }
  else {
    if (DM5_PAGE > DM5_IMAGE_COUNT) {
      DM5_PAGE = DM5_IMAGE_COUNT;
    }
  }

  SetReadHistory(DM5_CID, DM5_MID, DM5_PAGE, DM5_USERID)

  if (DM5_PAGE != 1) {
    if (DM5_PAGE == 2) {
      prepage = DM5_CURL;
    }
    else {
      prepage = croot + (DM5_PAGE - 1) + "/";
    }
  }
  if (DM5_PAGE != DM5_IMAGE_COUNT) {
    nextpage = croot + (DM5_PAGE + 1) + "/";
  }
  else {
    nextpage = cend;
  }

  $("#pagelist").change(function () {
    if (DM5_REFRESH) {
      window.location.href = setAnchorUrl($(this).val(), "cuadpg");
    }
    else {
      DM5_PAGE = GetQueryString("p", $(this).val());
      SetReadHistory(DM5_CID, DM5_MID, DM5_PAGE, DM5_USERID);
      getimage();
      SetFace();
      SetUrl();
    }
  });

  $(document).keypress(function (e) {
    var e_key = (e.keyCode == 0 ? e.which : e.keyCode);
    if (e_key == 122) {
      if (prepage && DM5_CURRENTFOCUS) {
        if (showerrorimage()) {
          return;
        }
        if (DM5_REFRESH) {

          window.location.href = setAnchorUrl(prepage, "cuadpg");
        }
        else {

          ShowPre();
        }
      }
    }
    if (e_key == 120 && DM5_CURRENTFOCUS) {
      if (setautosite() == true) {
        return;
      }
      if (nextpage) {
        if (showerrorimage()) {
          return;
        }
        if (DM5_REFRESH) {
          if (DM5_PAGE != DM5_IMAGE_COUNT) {
            window.location.href = setAnchorUrl(nextpage, "cuadpg");
          } else {
            if(nextpage.indexOf('end') != -1){
              ShowEnd();
            }
            else{
              window.location.href = nextpage;
            }
          }
        }
        else {
          ShowNext();
        }
      }
    }
  });

  ajaxloadimage(cpf, true);

}
function reseturl(url, ukey) {
  var u = url.replace("http://", "");
  var urr = u.split('/');
  u = u.replace(urr[0], "");
  var re = /(?:-p(\d+))?(?:-pl(\d+))?\/?(?:#ipg(\d+))?$/;
  re.test(u);
  if (RegExp.$3 != "") {
    var reurl = ukey
    reurl += "-p" + RegExp.$3;
    if (RegExp.$2 != "") {
      reurl += "-pl" + RegExp.$3;
    }
    reurl += "/";
    window.location.href = reurl;
  }
}
//显示上一张图片
function ShowPre() {
  if (showerrorimage()) {
    return;
  }
  if (DM5_PAGE > 1) {
    DM5_PAGE--;
    if (DM5_REFRESH) {
      var _url;
      if (DM5_PAGE != 1) {
        var croot = DM5_CURL.substring(0, DM5_CURL.length - 1) + "-p";
        _url = croot + DM5_PAGE + "/";
      }
      else {
        _url = DM5_CURL;
      }
      window.location.href = setAnchorUrl(_url, "cuadpg");
      return;
    }
    getimage();
    SetFace();
    SetReadHistory(DM5_CID, DM5_MID, DM5_PAGE, DM5_USERID);
    SetUrl();
  }
  else {
    alert("当前已经是第一页");
  }
}
//显示下一张图片
function ShowNext() {
  if (showerrorimage()) {
    return;
  }
  if (DM5_PAGE < DM5_IMAGE_COUNT) {
    DM5_PAGE++;
    if (DM5_REFRESH) {
      var croot = DM5_CURL.substring(0, DM5_CURL.length - 1) + "-p";
      var _url = croot + DM5_PAGE + "/";
      window.location.href = setAnchorUrl(_url, "cuadpg");
      return;
    }
    SetReadHistory(DM5_CID, DM5_MID, DM5_PAGE, DM5_USERID);
    getimage();
    SetFace();
    SetUrl();
  }
  else {
    ShowEnd();
  }
}
//设置页面元素的链接
function SetUrl() {
  var yc = $("iframe.fastrefresh");
  if (yc.length > 0) {
    yc.each(function () { $(this).attr("src", $(this).attr("src")); });
  }
  refresh_yb();
  if (DM5_PAGE == DM5_IMAGE_COUNT) {
    nextpage = DM5_CURL_END;
  }
  else {
    nextpage = getShowUrl(DM5_PAGE + 1);
  }
  if (DM5_PAGE == 1) {
    prepage = "";
  }
  else {
    prepage = getShowUrl(DM5_PAGE - 1);
  }
  setmetapage(DM5_PAGE);
  if (DM5_PAGE > 1) {
    $("#ipg").attr("name", "ipg" + DM5_PAGE);
    DM5_FROM = DM5_FROM.replace(/#ipg(\d)+/, "") + "#ipg" + DM5_PAGE;

  }
  window.location.href = "#itop";
  window.location.href = "#ipg" + DM5_PAGE;

  $(window).scrollTop(0);
  $(".arrow_down").text("第" + DM5_PAGE + "页");
  $(".arrow_up").text("第" + DM5_PAGE + "页");
  $(".pageBar a").removeClass("active");
  $(".pageBar .cuPage_" + DM5_PAGE).addClass("active");

  $("#showimage").css("min-height",$("#cp_image").height() + "px");
}

function setmetapage(p) {
  document.title = document.title.replace(/第[\d]+页/, "第" + p + "页");
  var meta = document.getElementsByTagName('meta');
  for (var i = 0; i < meta.length; i++) {
    if (meta[i].getAttribute('name') == "Description") {
      var tx = meta[i].getAttribute('content').replace(/第[\d]+页/, "第" + p + "页");
      meta[i].setAttribute('content', tx);

    }
  }
}

function getShowUrl(cpg) {
  var _url;
  if (cpg == 1) {
    _url = DM5_CURL;
  }
  else {
    var croot = DM5_CURL.substring(0, DM5_CURL.length - 1) + "-p";
    var _url = croot + cpg + "/";
  }
  return _url;
}

function Imagemouseup(imgobject, cpfobject) {
  imgobject.mouseup(function (e) {
    if (e.button == 0 || e.button == 1) {
      if (setautosite() == true) {
        return;
      }
      if (nextpage) {
        if (showerrorimage()) {
          return;
        }
        if (DM5_REFRESH) {
          if (DM5_PAGE != DM5_IMAGE_COUNT) {
            window.location.href = setAnchorUrl(nextpage, "cuadpg");
          } else {
            if(nextpage.indexOf('end') != -1){
              ShowEnd();
            }
            else{
              window.location.href = nextpage;
            }
          }
        }
        else {
          ShowNext();
        }

      }
    }
    if (e.button == 2) {
      if (showerrorimage()) {
        return;
      }
      if (DM5_REFRESH && prepage) {
        window.location.href = setAnchorUrl(prepage, "cuadpg");
      }
      else {
        ShowPre();
      }
    };
  })
}
//获取url参数
function GetQueryString(sProp, source) {
  var re = new RegExp("-" + sProp + "([^\\-/]*)", "i");

  var a = re.exec(source);

  if (a == null)

    return "";

  return a[1];

}

function SetFace() {
  $("#c_page").text(DM5_PAGE);
  $("#pagelist").val(DM5_CURL.substring(0, DM5_CURL.length - 1) + "-p" + DM5_PAGE + "/");
  $("#chapterpage").val(DM5_PAGE);
  DM5_FLOAT_INDEX = DM5_PAGE;
  if (typeof (fn_tc_open) == "function") {
    fn_tc_open();
  }
  if (typeof (fn_tc) == "function" && typeof (tc_norefresh) == "function") {
    tc_norefresh();
  }
}

function pagerlink(p, pcount) {
  var html = "";
  var maxlink = 10;
  if (pcount < 1 || p > pcount) {
    return "";
  }
  var midle = maxlink / 2;
  if (pcount <= maxlink) {
    for (var i = 1; i <= pcount; i++) {
      if (i == p) {
        html += "<span class=\"current\">" + i + "</span>";
      }
      else {
        if (i != 1) {
          html += "<a>" + i + "</a>";

        }
        else {
          html += "<a>" + i + "</a>";
        }
      }

    }
  }
  else {
    for (var i = 1; i <= maxlink; i++) {
      if (i > 1 && i < 10) {
        if (p > midle) {
          if (i == 2) {
            html += "...";
            continue;
          }
          if ((i == maxlink - 1) && (p > midle) && ((p + midle) < pcount)) {
            html += "...";
            continue;
          }
          if ((p + midle) < pcount) {
            if ((p - midle + i - 1) == p) {
              html += "<span class=\"current\">" + (p - midle + i - 1) + "</span>";

            }
            else {
              html += "<a>" + (p - midle + i - 1) + "</a>";

            }
          }
          else {
            if (pcount - (maxlink - i) == p) {
              html += "<span class=\"current\">" + (pcount - (maxlink - i)) + "</span>";
            }
            else {
              html += "<a>" + (pcount - (maxlink - i)) + "</a>";

            }
          }

        }
        else {
          if ((i == maxlink - 1) && (pcount > maxlink)) {
            html += "...";
            continue;
          }
          if (i == p) {
            html += "<span class=\"current\">" + i + "</span>";
          }
          else {
            html += "<a>" + i + "</a>";
          }
        }
      }
      else {
        if (i == 1) {
          if (p == i) {
            html += "<span class=\"current\">" + i + "</span>";
          }
          else {
            html += "<a>" + i + "</a>";
          }
        }
        if (i == maxlink) {
          if (p == pcount) {
            html += "<span class=\"current\">" + pcount + "</span>";
          }
          else {
            html += "<a>" + pcount + "</a>";
          }
        }
      }

    }
  }
  return html;
}

//获取当前页图片
function getimage() {
  var cpf = $("#cp_img");
  $(".chapterpager").html(pagerlink(DM5_PAGE, DM5_IMAGE_COUNT)).find("a").each(function () {
    var pgt = $(this).text();
    var _url = getShowUrl(pgt);
    $(this).attr("href", _url);
    $(this).click(
      function () {
        if (DM5_REFRESH) {
          window.location.href = setAnchorUrl(_url, "cuadpg");
          return false;
        }
        DM5_PAGE = parseInt(pgt);
        SetUrl();
        SetReadHistory(DM5_CID, DM5_MID, DM5_PAGE, DM5_USERID);
        getimage();
        SetFace();
        return false;
      }
    );
  });
  ajaxloadimage(cpf, false);
}

function showload(cpfobject) {
  if (typeof (DM5_LOADIMAGEURL) != "undefined") {
    if (cpfobject.length > 0) {
      $(".cp_tbimg").css("vertical-align", "top");
      cpfobject.html("<p id='imgloading' style='z-index: 100;text-align:center;color:#666;'><img style=\"margin-right:10px;\" oncontextmenu=\"return false;\" src='" + DM5_LOADIMAGEURL + "'>加载中<br/></p>");
      //$("#cp_img").css("position", "relative");
      $("#imgloading").css("position", "absolute");
      $("#imgloading").css("left", "50%");
      $("#imgloading").css("margin-left", "-85px");
      $("#imgloading").css("top", "50%");
    }
    else {
      if ($.cookie("isLight") == "off") {
        $("#showimage").html("<p id='imgloading' style='z-index: 100;text-align:center;color:#666;'><img style=\"margin-right:10px;\" oncontextmenu=\"return false;\" src='" + DM5_LOADIMAGEURL + "'>加载中<br/></p>");
      }
      else {
        $("#showimage").html("<p id='imgloading' style='z-index: 100;text-align:center;color:#666;'><img style=\"margin-right:10px;\" oncontextmenu=\"return false;\" src='" + DM5_LOADIMAGEURL + "'>加载中<br/></p>");
      }
      $("#showimage").css("position", "relative");
      $("#imgloading").css("position", "absolute");
      $("#imgloading").css("left", "50%");
      $("#imgloading").css("top", "50%");
      $("#imgloading").css("margin-left", "-85px");
    }
  }
}

function hideload() {
  if (typeof (DM5_LOADIMAGEURL) != "undefined") {
    if ($(".cp_tbimg").length > 0) {
      $(".cp_tbimg").css("vertical-align", "top");
    }

    if ($("#imgloading").length > 0) {
      $("#imgloading").hide();
    }
    if ($("#cp_image").length > 0) {
      $("#cp_image").show();
    }
  }
}



function resetimagesize() {
  var win_width = 0;
  var imageobj = $("#cp_image");
  var cpfobject = $("#cp_img");
  var prewidth = _imagerealwidth;
  var preheight = -1;
  if (autosite) {
    if (cpfobject.length > 0) {
      win_width = $(window).width() - $(".cp_tbfu").width() - $(".cp_tbmore").width() - 20;
    }
    else {
      win_width = ($(window).width() - 20);
    }
    if (_imagerealwidth > win_width) {
      imageobj.width(win_width);
      prewidth = win_width;
      var h = Math.round(_imagerealheight * (win_width / _imagerealwidth));
      imageobj.height(h);
      preheight = h;
    }
  }
  else {
    imageobj.width("auto");
    imageobj.height("auto");
  }
  if (cpfobject.length > 0 && !DM5_REFRESH) {
    var iwidth = prewidth;

    var tobject = $(".cp_tbimg");
    var minwd = 756;
    if (iwidth != 0) {
      minwd = (iwidth + 4);
    }
    tobject.css('min-width', minwd + 'px');
    var userAgent = window.navigator.userAgent.toLowerCase();
    var ie6 = ! -[1, ] && !window.XMLHttpRequest;
    var ie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
    if ((ie6 || ie7) && iwidth != 0) {
      tobject.width(minwd);
      cpfobject.width(minwd - 6);
    }
  }
  if (!DM5_REFRESH && cpfobject.length == 0) {
    if (preheight != -1) {
      $("#showimage").css('min-height', (preheight + 8) + 'px');
    }
    else {
      $("#showimage").css('min-height', (_imagerealheight + 8) + 'px');
    }
  }
}
function setautosite() {
  if (autosite) {
    if (_imagerealwidth * 0.7 > $("#cp_image").width()) {
      $("#cp_image").width(_imagerealwidth);
      $("#cp_image").height(_imagerealheight);
      return true;
    }
  }
  return false;
}
function ajaxloadimage(cpfobject, isrefreshad) {
  var mkey = '';
  if ($("#dm5_key").length > 0) {
    mkey = $("#dm5_key").val();
  }
  if (!DM5_REFRESH && $("#cp_image").length > 0) {
    $("#cp_image").css("width", "auto");
    $("#cp_image").css("height", "auto");
  }
  showload(cpfobject);
  if (ajaxobject != null) {
    ajaxobject.abort();
    ajaxobject = null;
  }
  var currenpg = DM5_PAGE;
  ajaxobject = $.ajax({
    url: 'chapterfun.ashx',
    data: { cid: DM5_CID, page: DM5_PAGE, key: mkey, language: 1, gtk: 6, _cid: DM5_CID, _mid: DM5_MID, _dt: DM5_VIEWSIGN_DT, _sign: DM5_VIEWSIGN },
    type: 'GET',
    error: function (msg) {
    },
    success: function (msg) {
      if (msg != '') {
        var arr;
        eval(msg);
        arr = d;
        if (typeof (d_c) != 'undefined') {
          errorimage = d_c;
        }
        var ishide = false;
        if (typeof (hd_c) != 'undefined' && hd_c.length > 0 && typeof (isrevtt) != "undefined") {
          ishide = true;
        }
        var html;
        var cd;
        if (cpfobject.length > 0) {
          html = "<img src=\"" + arr[0] + "\" style=\"";
          if (ishide) {
            html += "display:none;";
          }
          html += "cursor:pointer;\" oncontextmenu=\"return false;\" id=\"cp_image\" ";
          html += "/>";
          if (ishide) {
            html += "<img src=\"" + hd_c[0] + "\" style=\"";
            html += "cursor:pointer;\" oncontextmenu=\"return false;\" id=\"cp_image2\" ";
            html += "/>";
          }

        } else {
          html = "<img src=\"" + arr[0] + "\" style=\"";
          if (ishide) {
            html += "display:none;";
          }
          html += "cursor:pointer;border:2px solid #111; padding:2px;background:white;\" oncontextmenu=\"return false;\" id=\"cp_image\"  ";
          html += "/>";
          if (ishide) {
            html += "<img src=\"" + hd_c[0] + "\" style=\"";
            html += "cursor:pointer;border:2px solid #111; padding:2px;background:white;\" oncontextmenu=\"return false;\" id=\"cp_image2\" ";
            html += "/>";
          }
        }
        cd = $(html);
        Imagemouseup(cd, cpfobject);
        if (typeof (DM5_LOADIMAGEURL) != "undefined") {
          if (cpfobject.length > 0) {
            cpfobject.append(cd);
          }
          else {
            $("#showimage").append(cd);
          }
        }
        else {
          if (cpfobject.length > 0) {
            cpfobject.html(cd);
          }
          else {
            $("#showimage").html(cd);
          }
        }
        var isready = false;
        if (ishide) {
          if (typeof (DM5_LOADIMAGEURL) != "undefined") {
            if ($(".cp_tbimg").length > 0) {
              $(".cp_tbimg").css("vertical-align", "top");
            }

            if ($("#imgloading").length > 0) {
              $("#imgloading").hide();
            }
          }
        }
        else {
          $("#cp_image").load(function () {
            hideload();
            if (errorimage != null && errorimage.length > 0 && typeof (isrevtt) != "undefined") {
              loadimage(errorimage, 1, DM5_CID);
            }
            else {
              loadimage(arr, 1, DM5_CID);
            }
          });
          if (currenpg == DM5_PAGE) {
            imageReady(arr[0], function () { if (currenpg != DM5_PAGE) { return; } _imagerealheight = this.height; _imagerealwidth = this.width; if (!isready) { isready = true; resetimagesize(); } $("#imgloading").fadeTo(2000, 0.1); }, function () {
              if (currenpg != DM5_PAGE) { return; } hideload(); if (!isready) { resetimagesize(); }
            }, function () { hideload(); });

          }
        }

        $("#showimage").attr("title", "");
        if (isrefreshad) {
          $("#adjs_id div").css("visibility", "hidden");
          setTimeout(function () {
            SetAdPosation()
          }, 100);
        }
      }
    }
  });
}

function ShowEnd() {
  //$("#divEnd").show();
  //canview = false;
  if (typeof (promotionre) != 'undefined' && promotionType == 2 && promotionre > 0) {
    window.location.href = DM5_CURL_PROURL;
  } else {
    $('#last-mask').show();
    $('#last-win').show();
    //window.location.href = DM5_CURL_END;
  }
}

function SetAdPosation() {
  $("#adjs_id div").css("visibility", "");
}

function loadimage(arr, index, cid) {
  if (!IsCookieEnabled()) return;
  var cval = getnextvalue(cid);
  if ((cval - DM5_PAGE + 1) >= arr.length) {
    return;
  }
  if ((cval - DM5_PAGE) >= index) {
    index++;
    loadimage(arr, index, cid);
    return;
  }
  if (index >= arr.length)
    return;
  imageReady(arr[index], function () { }, function () {
    cval = DM5_PAGE + index;
    var dm5imgcooke = $.cookie('dm5imgcooke');
    var rs;
    var cv = cid + "|" + cval;
    if (dm5imgcooke) {
      var v = dm5imgcooke.split(',');
      for (var i = 0; i < v.length; i++) {
        var c = v[i].split('|');
        if (c[0] == cid && c[1]) {
          rs = parseInt(c[1]);
          var raRegExp = new RegExp(cid + "\\|\\d+", "ig");
          dm5imgcooke = dm5imgcooke.replace(raRegExp, "");
          dm5imgcooke = dm5imgcooke.replace(",,", ",");
          if (dm5imgcooke.substr(0, 1) == ",")
            dm5imgcooke = dm5imgcooke.substring(1, dm5imgcooke.length);
          if (dm5imgcooke.substr(dm5imgcooke.length - 1, 1) == ",")
            dm5imgcooke = dm5imgcooke.substr(0, dm5imgcooke.length - 1);
          break;
        }
      }
      dm5imgcooke += (dm5imgcooke == "" ? "" : ",") + cv;
      if (dm5imgcooke.split(',').length > 10) {
        dm5imgcooke = dm5imgcooke.substring(dm5imgcooke.indexOf(",") + 1, dm5imgcooke.length);
      }
    }
    else
      dm5imgcooke = cv;
    $.cookie('dm5imgcooke', dm5imgcooke, { expires: 1, path: '/', domain: cookiedm });
    index++;
    loadimage(arr, index, cid);
  });
}

function getnextvalue(cid) {
  var dm5imgcooke = $.cookie('dm5imgcooke');
  var rs;
  if (dm5imgcooke) {
    var v = dm5imgcooke.split(',');
    for (var i = 0; i < v.length; i++) {
      var c = v[i].split('|');
      if (c[0] == cid && c[1]) {
        rs = parseInt(c[1]);
        break;
      }
    }
  }
  if (rs) {
    return rs;
  }
  else {
    return 0;
  }
}

var imageReady = (function () {
  var list = [], intervalId = null,

    // 用来执行队列
    tick = function () {
      var i = 0;
      for (; i < list.length; i++) {
        list[i].end ? list.splice(i--, 1) : list[i]();
      };
      !list.length && stop();
    },

    // 停止所有定时器队列
    stop = function () {
      clearInterval(intervalId);
      intervalId = null;
    };

  return function (url, ready, load, error) {
    var onready, width, height, newWidth, newHeight,
      img = new Image();

    img.src = url;

    // 如果图片被缓存，则直接返回缓存数据
    if (img.complete) {
      ready.call(img);
      load && load.call(img);
      $("#showimage").css("min-height",$("#cp_image").height() + "px");
      return;
    };

    width = img.width;
    height = img.height;

    // 加载错误后的事件
    img.onerror = function () {
      error && error.call(img);
      onready.end = true;
      img = img.onload = img.onerror = null;
    };

    // 图片尺寸就绪
    onready = function () {
      newWidth = img.width;
      newHeight = img.height;
      if (newWidth !== width || newHeight !== height ||
        // 如果图片已经在其他地方加载可使用面积检测
        newWidth * newHeight > 1024
      ) {
        ready.call(img);
        onready.end = true;
      };
    };
    onready();

    // 完全加载完毕的事件
    img.onload = function () {
      $("#showimage").css("min-height",$("#cp_image").height() + "px");
      // onload在定时器时间差范围内可能比onready快
      // 这里进行检查并保证onready优先执行
      !onready.end && onready();

      load && load.call(img);

      // IE gif动画会循环执行onload，置空onload即可
      img = img.onload = img.onerror = null;
    };

    // 加入队列中定期执行
    if (!onready.end) {
      list.push(onready);
      // 无论何时只允许出现一个定时器，减少浏览器性能损耗
      if (intervalId === null) intervalId = setInterval(tick, 40);
    };
  };
})();

function IsCookieEnabled() {
  var v = $.cookie('dm5cookieenabletest');
  if (v && v == 1)
    return true;
  else {
    var result = false;

    $.cookie('dm5cookieenabletest', 1, { expires: 1, path: '/', domain: cookiedm });
    var v = $.cookie('dm5cookieenabletest');
    if (v && v == 1)
      result = true;
    return result;
  }
}

function setPageAnchorUrl() {
  var anchorobj = $("#cuadpg");
  if (anchorobj.length < 1) {
    return
  };
  var anchorpre = $("#s_pre a");
  var anchorohref = "";
  if (anchorpre.length > 0) {
    anchorohref = anchorpre.attr("href");
    if (typeof (anchorohref) != "undefined" && anchorohref != "" && anchorohref.endsWith("/")) {
      anchorohref = setAnchorUrl(anchorohref, "cuadpg");
      anchorpre.attr("href", anchorohref)
    }
  };
  $("#search_fy a").each(function () {
    anchorohref = $(this).attr("href");
    if (typeof (anchorohref) != "undefined" && anchorohref != "" && anchorohref.endsWith("/")) {
      anchorohref = setAnchorUrl(anchorohref, "cuadpg");
      $(this).attr("href", anchorohref);
    }
  });
  $(".chapter_fy a").each(function () {
    anchorohref = $(this).attr("href");
    if (typeof (anchorohref) != "undefined" && anchorohref != "" && anchorohref.endsWith("/")) {
      anchorohref = setAnchorUrl(anchorohref, "cuadpg");
      $(this).attr("href", anchorohref);
    }
  });
  if (DM5_PAGE != DM5_IMAGE_COUNT) {
    anchorpre = $("#s_next a");
    if (anchorpre.length > 0) {
      anchorohref = anchorpre.attr("href");
      if (typeof (anchorohref) != "undefined" && anchorohref != "" && anchorohref.endsWith("/")) {
        anchorohref = setAnchorUrl(anchorohref, "cuadpg");
        anchorpre.attr("href", anchorohref);
      }
    }
  }
};

function setAnchorUrl(souchpageurl, anchorid) {
  //    var anchorobj = $("#" + anchorid);
  //    if (anchorobj.length > 0) {
  //        var anchorname = anchorobj.attr("name");
  //        if (typeof (anchorname) != "undefined" && anchorname != "") {
  //            return souchpageurl + "#" + anchorname;
  //        }
  //    };
  return souchpageurl;
};

function ChangeDateFormat(time) {
  if (time != null) {
    var date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hour = date.getHours();
    var miniute = date.getMinutes();
    var second = date.getSeconds();

    return date.getFullYear() + "-" + month + "-" + currentDate + " " + hour + ":" + miniute + ":" + second;
  }
}

function refreshloadmoreshow(oldslength) {
  if (oldslength >= 10) {
    if ($("#loadmoretizi").length != 1) {
      $("#loadmore").html("");
      var content = "<div class=\"morepl1\"><div><a id=\"loadmoretizi\" href=\"javascript:void(0)\">更多评论</a></div></div>";
      content = content + "<a href=\"" + DM5_TIEBATopicTag + "-" + DM5_TIEBATOPICID + "-p2\" style=\"display: block;margin-top: 9px;padding-right: 5px;\">+接着查看 <strong>";
      if (DM5_TIEBATOPICRuleType == "Hua") {
        content = content + DM5_TIEBAZJFN;
      }
      else {
        content = content + DM5_TIEBAZJXSFN;
      }
      content = content + "</strong> 评论！<font class=\"hongzi\">(" + DM5_TIEBAZJPLS + ")</font></a>";
      $("#loadmore").append(content);
      $("#loadmoretizi").click(function () {
        loadmoretiziclick();
      });
    }
  }
  else {
    $("#loadmore").html("");
  }
}

function loadmoretiziclick() {
  var obj = $("#quanbupl");
  if (typeof (DM5_TIEBAOLDMAXID) != 'undefined' && DM5_TIEBANEXTMAXID != DM5_TIEBAOLDMAXID) {
    DM5_TIEBANEXTMAXID = DM5_TIEBAOLDMAXID;
    $("#loadmoretizi").text("正在加载中..");
    $.ajax({
      url: 'tiebarefresh.ashx',
      type: 'POST',
      data: { tid: DM5_TIEBATOPICID, maxid: DM5_TIEBAOLDMAXID, cptype: 'loadmore' },
      dataType: 'json',
      error: function (result) {
        alert("访问异常！");
      },
      success: function (result) {
        if (!result.HaiYouData) {
          $("#loadmoretizi").remove();
        }
        if (result.List.length > 0) {
          $("#loadmoretizi").text("更多评论");
          DM5_TIEBAOLDMAXID = result.List[result.List.length - 1].ID;
          hideLastItemborderbottom("show");
          fillData($("#oldstiezi"), result.List, 0, result.List.length - 1);
          hideLastItemborderbottom("hide");
        }
        showborderbottom();
      }
    });
  }
}

jQuery.cookie = function (name, value, options) {
  if (typeof value != 'undefined') {
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString();
    }
    var path = options.path ? '; path=' + (options.path) : '';
    var domain = options.domain ? '; domain=' + (options.domain) : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};
if (typeof String.prototype.endsWith != "function") {
  String.prototype.endsWith = function (A) {
    return this.slice(-A.length) == A;
  }
};

function hideLastItemborderbottom(type) {
  var obj = $("#oldstiezi dl:last");
  if (obj != 'undefined') {
    if (type == "hide") {
      obj.css("border-bottom", "0");
    }
    if (type == "show") {
      obj.css("border-bottom", "1px dashed #e6e7e1");
    }
  }
}

function setautosize(item) {
  if($(item).hasClass("active")){
    $.cookie("nautosize", false, { path: "/", domain:  cookiedm, expires: 365 });
    autosite = false;
    $(item).removeClass("active");
  }
  else{
    $.cookie("nautosize", true, { path: "/", domain: cookiedm, expires: 365 });
    autosite = true;
    $(item).addClass("active");
  }
}

function settablefun() {
  if ($("#cp_fun_zsy").length > 0) {
    if ($.cookie("nautosize") != null) {
      $("#cp_fun_zsy").attr("val", "true");
      $("#cp_fun_zsy").addClass("cked");
      setautosize();
    }
    else {
      autosite = false;
      $("#cp_fun_zsy").attr("val", "");
      $("#cp_fun_zsy").removeClass("cked");
    }
    $("#cp_fun_zsy").click(
      function () {
        if ($(this).attr("val") != "true") {
          $(this).attr("val", "true");
          $(this).addClass("cked");
          setautosize();
          resetimagesize();
        }
        else {
          $(this).attr("val", "");
          $(this).removeClass("cked");
          //$.cookie("nautosize", null, { path: "/", domain: cookiedm });
          autosite = false;
          resetimagesize();
        }
      }
    );
  }
}

function setnotablefun() {
  if ($("#dv_fun_zsybt").length > 0) {
    if ($.cookie("nautosize") != null) {
      $("#dv_fun_zsybt").attr("val", "true");
      $("#dv_fun_zsybt").addClass("cked");
      setautosize();
    }
    else {
      autosite = false;
      $("#dv_fun_zsybt").attr("val", "");
      $("#dv_fun_zsybt").removeClass("cked");
    }
    $("#dv_fun_zsybt").click(
      function () {
        if ($(this).attr("val") != "true") {
          $(this).attr("val", "true");
          $(this).addClass("cked");
          setautosize();
          resetimagesize();
        }
        else {
          $(this).attr("val", "");
          $(this).removeClass("cked");
          //$.cookie("nautosize", null, { path: "/", domain: cookiedm });
          autosite = false;
          resetimagesize();
        }
      }
    );
  }
  if ($("#dv_fun_jsbt").length > 0) {
    if ($.cookie("fastshow") == null || $.cookie("fastshow") == "true") {
      $("#dv_fun_jsbt").attr("val", "true");
      $("#dv_fun_jsbt").addClass("cked");
      setnorefresh();
    }
    else {
      DM5_REFRESH = true;
      $("#dv_fun_jsbt").attr("val", "");
      $("#dv_fun_jsbt").removeClass("cked");
      $.cookie("fastshow", false, { path: "/", domain: cookiedm });
    }
    $("#dv_fun_jsbt").click(
      function () {
        if ($(this).attr("val") == "true") {
          DM5_REFRESH = true;
          $(this).attr("val", "");
          $(this).removeClass("cked");
          $.cookie("fastshow", false, { path: "/", domain: cookiedm });
        }
        else {
          $(this).attr("val", "true");
          $(this).addClass("cked");
          setnorefresh();
        }
      }
    );
  }



  if ($("#cbAutosize").length > 0) {
    if ($.cookie("nautosize") != null) {
      $("#cbAutosize").attr("checked", true)
      setautosize();
    }
    else {
      autosite = false;
      $("#cbAutosize").attr("checked", false)
    }
    $("#cbAutosize").click(function () {
      if ($(this).attr("checked")) {
        setautosize();
      }
      else {
        autosite = false;
        //$.cookie("nautosize", null, { path: "/", domain: cookiedm });
      }
    });
  }

  // if ($("#cbNorefresh").length > 0) {
  //     if ($.cookie("norefresh") == null || $.cookie("norefresh") == "true") {
  //         $("#cbNorefresh").attr("checked", true);
  //         $.cookie("norefresh", true, { path: "/" });
  //         setnorefresh();
  //     }
  //     else {
  //         DM5_REFRESH = true;
  //         $("#cbNorefresh").attr("checked", false)
  //         $.cookie("norefresh", false, { path: "/" });
  //     }
  //     $("#cbNorefresh").click(function () {
  //         if ($(this).attr("checked")) {
  //             $.cookie("norefresh", true, { path: "/" });
  //             setnorefresh();
  //         }
  //         else {
  //             $.cookie("norefresh", false, { path: "/" });
  //             DM5_REFRESH = true;
  //         }
  //     });
  // }
  // else {
  //     //$.cookie("norefresh", null, { path: "/" });
  // }
}

function setnorefresh() {
  $.cookie("fastshow", true, { path: "/", domain: cookiedm });
  DM5_REFRESH = false;
  $(".s_pre").click(
    function () {
      ShowPre();
      return false;
    }
  );
  $(".s_next").click(
    function () {
      ShowNext();
      return false;
    }
  );
  $(".pageBar a").each(function () {
    var pgt = $(this).attr("data-pgt");
    $(this).click(function () {
      if (pgt != DM5_PAGE) {
        DM5_PAGE = parseInt(pgt);
        SetReadHistory(DM5_CID, DM5_MID, DM5_PAGE, DM5_USERID);
        getimage();
        SetFace();
        SetUrl();
      }
      return false;
    });
  });
}

function showborderbottom() {
  var existLoadMore = $("#loadmoretizi");
  var obj = $("#quanbupl");
  if (obj.length > 0) {
    if (existLoadMore.length > 0) {
      obj.css("border-bottom", "none");
    }
    else {
      obj.css("border-bottom", "1px solid #b1c0d0");
    }
  }
}

function showerrorimage() {
  if (typeof (errorimage) == 'undefined' || errorimage == null || errorimage.length == 0) {
    return false;
  }
  var cpfobject = $("#cp_img");;
  if ($("#cp_image").length > 0) {
    $("#cp_image").css("width", "auto");
    $("#cp_image").css("height", "auto");
  }
  showload(cpfobject);
  var currenpg = DM5_PAGE;
  var html;
  var cd;
  if (cpfobject.length > 0) {
    html = "<img src=\"" + errorimage[0] + "\" style=\"cursor:pointer;\" oncontextmenu=\"return false;\" id=\"cp_image\" ";
    html += "/>";

  } else {
    html = "<img src=\"" + errorimage[0] + "\" style=\"cursor:pointer;border:2px solid #111; padding:2px;background:white;\" oncontextmenu=\"return false;\" id=\"cp_image\"  ";
    html += "/>";
  }

  cd = $(html);
  if (typeof (DM5_LOADIMAGEURL) != "undefined") {
    if (cpfobject.length > 0) {
      cpfobject.append(cd);
    }
    else {
      $("#showimage").append(cd);
    }
  }
  else {
    if (cpfobject.length > 0) {
      cpfobject.html(cd);
    }
    else {
      $("#showimage").html(cd);
    }
  }
  var isready = false;
  $("#cp_image").load(function () {
    hideload();
  });
  if (currenpg == DM5_PAGE) {
    imageReady(errorimage[0], function () { if (currenpg != DM5_PAGE) { return; } _imagerealheight = this.height; _imagerealwidth = this.width; if (!isready) { isready = true; resetimagesize(); } $("#imgloading").fadeTo(2000, 0.1); }, function () {
      if (currenpg != DM5_PAGE) { return; } hideload(); if (!isready) { resetimagesize(); }
    }, function () { hideload(); });

  }
  errorimage = null;
  Imagemouseup(cd, cpfobject);
  $("#showimage").attr("title", "");
  return true;
}

function refresh_yb(){
  if($('.asyRefresh').length > 0){
    var yb_arr = $('.asyRefresh');
    for(var i=0;i<yb_arr.length;i++){
      var yb_i = yb_arr.eq(i);
      var s1 = yb_i.find("script:first").html();
      yb_i.children().remove();
      var ga = document.createElement('script');
      ga.type = 'text/javascript';
      ga.text = s1;
      yb_i[0].appendChild(ga);
    }
    adsbygoogle = null;
    execute();
  }
}


eval(function (p, a, c, k, e, d) {
  e = function (c) {
    return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
  };
  if (!''.replace(/^/, String)) {
    while (c--) d[e(c)] = k[c] || e(c);
    k = [function (e) {
      return d[e]
    }];
    e = function () {
      return '\\w+'
    };
    c = 1;
  }
  ;
  while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
  return p;
}('2 5=\'\';2 3=\'\'+\'1\'+\'7\'+\'1\'+\'4\'+\'1\'+\'e\'+\'4\'+\'6\'+\'d\'+\'e\'+\'8\'+\'7\'+\'b\'+\'0\'+\'d\'+\'c\';$("#9").a(3);', 15, 15, '||var|hihu76h||guidkey|||f|dm5_key|val||||'.split('|'), 0, {}))
