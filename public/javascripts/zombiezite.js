$(document).ready(function () {
    console.log("Document is ready!");

    loadJson();
});

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

            buildZombieContainer(result.zombies);
            buildFields(result.area);
            markAttackableFields(result.attackableFields);
            initStatus();
            listenToAttackableFields();
        }
    });
}