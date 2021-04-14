"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/* USE THESE
let showResponse = await axios.get("http://api.tvmaze.com/search/shows", {params: {q : "bletchley"}})
response.data[0].show.name;
response.data.length is the number of query responses
response.data[0].show.id 

let episodesResponse = await axios.get("http://api.tvmaze.com/shows/1767/episodes");
response.data.length is the number of episodes
*/

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

//AJAX request for array of shows by search term
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let showResponse = await axios.get("http://api.tvmaze.com/search/shows",
    { params: { q: term } });

  let shows = []
  for (let show of showResponse.data) {
    console.log(show.show.name, showResponse.data);

    let showData = {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image ? show.show.image.medium : "https://tinyurl.com/tv-missing"
    }
    shows.push(showData)
  }
  console.log("show data array --->", shows);
  return shows
}


//creates a show div for each show in shows array, & appends to DOM
/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  console.log("populateShows function")
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="No Show Image" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  console.log('searched term --->', term);
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}


/*Form event => search handler*/
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
