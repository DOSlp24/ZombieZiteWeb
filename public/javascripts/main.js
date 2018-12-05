$(document).ready(function () {
    console.log("Document is ready!");
    $(".inventoryItem").click(function () {
        sayHello()
    });
    $("#equippedWeapon").draggable();
    $("#equippedWeapon").droppable({
        drop: function (e, ui) {
            console.log(ui.draggable[0].id);
            console.log(ui.draggable[0].id.split(":")[1]);
            console.log("Is Weapon:" + ui.draggable[0].classList.contains("inventoryWeapon"));

            var index = ui.draggable[0].id.split(":")[1];
            if (ui.draggable[0].classList.contains("inventoryWeapon")) {
                document.location.href = "/equipWeapon/" + index;
            } else if (ui.draggable[0].classList.contains("inventoryArmor")) {
                document.location.href = "/equipArmor/" + index;
            } else {

            }
        }
    });
    $(".inventoryItem").draggable();
    $(".attackableField").click((function (e) {
        sayHello()
        console.log(e.currentTarget.id)
        document.location.href = "/attackField/" + e.currentTarget.id
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