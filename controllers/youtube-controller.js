'use strict';

//noinspection Eslint
const urlRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

class YoutubeController {

  /**
   * Parses the youtube url and gets the videoId
   * [Note] : if the url given is not valid, it returns undefined
   * @param url Youtube url
   * @returns {string|undefined}
   */
  static getVideoId(/*string*/ url) {
    const result = url.match(urlRegex);
    if (result) return result[1];
  }

  static getWideThumbnailUrl(/*string*/ videoId) {
    return `http://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

}

module.exports = YoutubeController;
