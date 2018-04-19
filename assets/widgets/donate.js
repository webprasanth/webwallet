! function() {
    var jQuery;
    //load QR code js
    flashloadQRJS();

    function initilizeFLASHWidget() {
        /******** Load jQuery if not present *********/
        if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.12.4') {
            var script_tag = document.createElement('script');
            script_tag.setAttribute("type","text/javascript");
            script_tag.setAttribute("src",
                "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js");
            if (script_tag.readyState) {
              script_tag.onreadystatechange = function () { // For old versions of IE
                  if (this.readyState == 'complete' || this.readyState == 'loaded') {
                      flashscriptLoadHandler();
                  }
              };
            } else {
              script_tag.onload = flashscriptLoadHandler;
            }
            // Try to find the head, otherwise default to the documentElement
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
        } else {
            // The jQuery version on the window is the one we want to use
            jQuery = window.jQuery;
            flashmain();
        }
    }

    /******** Called once jQuery has loaded ******/
    function flashscriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        flashmain(); 
    }

    function flashloadQRJS()
    {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        var domain = getFlashdomainName();
        script_tag.setAttribute("src", domain+"/assets/lib/qrcode.min.js");
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

        script_tag.addEventListener('load', function() {
            initilizeFLASHWidget(); 
        });
    }

    function getFlashdomainName() {
        var scriptfile = document.getElementById('flashWidgetScript');
        var url = scriptfile.src;
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        var protocol = url.split('://')[0];
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        //hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return protocol + '://' +hostname;
    }
   

    function preparflashHTML(address, text, width, number, type, language) {
        var domain = getFlashdomainName();
        var k = '<div><img flash-data-popup-open="flash-popup-'+number+'" style="width:'+width+'px;cursor:pointer" src="'+domain+'/assets/images/widgets/'+type+'_now_'+language+'.png" /></div>';
        k += '<div class="flash-popup" style="width:100%;height:100%;display:none;position:fixed;top:0px;left:0px;background:rgba(0,0,0,0.75);z-index:1" flash-data-popup="flash-popup-'+number+'">';
        k += '<div class="flash-popup-inner" style="max-width:700px;padding:20px;text-align:center;position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);box-shadow:0px 2px 6px rgba(0,0,0,1);border-radius:3px;background:#fff;"><h2>'+text+'</h2><p><h4>'+address+'</h4><div id="flash-qr-image-'+number+'"></div>';
        k += '<a class="flash-popup-close" style="width:30px;height:30px;padding-top:4px;display:inline-block;position:absolute;top:0px;right:0px;transition:ease 0.25s all;-webkit-transform:translate(50%, -50%);transform:translate(50%, -50%);border-radius:1000px;background:rgba(0,0,0,0.8);font-family:Arial, Sans-Serif;font-size:20px;text-align:center;line-height:100%;color:#fff;" flash-data-popup-close="flash-popup-'+number+'" href="#">x</a></div></div>';
        return k;
    }

function flashmain() {
    jQuery(document).ready(function(e) {
        jQuery(".flash-donate-widget").each(function() {
            var number = Math.floor((Math.random() * 100) + 1);
            var address = jQuery(this).attr("data-wallet") ? jQuery(this).attr("data-wallet") : '';
            var language = jQuery(this).attr("data-language") ? jQuery(this).attr("data-language") : 'en';
            var type = jQuery(this).attr("data-type") ? jQuery(this).attr("data-type") : 'donate';
            var text = jQuery(this).attr("data-text") ? jQuery(this).attr("data-text") : ( (type == 'accept') ? 'Send FLASH' : 'Donate FLASH');
            var width = jQuery(this).attr("data-width") ? jQuery(this).attr("data-width") : 300;
            var content = preparflashHTML(address, text, width, number, type, language);
            jQuery(this).html(content);
            jQuery(this).find("a").css({
                "text-decoration": "none",
                color: "#428bca"
            });

            new QRCode(jQuery(this).find('#flash-qr-image-'+number)[0], {text: 'flashcoin:'+address, width: 250 , height: 250});
            
            jQuery(this).find('[flash-data-popup]').on('mouseup', function(e){
                var targeted_popup_class = jQuery(this).attr('flash-data-popup');
                var container = jQuery(this).find('.flash-popup-inner');
                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) 
                {
                    jQuery('[flash-data-popup="' + targeted_popup_class + '"]').hide();
                }
            });
            jQuery(this).find('[flash-data-popup-open]').on('click', function(e)  {
                var targeted_popup_class = jQuery(this).attr('flash-data-popup-open');
                jQuery('[flash-data-popup="' + targeted_popup_class + '"]').fadeIn(350);
                e.preventDefault();
            });
            jQuery(this).find('[flash-data-popup-close]').on('click', function(e)  {
                var targeted_popup_class = jQuery(this).attr('flash-data-popup-close');
                jQuery('[flash-data-popup="' + targeted_popup_class + '"]').hide();
                e.preventDefault();
            });
            var self = this;
            setTimeout(function() {
                jQuery(self).find('#flash-qr-image-'+number+ ' img').css({
                "display": "inline"
            });
            }, 500)
        });
    });
}

}();