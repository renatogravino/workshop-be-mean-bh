// - Prova do Suissa
var http = require("http");
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/workshop-bh');

var db = mongoose.connection;
db.on('error', function(err){
  console.log('Erro de conexao.', err);
});

db.once('open', function () {
  console.log('Conexão aberta.')
});

var BeerSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, default: '' },
  price: { type: Number, default: '' }
});

var Beer = mongoose.model('Beer', BeerSchema);

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<h1>Bem vindo ao sistema</h1>");

  switch(request.url){
    // Criando
    case '/create':
      var dados = {
        name: "Erdinger",
        description: "Eh boa",
        type: "Dunkel",
        price: 24
      };

      var beer = new Beer(dados);

      beer.save(function(err) {
        if(err){
          console.log(err);
        } else {
          console.log('Cerveja cadastrada com sucesso');
        }
      });
      break;

    // Buscando 
    case '/retrieve':
      Beer.findOne({ "name": "Kaiser"}, function (err, beers) {
        console.log('Pesquisando...');
        if(err) {
          console.log('Houve algum erro, tente novamente', err);
        } else {
          console.log(beers);
          response.write("<pre>" + beers + "</pre>");  //porque sera que nao exibiu ???  vamos pensar um pouco renato
        }
       });

      break;

    // atualizando
    case '/update':
      var dados = {
        type: "MUDEI AQUI"
      };

      Beer.update({name: "Kaiser"}, dados, function(err, beer) {
        if(err) {
          console.log(err);
        } else {
          console.log('Cerveja atualizada com sucesso');
        }
      });

      break;

    case '/delete':
      Beer.remove({name: "Kaiser"}, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('Cerveja deletada com sucesso!');
        }
      });

      break;

    default:
      response.write("<h3>Op&ccedil;&otilde;es</h3><ul><li>create</li><li>retrieve</li><li>update</li><li>delete</li></ul>");
  }
  response.end();

  console.log(request.url);
}).listen(3000);
