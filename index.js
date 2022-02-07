const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const contact = require('./models/contact');


const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views' )); 
app.use(express.urlencoded());
app.use(express.static('assets'));

var contactList = [
    {
        name: "Anjali",
        phone: "1234389135"
    },
    {
        name: "john",
        phone: "1234567890"
    },
    {
        name:"kylie",
        phone: "0987654321"
    }
]

app.get('/', function(req,res){
    // console.log(__dirname);
    //  res.send('<h1>cool, it is runnig or is it</h1>');

    contact.find({}, function(err, contacts){
        if(err){
            console.log('error in finding contacts in db');
            return;
        }

        return res.render('home',{
            title:'contacts list',
            contacts_list: contacts
        });
    });
    
});

app.get('/practice', function(req,res){
    return res.render('practice',{
        title:'lets play with ejs'
    });
});

app.post('/create-contact', function(req,res){
    // return res.redirect('/practice');
   /*contactList.push({
       name:req.body.name,
       phone:req.body.phone
   });*/

   //contactList.push(req.body);

   contact.create({
       name:req.body.name,
       phone:req.body.phone
   }, function(err, newContact){
       if(err){
           console.log("error in creating a contact!");
           return;
       }
       
       console.log('***********', newContact);
       return res.redirect('back');
   });

  // return res.redirect('back');
});

app.get("/delete-contact", function(req,res){
    //get the id from query in the url
    let id = req.query.id;
    
    //find the contact in db using id and delete it
    contact.findByIdAndDelete(id, function(err){
        if(err){
            console.log('error in deleting object from db');
            return;
        }
    
    // let contactIndex = contactList.findIndex(contact => contact.phone == phone);

    // if (contactIndex != -1){
        //contactList.splice(contactIndex, 1);


    return res.redirect('back');

});

});

app.get("/search-contact", function(req,res){
      var regex = new RegExp(req.body.name);
    contact.find({name:regex}, function(err,contacts){
        if(err){
             console.log("can't search");
             return;
        }
       
        return res.render('home',{
            title:'contacts list',
            contacts_list: contacts
        });
    });
    
});


app.listen(port, function(err){
    if(err)
    {
        console.log('error is running the server', err);
    }

    console.log("yup my express server is running on port", port);
});