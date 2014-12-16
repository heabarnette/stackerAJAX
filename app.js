$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
		});
	$('.inspiration-getter').submit( function(event) {
		$('.results').html('');
		// get the value of the tags the user submitted
		var tag = $(this).find("input[name='answerers']").val();
		getInspired(tag);
		});
	});


// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


/*---------------new for Get Inspired-------------- */

// this function takes the top answerer returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(userHolder) {
	var user = userHolder.user;
	console.log(user);
	// clone our result template code
	var template = $('.templates .answerer').clone();
	
	// Set the question properties in result
	var userName = template.find('.display_name a');
	userName.attr('href', user.link);
	userName.text(user.display_name);

	// set the date asked property in result
	var reputation = template.find('.reputation');
	reputation.text(user.reputation);

	// set the #views for question property in result
	var userImage = template.find('.profile_image img');
	userImage.attr('src', user.profile_image);

	var acceptRate = template.find('.acceptRate');
	acceptRate.text(user.accept_rate);

	var userType = template.find('.userType');
	userType.text(user.user_type);

	return template;
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getInspired = function(tag) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var params = {tag: tag,
//		site: 'stackoverflow',
		period: 'all_time'
		};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time?site=stackoverflow",
//		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		$.each(result.items, function(i, userHolder) {
			var resultInsp = showAnswerer(userHolder);
			$('.results').append(resultInsp);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

/* result array for top answerers query:
 "user": {
        "reputation": 352956,
        "user_id": 19068,
        "user_type": "registered",
        "profile_image": "https://www.gravatar.com/avatar/1d2d3229ed1961d2bd81853242493247?s=128&d=identicon&r=PG",
        "display_name": "Quentin",
        "link": "http://stackoverflow.com/users/19068/quentin"
      },
      "post_count": 4010,
      "score": 13724
}
*/

