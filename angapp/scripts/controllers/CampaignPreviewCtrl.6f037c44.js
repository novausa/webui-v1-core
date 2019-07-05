app.controller("CampaignPreviewCtrl",["$timeout","$interval","$location","$scope","$filter","$browser","$translatePartialLoader","$translate","$routeParams","CreateCampaignService","Restangular","RESOURCE_REGIONS","API_URL","PortalSettingsService","$rootScope","CampaignSettingsService","UserService","RestFullResponse","DisqusShortnameService","VideoLinkService","SOCIAL_SHARING_OPTIONS","$anchorScroll",function($timeout,$interval,$location,$scope,$filter,$browser,$translatePartialLoader,$translate,$routeParams,CreateCampaignService,Restangular,RESOURCE_REGIONS,API_URL,PortalSettingsService,$rootScope,CampaignSettingsService,UserService,RestFullResponse,DisqusShortnameService,VideoLinkService,SOCIAL_SHARING_OPTIONS,$anchorScroll){function checkTime(){var end=(moment(),moment($scope.campaign.ends)),d1=moment($scope.campaign.starts),d2=moment();moment.duration(d2.diff(end)).asMinutes();moment($scope.campaign.ends)<moment(new Date)?($scope.min=Math.abs(moment.duration(end.diff(d1)).asMinutes()),$scope.days=Math.abs(moment.duration(end.diff(d1)).asDays()),$scope.hours=Math.abs(moment.duration(end.diff(d1)).asHours()),$scope.week=Math.abs(moment.duration(end.diff(d1)).asWeeks()),$scope.month=Math.abs(moment.duration(end.diff(d1)).asMonths())):($scope.min=moment.duration(d2.diff(d1)).asMinutes(),$scope.days=moment.duration(d2.diff(d1)).asDays(),$scope.hours=moment.duration(d2.diff(d1)).asHours(),$scope.week=moment.duration(d2.diff(d1)).asWeeks(),$scope.month=moment.duration(d2.diff(d1)).asMonths()),$scope.month>1?($scope.duration=parseInt($scope.month),$scope.month>1&&$scope.month<2?$scope.dtype="month":$scope.dtype="months"):$scope.week>1?($scope.duration=parseInt($scope.week),$scope.week>1&&$scope.week<2?$scope.dtype="week":$scope.dtype="weeks"):$scope.days>1?($scope.duration=parseInt($scope.days),$scope.days>1&&$scope.days<2?$scope.dtype="day":$scope.dtype="days"):$scope.hours>1?($scope.duration=parseInt($scope.hours),$scope.hours>1&&$scope.hours<2?$scope.dtype="hour":$scope.dtype="hours"):$scope.min>1&&($scope.duration=parseInt($scope.min),$scope.min>1&&$scope.min<2?$scope.dtype="min":$scope.dtype="mins")}function missingText(array){$translate(["steps","stepsmessage","step","stepmessage"]).then(function(value){array.length>1?($scope.steps=value.steps,$scope.stepsmessage=value.stepsmessage,$scope.missingFieldsText=$scope.steps+'"'+array.toString()+'"'+$scope.stepsmessage):($scope.step=value.step,$scope.stepmessage=value.stepmessage,$scope.missingFieldsText=$scope.step+'"'+array.toString()+'"'+$scope.stepmessage),msg={header:$scope.missingFieldsText},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage()})}function check_path(){var params=$location.search();params.stream&&($("#campaign-tabs .ui.menu .item").tab("change tab","streams"),$scope.show_section.streamDetail=!0,Restangular.one("campaign",$scope.campaign_id).one("stream",params.stream).customGET().then(function(success){$scope.stream=success}))}function hasImage(){var bool=!1;return $scope.campaign.files&&angular.forEach($scope.campaign.files,function(file){if(3==file.region_id)return void(bool=!0)}),bool}function checkFunding(){if($scope.public_settings.site_campaign_country_funding_step&&$scope.campaign.settings.country_bank_form)return!!$scope.campaign.settings.bank&&"StripePlaceHolder";if($scope.contributionEnabled){if(!isStepFundingDelayed)return $scope.campaign.stripe_account_id;if($scope.campaign.ever_published)return $scope.campaign.stripe_account_id}return"StripePlaceHolder"}function setDefaultWidgetSettings(){$scope.campaignSettings.widget_settings||($scope.campaignSettings.widget_settings={themecolor:"00B5AD",fontcolor:"313131",fontfamily:"Helvetica"}),$scope.campaignSettings.widget_settings.backersfontcolor||($scope.campaignSettings.widget_settings.backersfontcolor="000000"),$scope.campaignSettings.widget_settings.blurbfontcolor||($scope.campaignSettings.widget_settings.blurbfontcolor="000000"),$scope.campaignSettings.widget_settings.campaignfontcolor||($scope.campaignSettings.widget_settings.campaignfontcolor="000000"),$scope.campaignSettings.widget_settings.commentsfontcolor||($scope.campaignSettings.widget_settings.commentsfontcolor="000000"),$scope.campaignSettings.widget_settings.contactfontcolor||($scope.campaignSettings.widget_settings.contactfontcolor="000000"),$scope.campaignSettings.widget_settings.creatorfontcolor||($scope.campaignSettings.widget_settings.creatorfontcolor="000000"),$scope.campaignSettings.widget_settings.faqfontcolor||($scope.campaignSettings.widget_settings.faqfontcolor="000000"),$scope.campaignSettings.widget_settings.fundingfontcolor||($scope.campaignSettings.widget_settings.fundingfontcolor="000000"),$scope.campaignSettings.widget_settings.paymentfontcolor||($scope.campaignSettings.widget_settings.paymentfontcolor="000000"),$scope.campaignSettings.widget_settings.profilefontcolor||($scope.campaignSettings.widget_settings.profilefontcolor="000000"),$scope.campaignSettings.widget_settings.rewardsfontcolor||($scope.campaignSettings.widget_settings.rewardsfontcolor="000000"),$scope.campaignSettings.widget_settings.streamsfontcolor||($scope.campaignSettings.widget_settings.streamsfontcolor="000000"),$scope.campaignSettings.widget_settings.tabbackgroundcolor||($scope.campaignSettings.widget_settings.tabbackgroundcolor="FFFFFF"),$scope.campaignSettings.widget_settings.tabselectedfontcolor||($scope.campaignSettings.widget_settings.tabselectedfontcolor="000000"),$scope.campaignSettings.widget_settings.tabunselectedfontcolor||($scope.campaignSettings.widget_settings.tabunselectedfontcolor="000000"),$scope.campaignSettings.widget_settings.topfontcolor||($scope.campaignSettings.widget_settings.topfontcolor="000000")}function setWidget(){var widgetSettings=$scope.campaign.settings.widget_settings;$("sedra-widget").attr("campaignid",$routeParams.campaign_id);for(var prop in widgetSettings)"fontfamily"!=prop&&(widgetSettings[prop]="#"+widgetSettings[prop]),$("sedra-widget").attr(prop,widgetSettings[prop]);setIframeWidget()}function setIframeWidget(){window.widgetHost=API_URL.url,widgetiframe=document.createElement("iframe"),widgetiframe.setAttribute("id","sedra-widget-container"),widgetiframe.setAttribute("frameborder","0"),widgetiframe.setAttribute("seamless","seamless"),widgetiframe.setAttribute("width","100%"),widgetiframe.setAttribute("scrolling","no");var srcString=($location.protocol()+"://"+$location.host()+"/",API_URL.url+"/service/restv1/campaign/"+$scope.campaign_id+"/widget");srcString+="?src="+$scope.widgetURL,srcString+="&themecolor=%23"+$scope.campaignSettings.widget_settings.themecolor,srcString+="&backersfontcolor=%23"+$scope.campaignSettings.widget_settings.backersfontcolor,srcString+="&blurbfontcolor=%23"+$scope.campaignSettings.widget_settings.blurbfontcolor,srcString+="&campaignfontcolor=%23"+$scope.campaignSettings.widget_settings.campaignfontcolor,srcString+="&commentsfontcolor=%23"+$scope.campaignSettings.widget_settings.commentsfontcolor,srcString+="&contactfontcolor=%23"+$scope.campaignSettings.widget_settings.contactfontcolor,srcString+="&creatorfontcolor=%23"+$scope.campaignSettings.widget_settings.creatorfontcolor,srcString+="&faqfontcolor=%23"+$scope.campaignSettings.widget_settings.faqfontcolor,srcString+="&fundingfontcolor=%23"+$scope.campaignSettings.widget_settings.fundingfontcolor,srcString+="&paymentfontcolor=%23"+$scope.campaignSettings.widget_settings.paymentfontcolor,srcString+="&profilefontcolor=%23"+$scope.campaignSettings.widget_settings.profilefontcolor,srcString+="&rewardsfontcolor=%23"+$scope.campaignSettings.widget_settings.rewardsfontcolor,srcString+="&streamsfontcolor=%23"+$scope.campaignSettings.widget_settings.streamsfontcolor,srcString+="&tabbackgroundcolor=%23"+$scope.campaignSettings.widget_settings.tabbackgroundcolor,srcString+="&tabselectedfontcolor=%23"+$scope.campaignSettings.widget_settings.tabselectedfontcolor,srcString+="&tabunselectedfontcolor=%23"+$scope.campaignSettings.widget_settings.tabunselectedfontcolor,srcString+="&topfontcolor=%23"+$scope.campaignSettings.widget_settings.topfontcolor,srcString+="&fontfamily=Helvetica",srcString+="&preview=yes",widgetiframe.src=srcString,$("#sedra-widget-container-area").append(widgetiframe)}function setIframeWidgetHeight(){$(widgetiframe).contents().find("body").height()>0&&$(widgetiframe).height($(widgetiframe).contents().find("body").height())}$scope.campaignSettings={},$scope.urlHost=$location.protocol()+"://"+$location.host()+$browser.baseHref();var paras=$location.$$path.split("/");$scope.path=paras[1],$scope.isLastStep=!1,"complete-funding"==$scope.path&&($scope.isLastStep=!0),$scope.clearMessage=function(){$rootScope.floatingMessage=[]};var msg=[];$scope.hashcheck=$location.hash(),$scope.organization_name={},$scope.RESOURCE_REGIONS=RESOURCE_REGIONS;var id=$routeParams.campaign_id;$scope.campaign_id=$routeParams.campaign_id,$scope.widgetURL=$location.protocol()+"://"+$location.host()+$browser.baseHref()+"widget/production/getwidget.js",$scope.campaign={},$translatePartialLoader.addPart("campaign-page"),$scope.showCampaign=0,$scope.showFaq=0,$scope.showBacker=0,$scope.showComment=0,$scope.showStream=0,$scope.duration="",$scope.stream_pagination={},$scope.stream_filter={page_entries:10,page_limit:100,pagination:{},page:1},$translate.refresh(),$scope.user=UserService;var intervalChecking;$scope.in_revision=!1,$timeout(function(){$("#myloader").fadeOut(4e3,function(){$("body").removeClass("loading")})}),$scope.dateInPast=function(value,sec){return 0==sec||0==sec||sec<0};var isStepFundingDelayed;$scope.makeLink=function(id){var linkpath=$location.path();$location.path(linkpath).hash(id).replace(),$scope.hashcheck=$location.hash()},$(".tabular.menu .item").tab(),$scope.campaignlink=$location.protocol()+"://"+$location.host()+"/campaign/"+id,PortalSettingsService.getSettingsObj().then(function(success){$scope.public_settings=success.public_setting,$scope.reward_html_editor=success.public_setting.site_theme_campaign_reward_html_editor,$scope.payment_gateway=success.public_setting.site_payment_gateway,$scope.direct_transaction=success.public_setting.site_campaign_fee_direct_transaction,$scope.contributionEnabled=success.public_setting.site_campaign_contributions,isStepFundingDelayed=success.public_setting.site_theme_campaign_delayed_funding_setup,$scope.removeContactUser=success.public_setting.site_campaign_contact_user,$scope.isRemoveCampaignFaq=success.public_setting.site_campaign_remove_campaign_faq,$scope.isCreatorNameOnly=success.public_setting.site_campaign_display_creator_info_name_only,$scope.isCreatorInfoOnMainBlock=success.public_setting.site_campaign_creator_info_display,$scope.isBackersOnSidebar=success.public_setting.site_campaign_backers_list_display,$scope.isCommentsOnMainBlock=success.public_setting.site_campaign_comments_display,$scope.isUpdatesOnMainBlock=success.public_setting.site_campaign_updates_display,$scope.isHideBackerProfileLink=success.public_setting.site_campaign_backer_hide_profile_link,$scope.isHideBackedCampaignsAmount=success.public_setting.site_campaign_backer_hide_backed_campaigns,$scope.isBlurbInSidebar=success.public_setting.site_campaign_move_blurb_sidebar,$scope.enableCampaignRevisions=success.public_setting.site_campaign_enable_campaign_revisions,$scope.isCreatorInfoTopBottomOfCampaign=success.public_setting.site_campaign_creator_info_display_top_bottom,$scope.isExplainerTextEnabled=success.public_setting.site_campaign_enable_explainer_text,$scope.moveEmbedBelowCommentsAccordionMobile=success.public_setting.site_campaign_move_embed_below_comments_accordion,$scope.moveBackersBelowCreatorAccordionMobile=success.public_setting.site_campaign_move_backers_accordion_below_creator_accordion,$scope.moveCreatorInfoToSidebar=success.public_setting.site_campaign_creator_info_display_sidebar,$scope.moveSharingButtonsToSidebar=success.public_setting.site_campaign_share_campaign_actions_display_sidebar,$scope.displayOnlyFbTwitterEmailShare=success.public_setting.site_campaign_share_display_only_fb_email_twitter,$scope.displayRewardsMobileTab=success.public_setting.site_campaign_display_reward_on_mobile_tabs,$scope.hideCampaignImageField=success.public_setting.site_campaign_creation_hide_campaign_image_field,$scope.hideCampaignBlurbField=success.public_setting.site_campaign_creation_hide_campaign_blurb_field,$scope.hideCampaignCategoryField=success.public_setting.site_campaign_creation_hide_campaign_category_field,$scope.showCampaignImageField=success.public_setting.site_campaign_creation_show_campaign_image_field,$scope.hideAllCampaignRewardsFields=success.public_setting.site_campaign_creation_hide_campaign_rewards_fields,$scope.displayPrevButtonHeader=success.public_setting.site_campaign_creation_display_previous_button_on_header,$scope.isRemoveCampaignLinks=$scope.public_settings.site_campaign_remove_campaign_links,$scope.hideRaiseMode=$scope.public_settings.site_campaign_remove_raise_mode,"undefined"==typeof success.public_setting.site_tos_campaign_submit?$scope.create=!1:$scope.create=success.public_setting.site_tos_campaign_submit,$scope.approve_campaign=$scope.public_settings.site_auto_approve_new_campaigns,Restangular.one("campaign",$scope.campaign_id).customGET("setting").then(function(success){if(success&&success.length){for(var index in success.plain())$scope.campaignSettings[success.plain()[index].name]=success.plain()[index].value;setDefaultWidgetSettings()}}).then(function(failed){setDefaultWidgetSettings()}),CreateCampaignService.load(id).then(function(success){$scope.$emit("loading_finished"),$scope.campaign=success,Restangular.one("campaign",$scope.campaign_id).one("ever_published").customGET().then(function(success){$scope.fundingExist=$scope.direct_transaction&&1!=$scope.user.person_type_id||!$scope.contributionEnabled||$scope.isStepFundingDelayed&&!success.ever_published,$scope.public_settings.site_enable_advanced_widget?$scope.backUrl="campaign-widget/"+$routeParams.campaign_id:$scope.fundingExist?$scope.backUrl="complete-funding/"+$routeParams.campaign_id:$scope.backUrl="profile-setup/"+$routeParams.campaign_id}),"undefined"!=typeof $scope.public_settings.site_campaign_custom_button&&null!=$scope.public_settings.site_campaign_custom_button||($scope.public_settings.site_campaign_custom_button={toggle:!1,reward:"Choose Reward",contribution:"Contribution"}),Restangular.one("account/person",$scope.campaign.managers[0].id).customGET().then(function(success){$scope.managerInfo=success}),$scope.public_settings.site_campaign_enable_organization_name&&Restangular.one('portal/person/attribute?filters={"person_id":"'+$scope.campaign.managers[0].id+'"}').customGET().then(function(success){$scope.organization_name.value=success[0].attributes.organization_name,$scope.organization_name.ein=success[0].attributes.ein}),$scope.customText=$scope.public_settings.site_campaign_custom_button,$scope.contribution=$scope.customText.contribution,$scope.reward=$scope.customText.reward;var shortCode="[min]",currency_iso=" ";null!=$scope.campaign.currencies&&(currency_iso=$scope.campaign.currencies[0].code_iso4217_alpha);var test=$filter("formatCurrency")($scope.public_settings.site_theme_campaign_min_contribute_amount,currency_iso,$scope.public_setting.site_campaign_decimal_option);if(1==$scope.customText.toggle){var rewardShortCode=$scope.reward.indexOf(shortCode)>-1;rewardShortCode&&($scope.reward=$scope.reward.replace(shortCode,test));var contributionShortCode=$scope.contribution.indexOf(shortCode)>-1;contributionShortCode&&($scope.contribution=$scope.contribution.replace(shortCode,test))}$scope.remaining_time=$scope.campaign.time_remaining,$scope.days_rem=$scope.campaign.days_remaining_inclusive,$scope.campaign.timezoneText=moment().tz($scope.campaign.timezone).zoneAbbr(),$translate(["seconds_to_go","second_to_go","seconds_ago","second_ago","minutes_to_go","minute_to_go","minutes_ago","minute_ago","hours_to_go","hour_to_go","hours_ago","hour_ago"]).then(function(values){0==$scope.days_rem?($scope.days_rem=$scope.campaign.hours_remaining_inclusive,0==$scope.days_rem?($scope.days_rem=$scope.campaign.minutes_remaining_inclusive,0==$scope.days_rem?($scope.days_rem=$scope.campaign.seconds_remaining_inclusive,$scope.days_rem>=1?$scope.days_rem>1?$scope.day_text=values.seconds_to_go:$scope.day_text=values.second_to_go:($scope.days_rem=$scope.days_rem*-1,$scope.days_rem>1?$scope.day_text=values.seconds_ago:$scope.day_text=values.second_ago)):$scope.days_rem>=1?$scope.days_rem>1?$scope.day_text=values.minutes_to_go:$scope.day_text=values.minute_to_go:($scope.days_rem=$scope.days_rem*-1,$scope.days_rem>1?$scope.day_text=values.minutes_ago:$scope.day_text=values.minute_ago)):$scope.days_rem>=1?$scope.days_rem>1?$scope.day_text=values.hours_to_go:$scope.day_text=values.hour_to_go:($scope.days_rem=$scope.days_rem*-1,$scope.days_rem>1?$scope.day_text=values.hours_ago:$scope.day_text=values.hour_ago)):$scope.days_rem>=1?$scope.days_rem>1?$scope.day_text=" days to go":$scope.day_text=" day to go":($scope.days_rem=$scope.days_rem*-1,$scope.days_rem>1?$scope.day_text="days ago":$scope.day_text="day ago")}),CampaignSettingsService.processSettings($scope.campaign.settings);var campaignSettings=CampaignSettingsService.getSettings();if($scope.campaign.settings=campaignSettings,$scope.campaign.settings.hide_contribute_button_per_campaign&&($scope.hideThisContribButton=$scope.campaign.settings.hide_contribute_button_per_campaign),$scope.progressHide=!1,$scope.public_settings.site_campaign_progress_bar_hide?$scope.progressHide=$scope.public_settings.site_campaign_progress_bar_hide:$scope.progressHide=$scope.public_settings.site_campaign_progress_bar_hide,"undefined"!=typeof $scope.campaign.settings.progress_bar_hide&&($scope.progressHide=$scope.campaign.settings.progress_bar_hide),null==campaignSettings||!campaignSettings.enable_rewards_pagination&&campaignSettings.hasOwnProperty("enable_rewards_pagination")?$scope.rewardPagination={page:1,page_entries:9999,pagination:{numpages:1}}:$scope.rewardPagination={page:1,page_entries:5,pagination:{numpages:1}},$scope.enableCampaignRevisions&&2==$scope.campaign.entry_status_id&&$routeParams.revision_id&&Restangular.one("campaign",$scope.campaign.entry_id).one("revision").customGET().then(function(success){$scope.revision=success[0],$scope.revision&&($scope.in_revision=!0)}),$scope.filterRewards=function(){var startindex=($scope.rewardPagination.page-1)*$scope.rewardPagination.page_entries,endindex=startindex+$scope.rewardPagination.page_entries;$scope.campaign.pledges_to_show=angular.copy($scope.campaign.pledges),$scope.campaign.pledges_to_show=$scope.campaign.pledges_to_show.slice(startindex,endindex)},$scope.campaign.pledges){var requiredNumCalls=parseInt($scope.campaign.pledges.length/$scope.rewardPagination.page_entries);$scope.campaign.pledges.length%$scope.rewardPagination.page_entries!=0&&(requiredNumCalls+=1),$scope.rewardPagination.pagination.numpages=requiredNumCalls,$scope.filterRewards()}switch($scope.public_settings.site_campaign_sharing_options){case SOCIAL_SHARING_OPTIONS.sharing_users:$scope.is_sharing_available=!0;break;case SOCIAL_SHARING_OPTIONS.sharing_backers:$scope.is_sharing_available=!1,$scope.campaign.managers[0].id!=$scope.user.id&&1!=$scope.user.person_type_id||($scope.is_sharing_available=!0);break;case SOCIAL_SHARING_OPTIONS.sharing_disabled:$scope.is_sharing_available=!1;break;default:$scope.is_sharing_available=!0}$scope.sortOrFiltersComments={sort:"-created",page_entries:5,page_limit:100,page:1,pagination:{}},$scope.getComments=function(comment_id,sort_order){if(sort_order&&($scope.sortOrFiltersComments.sort=sort_order),comment_id){var req=Restangular.one("campaign/"+$scope.campaign_id+"/comment/"+comment_id).customGET();return req}RestFullResponse.one("campaign/"+$scope.campaign_id).customGET("comment",$scope.sortOrFiltersComments).then(function(success){$scope.comments=success.data;var headers=success.headers();$scope.sortOrFiltersComments.pagination.currentpage=headers["x-pager-current-page"],$scope.sortOrFiltersComments.pagination.numpages=headers["x-pager-last-page"],$scope.sortOrFiltersComments.pagination.nextpage=headers["x-pager-next-page"],$scope.sortOrFiltersComments.pagination.pagesinset=headers["x-pager-pages-in-set"],headers["x-pager-total-entries"]?$scope.sortOrFiltersComments.pagination.totalentries=headers["x-pager-total-entries"]:$scope.sortOrFiltersComments.pagination.totalentries=0,$scope.sortOrFiltersComments.pagination.entriesperpage=headers["x-pager-entries-per-page"]})},null!=$scope.public_settings.comment_system?$scope.comment_system=$scope.public_settings.comment_system:$scope.comment_system="disqus","disqus"==$scope.comment_system?DisqusShortnameService.getDisqusShortname().then(function(shortname){$scope.disqus_shortname,angular.forEach(shortname,function(value){3==value.setting_type_id&&($scope.disqus_shortname=value.value)});var disqus_identifier=$scope.campaign_id;$scope.identifier=$scope.campaign_id;var disqus_url=$location.absUrl();if(window.DISQUS)$('<div id="disqus_thread"></div>').insertAfter("#insert_disqus"),DISQUS.reset({reload:!0,config:function(){this.page.identifier=disqus_identifier,this.page.url=disqus_url}});else if($scope.disqus_shortname){$('<div id="disqus_thread"></div>').insertAfter("#insert_disqus"),window.disqus_identifier=disqus_identifier,window.disqus_url=disqus_url;var dsq=document.createElement("script");dsq.type="text/javascript",dsq.async=!0,dsq.src="//"+$scope.disqus_shortname+".disqus.com/embed.js",$("head").append(dsq)}}):"custom"==$scope.comment_system&&($scope.comments_show_comment_picture=$scope.public_settings.custom_comment_show_comment_picture,$scope.getComments(),$scope.comments_background_style={"background-color":"#"+$scope.public_settings.custom_comment_comment_background_color,"font-family":$scope.public_settings.custom_comment_font_family},$scope.comments_font_color={color:"#"+$scope.public_settings.custom_comment_font_color},$scope.public_settings.custom_comment_auto_refresh&&setInterval(function(){$scope.getComments()},6e4)),checkTime(),$scope.daysEndDateInPast=function(daysEnd,ends,seconds_remaining){return 1!=daysEnd&&(!(!seconds_remaining||!ends)&&!$scope.dateInPast(ends,seconds_remaining))},$scope.dateInPast=function(value,sec){return 0==sec||"00"==sec||sec<0},angular.forEach($scope.campaign.settings,function(value,index){var setting_name=value.name,setting_value=value.value;$scope.campaign[setting_name]=setting_value,$scope.campaign.profile_type_view_id||($scope.campaign.profile_type_view_id=0)}),$.trim($scope.campaign.settings.top_header_link)&&$scope.campaign.settings.top_header_link.length<=0&&($scope.campaign.settings.top_header_link="#"),"#"==$scope.campaign.settings.top_header_link&&delete $scope.campaign.settings.top_header_link,$scope.campaign.timezoneText=moment().tz($scope.campaign.timezone).zoneAbbr(),$scope.faqs=success.faqs,$scope.FAQ=success.faqs,success.faqs&&($scope.faqs=success.faqs.length),$scope.cpath=$scope.campaign.uri_paths[0].path,$scope.fullUriPath=$scope.urlHost+$scope.cpath,$scope.campaign.campaign_links=[],$scope.campaign.links&&angular.forEach($scope.campaign.links,function(value){1==value.region_id&&1==value.resource_content_type_id&&"link"==value.resource_type&&($scope.campaign.video=value.uri.replace(/https?:\/\//gi,$location.protocol()+"://"),VideoLinkService.processVideoLink($scope.campaign.video,""),$scope.campaign.video_type=VideoLinkService.get_video_type(),"custom"==$scope.campaign.video_type&&($scope.campaign.video=VideoLinkService.get_video_link())),2==value.region_id&&$scope.campaign.campaign_links.push(value)}),$scope.direct_transaction||Restangular.one("campaign",id).one("stripe-account").customGET().then(function(success){success&&success.length&&($scope.campaign.stripe_account_id=success[0].id)}),hasImage()&&$scope.campaign.name&&$scope.campaign.raise_mode_id&&$scope.campaign.profile_type_id&&$scope.campaign.funding_goal&&$scope.campaign.currency_id&&$scope.public_settings.site_enable_advanced_widget?($scope.shouldLoadWidget=!0,setWidget()):$scope.shouldLoadWidget=!1,$scope.backers_pagination={sort:"-created",page_entries:10,page_limit:100,page:1,pagination:{}},$scope.campaign.backers=[],$scope.getBackers=function(){RestFullResponse.all("campaign/"+success.entry_id+"/backer").getList($scope.backers_pagination).then(function(success){$scope.campaign.backers=success.data;var headers=success.headers();headers["x-pager-total-entries"]?$scope.campaign.backer_offset?$scope.backer_length=parseInt(headers["x-pager-total-entries"])+parseInt($scope.campaign.backer_offset):$scope.backer_length=parseInt(headers["x-pager-total-entries"]):$scope.backer_length="0",$scope.backers_pagination.currentpage=headers["x-pager-current-page"],$scope.backers_pagination.numpages=headers["x-pager-last-page"],$scope.backers_pagination.nextpage=headers["x-pager-next-page"],$scope.backers_pagination.pagesinset=headers["x-pager-pages-in-set"],$scope.backers_pagination.totalentries=headers["x-pager-total-entries"],$scope.backers_pagination.entriesperpage=headers["x-pager-entries-per-page"]})},$scope.getBackers(),$scope.campaign.streams=[],RestFullResponse.all("campaign/"+success.entry_id+"/stream").getList($scope.stream_filter).then(function(success){$scope.campaign.streams=success.data;var headers=success.headers();$scope.stream_pagination.currentpage=headers["x-pager-current-page"],$scope.stream_pagination.numpages=headers["x-pager-last-page"],$scope.stream_pagination.nextpage=headers["x-pager-next-page"],$scope.stream_pagination.pagesinset=headers["x-pager-pages-in-set"],$scope.stream_pagination.totalentries=headers["x-pager-total-entries"],$scope.stream_pagination.entriesperpage=headers["x-pager-entries-per-page"]}),$scope.checklink=function(){var translate=$translate.instant(["campaign_page_campaigntitle","campaign_page_faq","campaign_page_rewardstitle","campaign_page_backers","campaign_page_streams","campaign_page_comments","campaign_page_files"]);if($location.hash()){$("#campaign").removeClass("active"),$("#campaign-seg").removeClass("active");var hash=$location.hash();switch(hash){case translate.campaign_page_faq:var faqLength=0;$scope.campaign.faqs&&"undefined"!=typeof $scope.campaign.faqs[0]&&(faqLength=$scope.campaign.faqs[0].faq_pairs.length),$(".menu-tabs .item").removeClass("active"),$("#faq").addClass("active"),$("#mobile-faq").addClass("active"),$("#faq-seg").addClass("active");break;case translate.campaign_page_backers:$(".menu-tabs .item").removeClass("active"),$("#backer").addClass("active"),$("#mobile-backer").addClass("active"),$("#backer-seg").addClass("active");break;case translate.campaign_page_streams:$(".menu-tabs .item").removeClass("active"),$("#stream").addClass("active"),$("#mobile-stream").addClass("active"),$("#stream-seg").addClass("active");break;case translate.campaign_page_comments:$(".menu-tabs .item").removeClass("active"),$("#comment").addClass("active"),$("#mobile-comment").addClass("active"),$("#comment-seg").addClass("active");break;case translate.campaign_page_campaigntitle:$(".menu-tabs .item").removeClass("active"),$("#campaign").addClass("active"),$("#mobile-campaign").addClass("active"),$("#campaign-seg").addClass("active");break;case translate.campaign_page_rewardstitle:$(".menu-tabs .item").removeClass("active"),$("#rewards").addClass("active"),$("#mobile-rewards").addClass("active"),$("#rewards-seg").addClass("active");break;case translate.campaign_page_files:$(".menu-tabs .item").removeClass("active"),$("#file").addClass("active"),$("#mobile-file").addClass("active"),$("#file-seg").addClass("active")}}},setTimeout(function(){$scope.checklink()},500),$scope.makeLink=function(id){var linkpath=$location.path();$location.path(linkpath).hash(id).replace(),$scope.hashcheck=$location.hash()},$scope.toggleHash=function(selectedItemKey){var translatedKey=$translate.instant(selectedItemKey);$location.search("").replace(),$scope.makeLink(translatedKey),$scope.checklink()},Restangular.one("portal/setting").getList().then(function(success){$scope.public_settings={},$scope.public_settings.site_theme_campaign_display_iso_date=success.site_theme_campaign_display_iso_date,angular.forEach(success,function(value){3==value.setting_type_id&&($scope.public_settings[value.name]=value.value)}),"undefined"!=typeof $scope.public_settings.site_campaign_custom_button&&null!=$scope.public_settings.site_campaign_custom_button||($scope.public_settings.site_campaign_custom_button={toggle:!1,reward:"Choose Reward",contribution:"Contribution"}),$scope.customText=$scope.public_settings.site_campaign_custom_button,$scope.contribution=$scope.customText.contribution;var shortCode="[min]",currency_iso=" ";null!=$scope.campaign.currencies&&(currency_iso=$scope.campaign.currencies[0].code_iso4217_alpha);var currency=$filter("formatCurrency")($scope.public_settings.site_theme_campaign_min_contribute_amount,currency_iso,$scope.public_setting.site_campaign_decimal_option);if(1==$scope.customText.toggle){var contributionShortCode=$scope.contribution.indexOf(shortCode)>-1;contributionShortCode&&($scope.contribution=$scope.contribution.replace(shortCode,currency))}$scope.public_settings.site_campaign_hide_creator_info&&($scope.site_campaign_hide_creator_info=$scope.public_settings.site_campaign_hide_creator_info),$scope.public_settings.site_theme_campaign_min_button_show?$scope.minamount=$scope.public_settings.site_theme_campaign_min_contribute_amount:$scope.minamount=1,"undefined"!=typeof $scope.public_settings.site_theme_campaign_per_min&&$scope.public_settings.site_theme_campaign_per_min&&"undefined"!=typeof $scope.campaign.min_contribution&&($scope.minamount=$scope.campaign.min_contribution),"undefined"!=typeof $scope.public_settings.site_theme_campaign_faq_option?("2"==$scope.public_settings.site_theme_campaign_faq_option&&($scope.hidef=!0,$scope.showFaq=0),"1"==$scope.public_settings.site_theme_campaign_faq_option&&($scope.showFaq=1),"0"==$scope.public_settings.site_theme_campaign_faq_option&&($scope.showFaq=0)):$scope.showFaq=1,null!=$scope.public_settings.site_theme_campaign_backer_option?("2"==$scope.public_settings.site_theme_campaign_backer_option&&($scope.hideb=!0,$scope.showBacker=0),"1"==$scope.public_settings.site_theme_campaign_backer_option&&($scope.showBacker=1,$scope.validUser=1),"0"==$scope.public_settings.site_theme_campaign_backer_option&&($scope.showBacker=0,$scope.validUser=1),"3"==$scope.public_settings.site_theme_campaign_backer_option&&($scope.user.auth_token?($scope.showBacker=1,$scope.validUser=1):($scope.showBacker=0,$scope.validUser=0))):($scope.showBacker=1,$scope.validUser=1),$scope.backer_show=($scope.showBacker||($scope.showBacker||$scope.campaign.backers.length)&&"2"!=$scope.public_settings.site_theme_campaign_backer_option)&&$scope.validUser,null!=$scope.public_settings.site_theme_campaign_comment_option?("2"==$scope.public_settings.site_theme_campaign_comment_option&&($scope.hidec=!0,$scope.showComment=0),"1"==$scope.public_settings.site_theme_campaign_comment_option&&($scope.showComment=1)):$scope.showComment=1,null!=$scope.public_settings.site_theme_campaign_stream_option?("2"==$scope.public_settings.site_theme_campaign_stream_option&&($scope.hides=!0,$scope.showStream=0),"1"==$scope.public_settings.site_theme_campaign_stream_option&&($scope.showStream=1),"0"==$scope.public_settings.site_theme_campaign_stream_option&&($scope.showStream=0)):$scope.showStream=1,"undefined"==typeof $scope.public_settings.site_theme_campaign_hide_min_contribute_message&&($scope.public_settings.site_theme_campaign_hide_min_contribute_message=!1),1==$scope.user.person_id||$scope.user.person_id==$scope.campaign.managers[0].person_id?$scope.validUser=1:$scope.validUser=0},function(failure){$msg={header:failure.data.message},$scope.errorMessage.push($msg)})})}),$scope.scrollToRewards=function(){$timeout(function(){$("html, body").animate({scrollTop:$("#campaign-seg #rewards-list").offset().top-15},500)},800)},$scope.scrollToMobileRewardsTab=function(){
var rewardsString=$translate.instant("campaign_page_rewardstitle");$timeout(function(){$location.hash()!==rewardsString&&($location.search("").replace(),$scope.makeLink(rewardsString),$scope.checklink()),$("html, body").animate({scrollTop:$("#rewards-seg #rewards-list").offset().top-15},500)},800)},$("#campaign-tabs .menu .item").tab({context:$("#campaign-tabs")}),$scope.missingFields={},Restangular.one("account/phone-number").customGET().then(function(success){success.business?$scope.bnumber=success.business[0].number:success.personal&&($scope.pnumber=success.personal[0].number)}),$scope.completionCheck=function(){var reqFieldsCheck;if($scope.create){if(!$("#creationCheck").checkbox("is checked"))return void($scope.tos_not_checked=!0);$scope.tos_not_checked=!1}var campaign=$scope.campaign;if(($scope.direct_transaction||2==$scope.payment_gateway||$scope.public_settings.site_campaign_country_funding_step&&$scope.campaign.settings.country_bank_form)&&(campaign.stripe_account_id=-1),$scope.public_settings.site_theme_campaign_show_reward_required?campaign.pledges?$scope.rewardsCheck=!0:$scope.rewardsCheck=!1:$scope.rewardsCheck=!0,$scope.in_revision)return $scope.confirmNotice=!0,$scope.loadingText=!1,void($scope.isLastStep&&(window.location.href="/"+$scope.cpath));if($scope.hideCampaignBlurbField&&$scope.hideCampaignCategoryField&&$scope.hideCampaignImageField?reqFieldsCheck=!!(campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.funding_goal&&campaign.currency_id&&campaign.description&&$scope.rewardsCheck&&checkFunding()):$scope.hideCampaignImageField?basicsReqField=!!(campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.blurb&&campaign.categories&&campaign.funding_goal&&campaign.currency_id&&campaign.description&&$scope.rewardsCheck&&checkFunding()):$scope.hideCampaignBlurbField?basicsReqField=!!(hasImage()&&campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.categories&&campaign.funding_goal&&campaign.currency_id&&campaign.description&&$scope.rewardsCheck&&checkFunding()):$scope.hideCampaignCategoryField?basicsReqField=!!(hasImage()&&campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.blurb&&campaign.funding_goal&&campaign.currency_id&&campaign.description&&$scope.rewardsCheck&&checkFunding()):reqFieldsCheck=!!(hasImage()&&campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.blurb&&campaign.categories&&campaign.funding_goal&&campaign.currency_id&&campaign.description&&$scope.rewardsCheck&&checkFunding()),reqFieldsCheck)$scope.loadingText=!0,CreateCampaignService.sendForReview().then(function(success){$scope.confirmNotice=!0,$scope.loadingText=!1,$scope.isLastStep&&(window.location.href="/"+$scope.cpath)},function(failed){$scope.errorNotice=failed.data.message,msg={header:failed.data.message},$rootScope.floatingMessage=msg,$scope.hideFloatingMessage(),$scope.loadingText=!1});else{var step1ReqField,step2ReqField,step3ReqField,steps=[];$timeout(function(){$translate(["basics","details","rewards","funding","uprofile"]).then(function(value){step1ReqField=$scope.hideCampaignBlurbField&&$scope.hideCampaignCategoryField&&$scope.hideCampaignImageField?!!(campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.funding_goal&&campaign.currency_id):$scope.hideCampaignImageField?!!(campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.blurb&&campaign.categories&&campaign.funding_goal&&campaign.currency_id):$scope.hideCampaignBlurbField?!!(hasImage()&&campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.categories&&campaign.funding_goal&&campaign.currency_id):$scope.hideCampaignCategoryField?!!(hasImage()&&campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.blurb&&campaign.funding_goal&&campaign.currency_id):!!(hasImage()&&campaign.name&&campaign.raise_mode_id&&campaign.profile_type_id&&campaign.blurb&&campaign.categories&&campaign.funding_goal&&campaign.currency_id),step1ReqField||steps.push(value.basics),step2ReqField=$scope.showCampaignImageField?!!hasImage():!!campaign.description,step2ReqField||steps.push(value.details),step3ReqField=$scope.hideAllCampaignRewardsFields?!!campaign.description:!($scope.public_settings.site_theme_campaign_show_reward_required&&!campaign.pledges),step3ReqField||steps.push(value.rewards),campaign.stripe_account_id||steps.push(value.funding),steps.length>0&&missingText(steps)})})}},$scope.requiredFields=["name","raise_mode_id","profile_type_id","cities","categories","funding_goal","currency_id","description","stripe_account_id"],$scope.showStreamDeail=function(stream,index){$scope.stream=stream,$scope.stream.sindex=index,$location.search("stream",stream.id).replace()},check_path(),$scope.$on("$locationChangeSuccess",function(event){!$location.hash()});var widgetiframe;$scope.$on("$routeChangeStart",function(){void 0!=intervalChecking&&$interval.cancel(intervalChecking)}),$scope.setIframeWidgetHeight=function(){intervalChecking=$interval(setIframeWidgetHeight,1e3),$timeout(function(){$interval.cancel(intervalChecking)},1e4)}}]);