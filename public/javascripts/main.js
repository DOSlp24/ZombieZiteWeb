$(document).ready(function () {
    console.log("Document is ready!");

    $("#inventoryTrash").hide();

    $(".inventoryItem").click(function () {
        sayHello()
    });
    $("#equippedWeapon").dblclick(function () {
        document.location.href = "/unequipWeapon";
    });
    $("#equippedWeapon").droppable({
        accept: ".inventoryWeapon", //Accept Weapons only
        drop: function (e, ui) {
            var index = ui.draggable[0].id.split(":")[1];
            document.location.href = "/equipWeapon/" + index;
        }
    });
    $("#inventoryTrash").droppable({
        drop: function (e, ui) {
            var index = ui.draggable[0].id.split(":")[1];
            document.location.href = "/trashItem/" + index;
        }
    });
    $("#status").droppable({
        accept: ".inventoryArmor",
        drop: function (e, ui) {
            var index = ui.draggable[0].id.split(":")[1];
            document.location.href = "/equipArmor/" + index;
        }
    });
    $(".inventoryItem").draggable({
        //grid: [ 50, 20 ]
        //refreshPositions //just in case of issues
        //snap: true
        containment: "#statContainer",  // No more messy Items all over the Window
        revert: "invalid",          // No more messy Items all over the inventory
        start: function () {
            $("#inventoryTrash").show();
            $("#status").addClass("alert-primary");
        },
        stop: function () {
            $("#inventoryTrash").hide();
            $("#status").removeClass("alert-primary");
        }
    });
    $(".attackableField").click((function (e) {
        sayHello()
        console.log(e.currentTarget.id);
        document.location.href = "/attackField/" + e.currentTarget.id;
    }));
    //loadJson();
});

function dragover(e) {
    console.log(e);
}

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