DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    director VARCHAR(100),
    year INT
);
