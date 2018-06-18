const articleService = require('../services/article');

module.exports = {
  index: async (req, res) => {
    try {
      const articlesData = await articleService.getLatestArticles();
      res.render('home/index', {
        articles: articlesData.articles,
        latestArticle: articlesData.latestArticle
      });
    } catch (err) {
      console.log(err);
    }
  }
}
