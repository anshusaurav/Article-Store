var express = require('express');
var router = express.Router();
var Article = require("../models/article");
var Comment = require("../models/comment");
// var commentRouter = require("./comments");

/* GET home page. */

router.get('/', function(req, res, next) {
    Article.find({}, (err, articles) =>{
        if(err)
            return next(err);
        return res.render("allArticle",{articles});
    });
});


//add article
router.get('/new', function(req, res, next) {
    return res.render("addArticle");
});

router.post('/', function(req, res, next) {
    req.body.tags = req.body.tags.split(', ');
    Article.create(req.body, (err, data) => {
        if(err) return next(err);
        return res.redirect('/articles');
    });
});


//view article

router.get('/:id', function(req, res, next) {
    console.log('view');
    let id = req.params.id;
    Article.findById(id, (err, article) =>{
        Comment.find({articleId: id}, (err, comments) =>{
            if(err)
                return next(err);
            return res.render("viewArticle", {article, comments});  
        });
        
    });
    
});


router.post('/:articleId/comments', (req, res, next) =>{
    var id = req.params.articleId;
    req.body.articleId = req.params.articleId;
    Comment.create(req.body, (err, newComment) =>{
        if(err)
            return next(err);
        Article.findByIdAndUpdate(id, {$push: {comments: newComment.id}}, (err, article) =>{
            res.redirect(`/articles/${id}`);
        });
        
    });
    console.log(req.body);
});

//edit article

router.get('/:id/edit', function(req, res, next) {
    let id = req.params.id;
    Article.findById(id, (err, article) =>{
        if(err)
            return next(err);
        return res.render("editArticle", {article});
    });
    
});

router.post('/:id', function(req, res, next) {
    let id = req.params.id;
    req.body.tags = req.body.tags.split(', ');
    Article.findByIdAndUpdate(id, req.body, (err, data) => {
        if(err) return next(err);
        return res.redirect('/articles');
    });
});


//delete article
router.get('/:id/delete', function(req, res, next) {
    let id = req.params.id;
    Article.findByIdAndDelete(id, (err, article) =>{
        if(err)
            return next(err);
        res.redirect('/articles');
    });
    
});


//like 
router.get('/:id/like', function(req, res, next) {
    let id = req.params.id;
    
    // req.body.likes = likeCount + 1;
    Article.findById(id, (err, article) =>{
        if(err)
            return next(err);
        console.log(article.likes);
        article.likes = article.likes + 1;
        Article.findByIdAndUpdate(id, article, (err, updatedArticle) =>{
            if(err)
                return next(err);
            res.redirect(`/articles/${article.id}`);
        });
    });
    
    
});


//dislike

router.get('/:id/dislike', function(req, res, next) {
    let id = req.params.id;
    
    Article.findById(id, (err, article) =>{
        if(err)
            return next(err);
        console.log(article.likes);
        if(article.likes > 0)
            article.likes = article.likes - 1;
        Article.findByIdAndUpdate(id, article, (err, updatedArticle) =>{
            if(err)
                return next(err);
            res.redirect(`/articles/${article.id}`);
        });
    });
    
    
});
module.exports = router;