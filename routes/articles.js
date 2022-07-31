const express = require('express');
const Article = require('../models/article');
const router = express.Router();

router.get('/new', async (req, res) => {
    res.render('articles/new', { article: new Article() });
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) res.redirect('/');
    res.render('articles/show', { article: article });
})

router.put('/:id', async (req, res) => {
    req.article = await Article.findById(req.params.id);
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    const updatedArticle = await article.save();
    res.redirect(`/articles/${updatedArticle.slug}`);
})

router.post('/', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });
    try {
        let createdArticle = await article.save();
        res.redirect(`/articles/${createdArticle.slug}`);
    } catch (error) {
        console.log(error);
    }
})

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

module.exports = router;