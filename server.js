console.log('server is starting');

const express=require('express');
const Sequelize=require('sequelize');
const mysql=require('mysql');

const app = express();
app.listen(8080);
app.use(express.static('../frontend/build'));

const sequelize = new Sequelize('licenta_db', 'andreirdnl', '', {
  dialect : 'mysql'
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'andreirdnl',
  password: '',
  database: 'licenta_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('DB Connected!');
});

const Product = sequelize.define('product',{
    name : Sequelize.STRING,
    description : Sequelize.STRING,
    price : Sequelize.INTEGER
});

const List = sequelize.define('list',{
    lst : Sequelize.STRING
});

const User = sequelize.define('user',{
    username : Sequelize.STRING,
    pass : Sequelize.STRING
});

app.get('/create', (req, res, next) => {
  sequelize.sync({force : true})
    .then(() => res.status(201).send('created'))
    .catch((error) => next(error));
});

app.get('/all', getProduct);
function getProduct(reques,response, next) {
  Product.findAll()
    .then((product) => response.status(200).json(product))
    .catch((error) => next(error));
}

app.get('/create/product', setProduct);
function setProduct(reques,response, next) {
    var product={
        name: 'Eggplants',
        description:'Fresh',
        price:30
    }
  Product.create(product)
    .then(() => response.status(201).send('Product Added'))
    .catch((error) => next(error));
}

app.get('/searchByName/:name', getProductByName);
function getProductByName(request,response,next){
  var name=request.params.name;
  Product.findAll({where:{ name: name } })
    .then((product) => response.status(200).json(product))
    .catch((error) => next(error));
}

app.post('/add/:name/:desc/:price', addProduct);
function addProduct(request, response, next){
  var prod={
    name: request.params.name,
    description:request.params.desc,
    price:request.params.price
  };
  
  Product.create(prod)
    .then(() => response.status(201).send('Product Added'))
    .catch((error) => next(error));
}

app.get('/send/:list/', addList);
function addList(request, response, next){
  var list={
    lst: request.params.list,
  };
  
  List.create(list)
    .then(() => response.status(201).send('Server Status: List Recived'))
    .catch((error) => next(error));
}

app.get('/createuser/:name/:pass', createUser);
function createUser(request, response, next){
  var user={
    username: request.params.name,
    pass: request.params.pass
  };
  
  User.create(user)
    .then(() => response.status(201).send('User Created!'))
    .catch((error) => next(error));
}

app.get('/getuser', getUser);
function getUser(reques,response, next) {
  User.findAll()
    .then((user) => response.status(200).json(user))
    .catch((error) => next(error));
}

app.get('/checkuser/:name/:pass/', checkUser);
function checkUser(request, response, next){
  User.findOne({
    where: {
      username: request.params.name,
      pass: request.params.pass
    }
  }).then((user) => {
      if (user){
        response.send("OK");
      }
      else{
        response.status(404).send('not found');
      }
    });
}

app.get('/recieve', getList);
function getList(reques,response, next) {
  List.findAll()
    .then((list) => response.status(200).json(list))
    .catch((error) => next(error));
}

app.put('/update/:name/:desc/:price/:id', updateProduct);
function updateProduct(request, response, next){
  var prod={
      name: request.params.name,
      description:request.params.desc,
      price:request.params.price
  }
  var id=request.params.id;
  Product.findById(id)
    .then((product) => {
      if (product){
        product.update(prod);
        response.send("Update completed!");
      }
      else{
        response.status(404).send('not found');
      }
    });
}

app.delete('/remove/:id/', deleteProduct);
function deleteProduct(request, response, next){
  var id=request.params.id;
  Product.destroy({
          where: {
            productId: id
          }
        })
      .then(console.log("Product destroyed"));
  Product.findById(id)
    .then((product) => {
      if (product){
        product.destroy();
        response.send("Destruction completed!");
      }
      else{
        response.status(404).send('not found');
      }
    });
}

app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
  if(err) console.log(err);
})