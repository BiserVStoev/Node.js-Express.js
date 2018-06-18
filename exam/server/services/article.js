
const mongoose = require('mongoose');
const Article = require('mongoose').model('Article');
const Edit = require('mongoose').model('Edit');
const User = require('mongoose').model('User');

async function create(data) {
    const { editor, title, content } = data;

    const article = await Article.create({ title });
    try {
        const edit = await Edit.create({
            content,
            editor,
            article: article._id
        });
        article.edits = [edit._id];
        article.save();
    } catch (err) {
        Article.findById(article._id).remove().exec();
        throw err;
    }

};

async function all() {
    const articles = await Article.find({}).select('_id title');
    const sortedArticles = articles.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }

        return 0;
    });

    return sortedArticles;
};

async function getLatestEdit(articleId){
    const allEdits = await Edit.find({ article: articleId }).select('content dateCreated');

    let neededEdit = {};
    for (i = 0; i < allEdits.length; i++) {
        if (i === 0) {
            neededEdit = allEdits[0];
        } else {
            if (allEdits[i].dateCreated > neededEdit.dateCreated) {
                neededEdit = allEdits[i];
            }
        }
    }

    return neededEdit;
}

async function getArticleWithLatestContent(articleId) {
    const article = await getArticleById(articleId);
    const neededEdit = await getLatestEdit(article._id); 
    const splittedContent = neededEdit.content.split('\r\n\r\n');
    const result = {
        content: neededEdit.content,
        splittedContent: splittedContent,
        title: article.title,
        isLocked: article.isLocked,
        id: article._id
    };

    return result;
}

async function getArticleById(id) {
    const article = await Article.findById(id).select('_id title edits isLocked');

    if (!article) {
        throw new Error('Product not found.');
    }

    return article;
}

async function editContent(article, data) {
    const { editor, content } = data;
    const edit = await Edit.create({
        content,
        editor,
        article: article._id
    });
    
    article.edits.push(edit._id);
    article.save();
}

async function getHistory(articleId) {
    const article = await Article.findById(articleId).select('_id content edits');
    const allEdits = await Edit.find({ article: article._id }).select('content dateCreated editor');
    const finalEdits = [];
    for (let edit of allEdits) {
        const currUser = await User.findById(edit.editor).select('email');
        const date = new Date(edit.dateCreated);
        const dateString = `${date.getHours()}:${date.getMinutes()}, ${date.toLocaleDateString()}`
        finalEdits.push({
            dateCreated: dateString,
            author: currUser.email,
            content: edit.content,
            articleId: article._id,
            editId: edit._id
        });
    }
    const sortedEdits = finalEdits.sort((a, b) => {
        if (a.dateCreated > b.dateCreated) {
            return -1;
        }
        if (a.dateCreated < b.dateCreated) {
            return 1;
        }

        return 0;
    });

    return sortedEdits;
}

async function getOldArticle(editId) {
    const edit = await Edit.findById(editId).select('content article').populate('article');
    if (!edit) {
        throw new Error('Article history not found.');
    }

    const data = {
        content: edit.content,
        title: edit.article.title
    }

    return data;
}

async function getLatestArticles() {
    const articles = await Article.find({}).sort('-dateCreated').limit(3);
    const articlesData = {
        articles: articles,
    };

    if (articles.length > 0) {
        const neededEdit = await getLatestEdit(articles[0]._id); 
        const latestArticle = {
            id: articles[0]._id,
            content: neededEdit.content.length > 50 ? neededEdit.content.slice(0, 50) + '...' : neededEdit.content,
            title: articles[0].title
        }
        
        articlesData.latestArticle = latestArticle;
    }
    
    return articlesData;
}

async function lockArticle(articleId){
    const article = await getArticleById(articleId);
    article.isLocked = true;
    article.save(); 
}

async function unlockArticle(articleId){
    const article = await getArticleById(articleId);
    article.isLocked = false;
    article.save(); 
}

module.exports = {
    create,
    all,
    getArticleById,
    getArticleWithLatestContent,
    editContent,
    getHistory,
    getOldArticle,
    getLatestArticles,
    lockArticle,
    unlockArticle
}