/*
Schema DDL by Jenna Rivera and Kaelee Duong
Group 79 Project Step 2 draft
CS340 Fall 2025
*/


SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

--
-- Table structure for table `Dancers`
--
CREATE OR REPLACE TABLE Dancers (
    dancerID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    PRIMARY KEY (dancerID)
);

--
-- Data for table `Dancers`
--

INSERT INTO Dancers (
    firstName,
    lastName,
    email
)
VALUES
("Kaelee", "Duong", "kd@hello.com"),
("Jenna", "Rivera", "jr@hello.com"),
("Cool", "Dude", "cd@hello.com");

--
-- Table structure for table `Locations`
--

CREATE OR REPLACE TABLE Locations (
    locationID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    PRIMARY KEY (locationID)
);

--
-- Data for table `Locations`
--

INSERT INTO Locations (
    name,
    address
)
VALUES
("Memorial Union", "2501 SW Jefferson Way, Corvallis, OR 97331"),
("Frosty Fox", "2043 NW Monroe Ave, Corvallis, OR 97330"),
("Some Building","1234 Cool Blvd, Corvallis, OR 97330");

--
-- Table structure for table `Performances`
--

CREATE OR REPLACE TABLE Performances (
    performanceID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    date datetime NOT NULL,
    locationID int(11),
    PRIMARY KEY (performanceID),
    FOREIGN KEY (locationID) REFERENCES Locations(locationID)
        ON DELETE CASCADE
);

--
-- Data for table `Performances`
--

INSERT INTO Performances (
    name,
    date,
    locationID
)
VALUES
("Warm Performance", "2025-02-24", "1"),
("Hot Performance", "2025-06-18", "2"),
("Cool Performance", "2025-10-30", "3");

--
-- Table structure for table `Practices`
--

CREATE OR REPLACE TABLE Practices (
    practiceID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    date datetime NOT NULL,
    performanceID int(11),
    locationID int(11),
    PRIMARY KEY (practiceID),
    FOREIGN KEY (performanceID) REFERENCES Performances(performanceID)
        ON DELETE CASCADE,
    FOREIGN KEY (locationID) REFERENCES Locations(locationID)
        ON DELETE CASCADE
);

--
-- Data for table `Performances`
--

INSERT INTO Practices (
    date,
    performanceID,
    locationID
)
VALUES
("2025-01-30", "1", "1"),
("2025-02-14", "2", "2"),
("2025-04-24", "2", "2"),
("2025-10-18", "3", "3");

--
-- Table structure for table `Performers`
--

CREATE OR REPLACE TABLE Performers (
    performerID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    dancerID int(11),
    performanceID int(11),
    PRIMARY KEY (performerID),
    FOREIGN KEY (dancerID) REFERENCES Dancers(dancerID)
        ON DELETE CASCADE,
    FOREIGN KEY (performanceID) REFERENCES Performances(performanceID)
        ON DELETE CASCADE
);

--
-- Data for table `Performers`
--

INSERT INTO Performers (
    dancerID,
    performanceID
)
VALUES
("1", "1"),
("1", "2"),
("2", "3");

--
-- Table structure for table `Dancer_Practices`
--

CREATE OR REPLACE TABLE Dancer_Practices (
    dancerPracticeID int(11) NOT NULL UNIQUE AUTO_INCREMENT,
    mandatory BOOLEAN DEFAULT TRUE,
    dancerID int(11),
    practiceID int(11),
    PRIMARY KEY (dancerPracticeID),
    FOREIGN KEY (dancerID) REFERENCES Dancers(dancerID)
        ON DELETE CASCADE,
    FOREIGN KEY (practiceID) REFERENCES Practices(practiceID)
        ON DELETE CASCADE
);

--
-- Data for table `Dancer_Practices`
--

INSERT INTO Dancer_Practices (
    mandatory,
    dancerID,
    practiceID
)
VALUES
(TRUE, "1", "1"),
(TRUE, "2", "2"),
(FALSE, "3", "2"),
(FALSE, "3", "3");

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- Citations: All work done by group 79