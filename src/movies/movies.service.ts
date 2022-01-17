import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import * as _ from 'lodash';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MoviesService {
  constructor(private configService: ConfigService) {}

  randomDate(start, end) {
    end = _.isUndefined(end) ? new Date() : new Date(end);
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  async create(createMovieDto: CreateMovieDto, headers: any) {
    if (_.isEmpty(createMovieDto.title)) {
      return { error: 'Title cannot be blank' };
    }
    let newMovie = {};
    let viewingDate = new Date();
    let movieDetails: any = await axios.get(
      `http://www.omdbapi.com/?t=${
        createMovieDto.title
      }&apikey=${this.configService.get<string>('OMDB')}`,
    );
    if (!_.isEmpty(createMovieDto.date)) {
      viewingDate = new Date(createMovieDto.date);
    } else if (!_.isEmpty(createMovieDto.startDate)) {
      viewingDate = this.randomDate(
        new Date(createMovieDto.startDate),
        createMovieDto.endDate,
      );
    }
    if (movieDetails) {
      movieDetails = movieDetails.data;
      console.log(movieDetails)
      newMovie = {
        title: movieDetails.Title,
        description: movieDetails.Plot,
        language: 'English',
        year: Number(movieDetails.Year),
        genre: movieDetails.Genre,
        viewingDate: viewingDate,
        imdbRating: Number(
          _.get(movieDetails.Ratings[0], 'Value').split('/')[0],
        ),
        imdbId: movieDetails.imdbID,
        loved: createMovieDto.loved || false,
      };
      const config = {
        headers: {
          authorization: headers.authorization
        },
      };
      try {
        const movieCreated = await axios.post(
          'https://systemapi.prod.ashish.me/movies',
          newMovie,
          config,
        );
        return movieCreated.data;
      } catch (e) {
        return { error: `Failed to create movie - ${e}` };
      }
    } else {
      return { error: 'Movie not found' };
    }
  }
}
