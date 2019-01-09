$(document).ready(function () {
    console.log("Document is ready!");

    loadJson();
});


function checkDefeat(players) {
    if (players.length === 0)
        document.location.href = "/dead";

}


function initStatus() {
    $("#inventoryTrash").hide();

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
}

function listenToAttackableFields() {
    $(".attackableField").click((function (e) {
        document.location.href = "/attackField/" + e.currentTarget.id;
    }));
}

function buildZombieContainer(zombies) {
    $("#zombieContainer").append("<h1 class=\"centered headline\">Zombies</h1>");
    $("#zombieContainer").append("<ul id='zombieContainerList'/>");
    zombies.forEach(function (actualZombie) {
        $("#zombieContainerList").append("<li>" + actualZombie.name + ":(" + actualZombie.actualPosition.x + "," + actualZombie.actualPosition.y + ")" + actualZombie.lifePoints + " LP </li>");
    });
}


function buildPlayerContainer(result) {
    $("#playerContainer").append("<img src='/assets/images/players/" + result.actualPlayer.name + " por.png'/>");

    $("#playerContainer").append("<ul id='playerContainerList'/>");
    result.status.players.forEach(function (thePlayer) {
        if (thePlayer.name === result.actualPlayer.name)
            $("#playerContainerList").append( "<p id='actualPlayer' class='centered'>>"+thePlayer.name+"</p>");
        else
            $("#playerContainerList").append( "<p id='notActualPlayer' class='centered'>"+thePlayer.name+"</p>");
    });

    $("#playerContainer").append("<h1 id='actionCounter'>");
    for (schritt = 0; schritt < result.actualPlayer.ActionCounter; schritt++)
        $("#actionCounter").append("*");

    $("#playerContainer").append("</h1>");

}


function buildInfoBoardContainer(status) {
    $("#infoBoard").append("<h1 class=\"centered headline\">Info Board</h1>");
    $("#infoBoard").append("<div class='text-info'>Runde "+status.round+"</div>");
    $("#infoBoard").append("<div class='text-info'>"+status.kills+"/" +status.winCount+ "Zombies erledigt.</div>");
}


function buildStatusContainer(actualPlayer) {
    $("#status").append("<h1 class=\"centered headline\">Status</h1>");
    $("#status").append("<p class='centered'>My Field: (" + actualPlayer.actualPosition.x + "," + actualPlayer.actualPosition.y + ")</p>");
    $("#status").append("<p class=\"centered\">LP: "+ actualPlayer.lifePoints +"</p>");
    $("#status").append("<p class=\"centered\">Strength: "+ actualPlayer.strength +"</p>");
    $("#status").append("<p class=\"centered\">Armor: "+ actualPlayer.armor +"</p>");
    $("#status").append("<p class=\"centered\">Equiped Weapon: "+ actualPlayer.equippedWeapon.name +"</p>");
}


function buildInventoryContainer(actualPlayer) {
    $("#equippedWeapon").append("<img src='/assets/images/weapons/" + actualPlayer.equippedWeapon.name + ".png'/>");

    var iIndex = 0;
    actualPlayer.inventory.forEach(function (theItem) {
        var itemType = ""
        if (theItem.name === "Axe" || theItem.name === "Big Mama" || theItem.name === "EVIL SISTERS" || theItem.name === "Flame Thrower" ||
            theItem.name === "Knife" || theItem.name === "Mashine Gun" || theItem.name === "Pan" || theItem.name === "Pistol" ||
            theItem.name === "Shotgun" || theItem.name === "Sniper" )
            itemType = "inventoryWeapon";
        if (theItem.name === "Boots" || theItem.name === "Chest" || theItem.name === "Healkit" || theItem.name === "Holy Armor" || theItem.name === "Swat-Shield")
            itemType = "inventoryArmor";

        $("#inventoryContainer").append("<div class=\"col\"><img id='inventory:"+ iIndex+"' class='"+itemType+" inventoryItem' src='/assets/images/items/" + theItem.name + ".png'/>");
        iIndex = iIndex + 1;
    });

    if (actualPlayer.inventory.length == 0)
        $("#topInventoryContainer").append("<p class=\"centered\">Inventory is empty.</p>");
}


function buildFields(area) {
    $("#playground").append("<table id='myPlaygroundTable'/>");
    area.fields.forEach(function (line) {
        $("#myPlaygroundTable").append("<tr id='playgroundTr" + area.fields.indexOf(line) + "'/>");
        line.forEach(function (field) {
            $x = field.position.x;
            $y = field.position.y;
            if ($x > 0) {
                $x = $x / 2;
            }
            if ($y > 0) {
                $y = $y / 2;
            }
            $("#playgroundTr" + area.fields.indexOf(line)).append("<td id='field" + $y + "-" + $x + "' class='field'/>");
            $actualField = $("#field" + $y + "-" + $x);
            if (field.chars.length > 0) {
                if (field.chars.length > 4) {
                    $actualField.append(">4 Chars");
                } else {
                    field.players.forEach(function (p) {
                        $actualField.append("<div class='item'><img src='/assets/images/players/" + p.name + ".png'/></div>");
                    });
                    field.zombies.forEach(function (z) {
                        $actualField.append("<div class='item'><img src='/assets/images/zombies/" + z.name + ".png'/></div>");
                    });
                }
            } else {
                $actualField.append("-");
            }
        });
    });
}

function markAttackableFields(attackableFields) {
    attackableFields.forEach(function (field) {
        $x = field.position.x;
        $y = field.position.y;
        if ($x > 0) {
            $x = $x / 2;
        }
        if ($y > 0) {
            $y = $y / 2;
        }
        $actualField = $("#field" + $y + "-" + $x);
        $actualField.addClass("attackableField");
    });
}

function loadJson() {
    $.ajax({
        method: "GET",
        url: "/json",
        dataType: "json",

        success: function (result) {
            console.log(result);

            checkDefeat(result.status.players)

            buildInfoBoardContainer(result.status);
            buildZombieContainer(result.zombies);
            buildPlayerContainer(result);
            buildStatusContainer(result.actualPlayer);
            buildInventoryContainer(result.actualPlayer);
            buildFields(result.area);
            markAttackableFields(result.attackableFields);
            initStatus();
            listenToAttackableFields();
        }
    });
}