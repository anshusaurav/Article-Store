const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var tagSchema = new Schema({
    
    tagname: {
        type: String,
        required: true,
    },
    articleId: [{
        type: Schema.Types.ObjectId,
        ref: "Article"
    }]
},{timestamps: true});

var Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
