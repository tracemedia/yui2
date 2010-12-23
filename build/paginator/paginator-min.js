(function(){var d=YAHOO.util.Dom,f=YAHOO.lang,b=f.isObject,e=f.isFunction,c=f.isArray,a=f.isString;function g(k){var n=g.VALUE_UNLIMITED,l,h,i,j,m;k=b(k)?k:{};this.initConfig();this.initEvents();this.set("rowsPerPage",k.rowsPerPage,true);if(g.isNumeric(k.totalRecords)){this.set("totalRecords",k.totalRecords,true);}this.initUIComponents();for(l in k){if(k.hasOwnProperty(l)){this.set(l,k[l],true);}}h=this.get("initialPage");i=this.get("totalRecords");j=this.get("rowsPerPage");if(h>1&&j!==n){m=(h-1)*j;if(i===n||m<i){this.set("recordOffset",m,true);}}}f.augmentObject(g,{id:0,ID_BASE:"yui-pg",VALUE_UNLIMITED:-1,TEMPLATE_DEFAULT:"{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}",TEMPLATE_ROWS_PER_PAGE:"{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink} {RowsPerPageDropdown}",ui:{},isNumeric:function(h){return isFinite(+h);},toNumber:function(h){return isFinite(+h)?+h:null;}},true);g.prototype={_containers:[],_batch:false,_pageChanged:false,_state:null,initConfig:function(){var h=g.VALUE_UNLIMITED;this.setAttributeConfig("rowsPerPage",{value:0,validator:g.isNumeric,setter:g.toNumber});this.setAttributeConfig("containers",{value:null,validator:function(l){if(!c(l)){l=[l];}for(var k=0,j=l.length;k<j;++k){if(a(l[k])||(b(l[k])&&l[k].nodeType===1)){continue;}return false;}return true;},method:function(i){i=d.get(i);if(!c(i)){i=[i];}this._containers=i;}});this.setAttributeConfig("totalRecords",{value:0,validator:g.isNumeric,setter:g.toNumber});this.setAttributeConfig("recordOffset",{value:0,validator:function(j){var i=this.get("totalRecords");if(g.isNumeric(j)){j=+j;return i===h||i>j||(i===0&&j===0);}return false;},setter:g.toNumber});this.setAttributeConfig("initialPage",{value:1,validator:g.isNumeric,setter:g.toNumber});this.setAttributeConfig("template",{value:g.TEMPLATE_DEFAULT,validator:a});this.setAttributeConfig("containerClass",{value:"yui-pg-container",validator:a});this.setAttributeConfig("alwaysVisible",{value:true,validator:f.isBoolean});this.setAttributeConfig("updateOnChange",{value:false,validator:f.isBoolean});this.setAttributeConfig("id",{value:g.id++,readOnly:true});this.setAttributeConfig("rendered",{value:false,readOnly:true});},initUIComponents:function(){var j=g.ui,i,h;for(i in j){if(j.hasOwnProperty(i)){h=j[i];if(b(h)&&e(h.init)){h.init(this);}}}},initEvents:function(){this.createEvent("render");this.createEvent("rendered");this.createEvent("changeRequest");this.createEvent("pageChange");this.createEvent("beforeDestroy");this.createEvent("destroy");this._selfSubscribe();},_selfSubscribe:function(){this.subscribe("totalRecordsChange",this.updateVisibility,this,true);this.subscribe("alwaysVisibleChange",this.updateVisibility,this,true);this.subscribe("totalRecordsChange",this._handleStateChange,this,true);this.subscribe("recordOffsetChange",this._handleStateChange,this,true);this.subscribe("rowsPerPageChange",this._handleStateChange,this,true);this.subscribe("totalRecordsChange",this._syncRecordOffset,this,true);},_syncRecordOffset:function(k){var h=k.newValue,j,i;if(k.prevValue!==h){if(h!==g.VALUE_UNLIMITED){j=this.get("rowsPerPage");if(j&&this.get("recordOffset")>=h){i=this.getState({totalRecords:k.prevValue,recordOffset:this.get("recordOffset")});this.set("recordOffset",i.before.recordOffset);this._firePageChange(i);}}}},_handleStateChange:function(i){if(i.prevValue!==i.newValue){var j=this._state||{},h;j[i.type.replace(/Change$/,"")]=i.prevValue;h=this.getState(j);if(h.page!==h.before.page){if(this._batch){this._pageChanged=true;}else{this._firePageChange(h);}}}},_firePageChange:function(h){if(b(h)){var i=h.before;delete h.before;this.fireEvent("pageChange",{type:"pageChange",prevValue:h.page,newValue:i.page,prevState:h,newState:i});}},render:function(){if(this.get("rendered")){return this;}var l=this.get("template"),m=this.getState(),k=g.ID_BASE+this.get("id")+"-",j,h;for(j=0,h=this._containers.length;j<h;++j){this._renderTemplate(this._containers[j],l,k+j,true);}this.updateVisibility();if(this._containers.length){this.setAttributeConfig("rendered",{value:true});this.fireEvent("render",m);this.fireEvent("rendered",m);}return this;},_renderTemplate:function(j,n,m,l){var p=this.get("containerClass"),o,k,h;if(!j){return;}d.setStyle(j,"display","none");d.addClass(j,p);j.innerHTML=n.replace(/\{([a-z0-9_ \-]+)\}/gi,'<span class="yui-pg-ui yui-pg-ui-$1"></span>');o=d.getElementsByClassName("yui-pg-ui","span",j);for(k=0,h=o.length;k<h;++k){this.renderUIComponent(o[k],m);}if(!l){d.setStyle(j,"display","");}},renderUIComponent:function(h,m){var l=h.parentNode,k=/yui-pg-ui-(\w+)/.exec(h.className),j=k&&g.ui[k[1]],i;if(e(j)){i=new j(this);if(e(i.render)){l.replaceChild(i.render(m),h);}}},destroy:function(){this.fireEvent("beforeDestroy");this.fireEvent("destroy");this.setAttributeConfig("rendered",{value:false});this.unsubscribeAll();},updateVisibility:function(m){var p=this.get("alwaysVisible"),n,j,q,o,k,l,h;if(!m||m.type==="alwaysVisibleChange"||!p){n=this.get("totalRecords");j=true;q=this.get("rowsPerPage");o=this.get("rowsPerPageOptions");if(c(o)){for(k=0,l=o.length;k<l;++k){h=o[k];if(f.isNumber(h||h.value)){q=Math.min(q,(h.value||h));}}}if(n!==g.VALUE_UNLIMITED&&n<=q){j=false;}j=j||p;for(k=0,l=this._containers.length;k<l;++k){d.setStyle(this._containers[k],"display",j?"":"none");}}},getContainerNodes:function(){return this._containers;},getTotalPages:function(){var h=this.get("totalRecords"),i=this.get("rowsPerPage");if(!i){return null;}if(h===g.VALUE_UNLIMITED){return g.VALUE_UNLIMITED;}return Math.ceil(h/i);},hasPage:function(i){if(!f.isNumber(i)||i<1){return false;}var h=this.getTotalPages();return(h===g.VALUE_UNLIMITED||h>=i);},getCurrentPage:function(){var h=this.get("rowsPerPage");if(!h||!this.get("totalRecords")){return 0;}return Math.floor(this.get("recordOffset")/h)+1;},hasNextPage:function(){var h=this.getCurrentPage(),i=this.getTotalPages();return h&&(i===g.VALUE_UNLIMITED||h<i);},getNextPage:function(){return this.hasNextPage()?this.getCurrentPage()+1:null;
},hasPreviousPage:function(){return(this.getCurrentPage()>1);},getPreviousPage:function(){return(this.hasPreviousPage()?this.getCurrentPage()-1:1);},getPageRecords:function(k){if(!f.isNumber(k)){k=this.getCurrentPage();}var j=this.get("rowsPerPage"),i=this.get("totalRecords"),l,h;if(!k||!j){return null;}l=(k-1)*j;if(i!==g.VALUE_UNLIMITED){if(l>=i){return null;}h=Math.min(l+j,i)-1;}else{h=l+j-1;}return[l,h];},setPage:function(i,h){if(this.hasPage(i)&&i!==this.getCurrentPage()){if(this.get("updateOnChange")||h){this.set("recordOffset",(i-1)*this.get("rowsPerPage"));}else{this.fireEvent("changeRequest",this.getState({"page":i}));}}},getRowsPerPage:function(){return this.get("rowsPerPage");},setRowsPerPage:function(i,h){if(g.isNumeric(i)&&+i>0&&+i!==this.get("rowsPerPage")){if(this.get("updateOnChange")||h){this.set("rowsPerPage",i);}else{this.fireEvent("changeRequest",this.getState({"rowsPerPage":+i}));}}},getTotalRecords:function(){return this.get("totalRecords");},setTotalRecords:function(i,h){if(g.isNumeric(i)&&+i>=0&&+i!==this.get("totalRecords")){if(this.get("updateOnChange")||h){this.set("totalRecords",i);}else{this.fireEvent("changeRequest",this.getState({"totalRecords":+i}));}}},getStartIndex:function(){return this.get("recordOffset");},setStartIndex:function(i,h){if(g.isNumeric(i)&&+i>=0&&+i!==this.get("recordOffset")){if(this.get("updateOnChange")||h){this.set("recordOffset",i);}else{this.fireEvent("changeRequest",this.getState({"recordOffset":+i}));}}},getState:function(n){var p=g.VALUE_UNLIMITED,l=Math,m=l.max,o=l.ceil,j,h,k;function i(s,q,r){if(s<=0||q===0){return 0;}if(q===p||q>s){return s-(s%r);}return q-(q%r||r);}j={paginator:this,totalRecords:this.get("totalRecords"),rowsPerPage:this.get("rowsPerPage"),records:this.getPageRecords()};j.recordOffset=i(this.get("recordOffset"),j.totalRecords,j.rowsPerPage);j.page=o(j.recordOffset/j.rowsPerPage)+1;if(!n){return j;}h={paginator:this,before:j,rowsPerPage:n.rowsPerPage||j.rowsPerPage,totalRecords:(g.isNumeric(n.totalRecords)?m(n.totalRecords,p):+j.totalRecords)};if(h.totalRecords===0){h.recordOffset=h.page=0;}else{k=g.isNumeric(n.page)?(n.page-1)*h.rowsPerPage:g.isNumeric(n.recordOffset)?+n.recordOffset:j.recordOffset;h.recordOffset=i(k,h.totalRecords,h.rowsPerPage);h.page=o(h.recordOffset/h.rowsPerPage)+1;}h.records=[h.recordOffset,h.recordOffset+h.rowsPerPage-1];if(h.totalRecords!==p&&h.recordOffset<h.totalRecords&&h.records&&h.records[1]>h.totalRecords-1){h.records[1]=h.totalRecords-1;}return h;},setState:function(i){if(b(i)){this._state=this.getState({});i={page:i.page,rowsPerPage:i.rowsPerPage,totalRecords:i.totalRecords,recordOffset:i.recordOffset};if(i.page&&i.recordOffset===undefined){i.recordOffset=(i.page-1)*(i.rowsPerPage||this.get("rowsPerPage"));}this._batch=true;this._pageChanged=false;for(var h in i){if(i.hasOwnProperty(h)&&this._configs.hasOwnProperty(h)){this.set(h,i[h]);}}this._batch=false;if(this._pageChanged){this._pageChanged=false;this._firePageChange(this.getState(this._state));}}}};f.augmentProto(g,YAHOO.util.AttributeProvider);YAHOO.widget.Paginator=g;})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.CurrentPageReport=function(c){this.paginator=c;c.subscribe("recordOffsetChange",this.update,this,true);c.subscribe("rowsPerPageChange",this.update,this,true);c.subscribe("totalRecordsChange",this.update,this,true);c.subscribe("pageReportTemplateChange",this.update,this,true);c.subscribe("destroy",this.destroy,this,true);c.subscribe("pageReportClassChange",this.update,this,true);};b.ui.CurrentPageReport.init=function(c){c.setAttributeConfig("pageReportClass",{value:"yui-pg-current",validator:a.isString});c.setAttributeConfig("pageReportTemplate",{value:"({currentPage} of {totalPages})",validator:a.isString});c.setAttributeConfig("pageReportValueGenerator",{value:function(f){var e=f.getCurrentPage(),d=f.getPageRecords();return{"currentPage":d?e:0,"totalPages":f.getTotalPages(),"startIndex":d?d[0]:0,"endIndex":d?d[1]:0,"startRecord":d?d[0]+1:0,"endRecord":d?d[1]+1:0,"totalRecords":f.get("totalRecords")};},validator:a.isFunction});};b.ui.CurrentPageReport.sprintf=function(d,c){return d.replace(/\{([\w\s\-]+)\}/g,function(e,f){return(f in c)?c[f]:"";});};b.ui.CurrentPageReport.prototype={span:null,render:function(c){this.span=document.createElement("span");this.span.id=c+"-page-report";this.span.className=this.paginator.get("pageReportClass");this.update();return this.span;},update:function(c){if(c&&c.prevValue===c.newValue){return;}this.span.innerHTML=b.ui.CurrentPageReport.sprintf(this.paginator.get("pageReportTemplate"),this.paginator.get("pageReportValueGenerator")(this.paginator));},destroy:function(){this.span.parentNode.removeChild(this.span);this.span=null;}};})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.PageLinks=function(c){this.paginator=c;c.subscribe("recordOffsetChange",this.update,this,true);c.subscribe("rowsPerPageChange",this.update,this,true);c.subscribe("totalRecordsChange",this.update,this,true);c.subscribe("pageLinksChange",this.rebuild,this,true);c.subscribe("pageLinkClassChange",this.rebuild,this,true);c.subscribe("currentPageClassChange",this.rebuild,this,true);c.subscribe("destroy",this.destroy,this,true);c.subscribe("pageLinksContainerClassChange",this.rebuild,this,true);};b.ui.PageLinks.init=function(c){c.setAttributeConfig("pageLinkClass",{value:"yui-pg-page",validator:a.isString});c.setAttributeConfig("currentPageClass",{value:"yui-pg-current-page",validator:a.isString});c.setAttributeConfig("pageLinksContainerClass",{value:"yui-pg-pages",validator:a.isString});c.setAttributeConfig("pageLinks",{value:10,validator:b.isNumeric});c.setAttributeConfig("pageLabelBuilder",{value:function(d,e){return d;},validator:a.isFunction});};b.ui.PageLinks.calculateRange=function(e,f,d){var i=b.VALUE_UNLIMITED,h,c,g;if(!e||d===0||f===0||(f===i&&d===i)){return[0,-1];}if(f!==i){d=d===i?f:Math.min(d,f);}h=Math.max(1,Math.ceil(e-(d/2)));if(f===i){c=h+d-1;}else{c=Math.min(f,h+d-1);
}g=d-(c-h+1);h=Math.max(1,h-g);return[h,c];};b.ui.PageLinks.prototype={current:0,container:null,render:function(c){var d=this.paginator;this.container=document.createElement("span");this.container.id=c+"-pages";this.container.className=d.get("pageLinksContainerClass");YAHOO.util.Event.on(this.container,"click",this.onClick,this,true);this.update({newValue:null,rebuild:true});return this.container;},update:function(l){if(l&&l.prevValue===l.newValue){return;}var f=this.paginator,k=f.getCurrentPage();if(this.current!==k||!k||l.rebuild){var n=f.get("pageLabelBuilder"),j=b.ui.PageLinks.calculateRange(k,f.getTotalPages(),f.get("pageLinks")),d=j[0],g=j[1],m="",c,h;c='<a href="#" class="'+f.get("pageLinkClass")+'" page="';for(h=d;h<=g;++h){if(h===k){m+='<span class="'+f.get("currentPageClass")+" "+f.get("pageLinkClass")+'">'+n(h,f)+"</span>";}else{m+=c+h+'">'+n(h,f)+"</a>";}}this.container.innerHTML=m;}},rebuild:function(c){c.rebuild=true;this.update(c);},destroy:function(){YAHOO.util.Event.purgeElement(this.container,true);this.container.parentNode.removeChild(this.container);this.container=null;},onClick:function(d){var c=YAHOO.util.Event.getTarget(d);if(c&&YAHOO.util.Dom.hasClass(c,this.paginator.get("pageLinkClass"))){YAHOO.util.Event.stopEvent(d);this.paginator.setPage(parseInt(c.getAttribute("page"),10));}}};})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.FirstPageLink=function(c){this.paginator=c;c.subscribe("recordOffsetChange",this.update,this,true);c.subscribe("rowsPerPageChange",this.update,this,true);c.subscribe("totalRecordsChange",this.update,this,true);c.subscribe("destroy",this.destroy,this,true);c.subscribe("firstPageLinkLabelChange",this.update,this,true);c.subscribe("firstPageLinkClassChange",this.update,this,true);};b.ui.FirstPageLink.init=function(c){c.setAttributeConfig("firstPageLinkLabel",{value:"&lt;&lt; first",validator:a.isString});c.setAttributeConfig("firstPageLinkClass",{value:"yui-pg-first",validator:a.isString});};b.ui.FirstPageLink.prototype={current:null,link:null,span:null,render:function(e){var f=this.paginator,g=f.get("firstPageLinkClass"),d=f.get("firstPageLinkLabel");this.link=document.createElement("a");this.span=document.createElement("span");this.link.id=e+"-first-link";this.link.href="#";this.link.className=g;this.link.innerHTML=d;YAHOO.util.Event.on(this.link,"click",this.onClick,this,true);this.span.id=e+"-first-span";this.span.className=g;this.span.innerHTML=d;this.current=f.getCurrentPage()>1?this.link:this.span;return this.current;},update:function(d){if(d&&d.prevValue===d.newValue){return;}var c=this.current?this.current.parentNode:null;if(this.paginator.getCurrentPage()>1){if(c&&this.current===this.span){c.replaceChild(this.link,this.current);this.current=this.link;}}else{if(c&&this.current===this.link){c.replaceChild(this.span,this.current);this.current=this.span;}}},destroy:function(){YAHOO.util.Event.purgeElement(this.link);this.current.parentNode.removeChild(this.current);this.link=this.span=null;},onClick:function(c){YAHOO.util.Event.stopEvent(c);this.paginator.setPage(1);}};})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.LastPageLink=function(c){this.paginator=c;c.subscribe("recordOffsetChange",this.update,this,true);c.subscribe("rowsPerPageChange",this.update,this,true);c.subscribe("totalRecordsChange",this.update,this,true);c.subscribe("destroy",this.destroy,this,true);c.subscribe("lastPageLinkLabelChange",this.update,this,true);c.subscribe("lastPageLinkClassChange",this.update,this,true);};b.ui.LastPageLink.init=function(c){c.setAttributeConfig("lastPageLinkLabel",{value:"last &gt;&gt;",validator:a.isString});c.setAttributeConfig("lastPageLinkClass",{value:"yui-pg-last",validator:a.isString});};b.ui.LastPageLink.prototype={current:null,link:null,span:null,na:null,render:function(e){var g=this.paginator,h=g.get("lastPageLinkClass"),d=g.get("lastPageLinkLabel"),f=g.getTotalPages();this.link=document.createElement("a");this.span=document.createElement("span");this.na=this.span.cloneNode(false);this.link.id=e+"-last-link";this.link.href="#";this.link.className=h;this.link.innerHTML=d;YAHOO.util.Event.on(this.link,"click",this.onClick,this,true);this.span.id=e+"-last-span";this.span.className=h;this.span.innerHTML=d;this.na.id=e+"-last-na";switch(f){case b.VALUE_UNLIMITED:this.current=this.na;break;case g.getCurrentPage():this.current=this.span;break;default:this.current=this.link;}return this.current;},update:function(d){if(d&&d.prevValue===d.newValue){return;}var c=this.current?this.current.parentNode:null,f=this.link;if(c){switch(this.paginator.getTotalPages()){case b.VALUE_UNLIMITED:f=this.na;break;case this.paginator.getCurrentPage():f=this.span;break;}if(this.current!==f){c.replaceChild(f,this.current);this.current=f;}}},destroy:function(){YAHOO.util.Event.purgeElement(this.link);this.current.parentNode.removeChild(this.current);this.link=this.span=null;},onClick:function(c){YAHOO.util.Event.stopEvent(c);this.paginator.setPage(this.paginator.getTotalPages());}};})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.NextPageLink=function(c){this.paginator=c;c.subscribe("recordOffsetChange",this.update,this,true);c.subscribe("rowsPerPageChange",this.update,this,true);c.subscribe("totalRecordsChange",this.update,this,true);c.subscribe("destroy",this.destroy,this,true);c.subscribe("nextPageLinkLabelChange",this.update,this,true);c.subscribe("nextPageLinkClassChange",this.update,this,true);};b.ui.NextPageLink.init=function(c){c.setAttributeConfig("nextPageLinkLabel",{value:"next &gt;",validator:a.isString});c.setAttributeConfig("nextPageLinkClass",{value:"yui-pg-next",validator:a.isString});};b.ui.NextPageLink.prototype={current:null,link:null,span:null,render:function(e){var g=this.paginator,h=g.get("nextPageLinkClass"),d=g.get("nextPageLinkLabel"),f=g.getTotalPages();this.link=document.createElement("a");this.span=document.createElement("span");this.link.id=e+"-next-link";this.link.href="#";this.link.className=h;
this.link.innerHTML=d;YAHOO.util.Event.on(this.link,"click",this.onClick,this,true);this.span.id=e+"-next-span";this.span.className=h;this.span.innerHTML=d;this.current=g.getCurrentPage()===f?this.span:this.link;return this.current;},update:function(f){if(f&&f.prevValue===f.newValue){return;}var d=this.paginator.getTotalPages(),c=this.current?this.current.parentNode:null;if(this.paginator.getCurrentPage()!==d){if(c&&this.current===this.span){c.replaceChild(this.link,this.current);this.current=this.link;}}else{if(this.current===this.link){if(c){c.replaceChild(this.span,this.current);this.current=this.span;}}}},destroy:function(){YAHOO.util.Event.purgeElement(this.link);this.current.parentNode.removeChild(this.current);this.link=this.span=null;},onClick:function(c){YAHOO.util.Event.stopEvent(c);this.paginator.setPage(this.paginator.getNextPage());}};})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.PreviousPageLink=function(c){this.paginator=c;c.subscribe("recordOffsetChange",this.update,this,true);c.subscribe("rowsPerPageChange",this.update,this,true);c.subscribe("totalRecordsChange",this.update,this,true);c.subscribe("destroy",this.destroy,this,true);c.subscribe("previousPageLinkLabelChange",this.update,this,true);c.subscribe("previousPageLinkClassChange",this.update,this,true);};b.ui.PreviousPageLink.init=function(c){c.setAttributeConfig("previousPageLinkLabel",{value:"&lt; prev",validator:a.isString});c.setAttributeConfig("previousPageLinkClass",{value:"yui-pg-previous",validator:a.isString});};b.ui.PreviousPageLink.prototype={current:null,link:null,span:null,render:function(e){var f=this.paginator,g=f.get("previousPageLinkClass"),d=f.get("previousPageLinkLabel");this.link=document.createElement("a");this.span=document.createElement("span");this.link.id=e+"-prev-link";this.link.href="#";this.link.className=g;this.link.innerHTML=d;YAHOO.util.Event.on(this.link,"click",this.onClick,this,true);this.span.id=e+"-prev-span";this.span.className=g;this.span.innerHTML=d;this.current=f.getCurrentPage()>1?this.link:this.span;return this.current;},update:function(d){if(d&&d.prevValue===d.newValue){return;}var c=this.current?this.current.parentNode:null;if(this.paginator.getCurrentPage()>1){if(c&&this.current===this.span){c.replaceChild(this.link,this.current);this.current=this.link;}}else{if(c&&this.current===this.link){c.replaceChild(this.span,this.current);this.current=this.span;}}},destroy:function(){YAHOO.util.Event.purgeElement(this.link);this.current.parentNode.removeChild(this.current);this.link=this.span=null;},onClick:function(c){YAHOO.util.Event.stopEvent(c);this.paginator.setPage(this.paginator.getPreviousPage());}};})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.RowsPerPageDropdown=function(c){this.paginator=c;c.subscribe("rowsPerPageChange",this.update,this,true);c.subscribe("rowsPerPageOptionsChange",this.rebuild,this,true);c.subscribe("totalRecordsChange",this._handleTotalRecordsChange,this,true);c.subscribe("destroy",this.destroy,this,true);c.subscribe("rowsPerPageDropdownClassChange",this.rebuild,this,true);};b.ui.RowsPerPageDropdown.init=function(c){c.setAttributeConfig("rowsPerPageOptions",{value:[],validator:a.isArray});c.setAttributeConfig("rowsPerPageDropdownClass",{value:"yui-pg-rpp-options",validator:a.isString});};b.ui.RowsPerPageDropdown.prototype={select:null,all:null,render:function(c){this.select=document.createElement("select");this.select.id=c+"-rpp";this.select.className=this.paginator.get("rowsPerPageDropdownClass");this.select.title="Rows per page";YAHOO.util.Event.on(this.select,"change",this.onChange,this,true);this.rebuild();return this.select;},rebuild:function(l){var c=this.paginator,f=this.select,m=c.get("rowsPerPageOptions"),d,k,g,h,j;this.all=null;for(h=0,j=m.length;h<j;++h){k=m[h];d=f.options[h]||f.appendChild(document.createElement("option"));g=a.isValue(k.value)?k.value:k;d.innerHTML=a.isValue(k.text)?k.text:k;if(a.isString(g)&&g.toLowerCase()==="all"){this.all=d;d.value=c.get("totalRecords");}else{d.value=g;}}while(f.options.length>m.length){f.removeChild(f.firstChild);}this.update();},update:function(h){if(h&&h.prevValue===h.newValue){return;}var g=this.paginator.get("rowsPerPage")+"",d=this.select.options,f,c;for(f=0,c=d.length;f<c;++f){if(d[f].value===g){d[f].selected=true;break;}}},onChange:function(c){this.paginator.setRowsPerPage(parseInt(this.select.options[this.select.selectedIndex].value,10));},_handleTotalRecordsChange:function(c){if(!this.all||(c&&c.prevValue===c.newValue)){return;}this.all.value=c.newValue;if(this.all.selected){this.paginator.set("rowsPerPage",c.newValue);}},destroy:function(){YAHOO.util.Event.purgeElement(this.select);this.select.parentNode.removeChild(this.select);this.select=null;}};})();(function(){var b=YAHOO.widget.Paginator,a=YAHOO.lang;b.ui.JumpToPageDropdown=function(c){this.paginator=c;c.subscribe("rowsPerPageChange",this.rebuild,this,true);c.subscribe("rowsPerPageOptionsChange",this.rebuild,this,true);c.subscribe("pageChange",this.update,this,true);c.subscribe("totalRecordsChange",this.rebuild,this,true);c.subscribe("destroy",this.destroy,this,true);};b.ui.JumpToPageDropdown.init=function(c){c.setAttributeConfig("jumpToPageDropdownClass",{value:"yui-pg-jtp-options",validator:a.isString});};b.ui.JumpToPageDropdown.prototype={select:null,render:function(c){this.select=document.createElement("select");this.select.id=c+"-jtp";this.select.className=this.paginator.get("jumpToPageDropdownClass");this.select.title="Jump to page";YAHOO.util.Event.on(this.select,"change",this.onChange,this,true);this.rebuild();return this.select;},rebuild:function(k){var j=this.paginator,h=this.select,d=j.getTotalPages(),g,f,c;this.all=null;for(f=0,c=d;f<c;++f){g=h.options[f]||h.appendChild(document.createElement("option"));g.innerHTML=f+1;g.value=f+1;}for(f=d,c=h.options.length;f<c;f++){h.removeChild(h.lastChild);}this.update();},update:function(h){if(h&&h.prevValue===h.newValue){return;}var g=this.paginator.getCurrentPage()+"",d=this.select.options,f,c;
for(f=0,c=d.length;f<c;++f){if(d[f].value===g){d[f].selected=true;break;}}},onChange:function(c){this.paginator.setPage(parseInt(this.select.options[this.select.selectedIndex].value,false));},destroy:function(){YAHOO.util.Event.purgeElement(this.select);this.select.parentNode.removeChild(this.select);this.select=null;}};})();YAHOO.register("paginator",YAHOO.widget.Paginator,{version:"@VERSION@",build:"@BUILD@"});