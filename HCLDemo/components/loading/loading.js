/*
 * artemisUI  Library
 * @Descript	: loading 读取中组件
 * @Author		: maojialei@longshine.com
 * @Depend      : jquery.js(1.8 or later)
 * @version	    :2015.06.12
 *
 */
(function($) {
    var pluginName = 'loading';

    var defaults = {
        content:$("#tab-content") ,
        state:"show"    //show:显示，hide:隐藏
    };


    /**
     *
     * @param element
     * @param options
     * @constructor
     */
    function Loading( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._init();
        this.Layer();
    }

    Loading.prototype._init = function () {
        var me = this;
        var element = me.element,
            options = me.options,
            state = options.state,
            background = options.background,
            content = options.content;
        //console.log("init")

    };


    Loading.prototype.Layer = function () {
        var me = this;
        var element = me.element,
            options = me.options,
            state = options.state,
            content = options.content;

        if(state == "show"){
            me.showLayer();
        }else if(state == "hide"){
            me.closeLayer();

        }
    };

    /**
     * 显示遮罩
     * @private
     */
    Loading.prototype.showLayer = function () {
        var me = this;
        me._init();

        var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

        var bodyHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var bodyWidth = document.documentElement.clientWidth || document.body.clientWidth;
        var LayerHeight = $(".artemisUI-loading-default").height();
        var LayerWidth = $(".artemisUI-loading-default").width();

        var top = (bodyHeight - LayerHeight)/2;
        var left = (bodyWidth - LayerWidth)/2;

        var layer = $("<div id='artemisUI-Layer'></div>");
        layer.css({
            height:scrollHeight,
            width:scrollWidth
        });
        $("body").append(layer);

        $(window).resize(function(){

            var bodyHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var bodyWidth = document.documentElement.clientWidth || document.body.clientWidth;


            var top = (bodyHeight - LayerHeight)/2;
            var left = (bodyWidth - LayerWidth)/2;
            $(".artemisUI-loading-default").css({"top":top,"left":left });
        });

        $(".artemisUI-loading-default").css({ "display": "block","top":top,"left":left });


    };

    /**
     * 影藏遮罩
     * @private
     */
    Loading.prototype.closeLayer = function () {
        $("#artemisUI-Layer").remove();
        $(".artemisUI-loading-default").css("display","none");
        return;
    };



    $.fn.artemisUILoading= function ( options ) {
        if($.isEmptyObject(options)){
            return;
        }
        return new Loading($(this),options);
    }

})(jQuery);
