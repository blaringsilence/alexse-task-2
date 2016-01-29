// Chose to make several instances of vue then later found out I could've made 1 for the whole body

 $('[title]').qtip({
 	style:{
 		classes: 'qtip-tipsy'
 	}
 }); //TOOLTIPS

//FOR THE REGULAR PAGE
var sidebarvm = new Vue({
	el: '#sidebar',
	data: {
		picture: 'img/puppy.jpg',
	}
});



var formvm = new Vue({
	el: '#update-form',
	data: {
		faculties: [
		{name: "SSP", departments:[
			{id: "0", name: "Computer & Communication"}, 
			{id: "1", name: "Construction"}, 
			{id: "2", name: "Electromechanics"}, 
			{id: "3", name: "Petrochemicals"}, 
			{id: "4", name: "Offshore & Coastal"}, 
			{id: "5", name: "General (Term 1 & 2)"}
			]
		}, // I'm just playing those with no ids but I assume they have ids and whatnot
		{name: "Other", departments:[{id: "6", name: "Lala Land"}]}
		],
		chosenFaculty: "",
		ajaxresp: {},
		chosenCourses: []
	},
	methods: {
		loadDep: function(){
			$('#dep-select').remove();
			$('#terms').remove();
			$('#courses').remove();
			$('#course-form-submit').remove();
			var selected = this.chosenFaculty;
			var deps;
			for(var i=0; i<this.faculties.length; i++){
				if(this.faculties[i].name == selected){
					deps = this.faculties[i].departments;
					break;
				}
			}
			if(deps){
				if($('#dep-select-label').length === 0) $('#update-form').append('<p id="dep-select-label">Then, select your department:</p>');
				$('#update-form').append('<select id="dep-select" class="form-control" onChange="formvm.loadTerms()"><option disabled>Available Departments</option></select>');
				for(var i=0; i<deps.length; i++){
				$('#dep-select')
         					.append($("<option></option>")
        					.attr("value",deps[i].id)
         					.text(deps[i].name)); 
				}

			}
		},
		loadTerms: function(){
			$('#terms').remove();
			$('#courses').remove();
			$('#course-form-submit').remove();
			$('#update-form').append('<select id="terms" class="form-control" onChange="formvm.loadSub()"><option disabled>Select Term</option></select>');
			for(var i=1; i<=10; i++){ //assuming 10 terms and whatnot, this can be changed to only list available terms per dep
				$('#terms')
         			.append($("<option></option>")
        			.attr("value",i)
         			.text(i));
			}
			
		},
		loadSub: function(){
			$('#courses').remove();
			$('#course-form-submit').remove();
			var dep = $('#dep-select').val();
			var term = $('#terms').val();
			$('#update-form').append('<div class="row" id="courses"><div class="col-xs-12 col-md-6" id="default-courses"><label class="radio-inline"><h4><input type="radio" name="subject-type" value="default">Default Courses:</h4></label><ul class="list-unstyled"></ul></div><div class="col-xs-12 col-md-6" id="department-courses"><label class="radio-inline"><h4><input type="radio" name="subject-type" value="all">Or, choose your own:</h4><ul class="list-unstyled"></ul></div></div>');
			// send XMLHttpRequest based on previous choices, receive the text in the following variable: 
			var response = '{"department_subjects":{"1": "Math 2","3": "Accounting","subject_id": "Subject Name"},"default_subjects": {"5": "Analog Communications","6": "Mathematics","subject_id": "Subject Name"}}';
			this.ajaxresp = jQuery.parseJSON(response);
			for(key in this.ajaxresp.default_subjects){
				$('#default-courses ul').append('<li><label><input type="checkbox" disabled="disabled" checked="checked">'+this.ajaxresp.default_subjects[key]+'</label></li>');
			}
			for(key in this.ajaxresp.department_subjects){
				$('#department-courses ul').append('<li><label style="margin-left:-0.5em;"><input class="all-courses" type="checkbox" disabled="disabled" value="'+key+'">'+this.ajaxresp.department_subjects[key]+'</label></li>');
			}
			$( "input[type='radio'][name='subject-type']" ).on({
		          'change':function(){
		          				$('#course-form-submit').remove();
		          				$('#update-form').append('<button id="course-form-submit" type="submit" class="btn btn-warning" onclick="formvm.submitChoices(event)">Submit</button>');
		                       var selected = $("input[type='radio'][name='subject-type']:checked");
		                       if(selected.val()=='all'){
		                       	$('.all-courses').removeAttr("disabled");
		                       }
		                      	else{
		                      		$('.all-courses').attr("disabled", "disabled");
		                      	}
		                     }
		        });
		},
		submitChoices: function(e){
			e.preventDefault();
			this.chosenCourses=[]; //just in case
			var selected = $("input[type='radio'][name='subject-type']:checked");
			if(selected.val()=='all'){
				this.chosenCourses =  $('.all-courses:checked').map(function () { return this.value; }).toArray();
			}
			else{
				for(key in this.ajaxresp.default_subjects){
					this.chosenCourses.push(key);
				}
			}
			if(this.chosenCourses.length==0) alert("NO! CHECK MORE COURSES!"); // or, you know, an appropriate error
			else alert("IDs you chose are: " + this.chosenCourses);
		}
	}
});

