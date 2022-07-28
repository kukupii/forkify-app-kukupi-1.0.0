import icons from 'url:../img/icons.svg';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { async } from 'regenerator-runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECOND } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // render the spinner
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.render(model.getSearchResultPage());

    // 1. get the recipe
    bookmarksView.render(model.state.bookmarked);
    await model.loadRecipe(id);

    // 2. render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //get query
    const query = searchView.getQuery();
    if (!query) return;

    //get query results
    await model.loadSearchResults(query);
    console.log(model.state.search.results);

    //render the results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultPage(goToPage));

  // Render new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  model.changeServings(updateTo);
  recipeView.render(model.state.recipe);
};

const controlBookMarked = function () {
  // 1. add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.removeBookMark(model.state.recipe.id);
  }

  // 2. render bookmark
  recipeView.render(model.state.recipe);

  // 3. add to bookmark list and render
  bookmarksView.render(model.state.bookmarked);
};

const controlBookmarksRender = function () {
  bookmarksView.render(model.state.bookmarked);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    // 1. upload the new recipe data
    await model.updataRecipe(newRecipe);
    console.log(model.state.recipe);

    // 2. render recipe
    recipeView.render(model.state.recipe);

    // 3. render success message
    addRecipeView.renderMessage();

    // 4. render the bookmarks
    bookmarksView.render(model.state.bookmarked);

    // 5. change id in URL
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    // 4. close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECOND);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarksRender);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandlerUpdate(controlServings);
  recipeView.addHandlerBookmarked(controlBookMarked);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerSubmit(controlAddRecipe);
};

init();
