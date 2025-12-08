var express = require('express')
var exphbs = require('express-handlebars')

const app = express();
const PORT = 9779; 

// database
const db = require('./db-connector');

// set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// set up handlebars    
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');


// routes

// ===== home =====
app.get('/', async (req, res) => {
  res.render('home', { title: 'ECLIPSE Crew Management System' });
});

// ===== dancers =====
app.get('/dancers', async (req, res) => {
  try {
    const [dancers] = await db.query("SELECT * FROM Dancers;");

    const createdID = req.query.created || null;

    const updatedID = req.query.updated || null;

    res.render('dancers', { title: 'Dancers', dancers, createdID, updatedID });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database query error");
  }
});

// ===== performances =====
app.get('/performances', async (req, res) => {
  try {
    const [performances] = await db.query("SELECT Performances.performanceID, Performances.name, DATE(Performances.date) AS date, Locations.name AS locationName FROM Performances JOIN Locations ON Performances.locationID = Locations.locationID;");

    const [locations] = await db.query("SELECT locationID, name FROM Locations;");

    const createdID = req.query.created || null;

    res.render('performances', { title: 'Performances', performances, locations, createdID});
  } catch (err) {
    console.error(err);
    res.status(500).send("Database query error");
  }
});


// ===== practices =====
app.get('/practices', async (req, res) => {
    try {
    const [practices] = await db.query("SELECT Practices.practiceID, DATE(Practices.date) AS date, Locations.name AS locationName, Performances.name AS performanceName FROM Practices JOIN Locations ON Practices.locationID = Locations.locationID JOIN Performances ON Practices.performanceID = Performances.performanceID;");
    
    const [performances] = await db.query("SELECT performanceID, name FROM Performances;");

    const [locations] = await db.query("SELECT locationID, name FROM Locations;");

    const createdID = req.query.created || null;
    
    res.render('practices', { title: 'Practices', practices, performances, locations, createdID });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database query error");
  }
});

// ===== locations =====
app.get('/locations', async (req, res) => {
  try {
    const [locations] = await db.query("SELECT * FROM Locations;");
    const createdID = req.query.created || null;
    res.render('locations', { title: 'Locations', locations, createdID});
  } catch (err) {
    console.error(err);
    res.status(500).send("Database query error");
  }
});

// ===== dancer_practices =====
app.get('/dancerpractices', async (req, res) => {
  try {
    const [dancerpractices] = await db.query("SELECT Dancer_Practices.dancerPracticeID, Dancer_Practices.mandatory, Dancers.firstName, Dancers.lastName, Practices.date AS practiceDate, Locations.name AS locationName FROM Dancer_Practices JOIN Dancers ON Dancer_Practices.dancerID = Dancers.dancerID JOIN Practices ON Dancer_Practices.practiceID = Practices.practiceID JOIN Locations ON Practices.locationID = Locations.locationID;");

    const [dancers] = await db.query("SELECT dancerID, firstName, lastName FROM Dancers;");

    const [practices] = await db.query("SELECT Practices.practiceID, Practices.date, Locations.name AS locationName FROM Practices JOIN Locations ON Practices.locationID = Locations.locationID;");

    const createdID = req.query.created || null;
    
    res.render('dancerpractices', { title: 'Dancer Practices', dancerpractices, dancers, practices, createdID });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database query error");
  }
});

// ===== performers =====
app.get('/performers', async (req, res) => {
  try {
    const [performers] = await db.query("SELECT Performers.performerID, Dancers.firstName, Dancers.lastName, Performances.name AS performanceName FROM Performers JOIN Dancers ON Performers.dancerID = Dancers.dancerID JOIN Performances ON Performers.performanceID = Performances.performanceID;");

    const [dancers] = await db.query("SELECT dancerID, firstName, lastName FROM Dancers;");

    const [performances] = await db.query("SELECT performanceID, name FROM Performances;");

    const createdID = req.query.created || null;

    res.render('performers', { title: 'Performers', performers, dancers, performances, createdID });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database query error");
  }
});

/* DELETE routes */

// delete dancer
app.post('/delete-dancer', async (req, res) => {
    const dancerID = req.body.dancerID;

    try {
        await db.query("CALL DeleteDancer(?);", [dancerID]);
        res.redirect('/dancers');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete dancer");
    }
});

// delete performance
app.post('/delete-performance', async (req, res) => {
    const performanceID = req.body.performanceID;

    try {
        await db.query("CALL DeletePerformance(?);", [performanceID]);
        res.redirect('/performances');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete performance");
    }
});

// delete practice
app.post('/delete-practice', async (req, res) => {
    const practiceID = req.body.practiceID;

    try {
        await db.query("CALL DeletePractice(?);", [practiceID]);
        res.redirect('/practices');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete practice");
    }
});

// delete location
app.post('/delete-location', async (req, res) => {
    const locationID = req.body.locationID;

    try {
        await db.query("CALL DeleteLocation(?);", [locationID]);
        res.redirect('/locations');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete location");
    }
});

// delete dancer practice
app.post('/delete-dancer-practice', async (req, res) => {
    const dancerPracticeID = req.body.dancerPracticeID;

    try {
        await db.query("CALL DeleteDancerPractice(?);", [dancerPracticeID]);
        res.redirect('/dancerpractices');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete dancer practice");
    }
});

// delete performer
app.post('/delete-performer', async (req, res) => {
    const performerID = req.body.performerID;

    try {
        await db.query("CALL DeletePerformer(?);", [performerID]);
        res.redirect('/performers');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete performer");
    }
});

/*CREATE routes */

// create dancer
app.post('/add-dancer', async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
        const [rows] = await db.query("CALL CreateDancer(?, ?, ?);", [firstName, lastName, email]);
        const new_id = rows[0][0].new_id;
        res.redirect(`/dancers?created=${new_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create dancer");
    }
});

// create performance
app.post('/add-performance', async (req, res) => {
    const { name, date, locationID } = req.body;

    try {
        const [rows] = await db.query("CALL CreatePerformance(?, ?, ?);", [name, date, locationID]);
        const new_id = rows[0][0].new_id;
        res.redirect(`/performances?created=${new_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create performance");
    }
});

// create practice
app.post('/add-practice', async (req, res) => {
    const { date, locationID, performanceID } = req.body;

    try {
        const [rows] = await db.query("CALL CreatePractice(?, ?, ?);", [date, locationID, performanceID]);
        const new_id = rows[0][0].new_id;
        res.redirect(`/practices?created=${new_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create practice");
    }
});

// create location
app.post('/add-location', async (req, res) => {
    const { name, address } = req.body;

    try {
        const [rows] = await db.query("CALL CreateLocation(?, ?);", [name, address]);
        const new_id = rows[0][0].new_id;
        res.redirect(`/locations?created=${new_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create location");
    }
});

// create dancer practice
app.post('/add-dancer-practice', async (req, res) => {
    const { dancerID, practiceID, mandatory } = req.body;

    try {
        const [rows] = await db.query("CALL CreateDancerPractice(?, ?, ?);", [mandatory, dancerID, practiceID]);
        const new_id = rows[0][0].new_id;
        res.redirect(`/dancerpractices?created=${new_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create dancer practice");
    }
});

// create performer
app.post('/add-performer', async (req, res) => {
    const { dancerID, performanceID } = req.body;

    try {
        const [rows] = await db.query("CALL CreatePerformer(?, ?);", [dancerID, performanceID]);
        const new_id = rows[0][0].new_id;
        res.redirect(`/performers?created=${new_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create performer");
    }
});


/*UPDATE routes */

//update dancer 
app.post('/edit-dancer', async (req, res) => {
    const { dancerID, newFirstName, newLastName, newEmail } = req.body;

    try {
        await db.query("CALL UpdateDancer(?, ?, ?, ?);", [dancerID, newFirstName, newLastName, newEmail]);
        res.redirect(`/dancers?updated=${dancerID}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update dancer");
    }
});

app.post('/edit-performance', async (req, res) => {
    const { performanceID, newName, newDate, newLocation } = req.body;

    try {
        await db.query("CALL UpdatePerformance(?, ?, ?, ?);", [performanceID, newName, newDate, newLocation]);
        res.redirect(`/performances?updated=${performanceID}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update performance");
    }
});

app.post('/edit-practice', async (req, res) => {
    const { practiceID, newDate, newLocation, newPerformance } = req.body;

    try {
        await db.query("CALL UpdatePractice(?, ?, ?, ?);", [practiceID, newDate, newLocation, newPerformance]);
        res.redirect(`/practices?updated=${practiceID}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update practice");
    }
});

app.post('/edit-location', async (req, res) => {
    const { locationID, newName, newAddress } = req.body;

    try {
        await db.query("CALL UpdateLocation(?, ?, ?);", [locationID, newName, newAddress]);
        res.redirect(`/locations?updated=${locationID}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update location");
    }
}); 

app.post('/edit-dancer-practice', async (req, res) => {
    const { dancerPracticeID, newDancer, newPractice, newMandatory } = req.body;

    try {
        await db.query("CALL UpdateDancerPractice(?, ?, ?, ?);", [dancerPracticeID, newMandatory, newDancer, newPractice]);
        res.redirect(`/dancerpractices?updated=${dancerPracticeID}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update dancer practice");
    }
});

app.post('/edit-performer', async (req, res) => {
    const { performerID, newDancerID, newPerformanceID } = req.body;

    try {
        await db.query("CALL UpdatePerformer(?, ?, ?);", [performerID, newDancerID, newPerformanceID]);
        res.redirect(`/performers?updated=${performerID}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update performer");
    }
});

/* RESET sample data route */
app.post('/reset-tables', async (req, res) => {
    try {
        await db.query("CALL ResetProd();");
        res.redirect('/');   // go back to the home page
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to reset tables");
    }
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://classwork.engr.oregonstate.edu:${PORT}`);
});