let express = require('express')
let bodyParser = require('body-parser')
let uuid = require('uuid')
let server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended:true}))

const PORT = process.env.PORT || 8080

let db = 
{
    galaxies : [],
    stars : [],
    planets : [],
    moons : [],
}

//hardcoded test data
let g01 = {name:"some galaxy name", description:"some description", id: "1"}
db.galaxies.push(g01)

let g02 = {name:"some other galaxy name", description:"some description 02", id: "2"}
db.galaxies.push(g02)

let g03 = {name:"some other, other galaxy name", description:"some description 03", id: "3"}
db.galaxies.push(g03)

let s01 = {name:"star01", description:"this is the descriptoin of star01", galaxyId:"1", id:"1"}
db.stars.push(s01)

let s02 = {name:"star02", description:"this is the descriptoin of start02", galaxyId:"1", id:"2"}
db.stars.push(s02)

let p01 = {name:"planet01", description:"this is the description of a planet01", galaxyId:"1", starId:"1", id:"1"}
db.planets.push(p01)

let p02 = {name:"planet02", description:"this is the description of a planet02", galaxyId:"1", starId:"1", id:"2"}
db.planets.push(p02)

//function to craete a galaxy
server.post('/galaxies',function(req,res){
    //console.log("A post function has been made to the root of the server.")
    //return res.send("A post function has been made to the root of the server.")

    galaxy = req.body;
    galaxy.id = uuid.v1()
    galaxy.planets = []
    db.galaxies.push(galaxy)

    res.send({message: "galaxy succesfully created.", data: galaxy})
})

//function to return all galaxies.
server.get('/galaxies',function(req,res){
    res.send({data: db.galaxies})
})

//function to return a single galaxy by an id. 
server.get('/galaxies/:id',function(req,res){

    let galaxyId = req.params.id;
    let found_galaxy = db.galaxies.find(galaxy => {return galaxy.id == galaxyId})

    if (found_galaxy)
    {
        return res.send({data: found_galaxy})
    }

    return res.send("No galaxy by that id!")
})

//function to edit a single galaxy by an id. 
server.put('/galaxies/:id',function(req,res){

    let edited_galaxy = req.body;   //this the galaxy that was passed to us for editing. 
    let galaxyId = req.params.id;  //this will be the id of both the new and old galaxy.

    let found_galaxy = db.galaxies.find(galaxy => {return galaxy.id == galaxyId})

    if (found_galaxy)
    {
        //add the old id to the object that was passed to us.
        edited_galaxy.id = found_galaxy.id;

        //remove the old object from the array.
        //Find its index.

        let indexToRemove = db.galaxies.indexOf(found_galaxy)
        db.galaxies.splice(indexToRemove,1)
        db.galaxies.push(edited_galaxy)

        //return the edited object to the user.
        return res.send({data: edited_galaxy})

    }

    return res.send("No galaxy by that id!")
})

//function to remove a single galaxy by an id. 
server.delete('/galaxies/:id',function(req,res){

    let galaxyId = req.params.id;  //this is the id of the galaxy to remove.
    let found_galaxy = db.galaxies.find(galaxy => {return galaxy.id == galaxyId})
    if (found_galaxy)
    {
        //Find its index.
        let indexToRemove = db.galaxies.indexOf(found_galaxy)
        //splice it from the database.
        db.galaxies.splice(indexToRemove,1)

        //interate over the stars database and remove any objects that have the that galaxy id.
        for (var i = db.stars.length-1; i>=0; i--)
        {
            star = db.stars[i]
            console.log("galaxyId:", galaxyId)
            if (star.galaxyId == found_galaxy.id)
            {   
                console.log("we are removing a star with a galaxy id of: ", star.galaxyId)
                db.stars.splice(i,1)
            } 
        }

        return res.send({message:"galaxy has been remvoed.",data: db.galaxies})
    }
    return res.send("No galaxy by that id!  Nothing has been removed.")
})

//-- section for stars --//

//function to create a star
server.post('/stars/:galaxyId',function(req,res){

    //verify that we are placing the star in a valid galaxy.
    let galaxyId = req.params.galaxyId;    
    let found_galaxy = db.galaxies.find(galaxy => {return galaxy.id == galaxyId})

    if (found_galaxy)
    {
        star = req.body;
        star.galaxyId = req.params.galaxyId;
        star.id = uuid.v1()
        db.stars.push(star)
        
        found_galaxy.planets.push({starId:star.id})
        return res.send({message: "star succesfully created.", data: db.stars})
    }
    else
    {
        return res.send({message: "That galaxy DNE"})
    }

})

//function to return all stars.
server.get('/stars',function(req,res){
    res.send({data: db.stars})
})

//function to return a single star by an id. 
server.get('/stars/:id',function(req,res){

    let starId = req.params.id;
    let found_star = db.stars.find(star => {return star.id == starId})

    if (found_star)
    {
        return res.send({data: found_star})
    }

    return res.send("No star by that id!")
})

//function to edit a single star by an id. 
server.put('/stars/:id',function(req,res){

    let edited_star = req.body;   //this the star that was passed to us for editing. 
    let starId = req.params.id;  //this will be the id of both the new and old star.

    console.log("id from parameter string: ", starId)

    let found_star = db.stars.find(star => {return star.id == starId})

    if (found_star)
    {
        //add the old id to the star object that was passed to us.
        edited_star.id = found_star.id;

        //remove the old object from the array.
        //Find its index.

        let indexToRemove = db.stars.indexOf(found_star)
        db.stars.splice(indexToRemove,1)
        db.stars.push(edited_star)

        //return the edited object to the user.
        return res.send({data: edited_star})

    }

    return res.send("No star by that id!")
})

//function to remove a single star by an id. 
server.delete('/stars/:id',function(req,res){

    let starId = req.params.id;  //this is the id of the star to remove.
    let found_star = db.stars.find(star => {return star.id == starId})
    if (found_star)
    {
        //Find its index.
        let indexToRemove = db.stars.indexOf(found_star)
        //splice it from the database.
        db.stars.splice(indexToRemove,1)
        return res.send({message:"star has been remvoed.",data: db.stars})
    }
    return res.send("No star by that id!  Nothing has been removed.")
})

//-- section for stars --//

//function to create a planet
server.post('/planets/:starId',function(req,res){

    //verify that we are placing the planet around a valid star.
    let starId = req.params.starId;    
    let found_star = db.stars.find(star => {return star.id == starId})

    if (found_star)
    {
        planet = req.body;
        planet.starId = req.params.starId;
        planet.id = uuid.v1()
        planet.galaxyId = found_star.galaxyId
        db.planets.push(planet)
        return res.send({message: "planet succesfully created.", data: db.planets})
    }
    else
    {
        return res.send({message: "That star DNE"})
    }

})

//function to return all planets.
server.get('/planets',function(req,res){
    res.send({data: db.planets})
})

//function to return a single planet by an id. 
server.get('/planets/:id',function(req,res){

    let planetId = req.params.id;
    let found_planet = db.planets.find(planet => {return planet.id == planetId})

    if (found_planet)
    {
        return res.send({data: found_planet})
    }

    return res.send("No planet with that id!")
})

//function to edit a single planet by an id. 
server.put('/planets/:id',function(req,res){

    let edited_planet = req.body;   //this the star that was passed to us for editing. 
    let planetId = req.params.id;  //this will be the id of both the new and old star.

    let found_planet = db.planets.find(planet => {return planet.id == planetId})

    if (found_planet)
    {
        //add the old id to the planet object that was passed to us.
        edited_planet.id = found_planet.id;
        edited_planet.starId = found_planet.starId;
        edited_planet.galaxyId = found_planet.galaxyId;

        //remove the old object from the array.
        //Find its index.

        let indexToRemove = db.planets.indexOf(found_planet)
        db.planets.splice(indexToRemove,1)
        db.planets.push(edited_planet)

        //return the edited object to the user.
        return res.send({data: edited_planet})

    }

    return res.send("No planet by that id!")
})

server.listen(PORT, function(){console.log("the server is runing confortabally.")})

//Done: if you remove a galaxy you need to remove the stars within it so as not to abandon them.

//ToDo: function to create a planet
//ToDo: function to remove a planet
//ToDo: function to show all a planets
//ToDo: function to show a single planet by id.
//ToDo: function to delete a planet.

