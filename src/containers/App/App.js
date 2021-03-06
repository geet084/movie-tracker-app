import React, { Component } from 'react';
import '../../normalize.css';
import '../../main.scss';
import { connect } from 'react-redux';
import { setMovies, errorToDisplay, setCurrentUser, isLoading } from '../../actions';
import API from '../../utils/api';
import { apiKey } from '../../utils/api-key';
import Movies from '../Movies/Movies';
import Login from '../Login/Login';
import NotFound from '../../components/NotFound/NotFound';
import { Route, NavLink, withRouter, Switch } from 'react-router-dom';
import SignUp from '../../components/SignUp/SignUp';
import MovieDetails from '../../components/MovieDetails/MovieDetails';
import PropTypes from 'prop-types';

export class App extends Component {
  signUserOut = () => {
    this.removeUserFromStorage();
    this.props.setCurrentUser({});
  }

  removeUserFromStorage = () => {
    localStorage.removeItem('movie-user');
  }

  checkForUser = () => {
    if (localStorage.hasOwnProperty('movie-user')) {
      let user = JSON.parse(localStorage.getItem('movie-user'));
      this.props.setCurrentUser(user);
    }
  }
s
  componentDidMount = async () => {
    this.checkForUser();
    const { errorToDisplay, setMovies, isLoading } = this.props;
    const initialCategory = 'popular';
    const root = `https://api.themoviedb.org/3/movie/${initialCategory}`;
    const url = `${root}?page=1&api_key=${apiKey}&language=en-US`;
    try {
      const movies = await API.getData(url);
      await setMovies(movies.results);
      isLoading(false);
    } catch (error) {
      errorToDisplay(error);
    }
  }

  render() {
    const { loading, user, movies, history, location } = this.props;
    if (loading) {
      return (<h1>Loading Movies...</h1>)
    } else {
      return (
        <div className="App">
          <header className='header-bg'>
            <h1>Movie Tracker</h1>
            <div className='nav-bar'>
              {
                user.name ? <span className="user-name">Welcome {user.name}</span> : ''
              }
              <NavLink exact activeClassName='selected' className='nav-links' to='/'>Popular Movies</NavLink>
              <NavLink activeClassName='selected' className='nav-links' to='/favorites'>Favorites</NavLink>
              {
                user.name ?
                  <button className='nav-links' id='sign-out-button' onClick={this.signUserOut}>Sign Out</button> :
                  <NavLink className='nav-links' to="/login">User Login</NavLink>
              }
            </div>
          </header>
          <Switch>
            <Route exact path='/' component={Movies} />
            <Route path='/favorites' render={() => {
              return <Movies location={location} />
            }} />
            <Route path='*' component={NotFound} />
          </Switch>
            <Route path='/movies/:id' render={({ match }) => {
              const { id } = match.params;
              const movie = movies.find(movie => movie.id === parseInt(id))
              if (movie) {
                return <MovieDetails history={history} {...movie} />
              } else {
                return <NotFound />
              }
            }} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={SignUp} />
        </div>
      )
    }
  }
}

App.propTypes = {
  user: PropTypes.object,
  movies: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  setMovies: PropTypes.func,
  setCurrentUser: PropTypes.func,
  errorToDisplay: PropTypes.func,
  isLoading: PropTypes.func,
}

App.defaultProps = {
  user: {},
  movies: [{}],
  loading: false,
}

export const mapStateToProps = (state) => ({
  user: state.user,
  movies: state.movies,
  loading: state.status,
})

export const mapDispatchToProps = (dispatch) => ({
  setMovies: (movies) => dispatch(setMovies(movies)),
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  errorToDisplay: (message) => dispatch(errorToDisplay(message)),
  isLoading: (status) => dispatch(isLoading(status)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));