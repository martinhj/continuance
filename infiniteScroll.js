/* nrkbeta infinite scroll */
(function($) {
    var Scroller, ajaxurl, stats, type, text, totop, timer;
    var isIE = (-1 != navigator.userAgent.search('MSIE'));
    if (isIE) {
        var IEVersion = navigator.userAgent.match(/MSIE\s?(\d+)\.?\d*;/);
        var IEVersion = parseInt(IEVersion[1]);
    }
    Scroller = function(settings) {
        var self = this;
        this.id = settings.id;
        this.body = $(document.body);
        this.window = $(window);
        this.element = ($('#' + settings.id).length) ? $('#' + settings.id) : $('.' + settings.id);
        this.wrapperClass = settings.wrapper_class;
        this.ready = true;
        this.disabled = false;
        this.page = 1;
        this.offset = settings.offset;
        this.currentday = settings.currentday;
        this.order = settings.order;
        this.throttle = false;
        this.handle = '<div id="infinite-handle"><span>' + text.replace('\\', '') + '</span></div>';
        this.click_handle = settings.click_handle;
        this.google_analytics = settings.google_analytics;
        this.history = settings.history;
        this.origURL = window.location.href;
        this.postID = settings.postID;
        this.postTitle = settings.postTitle;
        this.origTitle = document.title;
        this.postUrl = settings.postUrl;
        this.curPage = 0;
        this.the_titles = [];
        this.the_urls = [];
        this.debug = false;
        this.footer = $('#infinite-footer');
        this.footer.wrap = settings.footer;
        this.the_post_url = [];
        this.the_post_title = [];
        this.wpMediaelement = null;
        if (type == 'scroll') {
            this.window.bind('scroll.infinity', function() {
                this.throttle = true;
            });
            self.gotop();
            setInterval(function() {
                if (this.throttle) {
                    this.throttle = false;
                    self.thefooter();
                    self.refresh();
                }
            }, 300);
            self.ensureFilledViewport();
            this.body.bind('post-load', {
                self: self
            }, self.checkViewportOnLoad);
            this.body.bind('post-load', {
                self: self
            }, self.initializeMejs);
        } else if (type == 'click') {
            if (this.click_handle) {
                this.element.append(this.handle);
            }
            this.body.delegate('#infinite-handle', 'click.infinity', function() {
                if (self.click_handle) {
                    $('#infinite-handle').remove();
                }
                self.refresh();
            });
        }
    };
    Scroller.prototype.check = function() {
        var container = this.element.offset();
        if ('object' !== typeof container) {
            return false;
        }
        var bottom = this.window.scrollTop() + this.window.height(),
            threshold = container.top + this.element.outerHeight(false) - (this.window.height() * 2);
        return bottom > threshold;
    };
    Scroller.prototype.render = function(response) {
        this.body.addClass('infinity-success');
        this.element.append(response.html);
        this.body.trigger('post-load', response);
        this.ready = true;
    };
    Scroller.prototype.query = function() {
        return {
            page: this.page,
            currentday: this.currentday,
            order: this.order,
            postID: window.infiniteScroll.settings.postID,
            postID_order: this.postID,
            postTitle: this.postTitle,
            postUrl: this.postUrl,
            scripts: window.infiniteScroll.settings.scripts,
            styles: window.infiniteScroll.settings.styles,
            query_args: window.infiniteScroll.settings.query_args,
            last_post_date: window.infiniteScroll.settings.last_post_date
        };
    };
    Scroller.prototype.gotop = function() {
        var blog = $('#infinity-blog-title');
        blog.attr('title', totop);
        blog.bind('click', function(e) {
            $('html, body').animate({
                scrollTop: 0
            }, 'fast');
            e.preventDefault();
        });
    };
    Scroller.prototype.thefooter = function() {
        var self = this,
            width;
        if ($.type(this.footer.wrap) === "string") {
            width = $('body #' + this.footer.wrap).outerWidth(false);
            if (width > 479)
                this.footer.find('.container').css('width', width);
        }
        if (this.window.scrollTop() >= 350)
            self.footer.animate({
                'bottom': 0
            }, 'fast');
        else if (this.window.scrollTop() < 350)
            self.footer.animate({
                'bottom': '-50px'
            }, 'fast');
    };
    Scroller.prototype.refresh = function() {
        var self = this,
            query, jqxhr, load, loader, color;
        if (this.disabled || !this.ready || !this.check())
            return;
        this.ready = false;
        if (this.click_handle) {
            if (!$('.infinite-loader').length) {
                $('.site-container').append('<span class="infinite-loader"></span>');
            }
            loader = $('.infinite-loader');
        }
        query = $.extend({
            action: 'infinite_transporter'
        }, this.query());
        jqxhr = $.get(infiniteScroll.settings.ajaxurl, query);
        jqxhr.fail(function() {
            if (self.click_handle) {
                loader.hide();
            }
            self.ready = true;
        });
        jqxhr.done(function(response) {
            if (self.click_handle) {
                loader.hide();
            }
            if (!response)
                return;
            response = $.parseJSON(response);
            if (!response || !response.type)
                return;
            if (response.type == 'empty') {
                self.disabled = true;
                self.body.addClass('infinity-end').removeClass('infinity-success');
            } else if (response.type == 'success') {
                if (response.scripts) {
                    $(response.scripts).each(function() {
                        var elementToAppendTo = this.footer ? 'body' : 'head';
                        window.infiniteScroll.settings.scripts.push(this.handle);
                        if (this.extra_data) {
                            var data = document.createElement('script'),
                                dataContent = document.createTextNode("//<![CDATA[ \n" + this.extra_data + "\n//]]>");
                            data.type = 'text/javascript';
                            data.appendChild(dataContent);
                            document.getElementsByTagName(elementToAppendTo)[0].appendChild(data);
                        }
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = this.src;
                        script.id = this.handle;
                        if ('wp-mediaelement' === this.handle) {
                            self.body.unbind('post-load', self.initializeMejs);
                        }
                        if ('wp-mediaelement' === this.handle && 'undefined' === typeof mejs) {
                            self.wpMediaelement = {};
                            self.wpMediaelement.tag = script;
                            self.wpMediaelement.element = elementToAppendTo;
                            setTimeout(self.maybeLoadMejs.bind(self), 250);
                        } else {
                            document.getElementsByTagName(elementToAppendTo)[0].appendChild(script);
                        }
                    });
                }
                if (response.styles) {
                    $(response.styles).each(function() {
                        window.infiniteScroll.settings.styles.push(this.handle);
                        var style = document.createElement('link');
                        style.rel = 'stylesheet';
                        style.href = this.src;
                        style.id = this.handle + '-css';
                        if (this.conditional && (!isIE || !eval(this.conditional.replace(/%ver/g, IEVersion))))
                            var style = false;
                        if (style)
                            document.getElementsByTagName('head')[0].appendChild(style);
                    });
                }
                self.page++;
                self.render.apply(self, arguments);
                if (type == 'click') {
                    if (response.lastbatch) {
                        if (self.click_handle) {
                            $('#infinite-handle').remove();
                        } else {
                            self.body.trigger('infinite-transporter-posts-end');
                        }
                    } else {
                        if (self.click_handle) {
                            self.element.append(self.handle);
                        } else {
                            self.body.trigger('infinite-transporter-posts-more');
                        }
                    }
                }
                if (response.currentday)
                    self.currentday = response.currentday;
                if (response.postID) {
                    self.postID = response.postID;
                    self.postTitle = response.postTitle;
                    self.postUrl = response.postUrl;
                    self.the_post_url.push(response.postUrl);
                    self.the_post_title.push(response.postTitle);
                }
                if (self.google_analytics) {
                    if (typeof self.postID == 'undefined') {
                        var ga_url = self.history.path.replace(/%d/, self.page);
                    } else {
                        var ga_url = response.postPath;
                    }
                    if ('object' === typeof _gaq) {
                        _gaq.push(['_trackPageview', ga_url]);
                    }
                    if ('function' === typeof ga) {
                        ga('send', 'pageview', ga_url);
                    }
                }
            }
        });
        return jqxhr;
    };
    Scroller.prototype.maybeLoadMejs = function() {
        if (null === this.wpMediaelement) {
            return;
        }
        if ('undefined' === typeof mejs) {
            setTimeout(this.maybeLoadMejs, 250);
        } else {
            document.getElementsByTagName(this.wpMediaelement.element)[0].appendChild(this.wpMediaelement.tag);
            this.wpMediaelement = null;
            this.body.bind('post-load', {
                self: this
            }, this.initializeMejs);
        }
    }
    Scroller.prototype.initializeMejs = function(ev, response) {
        if (-1 === response.html.indexOf('wp-audio-shortcode') && -1 === response.html.indexOf('wp-video-shortcode')) {
            return;
        }
        if ('undefined' === typeof mejs) {
            return;
        }
        $(function() {
            var settings = {};
            if (typeof _wpmejsSettings !== 'undefined') {
                settings.pluginPath = _wpmejsSettings.pluginPath;
            }
            settings.success = function(mejs) {
                var autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
                if ('flash' === mejs.pluginType && autoplay) {
                    mejs.addEventListener('canplay', function() {
                        mejs.play();
                    }, false);
                }
            };
            $('.wp-audio-shortcode, .wp-video-shortcode').not('.mejs-container').mediaelementplayer(settings);
        });
    }
    Scroller.prototype.ensureFilledViewport = function() {
        var self = this,
            windowHeight = self.window.height(),
            postsHeight = self.element.height()
        aveSetHeight = 0, wrapperQty = 0;
        if (postsHeight === 0) {
            $(self.element.selector + ' > li').each(function() {
                postsHeight += $(this).height();
            });
            if (postsHeight === 0) {
                self.body.unbind('post-load', self.checkViewportOnLoad);
                return;
            }
        }
        $('.' + self.wrapperClass).each(function() {
            aveSetHeight += $(this).height();
            wrapperQty++;
        });
        if (wrapperQty > 0)
            aveSetHeight = aveSetHeight / wrapperQty;
        else
            aveSetHeight = 0;
        if (postsHeight < windowHeight && (postsHeight + aveSetHeight < windowHeight)) {
            self.ready = true;
            self.refresh();
        } else {
            self.body.unbind('post-load', self.checkViewportOnLoad);
        }
    }
    Scroller.prototype.checkViewportOnLoad = function(ev) {
        ev.data.self.ensureFilledViewport();
    }
    Scroller.prototype.determineURL = function() {
        var self = window.infiniteScroll.scroller,
            windowTop = $(window).scrollTop(),
            windowBottom = windowTop + $(window).height(),
            windowSize = windowBottom - windowTop,
            setsInView = [],
            pageNum = false,
            pageChangeThreshold = 0.1;
        $('.' + self.wrapperClass).each(function() {
            var id = $(this).attr('id'),
                setTop = $(this).offset().top,
                setHeight = $(this).outerHeight(false),
                setBottom = 0,
                setPageNum = $(this).data('page-num');
            if (0 == setHeight) {
                $('> *', this).each(function() {
                    setHeight += $(this).outerHeight(false);
                });
            }
            setBottom = setTop + setHeight;
            var tmp_post_url = typeof self.the_post_url === 'undefined' || typeof self.the_post_url[0] === 'undefined' ? '' : self.the_post_url[0];
            var tmp_post_title = typeof self.the_post_title === 'undefined' || typeof self.the_post_url[0] === 'undefined' ? '' : self.the_post_title[0];
            self.debugInfinity('the_post_url: ' + tmp_post_url);
            self.debugInfinity('the_post_title: ' + tmp_post_title);
            if (setTop < windowTop && setBottom > windowBottom) {
                setsInView.push({
                    'id': id,
                    'top': setTop,
                    'bottom': setBottom,
                    'pageNum': setPageNum,
                    'post_url': tmp_post_url,
                    'post_title': tmp_post_title
                });
            } else if (setTop > windowTop && setTop < windowBottom) {
                setsInView.push({
                    'id': id,
                    'top': setTop,
                    'bottom': setBottom,
                    'pageNum': setPageNum,
                    'post_url': tmp_post_url,
                    'post_title': tmp_post_title
                });
            } else if (setBottom > windowTop && setBottom < windowBottom) {
                setsInView.push({
                    'id': id,
                    'top': setTop,
                    'bottom': setBottom,
                    'pageNum': setPageNum,
                    'post_url': tmp_post_url,
                    'post_title': tmp_post_title
                });
            }
        });
        if (0 == setsInView.length) {
            self.debugInfinity('line 500 Sets in view: ' + setsInView.length);
            pageNum = -1;
            self.debugInfinity('pageNum: ' + pageNum);
        } else if (1 == setsInView.length) {
            self.debugInfinity('line 504 Sets in view: ' + setsInView.length);
            var setData = setsInView.pop();
            self.debugInfinity('( ' + windowBottom + ' - ' + setData.top + ' ) / ' + windowSize + ' = ' + ((windowBottom - setData.top) / windowSize));
            if (((windowBottom - setData.top) / windowSize) < pageChangeThreshold) {
                pageNum = -1;
                self.debugInfinity('pageNum: ' + pageNum);
            } else {
                pageNum = setData.pageNum;
                self.debugInfinity('pageNum: ' + pageNum);
                post_url = setData.post_url;
                post_title = setData.post_title;
            }
        } else {
            self.debugInfinity('line 519 Sets in view: ' + setsInView.length);
            if (jQuery('.infinite-view-' + (self.curPage + 1)).length) {
                var nextPageTop = jQuery('.infinite-view-' + (self.curPage + 1)).offset().top;
                self.debugInfinity('( ' + windowBottom + ' - ' + nextPageTop + ' ) / ' + windowSize + ' = ' + ((windowBottom - nextPageTop) / windowSize));
                if (((windowBottom - nextPageTop) / windowSize) >= pageChangeThreshold) {
                    pageNum = self.curPage + 1;
                    post_url = typeof self.the_post_url === 'undefined' || typeof self.the_post_url[0] === 'undefined' ? '' : self.the_post_url[0];
                    post_title = typeof self.the_post_title === 'undefined' || typeof self.the_post_url[0] === 'undefined' ? '' : self.the_post_title[0];
                    self.debugInfinity('new page!');
                    self.debugInfinity('pageNum: ' + pageNum);
                }
            }
        }
        if ('number' == typeof pageNum) {
            self.debugInfinity('current page: ' + self.curPage);
            if (typeof self.postID == 'undefined') {
                if (pageNum != -1)
                    pageNum++;
                self.updateURL(pageNum);
            } else if (pageNum > self.curPage && window.location.href != post_url) {
                self.curPage = pageNum;
                self.debugInfinity('self.curPage' + self.curPage);
                self.debugInfinity('pageNum' + pageNum);
                if (post_url != '') {
                    history.replaceState(null, null, post_url);
                    self.the_urls[pageNum] = post_url;
                    self.the_titles[pageNum] = post_title;
                    document.title = post_title;
                    jQuery(window).trigger("ajaxview");
                }
                if (typeof self.the_post_url !== 'undefined') {
                    self.the_post_url.shift();
                }
                if (typeof self.the_post_title !== 'undefined') {
                    self.the_post_title.shift();
                }
            } else if (self.the_urls[pageNum] != window.location.href) {
                if (pageNum == -1) {
                    if (!(self.origURL == location.protocol + '//' + location.host + location.pathname)) {
                        history.replaceState(null, null, self.origURL);
                    }
                    if (self.origTitle != undefined) {
                        document.title = self.origTitle;
                    }
                } else {
                    if (!(self.the_urls[pageNum] == location.protocol + '//' + location.host + location.pathname)) {
                        history.replaceState(null, null, self.the_urls[pageNum]);
                    }
                    if (self.the_titles[pageNum] != undefined) {
                        document.title = self.the_titles[pageNum];
                    }
                    jQuery(window).trigger("ajaxview");
                }
            }
        }
    }
    Scroller.prototype.debugInfinity = function(message) {
        var self = window.infiniteScroll.scroller;
        if (self.debug) {
            console.log("Infinity: " + message);
        }
    }
    Scroller.prototype.updateURL = function(page) {
        var self = this,
            offset = self.offset > 0 ? self.offset - 1 : 0,
            pageSlug = -1 == page ? self.origURL : window.location.protocol + '//' + self.history.host + self.history.path.replace(/%d/, page + offset) + self.history.parameters;
        if (window.location.href != pageSlug) {
            history.pushState(null, null, pageSlug);
            jQuery(window).trigger("ajaxview");
        }
    }
    $(document).ready(function() {
        if ('object' != typeof infiniteScroll)
            return;
        ajaxurl = infiniteScroll.settings.ajaxurl;
        stats = infiniteScroll.settings.stats;
        type = infiniteScroll.settings.type;
        text = infiniteScroll.settings.text;
        totop = infiniteScroll.settings.totop;
        infiniteScroll.scroller = new Scroller(infiniteScroll.settings);
        if (!isIE || (isIE && IEVersion >= 10)) {
            $(window).bind('scroll', function() {
                clearTimeout(timer);
                timer = setTimeout(infiniteScroll.scroller.determineURL, 100);
            });
        }
    });
})(jQuery);;

(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

var pageviewDepthCounter = 0;
var DEFAULT_PROPERTIES = {
    anonymizeIp: true,
}
var DIMENSION = {
    id: 'dimension1',
    title: 'dimension2',
    year: 'dimension3',
    month: 'dimension4',
    day: 'dimension5',
    referrerDomain: 'dimension6',
    referrer: 'dimension7',
    sourceID: 'dimension10',
    infiniteScroll: 'dimension11'
};
var METRIC = {
    pageviewDepth: 'metric1'
};

function track(article) {
    var options = Object.assign({}, DEFAULT_PROPERTIES);
    options[DIMENSION.id] = options[DIMENSION.sourceID] = "nrkbeta:" + article.postID;
    options[DIMENSION.title] = article.title.trim();
    options[DIMENSION.year] = article.year;
    options[DIMENSION.month] = article.month;
    options[DIMENSION.day] = article.day;
    options[DIMENSION.infiniteScroll] = 'No';
    options[METRIC.pageviewDepth] = 0;
    if (article.url) {
        options[DIMENSION.infiniteScroll] = 'Yes';
        pageviewDepthCounter++;
        options[METRIC.pageviewDepth] = pageviewDepthCounter;
    }
    if (document.referrer) {
        var url = getUrlObject(document.referrer),
            hostname = url.hostname.replace(/^www\./, '');
        options[DIMENSION.referrerDomain] = url.hostname;
        options[DIMENSION.referrer] = hostname + url.pathname;
    }
    if (!article.url) {
        ga('create', 'UA-2629206-2', 'auto');
    }
    ga('set', options);
    ga('send', 'pageview');
    if (article.url) {
        _sf_async_config.sections = "";
        _sf_async_config.authors = "";
        pSUPERFLY.virtualPage(article.url, article.title);
    }
}

function getUrlObject(referrer) {
    if (typeof window.URL === 'function') {
        return new URL(referrer);
    }
    var anchor = document.createElement('a');
    anchor.href = referrer;
    return {
        hostname: anchor.hostname,
        pathname: anchor.pathname
    };
}
jQuery(function($) {
    jQuery(window).on('ajaxview', function(data) {
        var parser = document.createElement('a');
        parser.href = this.post_url;
        pathname = parser.pathname.split('/');
        options = {
            year: pathname[1],
            month: pathname[2],
            day: pathname[3],
            slug: pathname[4],
            title: this.infiniteScroll.scroller.postTitle,
            postID: this.infiniteScroll.scroller.postID,
            url: parser.pathname
        };
        track(options);
    });
    jQuery(window).on('newPostView', function() {
        pathname = document.location.pathname.split('/');
        options = {
            year: pathname[1],
            month: pathname[2],
            day: pathname[3],
            slug: pathname[4],
            title: $("title").text(),
            postID: $("article").data('post-id'),
        };
        track(options);
    });
    jQuery(window).on('trackPageview', function() {
        options = {
            year: null,
            month: null,
            day: null,
            slug: null,
            title: $("title").text(),
            postID: null,
        };
        track(options);
    });
    $(document).on('click', '.packed .button', function(a) {
        a.preventDefault();
        $(this).parents('.comments').removeClass('packed');
        $(this).parent('.packed-expand').remove();
    });
    $(document).on('click', '.comments-anchor', function(a) {
        $($(this).attr('href')).removeClass('packed');
        $($(this).attr('href')).find('.packed-expand').remove();
    })
    if (window.location.hash && (window.location.hash.indexOf('comment-') != -1 || (window.location.hash.indexOf('respond') != -1))) {
        $('.packed .button').parents('.comments').removeClass('packed');
        $('.comments .packed-expand').remove();
    }
    $('.navigation').each(function() {
        var $nav = $(this);
        $nav.removeClass('show-menu show-search');
        $nav.on('click', '.toggle-menu', function(b) {
            b.preventDefault();
            $nav.toggleClass('show-menu');
        });
        $nav.on('click', '.toggle-search', function(c) {
            c.preventDefault();
            $nav.toggleClass('show-search');
        });
    });
    $("a[data-for]").hover(function() {
        var val = $(this).attr('data-for');
        $("a[data-to='" + val + "']").css('border-color', 'orange');
    }, function() {
        var val = $(this).attr('data-for');
        $("a[data-to='" + val + "']").css('border-color', '#eee');
    });
    $("a[data-to]").hover(function() {
        var val = $(this).attr('data-to');
        $("a[data-for='" + val + "']").css('background', 'orange');
    }, function() {
        var val = $(this).attr('data-to');
        $("a[data-for='" + val + "']").css('background', '#eee');
    });
    $("div[data-for-year]").hover(function() {
        var val = $(this).attr('data-for-year');
        $("a[data-year='" + val + "']").css('border-color', 'orange');
    }, function() {
        var val = $(this).attr('data-for-year');
        $("a[data-year='" + val + "']").css('border-color', '#eee');
    });
});;
jQuery(function($) {
    $('.nrk-masthead').on('click', '.nrk-masthead-menu-switch', function(e) {
        var target = $(this).attr('href');
        e.preventDefault();
        $('.nrk-masthead-menu').find(target).parent('li').toggleClass('nrk-masthead-state-active');
    });
    $('.nrk-masthead').on('click', '.nrk-masthead-mobile-switch', function(i) {
        var target = $(this).attr('href');
        i.preventDefault();
        $(target).toggleClass('nrk-masthead-state-active');
    });
});;
var ak_js = document.getElementById("ak_js");
if (!ak_js) {
    ak_js = document.createElement('input');
    ak_js.setAttribute('id', 'ak_js');
    ak_js.setAttribute('name', 'ak_js');
    ak_js.setAttribute('type', 'hidden');
} else {
    ak_js.parentNode.removeChild(ak_js);
}
ak_js.setAttribute('value', (new Date()).getTime());
var commentForm = document.getElementById('commentform');
if (commentForm) {
    commentForm.appendChild(ak_js);
} else {
    var replyRowContainer = document.getElementById('replyrow');
    if (replyRowContainer) {
        var children = replyRowContainer.getElementsByTagName('td');
        if (children.length > 0) {
            children[0].appendChild(ak_js);
        }
    }
};
! function(a, b) {
    "use strict";

    function c() {
        if (!e) {
            e = !0;
            var a, c, d, f, g = -1 !== navigator.appVersion.indexOf("MSIE 10"),
                h = !!navigator.userAgent.match(/Trident.*rv:11\./),
                i = b.querySelectorAll("iframe.wp-embedded-content");
            for (c = 0; c < i.length; c++)
                if (d = i[c], !d.getAttribute("data-secret")) {
                    if (f = Math.random().toString(36).substr(2, 10), d.src += "#?secret=" + f, d.setAttribute("data-secret", f), g || h) a = d.cloneNode(!0), a.removeAttribute("security"), d.parentNode.replaceChild(a, d)
                } else;
        }
    }
    var d = !1,
        e = !1;
    if (b.querySelector)
        if (a.addEventListener) d = !0;
    if (a.wp = a.wp || {}, !a.wp.receiveEmbedMessage)
        if (a.wp.receiveEmbedMessage = function(c) {
                var d = c.data;
                if (d.secret || d.message || d.value)
                    if (!/[^a-zA-Z0-9]/.test(d.secret)) {
                        var e, f, g, h, i, j = b.querySelectorAll('iframe[data-secret="' + d.secret + '"]'),
                            k = b.querySelectorAll('blockquote[data-secret="' + d.secret + '"]');
                        for (e = 0; e < k.length; e++) k[e].style.display = "none";
                        for (e = 0; e < j.length; e++)
                            if (f = j[e], c.source === f.contentWindow) {
                                if (f.removeAttribute("style"), "height" === d.message) {
                                    if (g = parseInt(d.value, 10), g > 1e3) g = 1e3;
                                    else if (200 > ~~g) g = 200;
                                    f.height = g
                                }
                                if ("link" === d.message)
                                    if (h = b.createElement("a"), i = b.createElement("a"), h.href = f.getAttribute("src"), i.href = d.value, i.host === h.host)
                                        if (b.activeElement === f) a.top.location.href = d.value
                            } else;
                    }
            }, d) a.addEventListener("message", a.wp.receiveEmbedMessage, !1), b.addEventListener("DOMContentLoaded", c, !1), a.addEventListener("load", c, !1)
}(window, document);
