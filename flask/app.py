from flask import Flask, jsonify, abort, request, make_response, send_from_directory
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__)
CORS(app)

DATABASE_CONFIG = {
    'dbname': 'postgres',
    'user': os.getenv('POSTGRES_USER', 'my_user'),  # 
    'password': os.getenv('POSTGRES_PASSWORD', 'my_password'),  # 
    'host': 'postgres-container',
    'port': '5432'
}

def get_db_connection():
    return psycopg2.connect(**DATABASE_CONFIG, cursor_factory=RealDictCursor)

def init_movie_db():
    """Initialize the movie database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS movies;")
    cursor.execute("""
        CREATE TABLE movies (
            movie_id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            director VARCHAR(100),
            year INT
        );
    """)
    conn.commit()
    cursor.close()
    conn.close()

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to the Movie API. Use /movies for CRUD operations."
    })

@app.route('/movies', methods=['GET'])
def get_movies():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM movies;")
    movies = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'movies': movies})

@app.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM movies WHERE movie_id = %s;", (movie_id,))
    movie = cursor.fetchone()
    cursor.close()
    conn.close()
    if movie is None:
        abort(404)
    return jsonify({'movie': movie})

@app.route('/movies', methods=['POST'])
def add_movie():
    if not request.json or 'title' not in request.json:
        abort(400)

    title = request.json['title']
    director = request.json.get('director')
    year = request.json.get('year')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO movies (title, director, year) VALUES (%s, %s, %s) RETURNING *;",
        (title, director, year)
    )
    new_movie = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'movie': new_movie}), 201

@app.route('/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM movies WHERE movie_id = %s;", (movie_id,))
    movie = cursor.fetchone()
    if movie is None:
        abort(404)

    title = request.json.get('title', movie['title'])
    director = request.json.get('director', movie['director'])
    year = request.json.get('year', movie['year'])
    
    cursor.execute(
        "UPDATE movies SET title = %s, director = %s, year = %s WHERE movie_id = %s RETURNING *;",
        (title, director, year, movie_id)
    )
    updated_movie = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'movie': updated_movie})

@app.route('/movies/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM movies WHERE movie_id = %s RETURNING movie_id;", (movie_id,))
    deleted_movie = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    if deleted_movie is None:
        abort(404)
    return jsonify({'result': True})

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)

if __name__ == '__main__':
    init_movie_db()
    #app.run(host='#127.0.0.1', port=5000)
    app.run(host='0.0.0.0', port=5000) #container to others interfaces