serve:
	firebase functions:config:get > .runtimeconfig.json
	firebase serve --only functions
deploy: 
	firebase deploy --only functions
rebuild:
	npm install firebase-functions@latest firebase-admin@latest --save
	npm install -g firebase-tools
	npm install 
clean:
	rm -rf node_modules
	rm package-lock.json
