andaman:
	gulp andaman
	cp  assets/lib/andaman/andaman-bundle.js ../flashcoin-mobile/src/js/andaman.js 
qa:
	gulp build-debug
prod:
	gulp build-debug
	gulp uglify
	gulp replace
mprod:
	gulp build-debug-mobile
	gulp uglify
	gulp replace
	rm -rf public/assets/images/pages/home-page
	
