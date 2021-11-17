class RenderEgine {
	constructor() {
		this.data = [
			{foo:"ree",bar:"ree"},
			{foo:"nay",bar:"say"},
			{foo:"ba",bar:"da"},
		]
	}

	parser(node) {
		const obj = {
			name:node.nodeName,
			attributes: node.attributes ? this.get_attributes(node) : [],
			nodes: [],
			nodeValue: node.nodeValue ? node.nodeValue : ""
		}



		node.childNodes.forEach(c => {
			if(c.nodeName !== "#text") {
				obj.nodes.push(this.parser(c))
			}else if(!!this.is_whitespace(c)) {
				obj.nodes.push(this.parser(c))
			}
			
		})

	

		return obj;
	}

	interpreter(node) {
		const element = node.name !== "#text" ? document.createElement(node.name) : document.createTextNode(node.nodeValue);

		this.set_attributes(element, node.attributes)
		
		
		node.nodes.forEach( c => {
			const {name} = c;

			if(name === "if") {
				this.visit_if(c, element)
			}else if(name === "for") {
				this.visit_for(c).forEach(e => {
					element.appendChild(e,element)
				})
			}else{
				element.appendChild(this.interpreter(c));
			}
		})
		return element;
	}

	visit_if(node,parent) {
		if(data[node.attributes[0].value]) {
			node.nodes.forEach(c => {
			const {name} = c;
				if(name === "for") {
					temp = visit_for(c);
					temp.forEach(e => {
						parent.appendChild(e)
					})
				}else {
					parent.appendChild(this.interpreter(c));
				}
			})
		}
	}

	visit_for(node,arr) {
		const elements = [];

		let tempData = arr ? arr : this.data;

		console.log(tempData)
		//tempData[node.attributes[0].value]
		this.data.forEach(i => {
			node.nodes.forEach(c => {
				elements.push(this.create_element(c,i))
			})
			
		})
		return elements;
	}


	get_attributes(tag) {
		let attributes = [];

		attributes = Array.prototype.slice.call(tag.attributes).map(a => {
			return {
				attr: a.name,
				value: a.value
			}
		});


		return attributes;
	}

	set_attributes(el,attributes) {
		attributes.forEach(a => {
			el.setAttribute(a.attr, a.value)
		})
	}

	create_element(node,item) {
		let temp = ""

		if(/{(.*?)}/.test(node.nodeValue)) {
			temp = item[this.get_key(node)];
		}

		const element =  node.name !== "#text" ? document.createElement(node.name) : document.createTextNode(temp);
		this.set_attributes(element, node.attributes);
		node.nodes.forEach(c => {
			if(c.name === "for") {
				visit_for(c,item).forEach(e => {
					element.appendChild(e)
				})
			}else {
				element.appendChild(this.create_element(c,item));
			}
			
		});
		return element;
	}

	get_key(node) {
		const key = node.nodeValue.replaceAll(/({|})/g,"");
	
		return key;
	}

	is_whitespace(node) {
		return /\S/.test(node.nodeValue);
	}

	async parse(html) {

		const domParser = new DOMParser();
		

		const res = await fetch("./templates/test.html");

		const template = await res.text();

		const tree = domParser.parseFromString(template, "application/xml").documentElement;

		const payloadTemp = this.interpreter(this.parser(tree));

		document.querySelector("#app").appendChild(payloadTemp);
	}
}

export default RenderEgine;