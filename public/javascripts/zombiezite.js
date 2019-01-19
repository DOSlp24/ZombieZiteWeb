$(document).ready(function () {
    console.log("Document is ready!");

    createSocket();
    //ajax();
});

var socket;

function createSocket() {
    socket = new WebSocket("ws://localhost:9000/webSockets");
    socket.setTimeout;

    $("#moveUpButton").click(function () {
        socket.send("Move Up")
    });

    $("#moveDownButton").click(function () {
        socket.send("Move Down")
    });

    $("#moveLeftButton").click(function () {
        socket.send("Move Left")
    });

    $("#moveRightButton").click(function () {
        socket.send("Move Right")
    });

    $("#waitButton").click(function () {
        socket.send("Wait")
    });

    $("#searchButton").click(function () {
        socket.send("Search")
    });

    socket.onopen = function () {
        console.log("I just opened a socket!");
        socket.send("Send Me Data");
    };
    socket.onmessage = function (message) {
        if (socket.readyState == 1) {
            if (message.data == "Winner") {
                location.href = "/about"; //TODO Put the Winning Screen here
            } else if (message.data == "Loser") {
                location.href = "/dead ";
            } else {

                cleanUp();
                buildUp(JSON.parse(message.data));
                socket.send("I just got your JSON :D - Thanks!");
            }
        }

    };
    socket.onclose = function () {
        console.log("Socket Closed!");
    };
}

function ajax() {
    $.ajax({
        method: "GET",
        url: "/json",
        dataType: "json",

        success: function (result) {
            //socket.send("I just got your JSON :D - Thanks!");

            buildUp(result)
        }
    });
}

function checkDefeat(players) {
    if (players.length === 0)
        document.location.href = "/dead";

}

function initStatus() {
    $("#inventoryTrash").hide();

    $("#equippedWeapon").dblclick(function () {
        //document.location.href = "/unequipWeapon";
        socket.send("Unequip");
    });

    $("#equippedWeapon").droppable({
        accept: ".inventoryWeapon", //Accept Weapons only
        drop: function (e, ui) {
            var index = ui.draggable[0].id.split(":")[1];
            //document.location.href = "/equipWeapon/" + index;
            socket.send("EquipWeapon " + index);
        }
    });

    $("#inventoryTrash").droppable({
        drop: function (e, ui) {
            var index = ui.draggable[0].id.split(":")[1];
            //document.location.href = "/trashItem/" + index;
            socket.send("Trash " + index);
        }
    });

    $("#status").droppable({
        accept: ".inventoryArmor",
        drop: function (e, ui) {
            var index = ui.draggable[0].id.split(":")[1];
            //document.location.href = "/equipArmor/" + index;
            socket.send("EquipArmor " + index);
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
        socket.send(e.currentTarget.id)
        //document.location.href = "/attackField/" + e.currentTarget.id;
    }));
}

function buildZombieContainer(zombies) {
    $("#zombieContainer").append("<h1 class=\"centered headline\">Zombies</h1>");
    $("#zombieContainer").append("<ul id='zombieContainerList'/>");
    zombies.forEach(function (actualZombie) {
        $("#zombieContainerList").append("<li>" + actualZombie.name + ":(" + actualZombie.actualPosition.x/2 + "," + actualZombie.actualPosition.y/2 + ")" + actualZombie.lifePoints + " LP </li>");
    });
}

function buildPlayerContainer(result) {
    $("#playerContainer").append("<img src='/assets/images/players/" + result.actualPlayer.name + " por.png'/>");

    $("#playerContainer").append("<ul id='playerContainerList'/>");
    result.status.players.forEach(function (thePlayer) {
        if (thePlayer.name === result.actualPlayer.name)
            $("#playerContainerList").append("<p id='actualPlayer' class='centered'>>" + thePlayer.name + "</p>");
        else
            $("#playerContainerList").append("<p id='notActualPlayer' class='centered'>" + thePlayer.name + "</p>");
    });

    $("#playerContainer").append("<h1 id='actionCounter'>");
    for (schritt = 0; schritt < result.actualPlayer.ActionCounter; schritt++)
        $("#actionCounter").append("*");

    $("#playerContainer").append("</h1>");

}

function buildInfoBoardContainer(status) {
    $("#infoBoard").append("<h1 class=\"centered headline\">Info Board</h1>");
    $("#infoBoard").append("<div class='text-info'>Runde " + status.round + "</div>");
    $("#infoBoard").append("<div class='text-info'>" + status.kills + "/" + status.winCount + "Zombies erledigt.</div>");
}

function buildStatusContainer(actualPlayer) {
    $("#status").append("<h1 class=\"centered headline\">Status</h1>");
    $("#status").append("<p class='centered'>My Field: (" + actualPlayer.actualPosition.x/2 + "," + actualPlayer.actualPosition.y/2 + ")</p>");
    $("#status").append("<p class=\"centered\">LP: " + actualPlayer.lifePoints + "</p>");
    $("#status").append("<p class=\"centered\">Strength: " + actualPlayer.strength + "</p>");
    $("#status").append("<p class=\"centered\">Armor: " + actualPlayer.armor + "</p>");
    $("#status").append("<p class=\"centered\">Equiped Weapon: " + actualPlayer.equippedWeapon.name + "</p>");
}

function buildInventoryContainer(actualPlayer) {
    $("#topInventoryContainer").append("<div class='row centered smallMarginBottom'><div class='col' id='equippedWeapon'></div></div>");
    $("#topInventoryContainer").append("<div class='row' id='inventoryContainer'></div>");
    $("#equippedWeapon").append("<img src='/assets/images/weapons/" + actualPlayer.equippedWeapon.name + ".png'/>");

    var iIndex = 0;
    actualPlayer.inventory.forEach(function (theItem) {
        var itemType = ""
        if (theItem.name === "Axe" || theItem.name === "Big Mama" || theItem.name === "EVIL SISTERS" || theItem.name === "Flame Thrower" ||
            theItem.name === "Knife" || theItem.name === "Mashine Gun" || theItem.name === "Pan" || theItem.name === "Pistol" ||
            theItem.name === "Shotgun" || theItem.name === "Sniper")
            itemType = "inventoryWeapon";
        if (theItem.name === "Boots" || theItem.name === "Chest" || theItem.name === "Healkit" || theItem.name === "Holy Armor" || theItem.name === "Swat-Shield")
            itemType = "inventoryArmor";

        $("#inventoryContainer").append("<div class=\"col\"><img id='inventory:" + iIndex + "' class='" + itemType + " inventoryItem' src='/assets/images/items/" + theItem.name + ".png'/>");
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

function bindArrowkeys() {
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (event.key) {
            case "ArrowDown":
                document.location.href = "/move/down";
                break;
            case "ArrowUp":
                document.location.href = "/move/up";
                break;
            case "ArrowLeft":
                document.location.href = "/move/left";
                break;
            case "ArrowRight":
                document.location.href = "/move/right";
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
}

function buildUp(result) {
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
    bindArrowkeys();
}

function cleanUp() {
    $("#playground").children().remove();
    $("#topInventoryContainer").children().remove();
    $("#equippedWeapon").children().remove();
    $("#zombieContainer").children().remove();
    $("#playerContainer").children().remove();
    $("#infoBoard").children().remove();
    $("#status").children().remove();
}