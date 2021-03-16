import axios from "axios";
import Constants from "config/constants";
import getParamString from "utils/getParamString";

class SearchService {
  constructor() {
    this.baseUrl = Constants.BASE_URL;
    this.apiKey = Constants.API_KEY;
    this.imgUrl = Constants.IMAGE_URL;
  }

  getSearchData = async (params) => {
    let query = getParamString({ api_key: this.apiKey, ...params });

    return axios.get(`${this.baseUrl}${query}`).then((payload) => payload.data);
  };

  getActorDetails = async (id) => {
    let query = getParamString({ api_key: this.apiKey, url: `person/${id}` });

    return axios.get(`${this.baseUrl}${query}`).then((payload) => {
      const { id, profile_path, name, biography } = payload.data;
      return {
        id,
        path: profile_path
          ? `${this.imgUrl}w500${profile_path}?api_key=${this.apiKey}`
          : "/images/Not-available4.png",
        name,
        biography,
      };
    });
  };

  getActorCredits = async (id) => {
    let query = getParamString({
      api_key: this.apiKey,
      url: `person/${id}/combined_credits`,
    });
    return axios.get(`${this.baseUrl}${query}`).then((payload) =>
      payload.data.cast.map((item) => ({
        character: item.character.split("/")[0],
        name: item.name || item.title,
        id: item.id,
        type: item.media_type,
        imgPath: item.poster_path
          ? `${this.imgUrl}w185${item.poster_path}?api_key=${this.apiKey}`
          : "/images/Not-available4.png",
      }))
    );
  };

  getShowDetails = async (type, id) => {
    let query = getParamString({
      api_key: this.apiKey,
      url: `${type}/${id}`,
    });

    return axios.get(`${this.baseUrl}${query}`).then((payload) => {
      const {
        id,
        poster_path,
        name,
        genres,
        title,
        runtime,
        episode_run_time,
        overview,
        first_air_date,
        release_date,
      } = payload.data;
      return {
        id,
        overview,
        path: poster_path
          ? `${this.imgUrl}w500${poster_path}?api_key=${this.apiKey}`
          : "/images/Not-available4.png",
        showTitle: name || title,
        showGenres: genres?.reduce(
          (acc, item) => (acc ? `${acc}, ${item.name}` : item.name),
          ""
        ),
        date: type === "movie" ? runtime : episode_run_time,
        releaseYear: new Date(first_air_date || release_date)?.getFullYear(),
      };
    });
  };

  getShowCasts = async (type, id) => {
    let query = getParamString({
      api_key: this.apiKey,
      url: `${type}/${id}/credits`,
    });

    return axios.get(`${this.baseUrl}${query}`).then((payload) =>
      payload.data.cast.map((item) => ({
        id: item.id,
        name: item.name,
        character: item.character.split("/")[0],
        media_type: type,
        imgPath: item.profile_path
          ? `${this.imgUrl}w185${item.profile_path}?api_key=${this.apiKey}`
          : "/images/Not-available4.png",
      }))
    );
  };
}

export default new SearchService();
