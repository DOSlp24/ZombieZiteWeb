package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import de.htwg.se.zombiezite
import de.htwg.se.zombiezite.ZombieZiteApp
import de.htwg.se.zombiezite.controller._
import de.htwg.se.zombiezite.model._
import javax.inject._
import play.api.libs.json._
import play.api.libs.streams.ActorFlow
import play.api.mvc._

import scala.collection.mutable.ArrayBuffer
import scala.swing.Reactor

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
  val c: zombiezite.controller.ControllerInterface = ZombieZiteApp.getController()

  // JSON Stuff
  implicit val item = new Writes[Item] {

    def writes(i: Item) = i match {
      case w: WeaponInterface => Json.obj(
        "name" -> w.name,
        "range" -> w.range,
        "damage" -> w.strength,
        "aoe" -> w.aoe
      )
      case a: ArmorInterface => Json.obj(
        "name" -> a.name,
        "armor" -> a.protection
      )
      case _ => Json.obj(
        "name" -> i.name
      )
    }
  }

  implicit val position = new Writes[PositionInterface] {
    def writes(pos: PositionInterface) = Json.obj(
      "x" -> pos.x,
      "y" -> pos.y
    )
  }

  // Cross ref -> ActualField to Position
  implicit val char = new Writes[Character] {
    def writes(c: Character) = c match {
      case p: PlayerInterface => Json.obj(
        "actualPosition" -> p.actualField.p,
        "lifePoints" -> p.lifePoints,
        "strength" -> p.strength,
        "armor" -> p.armor,
        "range" -> p.range,
        "name" -> p.name,
        "equippedWeapon" -> p.equippedWeapon,
        "inventory" -> p.equipment,
        "ActionCounter" -> p.actionCounter
      )
      case z: ZombieInterface => Json.obj(
        "actualPosition" -> z.actualField.p,
        "lifePoints" -> z.lifePoints,
        "strength" -> z.strength,
        "range" -> z.range,
        "name" -> z.name
      )
      case _ => Json.obj(
        "name" -> c.name
      )
    }
  }

  implicit val field = new Writes[FieldInterface] {
    def writes(f: FieldInterface) = Json.obj(
      "position" -> f.p,
      "players" -> f.players,
      "zombies" -> f.zombies,
      "chars" -> f.chars,
      "charCount" -> Json.toJson(f.chars.length)
    )
  }

  implicit val area = new Writes[AreaInterface] {
    def writes(a: AreaInterface) = Json.obj(
      "fields" -> a.line
    )
  }

  implicit val statWrites = new Writes[GameState] {
    def writes(s: GameState) = Json.obj(
      "round" -> s.round,
      "kills" -> s.kills,
      "winCount" -> s.winCount,
      "players" -> s.players
    )
  }

  implicit val gameSnapWrites = new Writes[GameSnapshot] {
    def writes(m: GameSnapshot) = Json.obj(
      "status" -> m.stat,
      "area" -> m.area,
      "actualPlayer" -> m.actualPlayer,
      "attackableFields" -> m.af,
      "zombies" -> m.zombies
    )
  }


  // Web Socket Area
  class ZombieWebSocketActor(out: ActorRef) extends Actor with Reactor {

    listenTo(ZombieZiteApp.getController())

    reactions += {
      case event: GameOverLost => sendLostToClient
      case event: GameOverWon => sendWonToClient
      case event: Wait => sendJsonToClient
      case event: Search => sendJsonToClient
      case event: PlayerMove => sendJsonToClient
      case event: ZombieWentUp => sendJsonToClient
      case event: ZombieWentDown => sendJsonToClient
      case event: ZombieWentLeft => sendJsonToClient
      case event: ZombieWentRight => sendJsonToClient
      case event: ItemDropped => sendJsonToClient
      case event: DiscardWeapon => sendJsonToClient
      case event: EquipedWeapon => sendJsonToClient
      case event: SwappedWeapon => sendJsonToClient
      case event: NewAction => sendJsonToClient
      case event: DrawZombie => sendJsonToClient
      case event: ZombieAttack => sendJsonToClient
      case event: PlayerAttack => sendJsonToClient
      case event: PlayerAttackPlayer => sendJsonToClient
      case event: Consumed => sendJsonToClient
    }

    def receive = {
      case msg: String =>
        if (msg.startsWith("field")) { // Handle Attack

          println("Attack Received!")
          val coordinate = msg.slice(5, msg.length).split("-")
          val x = Integer.parseInt(coordinate.apply(1).trim())
          val y = Integer.parseInt(coordinate.apply(0).trim())

          println("Attacking (X: " + x + " Y: " + y + ")")

          c.attackField(c.actualPlayer, c.area.line(x)(y))
          sendJsonToClient

        } else if (msg.startsWith("EquipWeapon")) { // Handle Equip Weapon

          val invPosition = msg.slice(12, msg.length)
          val itemIndex = Integer.parseInt(invPosition)
          val item: WeaponInterface = c.actualPlayer.equipment.apply(itemIndex).asInstanceOf[WeaponInterface]
          c.beweapon(c.actualPlayer, item)

        } else if (msg.startsWith("Trash")) { // Handle Trash

          val invPosition = msg.slice(6, msg.length)
          val itemIndex = Integer.parseInt(invPosition)
          val item: Item = c.actualPlayer.equipment.apply(itemIndex)
          c.drop(c.actualPlayer, item)

        } else if (msg.startsWith("EquipArmor")) { // Handle Equip Armor

          val invPosition = msg.slice(11, msg.length)
          val itemIndex = Integer.parseInt(invPosition)
          val item: ArmorInterface = c.actualPlayer.equipment.apply(itemIndex).asInstanceOf[ArmorInterface]
          c.equipArmor(c.actualPlayer, item)

        } else {

          println(msg + "\n");
          msg match {
            case "Wait" => c.wait(c.actualPlayer)
            case "Search" => c.search(c.actualPlayer)
            case "Move Up" => c.move(c.actualPlayer, -1, 0)
            case "Move Down" => c.move(c.actualPlayer, 1, 0)
            case "Move Left" => c.move(c.actualPlayer, 0, -1)
            case "Move Right" => c.move(c.actualPlayer, 0, 1)
            case "Unequip" => c.beweapon(c.actualPlayer, null)
            case "Send Me Data" => sendJsonToClient
            case _ =>
          }
        }
    }

    def sendWonToClient = {
      out ! ("Winner")
    }

    def sendLostToClient = {
      out ! ("Loser")
    }

    def sendJsonToClient = {
      println("Received event from Controller")
      val gameState = GameState(c.round, c.zombiesKilled, c.winCount, c.player)
      val myJson = Json.toJson(GameSnapshot(c.area, c.actualPlayer, gameState, c.attackableFields(c.actualPlayer), c.zombies))
      out ! (myJson.toString())
    }
  }

  object ZombieActorFactory {
    def create(out: ActorRef) = {
      Props(new ZombieWebSocketActor(out))
    }
  }


  /*def socket() = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received")
      ZombieActorFactory.create(out)
    }
  }*/

  def about() = Action { implicit request: Request[AnyContent] =>
    c.init(4)
    Ok(views.html.About())
  }

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def showPlayground() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.ZombieZite(c))
  }

  def dead() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.dead())
  }

  def newGame(num: String) = Action { implicit request: Request[AnyContent] =>
    c.init(Integer.parseInt(num))
    Ok(views.html.ZombieZite(c))
  }

  def callWait() = Action { implicit request: Request[AnyContent] =>
    c.wait(c.actualPlayer)
    Ok(views.html.ZombieZite(c))
  }

  def callSearch() = Action { implicit request: Request[AnyContent] =>
    c.search(c.actualPlayer)
    Ok(views.html.ZombieZite(c))
  }

  def polymer() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.Polymer())
  }

  def callMove(direction: String) = Action { implicit request: Request[AnyContent] =>
    direction match {
      case "up" => c.move(c.actualPlayer, -1, 0)
      case "down" => c.move(c.actualPlayer, 1, 0)
      case "left" => c.move(c.actualPlayer, 0, -1)
      case "right" => c.move(c.actualPlayer, 0, 1)
    }
    Ok(views.html.ZombieZite(c))
  }

  def attackField(coord: String) = Action { implicit request: Request[AnyContent] =>
    val coordinate = coord.slice(5, coord.length).split("-")
    val x = Integer.parseInt(coordinate.apply(0).trim())
    val y = Integer.parseInt(coordinate.apply(1).trim())
    c.attackField(c.actualPlayer, c.area.line(y)(x))
    Ok(views.html.ZombieZite(c))
  }

  def equipArmor(invPosition: String) = Action { implicit request: Request[AnyContent] =>
    val itemIndex = Integer.parseInt(invPosition)
    val item: ArmorInterface = c.actualPlayer.equipment.apply(itemIndex).asInstanceOf[ArmorInterface]
    c.equipArmor(c.actualPlayer, item)
    Ok(views.html.ZombieZite(c))
  }

  def equipWeapon(invPosition: String) = Action { implicit request: Request[AnyContent] =>
    val itemIndex = Integer.parseInt(invPosition)
    val item: WeaponInterface = c.actualPlayer.equipment.apply(itemIndex).asInstanceOf[WeaponInterface]
    c.beweapon(c.actualPlayer, item)
    Ok(views.html.ZombieZite(c))
  }

  def unequipWeapon() = Action { implicit request: Request[AnyContent] =>
    c.beweapon(c.actualPlayer, null)
    Ok(views.html.ZombieZite(c))
  }

  def trashItem(invPosition: String) = Action { implicit request: Request[AnyContent] =>
    val itemIndex = Integer.parseInt(invPosition)
    val item: Item = c.actualPlayer.equipment.apply(itemIndex)
    c.drop(c.actualPlayer, item)
    Ok(views.html.ZombieZite(c))
  }

  def ajaxJson() = Action {
    val gameState = GameState(c.round, c.zombiesKilled, c.winCount, c.player)
    val myJson = Json.toJson(GameSnapshot(c.area, c.actualPlayer, gameState, c.attackableFields(c.actualPlayer), c.zombies))
    Ok(myJson)
  }

  def webSocketJson() = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received")
      ZombieActorFactory.create(out)
    }
  }
}

case class GameState(round: Int, kills: Int, winCount: Int, players: Array[PlayerInterface])

case class GameSnapshot(area: AreaInterface, actualPlayer: PlayerInterface, stat: GameState, af: Array[FieldInterface], zombies: ArrayBuffer[ZombieInterface])

