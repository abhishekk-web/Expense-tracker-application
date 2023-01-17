const path = require('path');
const fs = require('fs');
//const helmet = require('helmet');
const morgan = require('morgan');
//const https = require('https');

const express = require('express');

const bodyParser = require('body-parser');


const dotenv = require('dotenv')


const sequelize = require('./utils/database');
const dataRoute = require('./routes/routes');
const purchaseRoute = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premium");


const cors = require('cors');
const User = require('./models/users');
const Expense = require('./models/models');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgot');
const forgotRoute = require("./routes/forgot");
const { Certificate } = require('crypto');

const app = express();

//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

//app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(cors());
dotenv.config();

app.use(bodyParser.json({extended: false}));

app.use(dataRoute);
app.use("/purchase",purchaseRoute);

app.use('/premium', premiumFeatureRoutes);
app.use('/password', forgotRoute);
app.use('/user', dataRoute);
app.use((req, res) => {
    console.log("Url"+req.url);
    res.sendFile(path.join(__dirname, `views/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize
// .sync({force:true})
.sync()
.then(result=>{
    console.log(result);
    // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
})
.catch(err=>{
    console.log(err);
})


