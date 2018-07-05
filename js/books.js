document.addEventListener("DOMContentLoaded", function() {

//funckja glowna, ladujaca wszystkie ksiazki
function loadBooks() {
	$.ajax({
				url : 'http://localhost:8282/books',
				type : "GET",
				success : function(jsonBooks) {
					//usuwanie dzieci diva, zeby nie dublowac tytulow
					var div = $(".loadBooks");
					if (div.children().length != 0) {
						var children = div.children();
						children.remove();
					}

					var books = [];
					for (var i = 0; i < jsonBooks.length; i++) {
						books.push(jsonBooks[i]);
						var infoDiv = $("<div class = \"info\">");
						var title = books[i].title;
						var id = books[i].id;
						var p = $("<p class = \"title\" id=\"" + id + "\">"
								+ title + "</p>");
						var input = $("<input class = \"delete\" value = \"DELETE\" type = \"submit\">");
						div.append(p);
						
						div.append(infoDiv);
						div.append(input);
					}

					//dodanie klika na tytul i wyswietlenie szczegolow
					var allTitle = $(".title");
					var dd = $(".info");
					for (var i = 0; i < allTitle.length; i++) {
						allTitle.eq(i).one("click", function(e) {

							var id = $(this).attr("id");
							var idP = parseInt(id, 10);
							place = $(this).next();
							loadBookInfo(idP, place);

						});
					}

					//dodanie przycisku usuwania
					var allDeletes = $(".delete");
					for (var i = 0; i < allDeletes.length; i++) {

						allDeletes.eq(i).one("click", function() {
							var delParent = $(this).prev();
							var delGr = delParent.prev();
							var id = delGr.attr("id");
							var idP = parseInt(id, 10);
							deleteBook(idP);

						});

					}

				},
				error : function() {
					alert("Cannot load books...")
				}
			});// koniec ajax
} // koniec loadBooks()

//funkcja pobbierajaca szczegoly 
function loadBookInfo(id, place) {
	var bookInfo;
	$.ajax({
		url : 'http://localhost:8282/books/' + id,
		type : "GET",
	}).done(
			function(jsonBook) {

				var id = jsonBook.id;
				var isbn = jsonBook.isbn;
				var author = jsonBook.author;
				var publisher = jsonBook.publisher;
				var type = jsonBook.type;

				bookInfo = "ID: " + id + " ISBN: " + isbn + " Author: "
						+ author + " Type: " + type;

				place.text(bookInfo);

			});
}

//funkcja usuwajaca ksiazke
function deleteBook(id) {
	var bookDetails = $.ajax({
		url : "http://localhost:8282/books/" + id,
		type : "DELETE",
		success: function(){
			alert("Deleted book");
		},
		complete : loadBooks,
	});
}


var addBtn = $(".add");
//obsluga przycisku add i dodanie zapytaniem POST ksiazki z formularza do bazy
addBtn.on("click", function(event) {
	event.preventDefault();

	$.ajax({
		//bez tego blad kodowania
		headers : {
			'Content-Type' : 'application/json'
		},
		url : "http://localhost:8282/books",
		type : "POST",
		data : JSON.stringify({
			"isbn" : $("#isbn").val(),
			"title" : $("#title").val(),
			"author" : $("#author").val(),
			"publisher" : $("#publiser").val(),
			"type" : $("type").val()
		}),
		success: function(){
			alert("Added book");
		},
		complete : loadBooks,
		
	});
});

loadBooks();

//obsluga przycisku rozwijajacego formularz
var addBookBtn = $("#addBookBtn");
addBookBtn.on("click", function(){
	var formAll = $(".formAll");
	
	if(formAll.css("display") == "none"){
	formAll.slideDown(2000);
	formAll.css("display", "block");}
	else{
		formAll.slideUp(2000);}	
	
});

//obsluga przycisku do rozwijania ksiazek
var displayBooksBtn = $("#displayBooksBtn");
displayBooksBtn.on("click", function(){
	var booksD = $(".booksD");
	var lb = $(".loadBooks");
	
	if(booksD.css("display") == "none"){
		booksD.slideDown(2000);
		booksD.css("display", "block");
		lb.slideDown(2000);
		lb.css("display", "block");	
	}
	else{
		booksD.slideUp(2000);
		lb.slideUp(2000);	
	}
		
	
});
});//koniec DOM