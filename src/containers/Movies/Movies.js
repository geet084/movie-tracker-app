import React from 'react'
import Movie from '../Movie/Movie'
import { connect } from 'react-redux'

const Movies = (props) => {

  return (
    <div>
      {
        props.movies.length &&
          props.movies.map(movie => <Movie {...movie} key={movie.id} />)
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return { movies: state.movies, }
}

export default connect(mapStateToProps)(Movies);