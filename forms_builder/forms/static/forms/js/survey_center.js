/*
 * File:       custom-forms.js
 * Desc:       Various utils and jQuery plugins
 */

/* Global */
var hash = window.location.hash.substring(1);

function fum (ele){

	var markup =  '<!-- FROM JS: File Upload Markup (fum) -->';
		markup += '<div class="fileupload fileupload-new" data-provides="fileupload">';
		markup += '<div class="fileupload-new thumbnail" style="width: 200px; height: 150px;"><img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image" /></div>';
		markup += '<div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>';
		markup += '<div><span class="btn btn-file"><span class="fileupload-new">Select image</span><span class="fileupload-exists">Change</span><!-- input field -->'+ele+'</span>';
		markup += '<a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Remove</a></div></div>';
 
 	return markup;
}

/* jQuery */
(function($){

	/*
	 * Plugin 		: removeTextOnly
	 * Description 	: simple plugin to remove the text of an element.
	 */
	$.fn.removeTextOnly = function() {
   
    	$(this).contents().filter(function(){
    		 return this.nodeType == 3; //Node.TEXT_NODE
    	}).remove();
	};

	/*
	 * Plugin 		: textOnly
	 * Description 	: simple plugin to retun only the text of an element.
	 */
	$.fn.getTextOnly = function() {
   
    	return $.trim((this).clone().children().remove().end().text());
	};

	/*
	 * Plugin 		: exits
	 * Description 	: simple plugin to retun bool if element exists
	 */
    $.fn.exists = function(){

        return this.length > 0;
    };

	/*
	 * Plugin 		: surveyCenter
	 * Description 	: setup plugin for survey_center
	 * Dependencies : jQuery, Jansy Bootstrap
	 */
	$.fn.surveyCenter = function(options){

		var survey = {
			form 			: $(this),
			opts 			: $.extend( {}, $.fn.surveyCenter.settings, options ),
			fieldsets 		: '',
			submit_button 	: '<button class="btn-submit" type="button" value="submit" name="Submit" style="display:none;">Submit</button>',
			next_button 	: '<button class="btn-next" type="button" value="1" name="Next">Next</button>',
			pagination 		: '<div class="pagination"><ul></ul></div>',
			controls 		: $(".js-controls"),
			setup 			: function(){
								try{
									// setup fieldsets and pager
									survey.fieldsets.each(function(){

										var fieldset = {
											ele: $(this),
											num: parseInt($(this).index() +1),
											fields: $(this).find("p"),
											pager: ''
										};

										// add js classes
										fieldset.ele.addClass("js-fieldset-" + fieldset.num);

										// go thruough each field of fieldset and do stuff
										fieldset.fields.each(function(){

											var field = {
												ele: $(this),
												desc: $(this).getTextOnly(),
												label: $(this).find("label"),
												input: $(this).children().eq(1),
												type: ""
											}
											
											// add class to field
											field.ele.addClass("field");

											// get field input type
											field.type = field.input.attr("type");

											// if not tag input
											if(!field.type){
												field.type = field.input[0].nodeName.toLowerCase();
											}

											// clear text from field
											field.ele.removeTextOnly();

											// add custom element with field te
											field.ele.append('<span class="desc '+field.type+'">'+field.desc+'</span>');

											// if field has a description
											if(field.desc){
												
												// info icon for popover
												field.ele.append('<i class="icon-info-sign icon-black"></i>');

												// set popovers for info icons
												field.ele.children("i.icon-info-sign").popover({
													title: field.label.getTextOnly(),
													content: field.desc,
													delay: { show: 500, hide: 100 },
													placement: 'top'
												});
											}

											// add claass to form element
											field.input.addClass(field.type);

											// if (fum) option is true
											if(survey.opts.fum && field.type == "file"){

												// get new input makup
												var fum_markup = fum(field.input[0].outerHTML);
												
												// delete the old
												field.input.remove();

												// append the new
												field.ele.append(fum_markup);
											}

										});

										// only if item num is one... {CONSIDER NO HASh}
										if(fieldset.num === 1){

											// display block
											fieldset.ele.show();

											// show first field set 
											fieldset.ele.addClass(survey.opts.c_active);

											// remove  js-diabled 
											fieldset.ele.removeClass(survey.opts.c_disable);

											// set first pagination item to active
											fieldset.pager = '<li class="js-pager-'+fieldset.num+' active"><span>'+fieldset.num+'</span></li>';
										}else{

											// display none
											fieldset.ele.hide();

											// hide  field set 
											fieldset.ele.addClass(survey.opts.c_disable);

											// set all other pagination items disabled
											fieldset.pager = '<li class="js-pager-'+fieldset.num+'"><span>'+fieldset.num+'</span></li>';
										}

										// append item pager to pagination
										$("div.pagination > ul").append(fieldset.pager);
									});
									
									// give me nice little bits of info.
									var res ={success: true, page_count:survey.fieldsets.length};

									return res;

								}catch(err){

									// log error
									console.log("Error: [survey center setup] - " + err);

									return false;
								}
							  },
			goto 			: function(goto_num){
								try{
									survey.fieldsets.each(function(){

										var fieldset = {
											ele: $(this),
											num: parseInt($(this).index() +1),
											pager: $("li.js-pager-" + ($(this).index() +1))
										};

										// if fieldset number is equal to goto number
										if(fieldset.num === goto_num){

											fieldset.ele.removeClass(survey.opts.c_disable);
											fieldset.ele.fadeIn("600", function(){
												fieldset.ele.addClass(survey.opts.c_active);
												fieldset.pager.addClass("active");
											});
										}else{
											fieldset.ele.hide();
											fieldset.ele.addClass(survey.opts.c_disable);
											fieldset.ele.removeClass(survey.opts.c_active);
											fieldset.pager.removeClass("active");
										}
									});

									// if last fieldset item
									if(survey.fieldsets.length === goto_num){

										// show submit button
										survey.submit_button.show();

										// hide next button
										survey.next_button.hide();

									}else{

										// hide submit button
										survey.submit_button.hide();

										// show next button
										survey.next_button.show();
									}

									return true;
								}catch(err){

									// log error
									console.log("Error: [survey center goto page] - " + err);

									return false;
								}
							  }
		};

		// find survey fields
		survey.fieldsets = survey.form.find(survey.opts.s_fieldsets);

		// test survey fieldsets
		var msg_fieldsets =  (survey.fieldsets.exists()) ? 'Success: fieldsets object found':'Fail: fieldset objects not found';
		
		// log test results
		console.log(msg_fieldsets);

		// hide original submit button
		$(":submit").hide();

		// build controls
		var controls = survey.pagination + survey.next_button + survey.submit_button;

		// insert new controls element
		survey.controls.html(controls);

		// setup survey
		var survey_status = survey.setup();

		// if survey setup is sucessful and ready then set survey event handlers
		if(survey_status.success){

			// get buttons
			survey.submit_button = $(".btn-submit");
			survey.next_button = $(".btn-next");


			// next button event handler
			survey.next_button.click(function(){

				var next_num = (parseInt($(this).attr("value"))+1);
				
				// call survey goto function
				var done = survey.goto(next_num);

				if(done){
					survey.next_button.attr("value", next_num);
				}

			});

			// pagination button event handler
			$(".pagination > ul > li").click(function(){
				
				var pager_num = parseInt($(this).index() +1);
				
				// call survey goto function
				var done = survey.goto(pager_num);

				if(done){
					survey.next_button.attr("value", pager_num);
				}

			});

			// submit form
			survey.submit_button.click(function(){
				survey.form.submit();
			});

			// remove popovers
			$(':not(#anything)').on('click', function (e) {
			    $('i.icon-info-sign').each(function () {
			        //the 'is' for buttons that trigger popups
			        //the 'has' for icons and other elements within a button that triggers a popup
			        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
			            $(this).popover('hide');
			            return;
			        }
			    });
			});

			// if hash value passed
			if(hash){
				var hash_num = parseInt(hash);
				
				// call survey goto function
				var done = survey.goto(hash_num);

				if(done){
					survey.next_button.attr("value", hash_num);
				}
			}

			// go to first and check if only one page/fieldset
			survey.goto(1);

			if(survey_status.page_count == 1){
				$(".pagination").hide();
			}

		}
	};

    $.fn.surveyCenter.settings = {
        fum			 	: false,
        pagination 	 	: true,
        s_fieldsets  	: "div.fieldset",
        s_imagefields	: "input.imagefield",
        c_active 	 	: "js-is-active",
        c_disable 	 	: "js-is-disabled"
    }



})(jQuery);