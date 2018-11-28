$(document).ready(function () {
    console.log("Document is ready!");
    $(".inventoryItem").click(function () {
        sayHello()
    });
    $("#equippedWeapon").draggable();
    $("#equippedWeapon").droppable();
    $(".attackableField").click((function (e) {
        sayHello()
        console.log(e.currentTarget.id)
    }));
    //loadJson();
});

function sayHello() {
    console.log("Hello whoever you are!");
}

function loadJson() {
    $.ajax({
        method: "GET",
        url: "/json",
        dataType: "json",

        success: function (result) {
            grid = new Grid(result.grid.size);
            grid.fill(result.grid.cells);
            updateGrid(grid);
            registerClickListener();
        }
    });
}