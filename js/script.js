/* fonction jQuery a exécuter au chargement de la page */
$(function() {
	"use strict";
	
	const API_URL = "http://wildfly.westeurope.cloudapp.azure.com/";
	
	console.log("banque ok !");
	
//	$("header").css({
//		color : "darkred",
//		backgroundColor: "#ff9"
//	});
	
	
//	$(".operations tbody tr:odd").css("backgroundColor", "#ffc");
	
//	$(".operations tbody tr:first").addClass("selected");
//	$(".operations tbody tr").addClass(function(i,oldClass){
//		if(this.textContent.indexOf("Debit") != -1){
//			return "selected";			
//		}
//		return "";
//	});
	
//	$("#ajouterClient input[name='prenom']").prop({
//		selectionStart: 2,
//		selectionEnd: 5
//	});
	
	
//	var liste = $("nav a");
//	liste.on("click",function(){
//		liste.removeClass("active");
//		$(this)
//			.addClass("active")
//		.siblings()
//			.removeClass("active");
//	});
	
	
	/* Menu Navigation */
	$("nav").on("click","a",function(event){
		console.dir(event.originalEvent.ctrlKey);
		
		$(this)
			.addClass("active")
		.siblings()
			.removeClass("active");
	});
	
	console.dir($("nav a"));
	
	
//	$("nav").bind("click",function(event){
//		console.dir(event);
//		
//		$(event.target)
//			.filter("a")
//			.addClass("active")
//		.siblings()
//			.removeClass("active");
//	});
	
	/* Tableau Opération */
	
	// Sélection des lignes
	$(".eni-table tbody").on("click","tr",function(event){
		if(!event.originalEvent.ctrlKey){
			$(this).siblings().removeClass("selected");
		}
		$(this).toggleClass("selected");
	});
	
	// Suppression des lignes
	$("#supprimer").click(function(){
		$(".operations .selected").remove();
	});

	// Ajouter une ligne
	$("#ajouter").click(function(){
		$(".operations button").prop("hidden",function(i,val){
			return !val;
		});
		$(".operations .saisie").prop("hidden",false);
	});
	
	// Valider l'ajout de la ligne
	$("#valider").click(function(){
		var saisie = $(".operations .saisie")
						.prop("hidden",true);

		var ope = {
//			date: saisie.find("[name='date']").val(),
//			libelle: ...
		};
		
		ope.date = saisie.find("[name='date']").val();
		ope.libelle = saisie.find("[name='libelle']").val();
		ope.montant = saisie.find("[name='montant']").val();
		ope.type = saisie.find("[name='type']").val();

		ajouterOperation(ope);
		
		$(".operations button").prop("hidden",function(i,val){
			return !val;
		});
		
		$(".operations [name]").val("");
		
	});
	
	// Créer une nouvelle ligne dans le tableau d'opérations
	function ajouterOperation(ope){
		
		$(".operations .template").clone()
			.removeClass("template")
		.children(":first")
			.text(ope.date)
		.next()
			.text(ope.libelle)
		.next()
			.text(ope.montant+ " €")
		.next()
			.text(ope.type)
		.parent()
			.appendTo(".operations tbody")
			.prop("hidden",false);
		
	}
	
	
	
	$("#ajouterOperation").submit(function(event){
		event.preventDefault();

		var ope = {};
		var data = $(this).serializeArray().forEach(function(val){
			ope[val.name] = val.value;
		});
		
		ajouterOperation(ope);
		
		//location.hash = "#comptes";
	});
	
	// *********** Ajax *****************
	
//	$.ajax({
//		url: "http://wildfly.westeurope.cloudapp.azure.com/clients",
//		success: actualiserListeClients
//	});
	var attente = $.get("http://wildfly.westeurope.cloudapp.azure.com/clients");
	attente.then(actualiserListeClients);
	
	$("#btnActualiserClients").click(function(event){
		$.ajax({
			url: "http://wildfly.westeurope.cloudapp.azure.com/clients",
			success: actualiserListeClients
		});
	});

	$("#btnSupprimerClients").click(function(event){
		
		var lignes = $("#listeClients .selected");
		
		var listeIds = [];
		for(var i= 0; i < lignes.length; i++){
			listeIds.push(lignes[i].dataset.id);

			// $.ajax({
			// 	url: API_URL + "clients/" + lignes[i].dataset.id,
			// 	type: "delete"
			// });
		}
		// actualiserListeClients();

//		var listeIds = lignes.map(function(elem){ 
//			
//			return elem.dataset.id; 
//		});
//		var listeIds = lignes.map( elem => elem.dataset?elem.dataset.id:undefined ); // Arrow function
		
		var attente = supprimerPlusieursLignes(listeIds);
		attente.then(function(data){
			$.ajax({
				url: "http://wildfly.westeurope.cloudapp.azure.com/clients",
				success: actualiserListeClients
			});
		});
		
//		for(var i = 0 ; i < lignes.length ; i++){
//			var id = lignes[i].dataset.id;
//			$.ajax({
//				url: API_URL + "clients/" + id,
//				type: "delete",
//				success: actualiserListeClients
//			});
//		}
		
		// Promise
			
	});
	
	function supprimerPlusieursLignes(listeIds){
		var attentes = [];			
		for ( var i in listeIds) {
			attentes.push(supprimerUneLigne(listeIds[i]));
		}
		return Promise.all(attentes);
	}

	
	function supprimerUneLigne(id){
		var attente = new Promise(function(resolve,reject){

			$.ajax({
				url: API_URL + "clients/" + id,
				type: "delete",
				success: function(data){
					resolve(data);
				},
				error: function(err){
					reject(err);
				}
			});
			
		});
		return attente;
	}
		
	
//	var attentes = [];
//
//	var clients = tableClients.querySelectorAll(".selected");
//	for (var i = 0; i < clients.length; i++) {
//		var attente = supprimerClient(clients[i].dataset.id, i == clients.length-1);
//		attentes.push(attente);
//	}
//	Promise.all(attentes).then(actualiserListeClients);

	
			
//			
//			.each(function(){		
//			$.ajax({
//				url: "http://wildfly.westeurope.cloudapp.azure.com/clients/"
//						+$(this)[0].dataset.id,
//				type: "delete",
//				success: actualiserListeClients
//			});
//		});
	
	$("#ajouterClient").on("submit",creerClient);
	
	function creerClient(event){
		event.preventDefault();
		$.ajax({
			url: API_URL + $(this).attr("action"),
			type: $(this).attr("method"),
			data: $(this).serialize()
			// data: {
			// 	nom: $(this).find("[name=nom]").val(),
			// 	prenom: $(this).find("[name=prenom]").val()
			// },
			// data: client,
			// success: actualiserListeClients
		});
	}


	function actualiserListeClients(data){
		var liste = $("#listeClients tbody").empty();
		// ES6 - Template String
		data.forEach((client) => {
			liste.append(`
				<tr data-id="${client.id}">
					<td>${client.prenom}</td>
					<td>${client.nom}</td>
				</tr>
			`);

		});
	}	

	$("#ajouterOperation #date")
		.on("input",function(){

			var jour = this.valueAsDate?this.valueAsDate.getDay():-1;
			console.log(jour);
			if(jour == 0 || jour == 6){
				this.setCustomValidity(
					"Obligatoirement un jour ouvré (hors samedi et dimanche)"
				);
			}else{
				this.setCustomValidity("");
			}


		});

	
});