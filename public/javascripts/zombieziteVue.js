/*
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

*/

/* --- Vue Stuff - WIP --- */

function VueStuff(result) {

    $("#inventoryContainer").append('<img class="col" v-for="(item, index) in items" :src="item.url" :id="\'inventory:\' + index" :json="setJson({ 'result' })"/>'');




    var inventoryContainer = new Vue({
        el: '#inventoryContainer',
        data: {

            json: {},

            /*
            items: [
                { url: '/assets/images/players/K. Kawaguchi.png'},
                { url: '/assets/images/players/K. Kawaguchi.png'}
            ]
            */
        },
        methods: {
            setJson (payload) {
                this.json = payload
            },
        }

            /*items: result.actualPlayer.inventory*/

    })
}
