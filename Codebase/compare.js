function comparePremierLeague() {
	var teams = [];

	if (localStorage.getItem("response") != null && localStorage.getItem("response") !== undefined) {

		var value = JSON.parse(localStorage.getItem("response"));

		createMultiLineTeam('/competitions/teams.json');

		createMultiLine('/competitions/leagueTable.json');

	} else {

		$.ajax({
			headers: {
				'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
			},
			url: '/competitions/competitions.json',
			dataType: 'json',
			type: 'GET',
			async: false,
		}).done(function(resp) {


			localStorage.setItem("response", JSON.stringify(resp));

			var value = JSON.parse(localStorage.getItem("response"));

			createMultiLineTeam('/competitions/teams.json');

			createMultiLine('/competitions/leagueTable.json');

		});
	}

	function callStackedBar(id) {
		alert(id);
	}



	function createMultiLineTeam(url) {

		if (localStorage.getItem("response2") != null && localStorage.getItem("response2") !== undefined) {


			var value11 = JSON.parse(localStorage.getItem("response2"));

			var teamval = JSON.parse(localStorage.getItem("teamsResponse"));

			teamval.forEach(function(element, index) {

				teams.push(element);
			});


		} else {

			$.ajax({
				headers: {
					'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
				},
				url: url,
				dataType: 'json',
				type: 'GET',
				async: false,
			}).done(function(resp) {
				localStorage.setItem("response2", JSON.stringify(resp));

				var value11 = JSON.parse(localStorage.getItem("response2"));

				value11['teams'].forEach(function(element, index) {


					var teamfixtures = element['_links']['fixtures']['href'];

					var arr = [];
					var name = {
						'name': element['name'],
						'arr': arr
					};
					teams.push(name);

				});
				localStorage.setItem("teamsResponse", JSON.stringify(teams));

			});

		}

	}

	function createMultiLine(url) {

		if (localStorage.getItem("response3") != null && localStorage.getItem("response3") !== undefined) {

			var value111 = JSON.parse(localStorage.getItem("response3"));


			for (var i = 1; i <= value111['matchday']; i++) {
				var url = '/competitions/matchday' + i + '.json';

				if (localStorage.getItem("response4" + i) != null && localStorage.getItem("response4" + i) !== undefined) {


					var value14 = JSON.parse(localStorage.getItem("response4" + i));


					value14['standing'].forEach(function(element, index) {
						teams.forEach(function(element1, index1) {
							if (element['teamName'] == element1['name']) {
								var arr = element1['arr'];
								arr.push(element['position']);

								teams[index1]['arr'] = arr;
							}
						});
					});
				} else {
					$.ajax({
						headers: {
							'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
						},
						url: url,
						dataType: 'json',
						type: 'GET',
						async: false,
					}).done(function(resp) {

						localStorage.setItem("response4", JSON.stringify(resp));

						var value15 = JSON.parse(localStorage.getItem("response4"));


						value15['standing'].forEach(function(element, index) {
							teams.forEach(function(element1, index1) {
								if (element['teamName'] == element1['name']) {
									var arr = element1['arr'];
									arr.push(element['position']);

									teams[index1]['arr'] = arr;
								}
							});
						});


					});
				}


			}

			callMultiLineChart(teams);

		} else {

			$.ajax({
				headers: {
					'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
				},
				url: url,
				dataType: 'json',
				type: 'GET',
				async: false,
			}).done(function(resp) {


				localStorage.setItem("response3", JSON.stringify(resp));

				var value171 = JSON.parse(localStorage.getItem("response3"));


				for (var i = 1; i <= value171['matchday']; i++) {
					var url = '/competitions/matchday' + i + '.json';

					$.ajax({
						headers: {
							'X-Auth-Token': 'f0387d742be94d18932cb1387d759325'
						},
						url: url,
						dataType: 'json',
						type: 'GET',
						async: false,
					}).done(function(resp) {


						localStorage.setItem("response4" + i, JSON.stringify(resp));

						var value151 = JSON.parse(localStorage.getItem("response4" + i));


						value151['standing'].forEach(function(element, index) {
							teams.forEach(function(element1, index1) {

								if (element['teamName'] == element1['name']) {

									var arr = element1['arr'];
									arr.push(element['position']);

									teams[index1]['arr'] = arr;
								}
							});
						});


					});

				}

				callMultiLineChart(teams);


			});

		}



	}



	/*To design and update line chart based on the one or more countries selected Part C*/
	function callMultiLineChart(countriesList) {

		var div = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		var colors = d3.scaleOrdinal(d3.schemeCategory20);


		$("#main").fadeOut(2000);
		d3.select("#main").selectAll("svg").transition()
			.duration(2000)
			.ease(d3.easeLinear)
			.remove();

		d3.select("#teamC").selectAll("svg").transition()
			.duration(2000)
			.ease(d3.easeLinear)
			.remove();


		var canvas1 = d3.select("#main").
		append("svg").
		attr("width", 1200).
		attr("height", 700).
		append("g").
		attr("transform", "translate(50,40)");



		var xaxisScale1 = d3.scaleLinear()
			.domain([1, 37])
			.range([0, 956]);

		var yaxisScale1 = d3.scaleLinear()
			.domain([1, 21])
			.range([40, 600]);

		var yaxis1 = d3.axisLeft().scale(yaxisScale1);

		var yaxis2 = d3.axisRight().scale(yaxisScale1);
		var xaxis1 = d3.axisBottom().scale(xaxisScale1);



		countriesList.forEach(function(value, i) {


			var line = d3.line()
				.x(function(d, index) {
					return xaxisScale1(index + 1);
				})
				.y(function(d, index) {
					return yaxisScale1(d);

				})


			var classVar = 'line' + i;
			canvas1.append("path")
				.data([countriesList])
				.transition()
				.duration(3000) // 2 seconds
				.attr("fill", "none")
				.attr("stroke", colors(i))
				.attr("stroke-width", 2.5)
				.attr("class", classVar)

				.attr("d", function(d) {
					console.log(d[i]['arr']);
					return line(d[i]['arr']);
				})
				.attr("id", function(d, i) {
					return 'path' + i;
				})


				.attr("onclick", "callStackedBar('" + value['name'] + "')");



			countriesList.forEach(function(element, index) {

				element['arr'].forEach(function(element1, index1) {



					canvas1.append("circle")
						.attr("r", 2)
						.attr("cx", function(d, i) {

							return xaxisScale1(index1 + 1);
						})
						.attr("fill", colors(index))
						.attr("cy", function(d) {

							return yaxisScale1(element1);
						})
						.on("mouseover", function(d) {
							div.transition()
								.duration(200)
								.style("opacity", .9);

						})
						.on("mouseout", function(d) {
							div.transition()
								.duration(500)
								.style("opacity", 0);
						});

				})
			});

		});


		for (var i = 0; i <= 19; i++) {

			canvas1.append("text")

				.attr("transform", "translate(1030," + (36 + ((countriesList[i]['arr'][35] - 1) * 28)) + ")")
				.attr("dy", ".35em")
				.attr("text-anchor", "start")
				.style("fill", colors(i))
				.attr("font-size", "10.5px")
				.text(countriesList[i]['name']);
		}

		canvas1.append("g")
			.call(yaxis1);

		canvas1.append("g")
			.call(yaxis2);
		canvas1.append("g")
			.attr("transform", "translate(0,600)")
			.call(xaxis1);

		canvas1.append("text")
			.attr("x", "-150")
			.attr("y", "12")
			.text("Position")
			.attr("transform", "rotate(-90,50,100)");


		canvas1.append("text")
			.attr("x", "-100")
			.attr("y", "12")
			.text("Game Day")
			.attr("transform", "translate(350,625)");

		canvas1.append("g")
			.attr("transform", "translate(0,600)")
			.call(xaxis1.ticks(33).tickFormat(d3.format("d")));

		canvas1.append("g")

			.call(yaxis1.ticks(20));

		canvas1.append("g")
			.attr("transform", "translate(956,0)")
			.call(yaxis2.ticks(20));

		canvas1.append("g")
			.attr("transform", "translate(1200,0)")
			.call(yaxis1);

		$("#main").fadeIn(2500);

	}

	$("#navigate").fadeIn(2500);
}