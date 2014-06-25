'use strict';

(function (window, $) {
	// News Page Class
	var News = function (api) {
		this.init(api);
	};

	News.prototype = {

		init: function (api) {
			var self = this;
			this.path = api || 'data.json';
			this.get(this.path, function (data) {
				self.data = data;
				self.populate();
			});
		},

		get: function (path, callback) {
			$.get(path, callback);
		},

		populate: function () {
			if(this.data.featured) {
				this.populateFeatured();
			}

			if(this.data.news) {
				this.populateNews();
			}
		},

		populateFeatured: function () {
			var widget = new HbsWidget('#tplFeatured', this.data); 
			this.append(widget.getElement());
		},

		populateNews: function () {
			var widget = new HbsWidget('#tplNews', this.data); 
			this.append(widget.getElement());
		},

		append: function (content) {
			$('#news').append(content);
		}
	};

	// Handlebars Widget Class
	var HbsWidget = function (id, data) {
		this.init(id, data);
	};

	HbsWidget.prototype = {
		init: function (id, data) {
			this.tpl = window.Handlebars.compile($(id).html());
			this.data = data;
		},

		getElement: function () {
			return this.tpl(this.data);
		}
	};
	
	new News();

})(window, jQuery);