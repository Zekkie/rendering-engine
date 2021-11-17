import RenderEngine from "./renderengine.js";

class Router extends RenderEngine{
	constructor() {
		super();
		this.hashEvent = window.addEventListener("hashchange",this.hashEventHandler.bind(this));
		this.routes = [];
		this.init();
		
	};

	pathToRegex(path) {
		if(path !== "*") {
			const regex =  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
			console.log(regex)
			return regex;
		}else {
			return null;
		}
		
	}

	getParams(match) {
		if(!match.result) {
			return false
		}

		const values = match.result.slice(1);

		const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

		

		return Object.fromEntries(keys.map((key,i) => {
			return [key,values[i]];
		}));
	}

	hashEventHandler(e) {

		const potentialMatches = this.routes.map(route => {
			return {
				route: route,
				result: location.hash.substring(1).match(this.pathToRegex(route.path))
			}
		});


		console.log(potentialMatches)
		

		let match = potentialMatches.find(potentialMatch =>{
			const pattern = new RegExp("^" + location.hash.substring(1).replace(/\/[^\/]*$/g,"").replace(/\//g,"\\/") + "$");

			const testPath = potentialMatch.route.path.replace(/\/[^\/]*$/g,"");

			return pattern.test(testPath);


		});


	


		if(match.result) {
			match.route.action(this.getParams(match), this)
		}else {
			const errorRoute = this.routes.find(route => {
				return route.path === "*";
			});

			errorRoute.action(this.getParams(match), this)
		}

		
	}

	init() {

		if(window.location.hash === "") {
			window.location.hash = "/home";
		}else {
			console.log(window.location.hash)
		}

		
	};

	add(obj, action) {
		this.routes.push({
			path: obj.path,
			template:obj.template,
			action: action
		});

		return this;
	}
}



export default Router;