'use strict';

const searchResponse = [{
  seriesid: '78650',
  language: 'en',
  SeriesName: 'The Flash',
  banner: 'graphical/78650-g2.jpg',
  Overview: 'Central City Police forensic scientist Barry Allen\'s crime lab is struck by lightning. Allen\'s electrified body is flung into and shatters a cabinet of chemicals, which are both electrified and forced to interact with each other and with his physiology when they come into physical contact with his body. He soon discovers that the accident has changed his body\'s metabolism and as a result he has gained the ability to move at superhuman speed. Barry Allen has become the Flash.',
  FirstAired: '1990-09-20',
  Network: 'CBS',
  IMDB_ID: 'tt0098798',
  id: '78650'
},
  {
    seriesid: '279121',
    language: 'en',
    SeriesName: 'The Flash (2014)',
    banner: 'graphical/279121-g7.jpg',
    Overview: 'After a particle accelerator causes a freak storm, CSI Investigator Barry Allen is struck by lightning and falls into a coma. Months later he awakens with the power of super speed, granting him the ability to move through Central City like an unseen guardian angel. Though initially excited by his newfound powers, Barry is shocked to discover he is not the only "meta-human" who was created in the wake of the accelerator explosion – and not everyone is using their new powers for good. Barry partners with S.T.A.R. Labs and dedicates his life to protect the innocent. For now, only a few close friends and associates know that Barry is literally the fastest man alive, but it won\'t be long before the world learns what Barry Allen has become... The Flash.',
    FirstAired: '2014-10-07',
    Network: 'The CW',
    IMDB_ID: 'tt3107288',
    zap2it_id: 'EP01922936',
    id: '279121'
  },
  {
    seriesid: '272094',
    language: 'en',
    SeriesName: 'The Flash (1967)',
    banner: 'graphical/272094-g.jpg',
    Overview: 'The Flash is- of course!- the fastest man alive. Barry Allen, otherwise known as the Flash, and his sidekick Wally West, otherwise known as Kid Flash, battle evil villains and aliens who try to cause mayhem on Earth. They can outrun a bullet, vibrate through solid walls, and do all sorts of other things with their incredible speed. When there is trouble, Barry and Wally open up their rings which shoot out their costumes.',
    FirstAired: '1967-11-11',
    Network: 'CBS',
    id: '272094'
  },
  {
    seriesid: '82452',
    language: 'en',
    SeriesName: 'The New Animated Adventures of Flash Gordon',
    banner: 'graphical/82452-g.jpg',
    Overview: 'Flash Gordon blasts off to the planet Mongo with girlfriend Dale Arden and scientist Hans Zarkov to prevent evil dictator Ming the Merciless from dominating the universe. In attempting to put an end to Ming\'s villainy, Flash receives the aid (and often the hindrance) of Prince Barin of Arboria, the Hawk Men led by King Vultan, Queen Fria of the ice-covered land of Frigia, Thun the Lion Man and Ming\'s sexy, scantily-clad daughter Aura, who has a powerful attraction for Flash.',
    FirstAired: '1979-07-08',
    Network: 'NBC',
    IMDB_ID: 'tt0078662',
    id: '82452'
  },
  {
    seriesid: '254867',
    language: 'en',
    SeriesName: 'Flash Gordon',
    AliasNames: 'Flash Gordon Conquers the Universe|Flash Gordon Space Soldiers|Flash Gordon\'s Trip to Mars',
    banner: 'graphical/254867-g.jpg',
    Overview: 'Flash Gordon, Flash Gordon\'s Trip to Mars and Flash Gordon Conquers the Universe, the most expensive and popular movie serials ever made, have been favorites of movie and comic fans for decades.',
    FirstAired: '1936-04-06',
    id: '254867'
  }];

const gameOfThrones = {
  id: '121361',
  Actors: '|Emilia Clarke|Peter Dinklage|Kit Harington|Nikolaj Coster-Waldau|Isaac Hempstead-Wright|Lena Headey|Sophie Turner|Maisie Williams|Liam Cunningham|Iwan Rheon|Gwendoline Christie|Aidan Gillen|Iain Glen|Jerome Flynn|Alfie Allen|Carice van Houten|Natalie Dormer|John Bradley|Conleth Hill|Michelle Fairley|Ben Crompton|Max von Sydow|Dominic Carter|Owen Teale|Daniel Portman|Anton Lesser|Brenock O\'Connor|Tobias Menzies|Kristofer Hivju|Julian Glover|Diana Rigg|Ian McElhinney|Ed Skrein|Jonathan Pryce|Alexander Siddig|Nathalie Emmanuel|Tom Wlaschiha|Jacob Anderson|Gemma Whelan|Mark Addy|Indira Varma|Michiel Huisman|Nonso Anozie|Charles Dance|Nell Tiger Free|Stephen Dillane|Rory McCann|Finn Jones|Ellie Kendrick|James Cosmo|Sibel Kekilli|Paul Kaye|Ciarán Hinds|Thomas Sangster|Harry Lloyd|Sean Bean|Jason Momoa|Richard Madden|Jack Gleeson|Rose Leslie|Pedro Pascal|Dean-Charles Chapman|Kerry Ingram|Michael McElhatton|Art Parkinson|Mackenzie Crook|Hannah Murray|Amrita Acharia|Aimee Richardson|Eugene Simon|Ron Donachie|Lino Facioli|Oona Chaplin|Kate Dickie|Peter Vaughan|Patrick Malahide|Natalia Tena|Joe Dempsie|Kristian Nairn|Donald Sumpter|Esmé Bianco|Gethin Anthony|',
  Airs_DayOfWeek: 'Sunday',
  Airs_Time: '9:00 PM',
  ContentRating: 'TV-MA',
  FirstAired: '2011-04-17',
  Genre: '|Adventure|Drama|Fantasy|',
  IMDB_ID: 'tt0944947',
  Language: 'en',
  Network: 'HBO',
  NetworkID: null,
  Overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night\'s Watch, is all that stands between the realms of men and the icy horrors beyond.',
  Rating: '9.5',
  RatingCount: '1545',
  Runtime: '55',
  SeriesID: '77121',
  SeriesName: 'Game of Thrones',
  Status: 'Continuing',
  added: '2009-10-26 16:51:46',
  addedBy: '10072',
  banner: 'graphical/121361-g19.jpg',
  fanart: 'fanart/original/121361-15.jpg',
  lastupdated: '1463001515',
  poster: 'posters/121361-50.jpg',
  tms_wanted_old: '1',
  zap2it_id: 'EP01389809'
};

const gameOfThronesParsed = {
  imdbId: 'tt0944947',
  tvDbId: '121361',
  name: 'Game of Thrones',
  genre: ['Adventure', 'Drama', 'Fantasy'],
  running: true,
  rating: '9.5',
  length: '55',
  poster: 'http://thetvdb.com/banners/_cache/posters/121361-50.jpg',
  fanArt: 'http://thetvdb.com/banners/fanart/original/121361-15.jpg'
};

const theFlash = {
  id: '279121',
  Actors: '|Grant Gustin|Jesse L. Martin|Carlos Valdés|Tom Cavanagh|Danielle Panabaker|Candice Patton|Rick Cosnett|',
  Airs_DayOfWeek: 'Tuesday',
  Airs_Time: '8:00 PM',
  ContentRating: 'TV-14',
  FirstAired: '2014-10-07',
  Genre: '|Action|Adventure|Drama|Science-Fiction|',
  IMDB_ID: 'tt3107288',
  Language: 'en',
  Network: 'The CW',
  NetworkID: null,
  Overview: 'After a particle accelerator causes a freak storm, CSI Investigator Barry Allen is struck by lightning and falls into a coma. Months later he awakens with the power of super speed, granting him the ability to move through Central City like an unseen guardian angel. Though initially excited by his newfound powers, Barry is shocked to discover he is not the only "meta-human" who was created in the wake of the accelerator explosion – and not everyone is using their new powers for good. Barry partners with S.T.A.R. Labs and dedicates his life to protect the innocent. For now, only a few close friends and associates know that Barry is literally the fastest man alive, but it won\'t be long before the world learns what Barry Allen has become... The Flash.',
  Rating: '8.6',
  RatingCount: '177',
  Runtime: '45',
  SeriesID: '193920',
  SeriesName: 'The Flash (2014)',
  Status: 'Continuing',
  added: '2014-03-02 01:43:57',
  addedBy: '406332',
  banner: 'graphical/279121-g7.jpg',
  fanart: 'fanart/original/279121-25.jpg',
  lastupdated: '1462998474',
  poster: 'posters/279121-27.jpg',
  tms_wanted_old: '0',
  zap2it_id: 'EP01922936'
};

const theFlashParsed = {
  imdbId: 'tt3107288',
  tvDbId: '279121',
  name: 'The Flash (2014)',
  genre: ['Action', 'Adventure', 'Drama', 'Science-Fiction'],
  running: true,
  rating: '8.6',
  length: '45',
  poster: 'http://thetvdb.com/banners/_cache/posters/279121-27.jpg',
  fanArt: 'http://thetvdb.com/banners/fanart/original/279121-25.jpg'
};

module.exports = {
  searchResponse,
  gameOfThrones,
  gameOfThronesParsed,
  theFlash,
  theFlashParsed
};
