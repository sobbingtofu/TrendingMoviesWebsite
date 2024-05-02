// TMDB에서 영화 정보 가져오는 함수
const fetchMovieData = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NThhODc2ZTY5NDA4NWY4YTA1MmQyNjc5MTRhY2RlMiIsInN1YiI6IjYxYzNjZjY5MzdiM2E5MDBjMzQ2YzYyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pPkre3BdMQtujbkqtPmW7TC_022A-ZR2M_ZShzd_kDU",
    },
  };

  const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&include_adult=false", options);

  const data = await response.json();

  console.log(typeof data);
  console.log(data);
  // 콘솔에 찍어본 결과, api가 가져오는 대상은 객체 형태이며 page, results, total_pages, total_results 속성을 가짐
  // 이 중에서 평점 탑 20 영화에 대한 정보는 results 키 속성의 값에 배열의 형태로 담겨있음을 확인 가능함

  return data.results;
  // 따라서 data 객체의 results 속성이 갖는 배열을 반환함
};

// TMDB 데이터베이스 기반으로 각 영화마다 카드 생성하고 html 내 cardlist 섹션에 append하는 함수
const createMovieCards = async () => {
  const cardList = document.getElementById("card-list");

  // TMDB API에서 가져온 영화 정보 배열을 movies에 할당
  const movies = await fetchMovieData();

  // 배열의 각 요소에 대해 카드 만드는 함수 실행
  movies.forEach((movie) => {
    const addTargetCard = document.createElement("div");
    addTargetCard.id = movie.id;
    addTargetCard.className = "movie-card";
    addTargetCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h3 class="movie-title">${movie.title}</h3>
    <p class="movie-overview">${movie.overview}</p>
    <br>
    <p class="movie-rating">Rating: ${movie.vote_average.toFixed(1)}</p>`;
    cardList.appendChild(addTargetCard);
  });

  // cardlist 섹션(안에 있는 요소들)에 대해 클릭시 발생할 동작 부여
  cardList.addEventListener("click", (event) => {
    const target = event.target;
    if (target === cardList) {
    } else {
      if (target.matches(".movie-card")) {
        alert("Movie id: " + target.id);
      } else {
        alert("Movie id: " + target.parentElement.id);
      }
    }
  });
};

// 검색 시 검색창에 있는 텍스트가 제목에 포함된 영화 카드만 화면에 표시되도록 하는 함수
const handleSearch = (event) => {
  // 버튼 눌릴 시 새로고침 방지
  event.preventDefault();

  const searchInput = document.getElementById("search-input");

  const movieCards = document.querySelectorAll(".movie-card");

  const searchTerm = searchInput.value.toLowerCase();

  movieCards.forEach((card) => {
    const title = card.querySelector(".movie-title").textContent.toLowerCase();
    console.log(title);

    if (title.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

const searchForm = document.getElementById("search");
searchForm.addEventListener("submit", handleSearch);

createMovieCards();
