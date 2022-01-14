import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import * as _ from 'lodash';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MoviesService {

  constructor(private configService: ConfigService){

  }

  randomDate(start, end = new Date()) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  async create(createMovieDto: CreateMovieDto) {
    if (_.isEmpty(createMovieDto.title)) {
      return 'Title cannot be blank';
    }
    let newMovie = {}
    let viewingDate = new Date()
    let movieDetails: any = await axios.get(
      `http://www.omdbapi.com/?t=${createMovieDto.title}&apikey=${this.configService.get<string>('OMDB')}`,
    );
    if(!_.isEmpty(createMovieDto.date)){
      viewingDate = createMovieDto.date
    } else if(!_.isEmpty(createMovieDto.startDate) && !_.isEmpty(createMovieDto.endDate)){
      viewingDate = this.randomDate(createMovieDto.startDate, createMovieDto.endDate)
    }
    if(movieDetails){
      movieDetails = movieDetails.data
      newMovie = {
        title: movieDetails.Title,
        description: movieDetails.Plot,
        language: 'English',
        year: Number(movieDetails.Year),
        genre: movieDetails.Genre,
        viewingDate: viewingDate,
        imdbRating: Number(_.get(movieDetails.Ratings[0], 'Value').split('/')[0]),
        imdbId: movieDetails.imdbID,
        loved: createMovieDto.loved || false,
      };
    }
    return newMovie;
  }
}
