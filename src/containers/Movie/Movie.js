import React, { Component } from 'react'
import { toggleFavorite, errorToDisplay } from '../../actions';
import { connect } from 'react-redux';
import API from '../../utils/api';

export class Movie extends Component {

  handleClick = async () => {
    const { user, toggleFavorite, errorToDisplay } = this.props;
    if (user.favorites) {
      const { id, title, poster_path, release_date, vote_average, overview } = this.props;
      const favoriteMovie = {
        movie_id: id,
        user_id: user.id,
        title,
        poster_path,
        release_date,
        vote_average,
        overview,
      };
      toggleFavorite(favoriteMovie);
      const favorite = user.favorites.find(favorite => favorite.movie_id === id)
      favorite ? 
        await this.removeFromUserFavorites() : 
        await this.addToUserFavorites(favoriteMovie);
    } else {
      errorToDisplay('Please log in to add favorites');
    }
  }

  addToUserFavorites = async (movie) => {
    try {
      await API.postData(movie, '/favorites/new');
    } catch(error) {
      errorToDisplay(error)
    }
  }

  removeFromUserFavorites = async () => {
    const { id, user } = this.props;
    try {
      await API.deleteData(`/${user.id}/favorites/${id}`)
    } catch (error) {
      errorToDisplay(error)
    }
  }

  render() {
    const { id, poster_path, user } = this.props;
    let favorite;
    if (user.favorites) {
      favorite = user.favorites.find(favorite => favorite.movie_id === id)
    }
    return (
      <div className='movie-card' id={id}>
        <button 
          onClick={this.handleClick}
          className=
          {
            favorite ? 'favorite-icon favorite' : 'favorite-icon'
          }
        ></button>
        <img className='movie-image' src={`http://image.tmdb.org/t/p/w342/${poster_path}`} alt="a" />
      </div>
    )
  }
}

export const mapStateToProps = (state) => ({
  user: state.user
});

export const mapDispatchToProps = (dispatch) => ({
  toggleFavorite: (movie) => dispatch(toggleFavorite(movie)),
  errorToDisplay: (message) => dispatch(errorToDisplay(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Movie);