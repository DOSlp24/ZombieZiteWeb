function sayHello() {
    console.log("Hello whoever you are!");
}
$( document ).ready(function() {
    console.log( "Document is ready!" );
    $(".inventoryItem").click(function() {sayHello()});
    $("#equippedWeapon").draggable();
});