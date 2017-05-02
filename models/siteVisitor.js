var mongoose = require('mongoose');

var siteVisitorSchema = mongoose.Schema({
	email: String,
	name: String,
	suggestion: String,
});
var SiteVisitor = mongoose.model('sitevisitor', siteVisitorSchema);

module.exports = SiteVisitor;
