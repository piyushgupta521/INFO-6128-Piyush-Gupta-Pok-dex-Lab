let elements = {
	navigator: null,
	Title: null,
};

const changePage = (page, data) => {
	elements.navigator.pushPage(page, { data });
};

const changeStyles = (e) => {
	const plat = e.target.checked ? "android" : "ios";
	ons.forcePlatformStyling(plat);
};

document.addEventListener("init", (e) => {
	let count = 1;
	if (e.target.id === "home") {
		elements = {
			navigator: document.querySelector("#navigator"),
		};
		ons.preload(["views/tabs.html"]);

		let url = "https://pokeapi.co/api/v2/pokemon?limit=100";
		const get = async () => {
			// do the API call and get JSON response
			const list = document.querySelector("#pokemon-list");
			const response = await fetch(url);
			const json = await response.json();
			const pokemon = json.results;
			pokemon.forEach((Pokemon) => {
				const name = Pokemon.name;
				const url = Pokemon.url;
				list.appendChild(
					ons.createElement(`
          <ons-list-item modifier="chevron" tappable id="${count}" onClick= "elements.navigator.pushPage('views/tabs.html', {data: {url: '${url}'}})">
             ${name}
          </ons-list-item>`)
				);
				count++;
			});
		};
		get();
	}

	if (e.target.id === "tabs") {
		ons.preload(["views/tabs.html"]);
		const listType = document.querySelector("#typelist");
		const listStat = document.querySelector("#statlist");
		const image = document.querySelector("#imgContainer");
		const progressBar = document.querySelector("#progress-bar");
		const suburl = e.target.data.url;
		const subget = async () => {
			const subresponse = await fetch(suburl);
			if (subresponse.ok) {
				progressBar.remove();
			}
			const subjson = await subresponse.json();
			const type = subjson.types;
			const stat = subjson.stats;
			const order = suburl.slice(34, 35);

			image.appendChild(
				ons.createElement(`
          <img src='assets/images/pokemon/${order}.png' style="width: 100%"/>
          `)
			);

			type.forEach((type) => {
				const PokemonType = type.type.name;
				listType.appendChild(
					ons.createElement(`
            <ons-list-item modifier="chevron"  class="type1"><p>${PokemonType}</p></ons-list-item>
              `)
				);
			});

			stat.forEach((stat) => {
				const base = stat.base_stat;
				const effort = stat.effort;
				const statName = stat.stat.name;
				listStat.appendChild(
					ons.createElement(`
            <ons-list-item modifier="chevron"  class="type1"><p>${statName} : ${base} , ${effort} </p></ons-list-item>
              `)
				);
			});
		};
		subget();
	}
});

const popPage = () => elements.navigator.popPage();
window.addEventListener("load", () => window.history.pushState({}, ""));

window.addEventListener("popstate", () => {
	const { pages } = elements.navigator;
	if (pages && pages.length > 1) {
		popPage();
		window.history.pushState({}, "");
	} else {
		window.history.back();
	}
});
