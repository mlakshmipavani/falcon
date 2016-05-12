'use strict';

const theFlashSeason2 = {
  season: 2,
  number: 22,
  title: 'Invincible',
  ids: {
    trakt: 2068515,
    tvdb: 5590822,
    imdb: null,
    tmdb: 1189726,
    tvrage: 0
  },
  number_abs: null,
  overview: 'After Zoom unleashes an army of Earth-2 meta-humans on Central City, Barry is shaken when he sees their leader is the Black Canary’s Earth-2 doppelganger, the Black Siren. Meanwhile, Wally takes to the streets to help The Flash stop the meta-humans, which worries Joe. Iris and Henry are concerned about Barry taking on Zoom.',
  rating: 8.94118,
  votes: 17,
  first_aired: '2016-05-18T00:00:00.000Z',
  updated_at: '2016-05-11T14:21:33.000Z',
  available_translations: []
};

const theFlashSeason2Parsed = {
  season: 2,
  number: 22,
  title: 'Invincible',
  overview: 'After Zoom unleashes an army of Earth-2 meta-humans on Central City, Barry is shaken when he sees their leader is the Black Canary’s Earth-2 doppelganger, the Black Siren. Meanwhile, Wally takes to the streets to help The Flash stop the meta-humans, which worries Joe. Iris and Henry are concerned about Barry taking on Zoom.',
  first_aired: '2016-05-18T00:00:00.000Z'
};

const theFlashNextEpisode = {
  season: 2,
  number: 22,
  title: 'Invincible',
  overview: 'After Zoom unleashes an army of Earth-2 meta-humans on Central City, Barry is shaken when he sees their leader is the Black Canary’s Earth-2 doppelganger, the Black Siren. Meanwhile, Wally takes to the streets to help The Flash stop the meta-humans, which worries Joe. Iris and Henry are concerned about Barry taking on Zoom.',
  first_aired: '2016-05-18T00:00:00.000Z'
};

const theFlashAllSeasons = [{
  number: 1,
  ids: {trakt: 61430, tvdb: 279121, tmdb: null, tvrage: 36939},
  rating: 8.54816,
  votes: 841,
  episode_count: 23,
  aired_episodes: 23,
  overview: null,
  first_aired: '2014-10-08T00:00:00.000Z',
  episodes: [{
    season: 1,
    number: 1,
    title: 'City of Heroes',
    ids: {
      trakt: 962074,
      tvdb: 4812524,
      imdb: 'tt3187092',
      tmdb: 977122,
      tvrage: 1065564472
    },
    number_abs: null,
    overview: 'CSI investigator Barry Allen awakens from a coma, nine months after he was hit by lightning, and discovers he has superhuman speed.',
    rating: 8.13964,
    votes: 3688,
    first_aired: '2014-10-08T00:00:00.000Z',
    updated_at: '2016-05-12T05:57:44.000Z',
    available_translations: []
  },
    {
      season: 1,
      number: 2,
      title: 'Fastest Man Alive',
      ids: {
        trakt: 962075,
        tvdb: 4929322,
        imdb: 'tt3819518',
        tmdb: 1005650,
        tvrage: 1065603573
      },
      number_abs: null,
      overview: 'Barry escorts Iris to a university gathering honoring scientist Simon Stagg. When six gunmen storm the event, Barry changes into The Flash and tries to stop them. While he does save a man\'s life, he passes out before he can capture the robbers, which frustrates him. As Dr. Wells, Caitlin and Cisco scramble to find out what\'s wrong with Barry, Joe comes down hard on Barry for taking the law into his own hands and risking his life. Barry realizes that it wasn\'t six gunmen but a metahuman named Danton Black, who can make multiples of himself. Meanwhile, Iris becomes even more intrigued by the “red streak.”',
      rating: 7.9928,
      votes: 2916,
      first_aired: '2014-10-15T00:00:00.000Z',
      updated_at: '2016-05-12T01:20:52.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 3,
      title: 'Things You Can\'t Outrun',
      ids: {
        trakt: 962076,
        tvdb: 4929325,
        imdb: 'tt3826166',
        tmdb: 1005651,
        tvrage: 1065603574
      },
      number_abs: null,
      overview: 'As Barry and the team at S.T.A.R. Labs work to capture Kyle Nimbus, a.k.a. The Mist, a dangerous new meta-human with toxic gas powers, they revisit the painful night the particle accelerator exploded and killed Caitlin’s fiancé, Ronnie. Meanwhile, Joe decides to finally visit Henry in jail after all these years, but things take a dangerous turn when Kyle shows up looking to punish Joe for arresting him years ago. Meanwhile, Iris and Eddie continue to hide their relationship from Joe.',
      rating: 7.87725,
      votes: 2721,
      first_aired: '2014-10-22T00:00:00.000Z',
      updated_at: '2016-05-12T00:47:22.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 4,
      title: 'Going Rogue',
      ids: {
        trakt: 962077,
        tvdb: 4936770,
        imdb: 'tt3881958',
        tmdb: 1005652,
        tvrage: 1065609025
      },
      number_abs: null,
      overview: 'The Flash stops a robbery but the culprits get away after shooting a guard, and The Flash chooses to save the man instead of following the criminals. Joe shows Barry a book of suspects and Barry identifies Leonard Snart as the leader of the group. Snart revises his plan to steal the Kahndaq Dynasty Diamond and gets a boost when he gets his hands on a stolen “cold gun,” which could kill The Flash. Dr. Wells is furious when he finds out that Cisco built the cold gun without telling anyone and now it\'s missing. Meanwhile, Iris is getting the silent treatment from Joe because of her relationship with Eddie.',
      rating: 8.02678,
      votes: 2614,
      first_aired: '2014-10-29T00:00:00.000Z',
      updated_at: '2016-05-12T04:09:20.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 5,
      title: 'Plastique',
      ids: {
        trakt: 999423,
        tvdb: 5025023,
        imdb: 'tt3887830',
        tmdb: 1010677,
        tvrage: 1065625291
      },
      number_abs: null,
      overview: 'After a bomb goes off downtown, the army, led by General Eiling, rolls in and takes over the case, much to Joe\'s surprise. Suspicious, Joe tells Barry that he and his friends at S.T.A.R. Labs should look into the army\'s involvement. Wells informs the team that Eiling was experimenting on his men to turn them into super soldiers. Cisco confirms one of Eiling\'s soldiers, Bette Sans Souci, was at the bomb site. The Flash tracks her down and realizes that she\'s not setting off the bombs, she is a meta-human who can blow things up just by touching them. Meanwhile, when Joe learns Iris is writing about “the streak,” he tells Barry to make her stop. Barry realizes Iris won\'t listen to him so he decides to have The Flash pay her a visit.',
      rating: 7.85521,
      votes: 2438,
      first_aired: '2014-11-12T01:00:00.000Z',
      updated_at: '2016-05-12T04:52:01.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 6,
      title: 'The Flash is Born',
      ids: {
        trakt: 999424,
        tvdb: 5028737,
        imdb: 'tt3920288',
        tmdb: 1010678,
        tvrage: 1065702880
      },
      number_abs: null,
      overview: 'The Flash faces a new meta-human named Tony, who can turn himself into girded steel at will. While Dr. Wells and Caitlin are concerned about Barry’s safety, Cisco comes up with a plan to take Tony down. Meanwhile, Iris’s blog on The Flash gets her into trouble, and Eddie witnesses Tony’s abilities firsthand and begins to ask questions that Joe doesn’t want answered. Joe asks Dr. Wells to help him solve Nora Allen’s murder.',
      rating: 8.06191,
      votes: 2439,
      first_aired: '2014-11-19T01:00:00.000Z',
      updated_at: '2016-05-12T03:11:24.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 7,
      title: 'Power Outage',
      ids: {
        trakt: 999426,
        tvdb: 5028738,
        imdb: 'tt3922506',
        tmdb: 1010679,
        tvrage: 1065709260
      },
      number_abs: null,
      overview: 'The Flash goes up against Farooq aka Blackout, a metahuman who can harness electricity. During their battle, Farooq zaps The Flash and siphons all his electricity, leaving The Flash without his speed. Dr. Wells, Caitlin and Cisco work to reverse the effects on Barry, but their efforts are disrupted when Farooq comes banging on S.T.A.R. Labs doors in search of Wells, who he blames for his accident. Without Barry\'s powers to protect them, the group must figure out a way to save themselves from the metahuman. Meanwhile, Tockman manages a coup inside the Central City police department and takes several people hostage, including Joe and Iris. While Iris is sure The Flash will save them, Eddie has a trick up his sleeve.',
      rating: 7.95745,
      votes: 2350,
      first_aired: '2014-11-26T01:00:00.000Z',
      updated_at: '2016-05-12T05:41:47.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 8,
      title: 'Flash vs. Arrow (1)',
      ids: {
        trakt: 999428,
        tvdb: 5028739,
        imdb: 'tt3899320',
        tmdb: 1010680,
        tvrage: 1065710605
      },
      number_abs: null,
      overview: 'Barry is thrilled when Oliver, Felicity and Diggle come to Central City to investigate a case involving a deadly boomerang.',
      rating: 8.3332,
      votes: 2557,
      first_aired: '2014-12-03T01:00:00.000Z',
      updated_at: '2016-05-12T06:23:58.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 9,
      title: 'The Man in the Yellow Suit',
      ids: {
        trakt: 999429,
        tvdb: 5042818,
        imdb: 'tt4017786',
        tmdb: 1018354,
        tvrage: 1065711822
      },
      number_abs: null,
      overview: 'Barry finds himself face-to-face with his nemesis, the man in the yellow suit, a.k.a. Reverse-Flash, who killed his mother. Barry is frustrated when the Reverse-Flash escapes, but Dr. Wells and Cisco come up with a plan to trap him. All they need is bait, so they turn to Dr. Tina McGee from Mercury Labs to help. Meanwhile, it’s Christmas at the West household and Iris is in full holiday cheer. Eddie gives her a surprising gift but also leaves her with a question that could change her life. Joe joins the search for the man in yellow and ends up in the crossfire. Caitlin finds Ronnie.',
      rating: 8.39112,
      votes: 2411,
      first_aired: '2014-12-10T01:00:00.000Z',
      updated_at: '2016-05-12T07:39:18.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 10,
      title: 'Revenge of the Rogues',
      ids: {
        trakt: 999431,
        tvdb: 5052260,
        imdb: 'tt4016102',
        tmdb: 1018355,
        tvrage: 1065644215
      },
      number_abs: null,
      overview: 'Leonard Snart AKA Captain Cold returns to Central City with a new hotheaded partner in tow – Mick Rory AKA Heat Wave. The duo plan to steal a multi-million dollar painting, but Cold has another agenda while in town – to set a trap for The Flash. Snart and Mick kidnap someone close to The Flash and threaten to kill them unless The Flash shows up for a battle of fire and ice. Barry tells Joe he isn’t sure he should take on Snart again after the casualties that happened the last time they fought. Meanwhile, Barry asks Dr. Wells, Caitlin and Cisco to help him double his training efforts so he’s ready for the Reverse Flash when he returns to Central City. Iris deals with the aftermath of Barry’s confession, and Cisco makes the CCPD a new shield.',
      rating: 7.67857,
      votes: 1708,
      first_aired: '2015-01-21T01:00:00.000Z',
      updated_at: '2016-05-12T09:03:13.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 11,
      title: 'The Sound and the Fury',
      ids: {
        trakt: 1701689,
        tvdb: 5073549,
        imdb: 'tt4111294',
        tmdb: 1037712,
        tvrage: 1065735300
      },
      number_abs: null,
      overview: 'Dr. Wells’ former protégée, Hartley Rathaway, returns to seek revenge on his mentor after being affected by the particle accelerator explosion. Now able to manipulate sound waves, the brilliant Rathaway is a dangerous threat to both Wells and The Flash. Meanwhile, Iris is thrilled when she’s hired by the Central City Picture News as their newest cub reporter. Unfortunately, her editor pairs her with a veteran reporter, Mason Bridge, who wants nothing to do with her. Cisco recalls his first day on the job at S.T.A.R. Labs when he met Hartley and Caitlin. Joe asks Eddie for a favor but asks him to keep it a secret from Barry.',
      rating: 7.64865,
      votes: 1665,
      first_aired: '2015-01-28T01:00:00.000Z',
      updated_at: '2016-05-12T07:54:09.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 12,
      title: 'Crazy for You',
      ids: {
        trakt: 1701690,
        tvdb: 5073556,
        imdb: 'tt4105618',
        tmdb: 1037713,
        tvrage: 1065683600
      },
      number_abs: null,
      overview: 'Caitlin takes Barry out to a local karaoke bar to help them both find new loves. Caitlin strikes out but Barry meets a sports reporter and asks her out for a date. Cisco considers Hartley\'s dangerous offer. The team searches for Shawna, a meta-human with teleportation powers.',
      rating: 7.79511,
      votes: 1718,
      first_aired: '2015-02-04T01:00:00.000Z',
      updated_at: '2016-05-12T09:01:17.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 13,
      title: 'The Nuclear Man',
      ids: {
        trakt: 1701691,
        tvdb: 5088525,
        imdb: 'tt4138324',
        tmdb: 1037714,
        tvrage: 1065735301
      },
      number_abs: null,
      overview: 'After Ronnie attacks a physicist, Barry and the team realize they need to go after Caitlin\'s fiancé who is now a dangerous meta-human. Barry struggles to balance his duties as The Flash and his relationship with Linda Park. Joe enlists Cisco\'s help to reinvestigate the murder of Nora Allen. General Eiling returns to Central City.',
      rating: 7.8986,
      votes: 1785,
      first_aired: '2015-02-11T01:00:00.000Z',
      updated_at: '2016-05-11T19:03:25.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 14,
      title: 'Fallout',
      ids: {
        trakt: 1718914,
        tvdb: 5104336,
        imdb: 'tt4138326',
        tmdb: 1039988,
        tvrage: 1065738929
      },
      number_abs: null,
      overview: 'After the nuclear explosion separates Ronnie and Dr. Stein, Barry and the team believe both men are safe. Caitlin is thrilled to have her fiancé back and prepares to resume their life together while Dr. Stein returns to his wife. When General Eiling targets Firestorm, Ronnie and Dr. Stein must decide if they are safer together or apart. Mason Bridge tells Iris that there is something secretive going on at S.T.A.R. Labs. Dr. Stein gives Barry some important information about time travel.',
      rating: 8.01708,
      votes: 1874,
      first_aired: '2015-02-18T01:00:00.000Z',
      updated_at: '2016-05-11T19:03:52.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 15,
      title: 'Out of Time',
      ids: {
        trakt: 1718915,
        tvdb: 5104337,
        imdb: 'tt4138338',
        tmdb: 1039989,
        tvrage: 1065738930
      },
      number_abs: null,
      overview: 'Mark Mardon aka The Weather Wizard appears in Central City intent on avenging his brother Clyde\'s death, and sets his sights on Joe, who shot Clyde. When Mardon attacks Joe and Barry, Barry is able to super-speed them to safety but Mardon gets away. Barry warns Joe not to go after a meta-human alone but Joe doesn\'t listen and ends up in grave danger. Meanwhile, Cisco looks into the night the team captured the Reverse Flash and realizes something doesn\'t add up and begins to wonder whether Joe was right about Dr. Wells. Barry and Linda end up on an awkward double date with Eddie and Iris.',
      rating: 8.53275,
      votes: 2977,
      first_aired: '2015-03-18T00:00:00.000Z',
      updated_at: '2016-05-12T04:28:03.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 16,
      title: 'Rogue Time',
      ids: {
        trakt: 1718916,
        tvdb: 5104338,
        imdb: 'tt4138340',
        tmdb: 1039990,
        tvrage: 1065738931
      },
      number_abs: null,
      overview: 'After going to the past, Barry talks to Harrison Wells about him time traveling and the consequences of changing the timeline. Meanwhile, the Flash learns that Captain Cold and Heat Wave have returned to Central City. This time Snart has brought along his baby sister Lisa aka Golden Glider to help wreak havoc on the city.',
      rating: 7.78898,
      votes: 2687,
      first_aired: '2015-03-25T00:00:00.000Z',
      updated_at: '2016-05-11T19:03:47.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 17,
      title: 'Tricksters',
      ids: {
        trakt: 1718917,
        tvdb: 5104339,
        imdb: 'tt4138344',
        tmdb: 1039991,
        tvrage: 1065728023
      },
      number_abs: null,
      overview: 'A copycat killer who goes by the name “The Trickster” starts setting off bombs in Central City. In order to stop the villain, Barry and Joe meet with the original Trickster, a criminal mastermind named James Jesse, who has been imprisoned for 20 years. Things quickly go from bad to worse when the Tricksters unite and take Henry prisoner. Meanwhile, Iris asks Eddie for help with a case and flashbacks show how Harrison Wells came up with the idea for the particle accelerator.',
      rating: 8.12154,
      votes: 2822,
      first_aired: '2015-04-01T00:00:00.000Z',
      updated_at: '2016-05-12T02:06:17.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 18,
      title: 'All-Star Team Up',
      ids: {
        trakt: 1725151,
        tvdb: 5110414,
        imdb: 'tt4138352',
        tmdb: 1047470,
        tvrage: 1065747417
      },
      number_abs: null,
      overview: 'Barry is surprised when Felicity Smoak arrives from Starling City along with her boyfriend, Ray Palmer, who flies in as the Atom. They’ve come to visit S.T.A.R. Labs as Ray needs help with his suit. Their timing turns out to be fortuitous because it’s all hands on deck after a meta human named Brie Larvin unleashes hundreds of robotic bees to attack and kill her former co-workers, including Dr. Tina McGee. A group dinner with Barry, Felicity, Ray, Iris and Eddie turns into a disaster.\n\nNote: Flash 1x18 takes places before Arrow 3x18.',
      rating: 7.92548,
      votes: 2724,
      first_aired: '2015-04-15T00:00:00.000Z',
      updated_at: '2016-05-12T05:45:26.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 19,
      title: 'Who is Harrison Wells?',
      ids: {
        trakt: 1765383,
        tvdb: 5166508,
        imdb: null,
        tmdb: 1051229,
        tvrage: 0
      },
      number_abs: null,
      overview: 'Joe and Cisco head to Starling City to continue their investigation of Dr. Wells. While in town, the duo enlists the help of Captain Lance, and Cisco meets the Black Canary, who asks him for a favor. Meanwhile, back in Central City, Barry races to catch a meta-human named Hannibal Bates who can transform himself into every person he touches – which includes Eddie, Iris, Caitlin and even The Flash. ',
      rating: 8.16685,
      votes: 2751,
      first_aired: '2015-04-22T00:00:00.000Z',
      updated_at: '2016-05-11T19:48:03.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 20,
      title: 'The Trap',
      ids: {
        trakt: 1765384,
        tvdb: 5166509,
        imdb: null,
        tmdb: 1051230,
        tvrage: 0
      },
      number_abs: null,
      overview: 'While in Wells\' secret room, Barry learns about his battle with the Reverse-Flash in the future, as well as key moments in his life that include marrying Iris, a promotion at the CCPD, and that he created the artificial consciousness known as Gideon in the future. Barry, Caitlin, Cisco and Joe set a trap for Wells. Cisco uses himself as prey which puts him in grave danger. Meanwhile, Eddie makes a decision regarding Iris, which leaves Joe a bit unsettled. ',
      rating: 8.36438,
      votes: 2802,
      first_aired: '2015-04-29T00:00:00.000Z',
      updated_at: '2016-05-12T04:38:16.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 21,
      title: 'Grodd Lives',
      ids: {
        trakt: 1765385,
        tvdb: 5166510,
        imdb: null,
        tmdb: 1051231,
        tvrage: 0
      },
      number_abs: null,
      overview: 'Barry must deal with the Reverse Flash\'s latest threat to a member of the group. To make matter worse, Dr. Wells unleashes Grodd on the city in order to distract Barry and the team. Joe, Barry and Cisco head down into the sewers to catch Grodd but the gorilla quickly gets the upper hand after he kidnaps Joe. Iris and Barry have a heart to heart talk.',
      rating: 7.80995,
      votes: 2594,
      first_aired: '2015-05-06T00:00:00.000Z',
      updated_at: '2016-05-12T00:08:08.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 22,
      title: 'Rogue Air',
      ids: {
        trakt: 1765386,
        tvdb: 5163053,
        imdb: null,
        tmdb: 1051232,
        tvrage: 0
      },
      number_abs: null,
      overview: 'As Wells once again gets the upper hand on the S.T.A.R. Labs team, Barry realizes he needs to make a big move and reaches out to an old foe, Captain Cold, for help. Joe and Caitlin warn Barry that Cold can\'t be trusted. True to form, Cold has his own agenda that involves the meta-humans trapped in the containment cells. As things seem to be going from bad to worse, The Flash gets reinforcements - Arrow and Firestorm.',
      rating: 8.2167,
      votes: 2335,
      first_aired: '2015-05-13T00:00:00.000Z',
      updated_at: '2016-05-12T07:03:22.000Z',
      available_translations: []
    },
    {
      season: 1,
      number: 23,
      title: 'Fast Enough',
      ids: {
        trakt: 1798337,
        tvdb: 5166511,
        imdb: null,
        tmdb: 1051233,
        tvrage: 0
      },
      number_abs: null,
      overview: 'Wells presents Barry with a life-changing choice. Dr. Martin Stein and Ronnie Raymond return to help the S.T.A.R. Labs team with this final fight.',
      rating: 8.57743,
      votes: 2783,
      first_aired: '2015-05-20T00:00:00.000Z',
      updated_at: '2016-05-11T23:55:45.000Z',
      available_translations: []
    }]
},
  {
    number: 2,
    ids: {trakt: 110984, tvdb: null, tmdb: null, tvrage: null},
    rating: 8.6158,
    votes: 367,
    episode_count: 24,
    aired_episodes: 21,
    overview: null,
    first_aired: '2015-10-07T00:00:00.000Z',
    episodes: [{
      season: 2,
      number: 1,
      title: 'The Man Who Saved Central City',
      ids: {
        trakt: 1866102,
        tvdb: 5260562,
        imdb: null,
        tmdb: 1063859,
        tvrage: 0
      },
      number_abs: null,
      overview: 'Picking up months after the Singularity attacked Central City, Barry is still struggling to forgive himself for Eddie’s death. Concerned about putting his friends in danger, Barry has pushed everyone away and has chosen to protect the city on his own. When a meta-human named Atom Smasher attacks the city, Iris tells Barry that he needs to let his friends help him protect the citizens of Central City. Meanwhile, Cisco helps Joe with his Meta Task Force.',
      rating: 7.897,
      votes: 3301,
      first_aired: '2015-10-07T00:00:00.000Z',
      updated_at: '2016-05-12T01:17:16.000Z',
      available_translations: []
    },
      {
        season: 2,
        number: 2,
        title: 'Flash of Two Worlds',
        ids: {
          trakt: 1933746,
          tvdb: 5280328,
          imdb: null,
          tmdb: 1063860,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Jay Garrick, a mysterious man from Earth-2, appears at S.T.A.R. Labs with a dire warning about an evil speedster named Zoom, who is set on destroying The Flash. Barry and the team must decide if they can trust this stranger even as they face yet another powerful meta-human. Meanwhile, Joe must deal with a determined officer named Patty Spivot who wants to join his meta-human task force.',
        rating: 7.90184,
        votes: 2822,
        first_aired: '2015-10-14T00:00:00.000Z',
        updated_at: '2016-05-12T03:52:36.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 3,
        title: 'Family of Rogues',
        ids: {
          trakt: 1933747,
          tvdb: 5280329,
          imdb: null,
          tmdb: 1089972,
          tvrage: 0
        },
        number_abs: null,
        overview: 'When Barry and the team find out Captain Cold has been kidnapped, they form an uneasy alliance with his sister, Lisa. However, Barry feels double-crossed when he finds out Snart is working with his father, Lewis Snart on a heist. Meanwhile, Joe is faced with a difficult decision.',
        rating: 7.78899,
        votes: 2616,
        first_aired: '2015-10-21T00:00:00.000Z',
        updated_at: '2016-05-12T03:52:19.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 4,
        title: 'The Fury of Firestorm',
        ids: {
          trakt: 1954869,
          tvdb: 5330990,
          imdb: null,
          tmdb: 1114797,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Barry and the team look for another Firestorm match for Dr. Stein. When the team meets Jefferson “Jax” Jackson, Caitlin has her reservations about whether Jax is the right match for Dr. Stein. Iris surprises Joe while Barry and Patty grow closer.',
        rating: 7.98426,
        votes: 2859,
        first_aired: '2015-10-28T00:00:00.000Z',
        updated_at: '2016-05-12T02:41:17.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 5,
        title: 'The Darkness and the Light',
        ids: {
          trakt: 2012710,
          tvdb: 5372872,
          imdb: null,
          tmdb: 1130074,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Barry learns a new breacher, Dr. Light, has come through the portal and sets off to capture her. Jay tells Barry that Dr. Light was not a threat on Earth-2 and that Barry can reason with her. However, during a fight with The Flash, she blinds him and drops some shocking news about Zoom. Meanwhile, Barry and Patty go out on a date.',
        rating: 7.95424,
        votes: 2819,
        first_aired: '2015-11-04T01:00:00.000Z',
        updated_at: '2016-05-12T06:19:44.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 6,
        title: 'Enter Zoom',
        ids: {
          trakt: 2035912,
          tvdb: 5380138,
          imdb: null,
          tmdb: 1132051,
          tvrage: 0
        },
        number_abs: null,
        overview: 'After recent events, Barry decides it’s time to confront Zoom and comes up with a dangerous plan. Caitlin sides with Jay and deems it too dangerous for Barry to engage with the speed demon. However, Iris shows her support and brings forth a surprising ally. We see what Earth-2 Harrison Wells’ life was like before coming through the breech.',
        rating: 8.25025,
        votes: 2945,
        first_aired: '2015-11-11T01:00:00.000Z',
        updated_at: '2016-05-12T03:43:20.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 7,
        title: 'Gorilla Warfare',
        ids: {
          trakt: 2041536,
          tvdb: 5386553,
          imdb: 'tt4848704',
          tmdb: 1133293,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Grodd returns to Central City and kidnaps Caitlin. Barry and team race to find her before it’s too late. Meanwhile, Cisco plans his first date with the new barista at Jitters, Kendra Saunders and Patty begins to suspect Barry is hiding something from her.',
        rating: 7.79726,
        votes: 2772,
        first_aired: '2015-11-18T01:00:00.000Z',
        updated_at: '2016-05-12T01:56:39.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 8,
        title: 'Legends of Today (1)',
        ids: {
          trakt: 2041537,
          tvdb: 5399413,
          imdb: null,
          tmdb: 1136454,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Vandal Savage arrives in Central City and sets his sights on Kendra Saunders. After Vandal attacks Kendra and Cisco, they turn to Barry for help. Realizing how dangerous Vandal is, Barry takes Kendra to Star City and asks Oliver and team to hide her until he can figure out how to stop Vandal. However, things quickly go from bad to worse when a man with wings AKA Hawkman shows up and flies off with Kendra. Meanwhile, Harrison develops a serum to make Barry run faster and asks Jay to test it out.\n\nThis cross-over episode concludes on Arrow\'s season 4 “Legends of Yesterday” episode.',
        rating: 8.15393,
        votes: 2878,
        first_aired: '2015-12-02T01:00:00.000Z',
        updated_at: '2016-05-12T06:34:49.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 9,
        title: 'Running to Stand Still',
        ids: {
          trakt: 2044123,
          tvdb: 5399414,
          imdb: null,
          tmdb: 1136455,
          tvrage: 0
        },
        number_abs: null,
        overview: 'When Mark Mardon AKA The Weather Wizard returns to break Leonard Snart AKA Captain Cold and James Jesse AKA The Trickster out of Iron Heights, Barry must stop these rogues from taking over Central City during Christmas. Meanwhile, Joe and Iris meet Wally West.',
        rating: 7.88112,
        votes: 2818,
        first_aired: '2015-12-09T01:00:00.000Z',
        updated_at: '2016-05-12T00:07:06.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 10,
        title: 'Potential Energy',
        ids: {
          trakt: 2044124,
          tvdb: 5433939,
          imdb: null,
          tmdb: 1145547,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Now that they\'ve grown closer, Barry considers telling Patty that he is The Flash. Meanwhile, Joe and Iris try to get to know Wally, and the team hunts down a meta-human who can slow time itself.',
        rating: 7.76594,
        votes: 2807,
        first_aired: '2016-01-20T01:00:00.000Z',
        updated_at: '2016-05-12T00:56:22.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 11,
        title: 'The Reverse-Flash Returns',
        ids: {
          trakt: 2056605,
          tvdb: 5434271,
          imdb: null,
          tmdb: 1145548,
          tvrage: 0
        },
        number_abs: null,
        overview: 'When Cisco gets a vibe of Eobard Thawne, Barry and the team don’t believe it. But, after an attack at Mercury Labs, Christina McGee confirms that the Reverse Flash is back. Meanwhile, Iris and Francine share a nice moment that brings Iris closer to her brother, Wally.',
        rating: 7.90199,
        votes: 2959,
        first_aired: '2016-01-27T01:00:00.000Z',
        updated_at: '2016-05-12T08:42:32.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 12,
        title: 'Fast Lane',
        ids: {
          trakt: 2056607,
          tvdb: 5434272,
          imdb: null,
          tmdb: 1145549,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Barry teams up with Wells to figure out a way to close the breaches, but they are distracted by a meta-human nicknamed Tar Pit who can transform into liquid asphalt. Iris is concerned for Wally\'s safety after she finds out about his drag racing hobby. When he refuses to stop she makes a bold move that puts her in danger.',
        rating: 7.86642,
        votes: 2912,
        first_aired: '2016-02-03T01:00:00.000Z',
        updated_at: '2016-05-12T08:48:36.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 13,
        title: 'Welcome to Earth-2',
        ids: {
          trakt: 2068501,
          tvdb: 5467786,
          imdb: null,
          tmdb: 1161192,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Barry, Wells and Cisco journey to Earth-2 to rescue Wells’ daughter, Jesse from Zoom. Barry is stunned when he runs into Earth-2 Iris and Joe, but nothing prepares him for meeting Killer Frost and Deathstorm. Meanwhile, back on Earth-1, Jay has to take over the Flash’s responsibilities when a meta-human nicknamed Geomancer attacks Central City.',
        rating: 8.20624,
        votes: 3142,
        first_aired: '2016-02-10T01:00:00.000Z',
        updated_at: '2016-05-12T03:14:32.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 14,
        title: 'Escape from Earth-2',
        ids: {
          trakt: 2068503,
          tvdb: 5467787,
          imdb: null,
          tmdb: 1161956,
          tvrage: 0
        },
        number_abs: null,
        overview: 'On Earth-2, the team races to find Zoom\'s lair and asks for help from the most unexpected source. Meanwhile, back on Earth-1, Caitlin rushes to perfect Velocity-9 so that Jay can stop the Geomancer.',
        rating: 8.16613,
        votes: 3136,
        first_aired: '2016-02-17T01:00:00.000Z',
        updated_at: '2016-05-12T01:35:33.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 15,
        title: 'King Shark',
        ids: {
          trakt: 2068507,
          tvdb: 5467788,
          imdb: null,
          tmdb: 1164111,
          tvrage: 0
        },
        number_abs: null,
        overview: 'When King Shark escapes from an A.R.G.U.S. holding tank, Lila and Diggle travel to Central City to warn The Flash. King Shark shows up at the West house and attacks Joe, Iris, Wally and Barry.',
        rating: 7.95729,
        votes: 2833,
        first_aired: '2016-02-24T01:00:00.000Z',
        updated_at: '2016-05-12T05:28:06.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 16,
        title: 'Trajectory',
        ids: {
          trakt: 2068509,
          tvdb: 5483296,
          imdb: null,
          tmdb: 1165172,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Having arrived in town intent on creating maximum chaos, Trajectory’s antics are misinterpreted as having been perpetrated by the Flash himself. Barry thus must quickly uncover the mystery of who is the girl under the mask — as well as what is driving her mad desire for speed and destruction.',
        rating: 7.95133,
        votes: 3041,
        first_aired: '2016-03-23T00:00:00.000Z',
        updated_at: '2016-05-11T22:19:09.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 17,
        title: 'Flash Back',
        ids: {
          trakt: 2068510,
          tvdb: 5536630,
          imdb: null,
          tmdb: 1165173,
          tvrage: 0
        },
        number_abs: null,
        overview: 'After the shocking revelation that Zoom is Jay Garrick, Barry is more determined than ever to get back to Earth-2 to stop Zoom forever. Desperate to find a way to increase his speed, Barry decides to travel back in time and masquerade as his earlier self in order to get his arch-nemesis, Dr. Harrison Wells/Eobard Thawne, to teach him how to run faster. However, things don’t go as planned and Barry is stunned to face familiar foe Hartley Rathaway, as well as old friend Eddie Thawne. Iris makes peace with her past in order to embrace her future.',
        rating: 8.12921,
        votes: 3537,
        first_aired: '2016-03-30T00:00:00.000Z',
        updated_at: '2016-05-12T08:21:03.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 18,
        title: 'Versus Zoom',
        ids: {
          trakt: 2068511,
          tvdb: 5561674,
          imdb: null,
          tmdb: 1183645,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Equipped with the tachyon device, Barry believes he is fast enough to stop Zoom and wants to open the breaches to catch him. Harry strongly advises against that plan but after Barry convinces him, Harry reveals that Cisco has the power to re-open the breach. Meanwhile, Hunter Zoloman’s painful story on Earth-2 is revealed.',
        rating: 7.97437,
        votes: 3511,
        first_aired: '2016-04-20T00:00:00.000Z',
        updated_at: '2016-05-12T06:27:33.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 19,
        title: 'Back to Normal',
        ids: {
          trakt: 2068512,
          tvdb: 5566674,
          imdb: null,
          tmdb: 1185071,
          tvrage: 0
        },
        number_abs: null,
        overview: 'A meta-human with super strength named Griffin Grey mistakes Harry for Earth-1 Harrison Wells and kidnaps him, demanding that Wells cure him from his current condition. Realizing another brilliant Wells could help track Griffin’s location, Barry asks Jesse to help. Meanwhile, Wally corners Joe about The Flash.',
        rating: 7.73768,
        votes: 3408,
        first_aired: '2016-04-27T00:00:00.000Z',
        updated_at: '2016-05-12T09:35:36.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 20,
        title: 'Rupture',
        ids: {
          trakt: 2068513,
          tvdb: 5579407,
          imdb: null,
          tmdb: 1186612,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Zoom arrives back on Earth-1 intent on taking over Central City. Barry and Wells come up with a plan to stop Zoom once and for all but it’s extremely dangerous. Unsure if he should take the risk, Barry reaches out to both fathers for advice. Henry is adamantly opposed to Barry risking his life again but Joe thinks he can handle it which puts the two men at odds with each other. Meanwhile, Cisco is shocked when he vibes the Earth-2 villain Rupture, who happens to be his brother Dante’s doppelganger. Rupture came to this Earth seeking justice for Reverb’s death. Iris decides she’s finally ready to open up to Barry about her feelings for him. ',
        rating: 8.24214,
        votes: 3085,
        first_aired: '2016-05-04T00:00:00.000Z',
        updated_at: '2016-05-12T09:41:15.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 21,
        title: 'The Runaway Dinosaur',
        ids: {
          trakt: 2068514,
          tvdb: 5589452,
          imdb: null,
          tmdb: 1188155,
          tvrage: 0
        },
        number_abs: null,
        overview: 'With Barry gone, the team must figure out a way to handle the return of an old enemy - Girder. Realizing Girder is retracing his steps from his last attack, Iris volunteers to act as bait to trap him in S.T.A.R. Labs. Meanwhile, Barry fights to return to his old life.',
        rating: 8.18359,
        votes: 1645,
        first_aired: '2016-05-11T00:00:00.000Z',
        updated_at: '2016-05-12T09:45:31.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 22,
        title: 'Invincible',
        ids: {
          trakt: 2068515,
          tvdb: 5590822,
          imdb: null,
          tmdb: 1189726,
          tvrage: 0
        },
        number_abs: null,
        overview: 'After Zoom unleashes an army of Earth-2 meta-humans on Central City, Barry is shaken when he sees their leader is the Black Canary’s Earth-2 doppelganger, the Black Siren. Meanwhile, Wally takes to the streets to help The Flash stop the meta-humans, which worries Joe. Iris and Henry are concerned about Barry taking on Zoom.',
        rating: 8.94118,
        votes: 17,
        first_aired: '2016-05-18T00:00:00.000Z',
        updated_at: '2016-05-11T14:21:33.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 23,
        title: 'The Race of His Life',
        ids: {
          trakt: 2068520,
          tvdb: 5598674,
          imdb: null,
          tmdb: 1190312,
          tvrage: 0
        },
        number_abs: null,
        overview: 'Barry vows to stop Zoom after learning Zoom\'s true plans.',
        rating: 6.90909,
        votes: 11,
        first_aired: '2016-05-25T00:00:00.000Z',
        updated_at: '2016-05-12T02:14:31.000Z',
        available_translations: []
      },
      {
        season: 2,
        number: 24,
        title: null,
        ids: {
          trakt: 2225991,
          tvdb: 5605527,
          imdb: null,
          tmdb: 0,
          tvrage: null
        },
        number_abs: null,
        overview: null,
        rating: 0,
        votes: 0,
        first_aired: null,
        updated_at: '2016-05-07T09:27:17.000Z',
        available_translations: []
      }]
  },
  {
    number: 3,
    ids: {trakt: 124706, tvdb: null, tmdb: null, tvrage: null},
    rating: 6.8,
    votes: 10,
    episode_count: 1,
    aired_episodes: 0,
    overview: null,
    first_aired: '2016-10-05T00:00:00.000Z',
    episodes: [{
      season: 3,
      number: 1,
      title: 'TBA',
      ids: {
        trakt: 2183561,
        tvdb: 5558531,
        imdb: null,
        tmdb: 0,
        tvrage: null
      },
      number_abs: null,
      overview: null,
      rating: 9.75,
      votes: 4,
      first_aired: '2016-10-05T00:00:00.000Z',
      updated_at: '2016-05-12T02:48:42.000Z',
      available_translations: []
    }]
  },
  {
    number: 0,
    ids: {trakt: 126556, tvdb: null, tmdb: null, tvrage: null},
    rating: 0,
    votes: 0,
    episode_count: 4,
    aired_episodes: 4,
    overview: null,
    first_aired: '2016-04-20T00:00:00.000Z',
    episodes: [{
      season: 0,
      number: 1,
      title: 'The Chronicles Of Cisco: Entry 0419 - Part 1',
      ids: {
        trakt: 2221945,
        tvdb: 5598747,
        imdb: null,
        tmdb: 0,
        tvrage: null
      },
      number_abs: null,
      overview: null,
      rating: 6.92857,
      votes: 14,
      first_aired: '2016-04-20T00:00:00.000Z',
      updated_at: '2016-05-11T14:45:11.000Z',
      available_translations: []
    },
      {
        season: 0,
        number: 2,
        title: 'The Chronicles Of Cisco: Entry 0419 - Part 2',
        ids: {
          trakt: 2221946,
          tvdb: 5598748,
          imdb: null,
          tmdb: 0,
          tvrage: null
        },
        number_abs: null,
        overview: null,
        rating: 7,
        votes: 15,
        first_aired: '2016-04-27T00:00:00.000Z',
        updated_at: '2016-05-11T03:19:08.000Z',
        available_translations: []
      },
      {
        season: 0,
        number: 3,
        title: 'The Chronicles Of Cisco: Entry 0419 - Part 3',
        ids: {
          trakt: 2224012,
          tvdb: 5602329,
          imdb: null,
          tmdb: 0,
          tvrage: null
        },
        number_abs: null,
        overview: null,
        rating: 7.5,
        votes: 14,
        first_aired: '2016-05-04T00:00:00.000Z',
        updated_at: '2016-05-11T03:21:27.000Z',
        available_translations: []
      },
      {
        season: 0,
        number: 4,
        title: 'The Chronicles Of Cisco: Entry 0419 - Part 4',
        ids: {
          trakt: 2229650,
          tvdb: 5610559,
          imdb: null,
          tmdb: 0,
          tvrage: null
        },
        number_abs: null,
        overview: null,
        rating: 8,
        votes: 10,
        first_aired: '2016-05-11T00:00:00.000Z',
        updated_at: '2016-05-12T05:42:42.000Z',
        available_translations: []
      }]
  }];

const theFlashAllSeasonInfo = [{
  number: 1,
  ids: {trakt: 61430, tvdb: 279121, tmdb: 60523, tvrage: 36939},
  rating: 8.54816,
  votes: 841,
  episode_count: 23,
  aired_episodes: 23,
  overview: null,
  first_aired: '2014-10-08T00:00:00.000Z'
},
  {
    number: 2,
    ids: {trakt: 110984, tvdb: null, tmdb: 66922, tvrage: null},
    rating: 8.6158,
    votes: 367,
    episode_count: 24,
    aired_episodes: 21,
    overview: 'Following the dramatic events of season 1, Team Flash quickly turns their attention to a threat high above Central City. Armed with the heart of a hero and the ability to move at super speeds, will Barry be able to save his city from impending doom?',
    first_aired: '2015-10-07T00:00:00.000Z'
  },
  {
    number: 3,
    ids: {trakt: 124706, tvdb: null, tmdb: null, tvrage: null},
    rating: 6.8,
    votes: 10,
    episode_count: 1,
    aired_episodes: 0,
    overview: null,
    first_aired: '2016-10-05T00:00:00.000Z'
  },
  {
    number: 0,
    ids: {trakt: 126556, tvdb: null, tmdb: null, tvrage: null},
    rating: 0,
    votes: 0,
    episode_count: 4,
    aired_episodes: 4,
    overview: null,
    first_aired: '2016-04-20T00:00:00.000Z'
  }];

const trendingSeriesRaw = [{
  watchers: 91,
  show: {
    title: 'Arrow',
    year: 2012,
    ids: {
      trakt: 1403,
      slug: 'arrow',
      tvdb: 257655,
      imdb: 'tt2193021',
      tmdb: 1412,
      tvrage: 30715
    }
  }
},
  {
    watchers: 69,
    show: {
      title: 'Game of Thrones',
      year: 2011,
      ids: {
        trakt: 1390,
        slug: 'game-of-thrones',
        tvdb: 121361,
        imdb: 'tt0944947',
        tmdb: 1399,
        tvrage: 24493
      }
    }
  },
  {
    watchers: 51,
    show: {
      title: 'The Flash',
      year: 2014,
      ids: {
        trakt: 60300,
        slug: 'the-flash-2014',
        tvdb: 279121,
        imdb: 'tt3107288',
        tmdb: 60735,
        tvrage: 36939
      }
    }
  },
  {
    watchers: 34,
    show: {
      title: 'Supernatural',
      year: 2005,
      ids: {
        trakt: 1611,
        slug: 'supernatural',
        tvdb: 78901,
        imdb: 'tt0460681',
        tmdb: 1622,
        tvrage: 5410
      }
    }
  },
  {
    watchers: 33,
    show: {
      title: 'Person of Interest',
      year: 2011,
      ids: {
        trakt: 1402,
        slug: 'person-of-interest',
        tvdb: 248742,
        imdb: 'tt1839578',
        tmdb: 1411,
        tvrage: 28376
      }
    }
  },
  {
    watchers: 30,
    show: {
      title: 'Marvel\'s Agents of S.H.I.E.L.D.',
      year: 2013,
      ids: {
        trakt: 1394,
        slug: 'marvel-s-agents-of-s-h-i-e-l-d',
        tvdb: 263365,
        imdb: 'tt2364582',
        tmdb: 1403,
        tvrage: 32656
      }
    }
  },
  {
    watchers: 28,
    show: {
      title: 'The Americans',
      year: 2013,
      ids: {
        trakt: 46263,
        slug: 'the-americans-2013',
        tvdb: 261690,
        imdb: 'tt2149175',
        tmdb: 46533,
        tvrage: 30449
      }
    }
  },
  {
    watchers: 26,
    show: {
      title: 'Modern Family',
      year: 2009,
      ids: {
        trakt: 1412,
        slug: 'modern-family',
        tvdb: 95011,
        imdb: 'tt1442437',
        tmdb: 1421,
        tvrage: 22622
      }
    }
  },
  {
    watchers: 25,
    show: {
      title: 'Empire',
      year: 2015,
      ids: {
        trakt: 77783,
        slug: 'empire-2015',
        tvdb: 281617,
        imdb: 'tt3228904',
        tmdb: 61733,
        tvrage: 40413
      }
    }
  },
  {
    watchers: 24,
    show: {
      title: 'The Big Bang Theory',
      year: 2007,
      ids: {
        trakt: 1409,
        slug: 'the-big-bang-theory',
        tvdb: 80379,
        imdb: 'tt0898266',
        tmdb: 1418,
        tvrage: 8511
      }
    }
  },
  {
    watchers: 23,
    show: {
      title: 'Fear the Walking Dead',
      year: 2015,
      ids: {
        trakt: 94961,
        slug: 'fear-the-walking-dead',
        tvdb: 290853,
        imdb: 'tt3743822',
        tmdb: 62286,
        tvrage: 48384
      }
    }
  },
  {
    watchers: 22,
    show: {
      title: 'Blindspot',
      year: 2015,
      ids: {
        trakt: 98980,
        slug: 'blindspot',
        tvdb: 295647,
        imdb: 'tt4474344',
        tmdb: 62710,
        tvrage: 44628
      }
    }
  },
  {
    watchers: 22,
    show: {
      title: 'New Girl',
      year: 2011,
      ids: {
        trakt: 1411,
        slug: 'new-girl',
        tvdb: 248682,
        imdb: 'tt1826940',
        tmdb: 1420,
        tvrage: 28304
      }
    }
  },
  {
    watchers: 21,
    show: {
      title: 'Marvel\'s Daredevil',
      year: 2015,
      ids: {
        trakt: 77938,
        slug: 'marvel-s-daredevil',
        tvdb: 281662,
        imdb: 'tt3322312',
        tmdb: 61889,
        tvrage: 38796
      }
    }
  },
  {
    watchers: 21,
    show: {
      title: 'Grey\'s Anatomy',
      year: 2005,
      ids: {
        trakt: 1407,
        slug: 'grey-s-anatomy',
        tvdb: 73762,
        imdb: 'tt0413573',
        tmdb: 1416,
        tvrage: 3741
      }
    }
  },
  {
    watchers: 20,
    show: {
      title: 'Gotham',
      year: 2014,
      ids: {
        trakt: 60278,
        slug: 'gotham',
        tvdb: 274431,
        imdb: 'tt3749900',
        tmdb: 60708,
        tvrage: 38049
      }
    }
  },
  {
    watchers: 18,
    show: {
      title: 'The Blacklist',
      year: 2013,
      ids: {
        trakt: 46676,
        slug: 'the-blacklist',
        tvdb: 266189,
        imdb: 'tt2741602',
        tmdb: 46952,
        tvrage: 35048
      }
    }
  },
  {
    watchers: 17,
    show: {
      title: 'Law & Order: Special Victims Unit',
      year: 1999,
      ids: {
        trakt: 2716,
        slug: 'law-order-special-victims-unit',
        tvdb: 75692,
        imdb: 'tt0203259',
        tmdb: 2734,
        tvrage: 4204
      }
    }
  },
  {
    watchers: 17,
    show: {
      title: 'Elementary',
      year: 2012,
      ids: {
        trakt: 1406,
        slug: 'elementary',
        tvdb: 255316,
        imdb: 'tt2191671',
        tmdb: 1415,
        tvrage: 30750
      }
    }
  },
  {
    watchers: 15,
    show: {
      title: 'Chicago P.D.',
      year: 2014,
      ids: {
        trakt: 58454,
        slug: 'chicago-p-d',
        tvdb: 269641,
        imdb: 'tt2805096',
        tmdb: 58841,
        tvrage: 35802
      }
    }
  }];

const trendingSeriesTvDbIds = [
  '257655',
  '121361',
  '279121',
  '78901',
  '248742',
  '263365',
  '261690',
  '95011',
  '281617',
  '80379',
  '290853',
  '295647',
  '248682',
  '281662',
  '73762',
  '274431',
  '266189',
  '75692',
  '255316',
  '269641'];

const flashSearchResults = [{
  type: 'show',
  score: 91.70551,
  show: {
    title: 'flash',
    year: null,
    status: '',
    images: {
      poster: {full: null, medium: null, thumb: null},
      fanart: {full: null, medium: null, thumb: null}
    },
    ids: {
      trakt: 106934,
      slug: 'flash-106934',
      tvdb: 309931,
      imdb: null,
      tmdb: null,
      tvrage: null
    }
  }
},
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'The Flash',
      overview: 'After a particle accelerator causes a freak storm, CSI Investigator Barry Allen is struck by lightning and falls into a coma. Months later he awakens with the power of super speed, granting him the ability to move through Central City like an unseen guardian angel. Though initially excited by his newfound powers, Barry is shocked to discover he is not the only "meta-human" who was created in the wake of the accelerator explosion – and not everyone is using their new powers for good. Barry partners with S.T.A.R. Labs and dedicates his life to protect the innocent. For now, only a few close friends and associates know that Barry is literally the fastest man alive, but it won\'t be long before the world learns what Barry Allen has become... The Flash.',
      year: 2014,
      status: 'returning series',
      images: {
        poster: {
          full: 'https://walter.trakt.us/images/shows/000/060/300/posters/original/79bd96a4d3.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/060/300/posters/medium/79bd96a4d3.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/060/300/posters/thumb/79bd96a4d3.jpg'
        },
        fanart: {
          full: 'https://walter.trakt.us/images/shows/000/060/300/fanarts/original/df36c9a731.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/060/300/fanarts/medium/df36c9a731.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/060/300/fanarts/thumb/df36c9a731.jpg'
        }
      },
      ids: {
        trakt: 60300,
        slug: 'the-flash-2014',
        tvdb: 279121,
        imdb: 'tt3107288',
        tmdb: 60735,
        tvrage: 36939
      }
    }
  },
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'The Flash',
      overview: 'Central City Police forensic scientist Barry Allen\'s crime lab is struck by lightning. Allen\'s electrified body is flung into and shatters a cabinet of chemicals, which are both electrified and forced to interact with each other and with his physiology when they come into physical contact with his body. He soon discovers that the accident has changed his body\'s metabolism and as a result he has gained the ability to move at superhuman speed. Barry Allen has become the Flash.',
      year: 1990,
      status: 'ended',
      images: {
        poster: {
          full: 'https://walter.trakt.us/images/shows/000/000/235/posters/original/fb1d03e09f.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/000/235/posters/medium/fb1d03e09f.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/000/235/posters/thumb/fb1d03e09f.jpg'
        },
        fanart: {
          full: 'https://walter.trakt.us/images/shows/000/000/235/fanarts/original/826b9ef114.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/000/235/fanarts/medium/826b9ef114.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/000/235/fanarts/thumb/826b9ef114.jpg'
        }
      },
      ids: {
        trakt: 235,
        slug: 'the-flash',
        tvdb: 78650,
        imdb: 'tt0098798',
        tmdb: 236,
        tvrage: 5781
      }
    }
  },
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'Flash Gordon',
      overview: 'Placing a 21st century spin on a science fiction classic, SCI FI\'s contemporized version of Flash Gordon follows the all-new adventures of Flash and his companions, Dale Arden, Baylin and Dr. Hans Zarkov. Ordinary people thrust into extraordinary circumstances, they find themselves as Earth\'s last line of defense against the forces of the merciless dictator Ming.',
      year: 2007,
      status: 'ended',
      images: {
        poster: {
          full: 'https://walter.trakt.us/images/shows/000/001/219/posters/original/398e858b92.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/001/219/posters/medium/398e858b92.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/001/219/posters/thumb/398e858b92.jpg'
        },
        fanart: {
          full: 'https://walter.trakt.us/images/shows/000/001/219/fanarts/original/b63400965b.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/001/219/fanarts/medium/b63400965b.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/001/219/fanarts/thumb/b63400965b.jpg'
        }
      },
      ids: {
        trakt: 1219,
        slug: 'flash-gordon',
        tvdb: 80441,
        imdb: 'tt0959086',
        tmdb: 1225,
        tvrage: null
      }
    }
  },
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'Flash Forward',
      overview: 'Becca Fisher and Tucker James are two 13 year-olds who have been best friends since birth. They live next door to each other and have shared birthday parties, babysitters and backyard swings. But now, Becca and Tucker are beginning the rite of passage known as the eighth grade. Suddenly, they are teenagers, testing the bounds of their new independence while struggling to hang on the their past.',
      year: 1997,
      status: 'ended',
      images: {
        poster: {full: null, medium: null, thumb: null},
        fanart: {
          full: 'https://walter.trakt.us/images/shows/000/010/320/fanarts/original/14b1376513.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/010/320/fanarts/medium/14b1376513.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/010/320/fanarts/thumb/14b1376513.jpg'
        }
      },
      ids: {
        trakt: 10320,
        slug: 'flash-forward',
        tvdb: 77954,
        imdb: 'tt0115173',
        tmdb: 10371,
        tvrage: 3556
      }
    }
  },
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'Flash Gordon',
      year: 1936,
      status: 'ended',
      images: {
        poster: {
          full: 'https://walter.trakt.us/images/shows/000/061/800/posters/original/c0dfdbc520.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/061/800/posters/medium/c0dfdbc520.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/061/800/posters/thumb/c0dfdbc520.jpg'
        },
        fanart: {full: null, medium: null, thumb: null}
      },
      ids: {
        trakt: 61800,
        slug: 'flash-gordon-1936',
        tvdb: 92551,
        imdb: null,
        tmdb: null,
        tvrage: null
      }
    }
  },
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'Flash Gordon',
      overview: 'Flash Gordon, Flash Gordon\'s Trip to Mars and Flash Gordon Conquers the Universe, the most expensive and popular movie serials ever made, have been favorites of movie and comic fans for decades.',
      year: 1936,
      status: 'ended',
      images: {
        poster: {
          full: 'https://walter.trakt.us/images/shows/000/065/589/posters/original/2bd008c174.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/065/589/posters/medium/2bd008c174.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/065/589/posters/thumb/2bd008c174.jpg'
        },
        fanart: {
          full: 'https://walter.trakt.us/images/shows/000/065/589/fanarts/original/cc39bc13ca.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/065/589/fanarts/medium/cc39bc13ca.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/065/589/fanarts/thumb/cc39bc13ca.jpg'
        }
      },
      ids: {
        trakt: 65589,
        slug: 'flash-gordon-1936-65589',
        tvdb: 254867,
        imdb: null,
        tmdb: null,
        tvrage: null
      }
    }
  },
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'Flash Gordon',
      overview: 'Based on Alex Raymon\'s legendary sci-fi comic strip hero, these episodes present the journeys of space hero Flash Gordon (Steve Holland). Along with the lovely Dale Arden (Irene Champlin) and the brilliant Dr. Zarkov (Joe Nash), Flash represents the Galaxy Bureau of Investigation in an ongoing quest to keep the cosmos safe.',
      year: 1954,
      status: 'ended',
      images: {
        poster: {full: null, medium: null, thumb: null},
        fanart: {
          full: 'https://walter.trakt.us/images/shows/000/015/051/fanarts/original/17a5642eb8.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/015/051/fanarts/medium/17a5642eb8.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/015/051/fanarts/thumb/17a5642eb8.jpg'
        }
      },
      ids: {
        trakt: 15051,
        slug: 'flash-gordon-1954',
        tvdb: 70331,
        imdb: 'tt0140738',
        tmdb: 15116,
        tvrage: 3557
      }
    }
  },
  {
    type: 'show',
    score: 65.50394,
    show: {
      title: 'The Flash',
      overview: 'The Flash is- of course!- the fastest man alive. Barry Allen, otherwise known as the Flash, and his sidekick Wally West, otherwise known as Kid Flash, battle evil villains and aliens who try to cause mayhem on Earth. They can outrun a bullet, vibrate through solid walls, and do all sorts of other things with their incredible speed. When there is trouble, Barry and Wally open up their rings which shoot out their costumes.',
      year: 1967,
      status: 'ended',
      images: {
        poster: {
          full: 'https://walter.trakt.us/images/shows/000/075/481/posters/original/0782d34337.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/075/481/posters/medium/0782d34337.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/075/481/posters/thumb/0782d34337.jpg'
        },
        fanart: {full: null, medium: null, thumb: null}
      },
      ids: {
        trakt: 75481,
        slug: 'the-flash-1967',
        tvdb: 272094,
        imdb: null,
        tmdb: null,
        tvrage: null
      }
    }
  },
  {
    type: 'show',
    score: 52.40315,
    show: {
      title: 'Dirty Pair Flash',
      overview: 'Dirty Pair Flash is related to the original Dirty Pair, with the same characters but there are some changes. Dirty Pair Flash was released later but it is something of a prequel, showing the two main characters on their first assignments. It contains animated violence and mayhem, some profanity and a small amount of nudity. The DVD release is rated 15 and up. The Pair consists of two 17-year-old junior level \'Trouble Consultants\', a cross between a trouble-shooter and a secret agent. They work for an organization called World Welfare & Works Association or the 3WA which handles problems galaxy-wide. Their codename is \'Lovely Angels\' but it\'s easy to see why they are eventually known as the Dirty Pair, not in a naughty way, but because they tend to leave ruination wherever they go. Yuri is the purple-haired and perky team member, she is occasionally zany and a bit distracted. Yuri tends to rely on her feminine wiles to get out of trouble, rarely plans ahead and is obsessed wit',
      year: 1994,
      status: 'ended',
      images: {
        poster: {
          full: 'https://walter.trakt.us/images/shows/000/064/804/posters/original/6e4d179d47.jpg',
          medium: 'https://walter.trakt.us/images/shows/000/064/804/posters/medium/6e4d179d47.jpg',
          thumb: 'https://walter.trakt.us/images/shows/000/064/804/posters/thumb/6e4d179d47.jpg'
        },
        fanart: {full: null, medium: null, thumb: null}
      },
      ids: {
        trakt: 64804,
        slug: 'dirty-pair-flash',
        tvdb: 73312,
        imdb: 'tt0109633',
        tmdb: null,
        tvrage: null
      }
    }
  }];

module.exports = {
  theFlashSeason2,
  theFlashSeason2Parsed,
  theFlashNextEpisode,
  theFlashAllSeasons,
  theFlashAllSeasonInfo,
  trendingSeriesRaw,
  trendingSeriesTvDbIds,
  flashSearchResults
};
