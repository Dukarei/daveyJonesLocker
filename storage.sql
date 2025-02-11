CREATE DATABASE jonesLocker;
USE jonesLocker;

CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE,
    pass VARCHAR(255) NOT NULL
);
CREATE TABLE incoming_IDs (
    email VARCHAR(255) ,
    FOREIGN KEY (email) REFERENCES users(email),
    value VARCHAR(255), 
    PRIMARY KEY(email,value)

);


CREATE TABLE received_IDs (
    email VARCHAR(255),
    FOREIGN KEY (email) REFERENCES users(email),
    value VARCHAR(255), 
    received TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(email,value)
);


INSERT INTO users (email, pass)
VALUES
('david@fuck','fuck'),
('jeff@shit','shit');

INSERT INTO incoming_IDs (email, value)
VALUES
('david@fuck','2553'),
('jeff@shit','2667');

SELECT * FROM incoming_IDs;

#all values w/ email = req.email will be shipped back to create incoming or received lists. 
#double check encryption stuff(local copy that never leaves db + clientside copy vs normal stuff) 
