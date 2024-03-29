const layouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const express = require('express');
const fs = require('fs');
const PORT = 3000;

const app = express();


app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + 'static'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(layouts);

app.get('/', function(req, res){
    res.redirect('articles');
});

app.get("/articles", function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    res.render('articles/index', {articleData:articleData});
});

app.get('/articles/new', function(req, res){
    res.render('articles/new');
    });

app.get('/articles/:id/edit', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/edit', {article: articleData[id], id});
});

app.get('/articles/:id', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/show', {article: articleData[id], id});
})

app.post('/articles', function(req, res){
    console.log(req.body);
    //read in our JsON file
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    //push our new data into the array
    let newArticle = {
        title: req.body.articleTitle,
        body: req.body.articleBody
    }
    articleData.push(newArticle);
    //write the array back to the file
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect('/articles');
})
app.delete('/articles/:id', function(req, res){
    //read the data from the file
    let articles = fs.readFileSync('./articles.json');
    // Parse the data into an object
    var articleData=JSON.parse(articles);
    //ssplice out the item at the spcified index
    var id = parseInt(req.params.id);
    articleData.splice(id, 1);
    //stringfy the object
    var articleString =  JSON.stringify(articleData);
    // write the object back to the file
    fs.writeFileSync('./articles.json', articleString);
    res.redirect('/articles');
});

app.put('/articles/:id', function(req, res){
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    articleData[id].title = req.body.articleTitle;
    articleData[id].body = req.body.articleBody;
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect("/articles/"+ id);
})
app.listen(PORT || 3000);