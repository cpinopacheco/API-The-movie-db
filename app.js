let page = 1;

const container = document.getElementById("container");
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");
const inputSearch = document.getElementById("search");
const numberPage = document.querySelector(".number-page");
const btnSearch = document.getElementById("btnSearch");

const getMovies = async () => {
  numberPage.innerHTML = page;
  try {
    /* fetch devuelve una promesa, hay que esperar a que se resuelve por eso agregamos async - await*/
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=06834f1a4c0114b44b173e57990084cf&language=es-MX&page=${page}`
    );

    //siempre validar el código de la response
    if (response.status === 200) {
      /* La respuesta se parsea a json. El método json() también es asyncrono asi que tiene que ir con await y almacenarlo en una variable*/
      const data = await response.json();

      let movies = "";
      data.results.forEach((movie) => {
        movies += `
          <div class="movie">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="" class="poster">
            <h3 class="title">${movie.title}</h3>
          </div>
        `;
      });

      container.innerHTML = movies;
    } else if (response.status === 401) {
      console.log("Pusiste la llave mal");
    } else if (response.status === 404) {
      console.log("La movie que buscas no existe");
    } else {
      console.log("Hubo un error y no sabemos que paso");
    }
  } catch (error) {
    console.log(error);
  }
};

const searchMovie = async (movieName) => {
  try {
    let response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=06834f1a4c0114b44b173e57990084cf&language=es-MX&query=${movieName}`
    );

    if (response.status === 200) {
      let data = await response.json();

      let movies = "";
      data.results.forEach((movie) => {
        movies += ` 
          <div class="movie">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="" class="poster">
            <h3 class="title">${movie.title}</h3>
          </div>
        `;
      });

      container.innerHTML = movies;
    } else if (response.status === 401) {
      console.log("Pusiste la llave mal");
    } else if (response.status === 404) {
      console.log("La movie que buscas no existe");
    } else {
      console.log("Hubo un error y no sabemos que paso");
    }
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("click", (e) => {
  if (e.target === btnNext) {
    if (page < 500) {
      page += 1;
      getMovies();
      numberPage.textContent = page;
    }
  }

  if (e.target === btnPrevious) {
    if (page > 1) {
      page -= 1;
      getMovies();
      numberPage.textContent = page;
    }
  }

  if (e.target === btnSearch) {
    if (inputSearch.value !== "") {
      let inputValue = inputSearch.value;
      searchMovie(inputValue);
    }
  }
});

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && inputSearch.value !== "") {
    let inputValue = inputSearch.value;
    searchMovie(inputValue);
  }
});

getMovies();
