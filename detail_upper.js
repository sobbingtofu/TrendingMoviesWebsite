const temph1 = document.getElementById("temp-h1");
// 클릭한 영화에 대해 표기될 정보들이 할당될 객체 미리 선언해둠
let mediaInfos = {
  mediaID: 0,
  posterPath: "",
  rating: 0,
  mediaTitle: "",
  overview: "",
  backdropPath: "",
  genreIds: [],
  genre: [],
  genre: [],
  actors: [],
  directors: [],
};

// url 내 클릭한 미디어 ID 정보 가져오는 함수
const getMediaID = () => {
  const urlParams = new URL(location.href).searchParams;
  const targetID = urlParams.get("media_id");
  return targetID;
};
// 위 함수를 실행시킨 결과(=클릭한 미디어의 ID)를 mediaID 속성으로 할당
mediaInfos.mediaID = parseInt(getMediaID());

// (영화 제목, 설명, 포스터 사진, 평점을 가져오기 위해서)
// TMDB에서 트렌딩 상위 영화 20개 정보 서버로부터 받아오는 함수
const fetchMovieData = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDJlYjRiZmU3MDgxMWYxZTM4NTQ2NjdlY2E3ODMxZSIsInN1YiI6IjY2MmU1ODJiNjlkMjgwMDEyNjQzMWZjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCAD6KLBg4hPCt30_MWWZ-UoNY_Da5R_IKuLnVelElQ",
    },
  };

  const response = await fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options);
  const data = await response.json();
  return data.results;
};

// TMDB 서버에 접근해 지정된 영화/시리즈 ID에 따른 출연진 및 스태프 정보를 가져오는 함수
const fetchCredit = async (targetID) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDJlYjRiZmU3MDgxMWYxZTM4NTQ2NjdlY2E3ODMxZSIsInN1YiI6IjY2MmU1ODJiNjlkMjgwMDEyNjQzMWZjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCAD6KLBg4hPCt30_MWWZ-UoNY_Da5R_IKuLnVelElQ",
    },
  };
  const response = await fetch(`https://api.themoviedb.org/3/movie/${parseInt(targetID)}/credits?language=en-US`, options);
  const data = await response.json();
  return data;
};

// TMDB 서버에 접근해 장르 id와 이름 쌍 리스트 가져오는 함수
const fetchGenreIdNamePair = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDJlYjRiZmU3MDgxMWYxZTM4NTQ2NjdlY2E3ODMxZSIsInN1YiI6IjY2MmU1ODJiNjlkMjgwMDEyNjQzMWZjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCAD6KLBg4hPCt30_MWWZ-UoNY_Da5R_IKuLnVelElQ",
    },
  };
  const response = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options);
  const data = await response.json();
  return data.genres;
};

// 가져온 미디어 ID를 바탕으로 클릭 타겟 미디어에 대한 배우들 및 감독 정보와 더불어,
// 영화 제목, 설명, 포스터 사진, 평점 정보를 구축하는 함수
const createDatabase = async () => {
  // TMDB API에서 가져온 타겟 미디어 제작진 정보 객체를 상수 currentMediaCrews에 할당
  const currentMediaCrews = await fetchCredit(mediaInfos.mediaID);

  // 각 출연배우의 이름, 성별, 배역, creditID, ID, 프로필사진 path가 담긴 객체들을 이전에 만든 actors 배열에 저장함
  currentMediaCrews.cast.forEach((actor) => {
    const currentActor = {
      name: actor.name,
      gender: actor.gender,
      characterName: actor.character,
      creditId: actor.credit_id,
      id: actor.id,
      profilepath: actor.profile_path,
    };
    mediaInfos.actors.push(currentActor);
  });

  // 각 감독의 이름, 성별, creditID, ID, 프로필사진 path가 담긴 객체들을 이전에 만든 directors 배열에 저장함
  // (감독도 여러명일 수 있으므로..)
  currentMediaCrews.crew.forEach((crew) => {
    if (crew.job === "Director") {
      const currentCrew = {
        name: crew.name,
        gender: crew.gender,
        creditId: crew.credit_id,
        id: crew.id,
        profilepath: crew.profile_path,
      };
      mediaInfos.directors.push(currentCrew);
    }
  });

  // TMDB API에서 가져온 트렌딩 미디어들 정보 배열을 movies에 할당
  const movies = await fetchMovieData();

  //mediaInfos에 저장해둔 ID 값으로 클릭 타겟 미디어 색출
  const currentMediaInfos = movies.filter((movie) => {
    return movie.id === mediaInfos.mediaID;
  })[0];

  // 색출된 타겟 미디어에서 필요한 정보 추출해 사전에 선언해둔 MediaInfos 객체에 할당시킴
  // 추후 해당 객체 통해 html 구성
  mediaInfos.mediaTitle = currentMediaInfos.title;
  mediaInfos.posterPath = currentMediaInfos.poster_path;
  mediaInfos.rating = currentMediaInfos.vote_average.toFixed(1);
  mediaInfos.overview = currentMediaInfos.overview;
  mediaInfos.backdropPath = currentMediaInfos.backdrop_path;
  mediaInfos.genreIds = currentMediaInfos.genre_ids;

  console.log(mediaInfos);

  const genreIdNamePairList = await fetchGenreIdNamePair();

  genreIdNamePairList.forEach((genreIdNamePair) => {
    mediaInfos.genreIds.forEach((genreId) => {
      if (genreIdNamePair.id === genreId) {
        mediaInfos.genre.push(genreIdNamePair.name);
      }
    });
  });
};

// 백드롭 이미지, 제목, 평점, 장르 표시되는 상단부 섹션 구현하는 함수
const createBackdropSection = () => {
  const backdropWallpaper = document.getElementById("backdrop-wallpaper");
  const mediaTitle = document.getElementById("title");
  const mediaRating = document.getElementById("rating");
  const mediaGenre = document.getElementById("genres");
  backdropWallpaper.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${mediaInfos.backdropPath})`;
  mediaTitle.innerText = `${mediaInfos.mediaTitle}`;
  mediaRating.innerText = `${mediaInfos.rating} /10`;

  mediaInfos.genre.forEach((genre, index) => {
    if (index !== mediaInfos.genre.length - 1) {
      const addTargetGenre = document.createTextNode(genre + " / ");
      mediaGenre.appendChild(addTargetGenre);
    } else {
      const addTargetGenre = document.createTextNode(genre);
      mediaGenre.appendChild(addTargetGenre);
    }
  });
};

// 포스터 사진과 평점 section 내용 구현하는 함수
const createPosterAndOverviewSection = () => {
  const posterAndOverviewSection = document.getElementById("poster-and-overview");
  posterAndOverviewSection.innerHTML = `
    <img class = poster src="https://image.tmdb.org/t/p/w300${mediaInfos.posterPath}" alt="${mediaInfos.mediaTitle}">
    <p class="overview">${mediaInfos.overview}</p>
`;
};

// 제작진 및 배우 section 내용 구현하는 함수
const createCrewContainer = () => {
  // 감독
  const crewContainer = document.getElementById("crew-info-container");
  mediaInfos.directors.forEach((director) => {
    const addTarget = document.createElement("div");
    addTarget.id = director.id;
    addTarget.class = "crew-card";
    addTarget.innerHTML = `
    <img class = "crew-image" src="https://image.tmdb.org/t/p/original${director.profilepath}" alt="${director.name}">
    <h3 class="crew-name">${director.name}</h3>
    <p class="crew-job">Director</p>`;
    crewContainer.appendChild(addTarget);
  });
  // 배우들 (5명)
  for (let i = 0; i < 5; i++) {
    const addTarget = document.createElement("div");
    addTarget.id = mediaInfos.actors[i].id;
    addTarget.class = "crew-card";
    addTarget.innerHTML = `
    <img  class = "crew-image" src="https://image.tmdb.org/t/p/w200${mediaInfos.actors[i].profilepath}" alt="${mediaInfos.actors[i].name}">
    <h3 class="crew-name">${mediaInfos.actors[i].name}</h3>
    <p class="crew-job">${mediaInfos.actors[i].characterName}</p>`;
    crewContainer.appendChild(addTarget);
  }
};

// 데이터베이스를 먼저 만든 후, html 문서 렌더링 작업 실행하도록 순서 설정
createDatabase().then(() => {
  createBackdropSection();
  createPosterAndOverviewSection();
  createCrewContainer();
});
