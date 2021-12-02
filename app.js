let page = 1;

const container = document.getElementById("container");
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");
const inputSearch = document.getElementById("search");
const numberPage = document.querySelector(".number-page");
const btnSearch = document.getElementById("btnSearch");
const containerMovie = document.querySelector(".movie");
const templateDetailMovie = document.getElementById("detail-movie").content;
const fragment = document.createDocumentFragment();

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
            <div id="${movie.id}" class="container-img">
              <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="" class="poster">
              <div class="hover" data-idMovie="${movie.id}">
                <h3>Ver Detalle</h3>          
              </div>
            </div>
            <h3 class="title">${movie.title}</h3>
          </div>
        `;
      });

      container.innerHTML = movies;
    } else if (response.status === 401) {
      console.log("Pusiste la llave mal");
    } else if (response.status === 404) {
      console.log("La película que buscas no existe");
    } else {
      console.log("Hubo un error desconocido");
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
            <div id="${movie.id}" class="container-img">
              <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="" class="poster">
              <div class="hover" data-idMovie="${movie.id}">
                <h3>Ver Detalle</h3>          
              </div>
            </div>
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
      console.log("Hubo un error desconocido");
    }
  } catch (error) {
    console.log(error);
  }
};

const getDetailMovie = async (idMovie) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${idMovie}?api_key=06834f1a4c0114b44b173e57990084cf&language=es-MX`
    );

    if (response.status === 200) {
      const data = await response.json();
      const clone = templateDetailMovie.cloneNode(true);
      const generes = data.genres;

      clone.querySelector(
        ".img-movie"
      ).src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
      clone.querySelector(".title").textContent = data.title;
      clone.querySelector(
        ".release-date"
      ).textContent = `Fecha de estreno: ${data.release_date}`;
      clone.querySelector(
        ".vote-average"
      ).textContent = `Promedio de votos: ${data.vote_average} / 10`;
      clone.querySelector(".listGenres").textContent = `Genero:`;

      generes.forEach((el) => {
        const listItem = document.createElement("li");
        listItem.textContent = el.name;
        clone.querySelector(".listGenres").appendChild(listItem);
      });

      clone.querySelector(".description").textContent = data.overview;

      if (data.homepage !== "") {
        clone.querySelector(".home-page").href = data.homepage;
        clone.querySelector(".home-page").textContent = "Ver sitio oficial";
      } else {
        clone.querySelector(".home-page").style.display = "none";
      }

      if (data.backdrop_path !== null) {
        clone.querySelector(
          ".img-back-movie"
        ).src = `https://image.tmdb.org/t/p/w500/${data.backdrop_path}`;
      }

      fragment.appendChild(clone);
    } else if (response.status === 401) {
      console.log("Pusiste la llave mal");
    } else if (response.status === 404) {
      console.log("La movie que buscas no existe");
    } else {
      console.log("Hubo un error desconocido");
    }

    container.innerHTML = "";
    container.appendChild(fragment);
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".close i")) {
    inputSearch.value === "" ? getMovies() : searchMovie(inputSearch.value);
  }

  if (e.target.matches(".hover *")) {
    let idMovie = e.target.parentElement.getAttribute("data-idMovie");
    getDetailMovie(idMovie);
  }

  if (e.target.matches(".hover") || e.target.matches(".poster")) {
    let idMovie = e.target.parentElement.getAttribute("id");
    getDetailMovie(idMovie);
  }

  if (e.target.matches(".title")) {
    let idMovie = e.target.previousElementSibling.id;
    getDetailMovie(idMovie);
  }

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
