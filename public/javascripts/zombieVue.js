let weapons = [
    {name: "Fists", desc: "Well.. Ever thought about fighting Zombies with your bare hands? \nMe either", img: "/assets/images/weapons/Fists.png"},
    {name: "Axe", desc: "'Wait a minute.. I'm just gonna get my Axe real quick.' - He died like a Viking.", img: "/assets/images/weapons/Axe.png"},
    {name: "Knife", desc: "Its a Knife. Better than nothing.", img: "/assets/images/weapons/Knife.png"},
    {name: "Pan", desc: "Everything is a Weapon if you want it to. Just like this Frying Pan.", img: "/assets/images/weapons/Pan.png"},
    {name: "Pistol", desc: "Moderate Damage, some Range and a cool Look.", img: "/assets/images/weapons/Pistol.png"},
    {name: "Shotgun", desc: "'Why don't you bring a shotgun to the party? Everybody got one.'", img: "/assets/images/weapons/Shotgun.png"},
    {name: "Maschine Gun", desc: "High Damage due to the high fire rate.", img: "/assets/images/weapons/Mashine Gun.png"},
    {name: "Sniper", desc: "This weapon got the highest range in the game.", img: "/assets/images/weapons/Sniper.png"},
    {name: "BIG MAMA", desc: "No clue whos mama this shotgun is, but I'm genuinely scared!", img: "/assets/images/weapons/Big Mama.png"},
    {name: "EVIL SISTERS", desc: "Those twin Pistols look like fun.", img: "/assets/images/weapons/EVIL SISTERS.png"},
    {name: "Flamethrower", desc: "It's the most powerfull weapon in this game! It attacks a whole field instead of one character.", img: "/assets/images/weapons/Flame Thrower.png"}
];

$(document).ready(function () {
    var zombieVue = new Vue({
        el: 'weapon-list',
        data: {
            weapons: weapons
        }
    });
});

// noinspection JSAnnotator
Vue.component('weapon-list', {
    template: '<div><table style="width:100%"><tr v-for="weapon in weapons"><td>{{weapon.name}}</td><td>{{weapon.desc}}</td><td><img v-bind:src="weapon.img"></td></tr></table></div>',
    data: function () {
        return {weapons: weapons}
    }
});