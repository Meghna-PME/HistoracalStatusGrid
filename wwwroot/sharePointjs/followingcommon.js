function $_global_followingcommon(){if("undefined"==typeof g_all_modules)g_all_modules={};g_all_modules["followingcommon.js"]={version:{rmj:16,rmm:0,rup:24016,rpr:12006}};typeof spWriteProfilerMark=="function"&&spWriteProfilerMark("perfMarkBegin_followingcommon.js");(function(){var i="o365_post_bookmarklet",g="https://{0}/messages/new/?status={1}&trk_event={2}",c="www.yammer.com",h="toolbar=0,status=0,resizable=1,width=650,height=550",j="_blank";window.GetYammerSwitchObject=function(){var a={IsEnabled:false,TargetYammerHostName:c};if(m$.isDefinedAndNotNull(window.SP))if(m$.isUndefinedOrNull(window.SP.YammerSwitch))window.SP.YammerSwitch=a;else a=window.SP.YammerSwitch;return a};window.GetExpConfigValue=function(a,c){var b=window.GetYammerSwitchObject();return b[a]?b[a]:c};window.YammerSwitchIsEnabled=function(){return window.GetYammerSwitchObject().IsEnabled};window.PrepareYammerEnvironment=function(a){var b=window.GetYammerSwitchObject();if(m$.isDefinedAndNotNull(a))for(var c in a)b[c]=a[c];return b};window.PostToYammer=function(o,b){var d=GetExpConfigValue("PostTrackEvent",i);if(m$.isDefinedAndNotNull(b)&&b.length>0)d=b;var a=encodeURIComponent(o);a=encodeURIComponent(a);var l=GetExpConfigValue("TargetYammerHostName",c),f=GetExpConfigValue("BookmarkletUrlFormat",g),k=String.format(f,l,a,d),m=GetExpConfigValue("PostWindowFeatures",h),n=GetExpConfigValue("PostWindowName",j),e=function(){var a=window.open(k,n,m)};if(/Firefox/.test(navigator.userAgent))setTimeout(e,0);else e()};var f="o365_docpost_doclibcallout";window.PostSelectedDocToYammer=function(b){var a=null;if(m$.isDefinedAndNotNull(b)){a=GetItemUrlForLinking(b);if(m$.isDefinedAndNotNull(a)&&a.getString().length>0){var d=a.getString(),c=GetExpConfigValue("PostTrackEventDocCallout",f);PostToYammer(d,c)}}};window.SetFollowStatus=function(g,h,c,f,a){if(!c){var e=new XMLHttpRequest;e.open("POST",g+"/_api/contextinfo",true);e.setRequestHeader("accept","application/json; odata=verbose");e.setRequestHeader("Content-Type","application/json;odata=verbose");e.onreadystatechange=function(){if(e.readyState===4)if(e.status===200){var i=JSON.parse(e.responseText);i=i.d.GetContextWebInformation.FormDigestValue;var j="/_vti_bin/homeapi.ashx/sites/followed/";j+=h?"add":"remove";var d=new XMLHttpRequest;d.open("POST",g+j,true);d.setRequestHeader("Content-Type","application/json;odata=verbose");d.setRequestHeader("Accept","application/json;odata=verbose");d.setRequestHeader("SPHome-ClientType","PagesWeb");d.setRequestHeader("x-requestdigest",i);d.onreadystatechange=function(){if(d.readyState===4)if(d.status===200||d.status===204){var e="/_layouts/15/images/siteicon.png?rev=47";addSiteFollowNotification("","",e,null,function(){NavigateToFollowedList(true)});m$.isDefinedAndNotNull(f)&&f()}else{b(c,Strings.STS.L_FollowingException_FollowFailed);m$.isDefinedAndNotNull(a)&&a()}};d.send('"'+g+'"')}else{b(c,Strings.STS.L_FollowingException_FollowFailed);m$.isDefinedAndNotNull(a)&&a()}};e.send();return}SP.SOD.executeFunc("userprofile","SP.UserProfiles.ProfileLoader",function(){var e=SP.ClientContext.get_current(),i=SP.UserProfiles.ProfileLoader.getProfileLoader(e).getUserProfile(),k=i.get_followedContent(),j;if(h){IsFullNameDefined("CUI.PMetrics.perfMark")&&CUI.PMetrics.perfMark(CUI.PMarker.perfSPFollowContentBegin);j=k.follow(g,null)}else{IsFullNameDefined("CUI.PMetrics.perfMark")&&CUI.PMetrics.perfMark(CUI.PMarker.perfSPStopFollowContentBegin);k.stopFollowing(g)}e.executeQueryAsync(function(){if(h)if(m$.isDefinedAndNotNull(j)){var g=j.get_resultType();if(g===SP.UserProfiles.FollowResultType.followed||g===SP.UserProfiles.FollowResultType.refollowed){var o=j.get_item(),e=o.get_iconUrl(),i=o.get_title();if(c===true){if(e===null)e=SP.Utilities.Utility.getImageUrl("lg_icgen.gif");if(g===SP.UserProfiles.FollowResultType.followed)addDocumentFollowNotification(i,"",e);else addAlreadyFollowingDocumentNotification(i,"",e);IsFullNameDefined("CUI.PMetrics.perfMark")&&CUI.PMetrics.perfMark(CUI.PMarker.perfSPFollowDocEnd)}else{if(e==null)e="/_layouts/15/images/siteicon.png?rev=47";if(g==SP.UserProfiles.FollowResultType.followed)addSiteFollowNotification(i,"",e,null,function(){NavigateToFollowedList(true)});else addAlreadyFollowingSiteNotification(i,"",e,null,function(){NavigateToFollowedList(true)});IsFullNameDefined("CUI.PMetrics.perfMark")&&CUI.PMetrics.perfMark(CUI.PMarker.perfSPFollowSiteEnd)}m$.isDefinedAndNotNull(f)&&f()}else if(g===SP.UserProfiles.FollowResultType.hitFollowLimit){var m,l,k,n=null;if(c){m=Strings.STS.L_DocumentsFollowLimitReachedDialog_Text;l=Strings.STS.L_FollowLimitReachedDialog_Title;k=Strings.STS.L_DocumentsFollowLimitReachedDialog_Button;n=function(){NavigateToFollowedList()}}else{m=Strings.STS.L_SitesFollowLimitReachedDialog_Text;l=Strings.STS.L_FollowLimitReachedDialog_Title;k=Strings.STS.L_SitesFollowLimitReachedDialog_Button;n=function(){NavigateToFollowedList(true)}}d(m,l,k,n);m$.isDefinedAndNotNull(a)&&a()}else{b(c,Strings.STS.L_FollowingException_FollowFailed);m$.isDefinedAndNotNull(a)&&a()}}else m$.isDefinedAndNotNull(a)&&a();else{IsFullNameDefined("CUI.PMetrics.perfMark")&&CUI.PMetrics.perfMark(CUI.PMarker.perfSPStopFollowContentEnd);m$.isDefinedAndNotNull(f)&&f()}},function(m,j){var h=j.get_errorCode(),g,f="";if(h==SP.UserProfiles.SocialDataStoreExceptionCode.cannotCreatePersonalSite||h==SP.UserProfiles.SocialDataStoreExceptionCode.noSocialFeatures){g=Strings.STS.L_FollowingCannotCreatePersonalSiteError_Text;f=Strings.STS.L_FollowingCannotCreatePersonalSiteError_Title;SP.SOD.executeFunc("SP.UI.MySiteCommon.js","SP.UI.MySiteCommon.MySiteDialog",function(){var a=new SP.UI.MySiteCommon.MySiteDialog(f,g);a.set_hideOkButton(true);a.set_cancelButtonText(Strings.STS.L_CloseButtonCaption);a.show()})}else if(h==SP.UserProfiles.SocialDataStoreExceptionCode.personalSiteNotFound){g=Strings.STS.L_FollowingPersonalSiteNotFoundError_Text;f=Strings.STS.L_FollowingPersonalSiteNotFoundError_Title;var k=Strings.STS.L_FollowingPersonalSiteNotFoundError_ButtonText;d(g,f,k,function(){e.load(i,"FollowPersonalSiteUrl");e.load(i,"UrlToCreatePersonalSite");e.executeQueryAsync(function(){var a=c?i.get_urlToCreatePersonalSite():i.get_followPersonalSiteUrl();if(c){a=SP.Utilities.UrlBuilder.replaceOrAddQueryString(a,"MySiteRedirect","AllDocuments");window.open(a,"_blank")}else window.location.href=a})})}else{var l=j.get_message();b(c,l)}m$.isDefinedAndNotNull(a)&&a()})})};var b=function(d,c){var a=Strings.STS.L_FollowingGenericError_Title,b=d?Strings.STS.L_FollowingGenericError_DocumentTemporaryUnavailable_Text:Strings.STS.L_FollowingGenericError_SiteTemporaryUnavailable_Text;SP.SOD.executeFunc("SP.UI.MySiteCommon.js","SP.UI.MySiteCommon.MySiteDialog",function(){var d=new SP.UI.MySiteCommon.MySiteDialog(a,b);d.set_errorMessage(c);d.set_okButtonText(Strings.STS.L_CloseButtonCaption);d.set_hideCancelButton(true);d.show()})},d=function(c,b,a,d){SP.SOD.executeFunc("SP.UI.MySiteCommon.js","SP.UI.MySiteCommon.MySiteDialog",function(){var e=new SP.UI.MySiteCommon.MySiteDialog(b,c);e.set_okButtonText(a);e.set_okButtonCallback(d);e.show()})},e=function(a,c,b){SP.SOD.executeFunc("SP.UI.MySiteCommon.js","SP.UI.MySiteCommon.MySiteDialog",function(){var e=String.format(Strings.STS.L_DialogFollowAction_Title,a),f=c,d=new SP.UI.MySiteCommon.MySiteDialog(e,f);d.set_okButtonText(Strings.STS.L_DialogFollowButton_Text);d.set_okButtonCallback(b);d.show()})};window.FollowSiteFromEmail=function(a){e(a,Strings.STS.L_DialogFollowSiteAction_Content,function(){FollowSite()})};window.FollowDocumentFromEmail=function(b,c,a){e(a,Strings.STS.L_DialogFollowDocAction_Content,function(){FollowDoc(c,b)})};window.FollowSelectedDocument=function(c){var b,a=null;if(m$.isDefinedAndNotNull(c)){var d=c.CurrentItem;if(m$.isUndefinedOrNull(d)||m$.isUndefinedOrNull(d.ID))throw"Error: listItem is missing properties";b=c.listName;a=d.ID}else{var e=SP.ListOperation.Selection.getSelectedItems();if(e.length==1){b=SP.ListOperation.Selection.getSelectedList();a=e[0].id}}m$.isDefinedAndNotNull(b)&&m$.isDefinedAndNotNull(a)&&FollowDoc(b,a)};window.FollowDoc=function(d,c){var a=SP.ClientContext.get_current(),e=a.get_url(),b=window.location.protocol+"//"+window.location.host+e+"?listId="+d+"&itemId="+c;SetFollowStatus(b,true,true)};window.FollowSite=function(){var b=SP.ClientContext.get_current(),a=b.get_url();a=window.location.protocol+"//"+window.location.host+a;SetFollowStatus(a,true,false)};window.NavigateToFollowedList=function(a){a=Boolean(a);SP.SOD.executeFunc("SP.js","SP.ClientContext",function(){SP.SOD.executeFunc("userprofile","SP.UserProfiles.ProfileLoader",function(){var b=SP.ClientContext.get_current(),d=SP.UserProfiles.ProfileLoader.getProfileLoader(b).getUserProfile(),c=d.get_followedContent();b.load(c,a?"FollowedSitesUrl":"FollowedDocumentsUrl");b.executeQueryAsync(function(){if(a)window.location.href=c.get_followedSitesUrl();else window.location.href=c.get_followedDocumentsUrl()})})})};window.addFollowNotification=function(e,h,f,g,b,c){var d=new SPStatusNotificationData(STSHtmlEncode(h),Strings.STS.L_FollowNotificationText,f,g);return a(e,d,b,c)};window.addPeopleFollowNotification=function(e,h,f,g,b,c){var d=new SPStatusNotificationData(STSHtmlEncode(h),Strings.STS.L_FollowNotificationText_Person,f,g);return a(e,d,b,c)};window.addDocumentFollowNotification=function(e,h,f,g,b,c){var d=new SPStatusNotificationData(STSHtmlEncode(h),Strings.STS.L_FollowNotificationText_Document,f,g);return a(e,d,b,c)};window.addSiteFollowNotification=function(e,h,f,g,b,c){var d=new SPStatusNotificationData(STSHtmlEncode(h),Strings.STS.L_FollowNotificationText_Site,f,g);return a(e,d,b,c)};window.addAlreadyFollowingDocumentNotification=function(e,h,f,g,b,c){var d=new SPStatusNotificationData(STSHtmlEncode(h),Strings.STS.L_AlreadyFollowingNotificationText_Document,f,g);return a(e,d,b,c)};window.addAlreadyFollowingSiteNotification=function(e,h,f,g,b,c){var d=new SPStatusNotificationData(STSHtmlEncode(h),Strings.STS.L_AlreadyFollowingNotificationText_Site,f,g);return a(e,d,b,c)};var a=function(e,f,b,d){var a;if(b!=null)a=b;else a=function(){NavigateToFollowedList()};var c=new SP.UI.Notify.Notification(SPNotifications.ContainerID.Status,STSHtmlEncode(e),false,null,a,f);c.Show(d);return c.id}})();m$.isDefinedAndNotNull(Sys)&&m$.isDefinedAndNotNull(Sys.Application)&&Sys.Application.notifyScriptLoaded();m$.isFunction(NotifyScriptLoadedAndExecuteWaitingJobs)&&NotifyScriptLoadedAndExecuteWaitingJobs("followingcommon.js");typeof spWriteProfilerMark=="function"&&spWriteProfilerMark("perfMarkEnd_followingcommon.js")}$_global_followingcommon();