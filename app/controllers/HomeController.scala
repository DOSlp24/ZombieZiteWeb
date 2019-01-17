package controllers

import de.htwg.se.zombiezite
import de.htwg.se.zombiezite.ZombieZiteApp
import de.htwg.se.zombiezite.model._
import javax.inject._
import play.api.libs.json._
import play.api.mvc._

import scala.collection.mutable.ArrayBuffer


/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val c: zombiezite.controller.ControllerInterface = ZombieZiteApp.getController()

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
    c.attackField(c.actualPlayer, c.area.line(x)(y))
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

  def getJson() = Action {
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


    val gameState = GameState(c.round, c.zombiesKilled, c.winCount, c.player)
    val myJson = Json.toJson(GameSnapshot(c.area, c.actualPlayer, gameState, c.attackableFields(c.actualPlayer), c.zombies))
    Ok(myJson)
  }

}

case class GameState(round: Int, kills: Int, winCount: Int, players: Array[PlayerInterface])

case class GameSnapshot(area: AreaInterface, actualPlayer: PlayerInterface, stat: GameState, af: Array[FieldInterface], zombies: ArrayBuffer[ZombieInterface])

