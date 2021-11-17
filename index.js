import RenderEngine from "./modules/renderengine.js";
import Router from "./modules/routingEngine.js"





const eng = new RenderEngine();


eng.parse("<div><for><div></div></for></div>")


const router = new Router();

router
	.add({
		path:"/home",
		template:"reee/reee"
	},() => {
		console.log("test")
	})
	.add({
		path:"/home/:id",
		template:"./templates/"
	}, (params,self) => {
		console.log(params)
	})
	.add({
		path:"/home/page/:id",
		template:"./templates/index.html"
	},(params) => {
		console.log(params)
	})
	.add({
		path:"*", 
		template:"./templates/index.html"
	}, () => {
		console.log(404)
	})



console.log(router);