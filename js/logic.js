var app = new Vue({ // Initialize Vue application
	el: '#app', // Bind app to div with id="app"
	data: { // Once-loaded app data
		title: 'Hello world'
	},
	watch: { // App variables to "watch" and change others accordingly

	},
	computed: { // Variables computed from other app variables

	},
	methods: { // Functions that can be used throughout the app
	}
});

$(function(){ // Function that runs when the document is ready
	
});


function getParameterByName(name, url) { // Get query parameter value by its name
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};