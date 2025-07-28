const express = require('express');
const app = express();

const nlp = require("compromise");
const path = require('path');
const axios = require("axios");
const bcrypt = require('bcrypt');
const userModel = require('./models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const isLoggedIn = require('./middlewares/isLoggedIn.js');
const db = require("./config/mongoose-connection");

require('dotenv').config();

app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use(session({
    secret: process.env.JWT_KEY || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // = 14 days
    }),
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(flash());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get("/", (req, res) => {
  res.redirect("/login");
})

app.get('/domain', isLoggedIn, async (req, res) => {
  // console.time('Find user domain route');
  let user = await userModel.findOne({email: req.user.email});
  // console.timeEnd('Find user domain route');

  res.render('domain',{showResults: false, description: "", suggestions: [], user});
});

app.get("/results", isLoggedIn, async (req, res) => {
  // console.time('Find user results route');
  let user = await userModel.findOne({email: req.user.email});
  // console.timeEnd('Find user results route');


  let { description } = req.query;
  let suggestions = [];

  // to use compromise for nlp of the description
  let doc = nlp(description);
  let nouns = doc
    .nouns()
    .out("array")
    .map((w) => w.replace(/\s+/g, ""));
  
  let adjectives = doc
    .adjectives()
    .out("array")
    .map((w) => w.replace(/\s+/g, ""));

  let keywords = [...new Set([...adjectives, ...nouns])].filter(Boolean);

  
  if (keywords.length === 0){
    keywords = description.split(" ").map((w) => w.replace(/\s+/g, ""));
  }
  
  let combos = [];

  for (let i = 0; i < keywords.length; i++) {
    for (let j = 0; j < keywords.length; j++) {
      if (i !== j) combos.push(keywords[i] + keywords[j]);
    }
  }

  combos = combos.concat(keywords);


  const tlds = [
    ".com",
    ".net",
    ".org",
    ".io",
    ".ai",
    ".co",
    ".dev",
    ".app",
    ".xyz",
    ".me",
    ".tech",
    ".online",
    ".shop"
  ];

  tlds.forEach((tld) => {
    combos.forEach((base) => {
      if (base) suggestions.push(base.toLowerCase() + tld);
    });
  });

  suggestions = [...new Set(suggestions)].filter(Boolean).slice(0, 8);



  // GoDaddy API key and secret
  const apiKey = process.env.GODADDY_API_KEY;
  const apiSecret = process.env.GODADDY_API_SECRET;

  const availability = {};

  for (const domain of suggestions) {
    try {
        const resp = await axios.get(
            `https://api.ote-godaddy.com/v1/domains/available`,
            {
                params: { domain },
                headers: {
                    'Authorization': `sso-key ${apiKey}:${apiSecret}`,
                    'Accept': 'application/json'
                }
            }
        );
        availability[domain] = resp.data.available;
    } catch (e) {
        availability[domain] = null; //if null 
    }
}
  res.render("domain", { showResults: true, description, suggestions, availability, user });
});

app.get('/login', (req, res)=> {
  res.render('login');
})

app.post("/login", async (req, res) => {
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) {
        req.flash('error', 'User not found');
        return res.redirect('/login');
    }
    else{
      bcrypt.compare(password, user.password, (err, result) => {
        if(err){
          req.flash('error', 'Something went wrong, please try again.');
          return res.redirect('/login');
        }
        else if(result) {
          let token = jwt.sign({ email: email }, process.env.JWT_KEY);
          res.cookie("token", token);
          req.flash('success', 'Successfully logged in!');
          res.redirect("/domain");
        }
        else{
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
        }
      })
    }
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/createUser", async (req, res) => {
  let {username, email, password} = req.body;

  if(await userModel.findOne({email})) {
    req.flash('error', 'User already exists with this email. Please try logging in.');
    return res.redirect('/register');
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        password: hash
      })
      let token = jwt.sign({ email: email }, process.env.JWT_KEY);
      res.cookie("token", token);
      req.flash('success', 'Account created successfully!');
      res.redirect("/domain");
    })
  })
})

app.post("/save-domain", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { domain, description } = req.body;

    if(user.savedDomains.indexOf(domain) == -1) {   
      user.savedDomains.push(domain);
      await user.save();
    }


    // Redirect with description as a query parameter
    res.redirect(`/results?description=${encodeURIComponent(description)}`);
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

app.post("/delete-domain", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    let { domain, from, description } = req.body;

    user.savedDomains = user.savedDomains.filter(function(d){
        return d !== domain;
    })
    await user.save();
    
    if(from === "results" && description) {
      res.redirect(`/results?description=${encodeURIComponent(description)}`);
    }
    else{
      res.redirect("/domain");
    }
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
