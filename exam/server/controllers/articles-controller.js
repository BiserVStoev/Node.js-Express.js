const articleService = require('../services/article');
const mongoose = require('mongoose');
const stringUtils = require('../utilities/stringUtils');

module.exports = {
    createGet: (req, res) => {
        return res.render('articles/create');
    },
    createPost: async (req, res) => {
        try {
            const { title, content } = req.body;
            const data = {
                title,
                content: content.trim(),
                editor: req.user._id
            };

            await articleService.create(data);
            return res.redirect('/');
        } catch (err) {
            console.log(err);
            const errMsmgParts = err.message.split(':');
            return res.render('articles/create', {
                error: stringUtils.capitalizeFirstLetter(errMsmgParts[errMsmgParts.length - 1].trim()),
                formData: {
                    title: req.body.title,
                    content: req.body.content
                }
            });
        }
    },
    all: async (req, res) => {
        const articles = await articleService.all();
        return res.render('articles/all', {
            articles
        });
    },
    details: async (req, res) => {
        const id = req.params.id;
        try {
            const testIdCast = mongoose.Types.ObjectId(id);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }

        try {
            const article = await articleService.getArticleWithLatestContent(id);
            return res.render('articles/details', article);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }
    },
    editGet: async (req, res) => {
        const id = req.params.id;
        try {
            const testIdCast = mongoose.Types.ObjectId(id);
        }
        catch{
            return res.render('error/404');
        }

        try {
            const article = await articleService.getArticleWithLatestContent(id);
            if(article.isLocked && !res.locals.isAdmin){
                return res.render('error/404');
            }
            return res.render('articles/edit', article);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }
    },
    editPost: async (req, res) => {
        const id = req.params.id;
        try {
            const testIdCast = mongoose.Types.ObjectId(id);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }

        const { content } = req.body;
        const data = {
            editor: req.user._id,
            content
        };

        try{
            const article = await articleService.getArticleById(id);
            if(article.isLocked && !res.locals.isAdmin){
                return res.render('error/404');
            }
            
            try {
                await articleService.editContent(article, data);
                return res.redirect(`/article/${id}`);
            } catch (err) {
                console.log(err);
                const errMsmgParts = err.message.split(':');
                return res.render(`articles/edit`, {
                    error: stringUtils.capitalizeFirstLetter(errMsmgParts[errMsmgParts.length - 1].trim()),
                    title: article.title,
                    content: req.body.content,
                    id: id
                });
            }

        }catch(err){
            console.log(err);
            return res.render('error/404');
        }
    },
    viewHistory: async (req, res) => {
        const id = req.params.id;
        try {
            const testIdCast = mongoose.Types.ObjectId(id);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }

        try {
            const edits = await articleService.getHistory(id);
            return res.render('articles/history', {
                edits: edits
            });
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }
    },
    viewOldArticle: async (req, res) => {
        const editId = req.params.editId;
        try {
            const testIdCast = mongoose.Types.ObjectId(editId);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }

        try {
            const oldArticle = await articleService.getOldArticle(editId);
            return res.render('articles/oldDetails', oldArticle);
        } catch (error) {
            console.log(error);
            return res.render('error/404');
        }
    },
    lock: async (req, res) => {
        const articleId = req.params.id;
        try {
            const testIdCast = mongoose.Types.ObjectId(articleId);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }

        try {
            await articleService.lockArticle(articleId);
            return res.redirect(`/article/${articleId}/edit`);
        } catch (error) {
            console.log(error);
            return res.render('error/404');
        }
    },
    unlock: async (req, res) => {
        const articleId = req.params.id;
        try {
            const testIdCast = mongoose.Types.ObjectId(articleId);
        } catch (err) {
            console.log(err);
            return res.render('error/404');
        }

        try {
            await articleService.unlockArticle(articleId);
            return res.redirect(`/article/${articleId}/edit`);
        } catch (error) {
            console.log(error);
            return res.render('error/404');
        }
    }
}
