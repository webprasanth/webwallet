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
	
