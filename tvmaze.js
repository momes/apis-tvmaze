"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


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

    let showData = {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image ? show.show.image.medium : "https://tinyurl.com/tv-missing"
    }
    shows.push(showData)
  }
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
             <button data-showId="${show.id}" class="btn btn-outline-light btn-sm Show-getEpisodes">
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


/*Episode Display Handler*/
/*When episode button is clicked, appends episode list to the bottom of the page*/
async function searchForEpisodesAndDisplay() {
  $('.Show-getEpisodes').on("click", async function (e) {
    $("#episodesList").empty();
    console.log('click target -->', e.target);
    console.log('function SearchForEpisodesAndDisplay --->', $(this).attr("data-showId"))
    //Calls the AJAX function to get episodes
    const episodes = await getEpisodesOfShow($(this).attr("data-showId"));
    console.log('episodes array -->', episodes);
    //Calls the populateEpisodes function to append to DOM
    populateEpisodes(episodes);
  })
}



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  let episodesResponse = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log('episodesResponse --->', episodesResponse.data);

  let episodes = episodesResponse.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));

  return episodes;
}

/** Write a clear docstring for this function... */
/*takes an array of episode objects and appends li to the episodes ul for each episode
=> EPISODE NAME Season # Episode # */
function populateEpisodes(episodes) {
  console.log('populateEpisodes with array --->', episodes)
  let $list = $("#episodesList");

  for (let episode of episodes) {
    $list.append(`<li>
    ${episode.name} Season ${episode.season} Episode ${episode.number}
    </li>`)
  }

  console.log($list);
  $episodesArea.append($list);
  $episodesArea.show();
}


/*Form event => search handler*/
/* when user searches a term and submits form, a list of shows is displayed. Each
show has an Episode button that displays episodes at the list on the bottom of the 
page on click*/
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  await searchForEpisodesAndDisplay();
});
