

/* --- Vue Stuff - WIP --- */

function VueStuff(result) {

    /* item und index übergabe klappt ganz gut. Json klappt gar nicht. */
    /* hier fehler! */
    $("#inventoryContainer").append('<img class="col" v-for="(item, index) in items" :src="item.url" :id="\'inventory:\' + index" :json="setJson({ 'result' })"/>"');




    var inventoryContainer = new Vue({
        el: '#inventoryContainer',
        data: {

            json: {},

            /* Bilder anzeigen geht. */
            items: [
                { url: '/assets/images/players/K. Kawaguchi.png'},
                { url: '/assets/images/players/K. Kawaguchi.png'}
            ]
            /*items: result.actualPlayer.inventory*/
        },
        methods: {
            setJson (payload) {
                this.json = payload
            },
        }



    })
}
