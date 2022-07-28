import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _numPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('button');

      const goToPage = btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = +this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    this._numPage = numPage;

    // page 1, and have other pages(1 button)
    if (currentPage === 1 && this._numPage > 1) {
      return this._generateButton(currentPage);
    }

    // pages(two buttons)
    if (currentPage < this._numPage && currentPage !== 1) {
      return this._generateButton(currentPage);
    }
    // last page(only 1 button)
    if (currentPage === this._numPage && currentPage !== 1) {
      return this._generateButton(currentPage);
    }
    // page 1, and no other page(no button)
    return ``;
  }

  _generateButton(curPage) {
    return `
    ${
      curPage === 1
        ? ` `
        : `
    <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
    </button>`
    }
    ${
      curPage === this._numPage
        ? ``
        : `
    <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `
    }
    
    `;
  }
}

export default new PaginationView();
