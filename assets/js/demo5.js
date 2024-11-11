;(function(window) {

	'use strict';

	var mainContainer = document.querySelector('.main-wrap'),
		openCtrl = document.getElementById('btn-search'),
		closeCtrl = document.getElementById('btn-search-close'),
		searchContainer = document.querySelector('.search'),
		inputSearch = searchContainer.querySelector('.search__input'),
		lastFocusedElement;

	function init() {
		initEvents();	
	}

	function initEvents() {
		openCtrl.addEventListener('click', openSearch);
		closeCtrl.addEventListener('click', closeSearch);
		document.addEventListener('keyup', function(ev) {
			// escape key.
			if( ev.keyCode == 27 ) {
				closeSearch();
			}
			else if( ev.keyCode == 13 ) {
				closeSearch();
			}
		});
	}

	function openSearch() {
		// document.getElementsByTagName("body").style.zIndex = "999"; 
		lastFocusedElement = document.activeElement;
		mainContainer.classList.add('main-wrap--move');
		searchContainer.classList.add('search--open');
		setTimeout(function() {
			inputSearch.focus();
		}, 600);
	}

	function closeSearch() {
		// document.getElementsByTagName("body").style.overflow = "visible"; 
		mainContainer.classList.remove('main-wrap--move');
		searchContainer.classList.remove('search--open');
		inputSearch.blur();
		inputSearch.value = '';
		if (lastFocusedElement) { // restore focus
			lastFocusedElement.focus();
		}
	}

	init();

})(window);