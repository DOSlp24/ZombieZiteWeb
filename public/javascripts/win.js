$(document).ready(function () {
    console.log("Document is ready!");

    loadJson();
});



function listPlayers(players) {
    players.forEach(function (thePlayer) {
        $("#winners").append( "<p>"+thePlayer.name+"</p>");
    });
}



function loadJson() {
    $.ajax({
        method: "GET",
        url: "/json",
        dataType: "json",

        success: function (result) {
            console.log(result);
            listPlayers(result.status.players)
        }
    });
}