;(function(){
    var AdRemove = {
        init: function () {

            /**
             * @type {{doms: Array, iframeConf: [*], classOrIdConf: [*]}}
             */
            var self = {
                doms: [],
                iframeConf: [
                    'div iframe',
                ],
                classOrIdConf: ['^ad_', '_ad_', '-ad$', '-ad-', '_adv', 'lbd', 'r300', 'QM_Container_10000', 'f-single-biz', 'append_mark_img', 'J_close layer_close', 'ad-widget-imageplus-', 'baiduimageplus-s', 'logom fl', 'logor fr',
                    'mm_\\d(.*)_\\d().*_\\d(.*)', 'dxy\\d', 'main mb\\d', 'cnblogs_[a-z]\\d'
                ],
            };

            /**
             * build regular experssion
             * @returns {RegExp}
             */
            self.getReg = function () {
                var regStr = '';
                regStr = self.classOrIdConf.join('|');
                return new RegExp('(' + regStr + ')', "gim");
            }

            /**
             * filter all doms which may be advertisement
             * @returns {boolean}
             */
            self.filterDoms = function () {
                var reg = self.getReg();
                var doms = document.getElementsByTagName('*');
                if (doms.length <= 0) return false;
                for (var i in doms) {
                    try {
                        if ((doms[i].id && reg.test(doms[i].id)) || (doms[i].className && reg.test(doms[i].className))) {
                            self.doms.push(doms[i]);
                        }
                    } catch (err) {
                    }
                }

                self.doms.forEach(function (element) {
                    try {
                        $(element).remove();
                    } catch (err) {
                    }
                })
            }


            /**
             * filter advertisement which is created by iframe
             * @returns {boolean}
             */
            self.filterIframe = function () {
                if (self.iframeConf.length <= 0) return false;
                self.iframeConf.forEach(function (element) {
                    try {
                        if($(element).width() <= 300 && $(element).height() <= 250)
                            $(element).remove()
                    } catch (err) {
                    }
                })
            }


            /**
             * filter advertisements from the search results on baidu
             * @returns {boolean}
             */
            self.filterBaidu = function () {
                if ('www.baidu.com' != window.location.host) return false;
                $('#content_left span').filter(function(index){
                    return ($(this).text() == '广告' || $(this).text() == '商业推广');
                }).parentsUntil('#content_left').css({"display" : "none", "visibility" : "hidden"});
                // clear blank
                // $('#content_left').next().css({'clear' : 'left'})
            }

            /**
             * monitor all doms, because of some doms are dynamic loading or ajax
             */
            self.mutation = function () {
                var article = document.body;
                var options = {
                    'childList': true,         //children
                    'attributes': true,        //attributes
                    'subtree': true,
                    // 'characterData' : true,     //change of content or text
                }
                var observer = new MutationObserver(function () {
                    self.clear();
                })
                observer.observe(article, options);
            }

            /**
             * clear operation
             */
            self.clear = function () {
                self.filterIframe();
                self.filterDoms();
                self.filterBaidu();
            }


            return self;

        }
    }

    AdRemove.init().mutation();
})()
