import React, { useState, useEffect } from 'react';

console.log("All Vite Env Variables:", import.meta.env);
const API_URL = import.meta.env.VITE_API_URL
// const API_URL = 'http://127.0.0.1:5000';
//const API_URL = process.env.REACT_APP_VM_IP;

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', director: '', year: '' });
  const [getMovieId, setGetMovieId] = useState('');
  const [fetchedMovie, setFetchedMovie] = useState(null);
  const [updateMovie, setUpdateMovie] = useState({ id: '', title: '', director: '', year: '' });

  const fetchMovies = async () => {
    const res = await fetch(`${API_URL}/movies`);
    const data = await res.json();
    setMovies(data.movies);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie),
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Added:', data.movie);
      setNewMovie({ title: '', director: '', year: '' });
      fetchMovies();
    }
  };

  const handleGetMovie = async () => {
    if (!getMovieId) return;
    const res = await fetch(`${API_URL}/movies/${getMovieId}`);
    if (res.ok) {
      const data = await res.json();
      setFetchedMovie(data.movie);
    } else {
      setFetchedMovie(null);
      alert('Movie not found');
    }
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    const { id, title, director, year } = updateMovie;
    if (!id) return;
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, director, year }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log('Updated:', data.movie);
      setUpdateMovie({ id: '', title: '', director: '', year: '' });
      fetchMovies();
    }
  };

  const handleDeleteMovie = async (id) => {
    const res = await fetch(`${API_URL}/movies/${id}`, { method: 'DELETE' });
    if (res.ok) {
      console.log('Deleted movie', id);
      fetchMovies();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Movie Management</h1>
      
      <section style={{ marginBottom: '20px' }}>
        <h2>All Movies</h2>
        <button onClick={fetchMovies}>Refresh Movies</button>
        <ul>
          {movies.map(movie => (
            <li key={movie.movie_id} style={{ marginBottom: '10px' }}>
              <strong>{movie.title}</strong> ({movie.year || 'N/A'}) – Directed by {movie.director || 'N/A'}
              <button onClick={() => handleDeleteMovie(movie.movie_id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
              <button
                onClick={() =>
                  setUpdateMovie({
                    id: movie.movie_id,
                    title: movie.title,
                    director: movie.director,
                    year: movie.year,
                  })
                }
                style={{ marginLeft: '10px' }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Add Movie</h2>
        <form onSubmit={handleAddMovie}>
          <input
            type="text"
            placeholder="Title"
            value={newMovie.title}
            onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            placeholder="Director"
            value={newMovie.director}
            onChange={e => setNewMovie({ ...newMovie, director: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input
            type="number"
            placeholder="Year"
            value={newMovie.year}
            onChange={e => setNewMovie({ ...newMovie, year: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Add Movie</button>
        </form>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Get Movie By ID</h2>
        <input
          type="number"
          placeholder="Movie ID"
          value={getMovieId}
          onChange={e => setGetMovieId(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleGetMovie}>Get Movie</button>
        {fetchedMovie && (
          <div style={{ marginTop: '10px' }}>
            <h3>Movie Details</h3>
            <p>ID: {fetchedMovie.movie_id}</p>
            <p>Title: {fetchedMovie.title}</p>
            <p>Director: {fetchedMovie.director || 'N/A'}</p>
            <p>Year: {fetchedMovie.year || 'N/A'}</p>
          </div>
        )}
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Update Movie</h2>
        <form onSubmit={handleUpdateMovie}>
          <input
            type="number"
            placeholder="Movie ID"
            value={updateMovie.id}
            onChange={e => setUpdateMovie({ ...updateMovie, id: e.target.value })}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            placeholder="Title"
            value={updateMovie.title}
            onChange={e => setUpdateMovie({ ...updateMovie, title: e.target.value })}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            placeholder="Director"
            value={updateMovie.director}
            onChange={e => setUpdateMovie({ ...updateMovie, director: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <input
            type="number"
            placeholder="Year"
            value={updateMovie.year}
            onChange={e => setUpdateMovie({ ...updateMovie, year: e.target.value })}
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Update Movie</button>
        </form>
      </section>
    </div>
  );
}

export default App;
