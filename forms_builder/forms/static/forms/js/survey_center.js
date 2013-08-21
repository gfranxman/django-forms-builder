/*
 * File:       custom-forms.js
 * Desc:       Various utils and jQuery plugins
 */

/* Global */
var hash = window.location.hash.substring(1);

function fum (id){

	var markup =  '<!-- FROM JS: File Upload Markup (fum) -->';
		markup += '<div id='+id+' class="fileupload fileupload-new" data-provides="fileupload">';
		markup += '<div class="fileupload-new thumbnail" style="width: 200px; height: 150px;"><img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image" /></div>';
		markup += '<div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>';
		markup += '<div><span class="btn btn-file"><span class="fileupload-new">Select image</span><span class="fileupload-exists">Change</span><input type="file" /></span>';
		markup += '<a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Remove</a></div></div>';
 
 	return markup;
}

/* jQuery */
(function($){

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
			submit_button 	: $(":submit"),
			next_button 	: '<button type="button" value="1" name="Next">Next</button>',
			pagination 		: '<div class="pagination"><ul class="js-controls"></ul></div>',
			setup 			: function(){
								try{
									// setup fieldsets and pager
									survey.fieldsets.each(function(){

										var fieldset = {
											ele: $(this),
											num: parseInt($(this).index() +1),
											pager: ''
										};

										// add js classes
										fieldset.ele.addClass("js-fieldset-" + fieldset.num);

										// only if item num is one... {CONSIDER NO HASh}
										if(fieldset.num === 1){
											// show first field set 
											fieldset.ele.addClass(survey.opts.c_active);

											// remove  js-diabled 
											fieldset.ele.removeClass(survey.opts.c_disable);

											// set first pagination item to active
											fieldset.pager = '<li class="js-pager-'+fieldset.num+' active"><span>'+fieldset.num+'</span></li>';
										}else{

											// hide  field set 
											fieldset.ele.addClass(survey.opts.c_disable);

											// set all other pagination items disabled
											fieldset.pager = '<li class="js-pager-'+fieldset.num+'"><span>'+fieldset.num+'</span></li>';
										}

										// append item pager to pagination
										$("div.pagination > ul").append(fieldset.pager);
									});

									// if file up markup (fum) is true
									if(survey.opts.fum){

										var image_fields = $(survey.opts.s_imagefields);

										image_fields.each(function(){
											
											var field = $(this);

											field.addClass(survey.opts.c_disable);

											var field_markup = fum("test");
											field.after(field_markup);
											
											field.fileupload();

										});
									}

									return true

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
											fieldset.ele.addClass(survey.opts.c_active);
											fieldset.pager.addClass("active");
										}else{
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

		// append pagination element
		$("form").append(survey.pagination);

		// append next button
		$("form").append(survey.next_button);

		// setup survey
		var survey_ready = survey.setup();

		// if survey setup is sucessful and ready then set survey event handlers
		if(survey_ready){

			// hid submit button
			survey.submit_button.hide();

			// get next button
			survey.next_button = $(":button[name=Next]");


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
			$(".pagination > .js-controls > li").click(function(){
				
				var pager_num = parseInt($(this).index() +1);
				
				// call survey goto function
				var done = survey.goto(pager_num);

				if(done){
					survey.next_button.attr("value", pager_num);
				}

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

		}
	};

    $.fn.surveyCenter.settings = {
        fum			 	: false,
        pagination 	 	: true,
        s_fieldsets  	: "div.fieldset",
        s_imagefields	: "input.imagefield",
        c_active 	 	: "js-is-active",
        c_disable 	 	: "js-is-disable"
    }



})(jQuery);