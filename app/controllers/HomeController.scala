package controllers

import de.htwg.se.zombiezite
import de.htwg.se.zombiezite.ZombieZiteApp
import de.htwg.se.zombiezite.model.{ArmorInterface, Item, WeaponInterface, baseImpl}
import de.htwg.se.zombiezite.model.baseImpl.Armor
import javax.inject._
import play.api.mvc._
import play.api.libs.json._


/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val c: zombiezite.controller.ControllerInterface = ZombieZiteApp.getController()


  def about() = Action { implicit request: Request[AnyContent] =>
    c.init(4)
    println(c.attackableFields(c.actualPlayer).apply(0).players)
    Ok(views.html.About())
  }

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def showPlayground() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.ZombieZite(c))
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

  def callMove(direction: String) = Action { implicit request: Request[AnyContent] =>
    direction match {
      case "up" => c.move(c.actualPlayer, 0, -1)
      case "down" => c.move(c.actualPlayer, 0, 1)
      case "left" => c.move(c.actualPlayer, -1, 0)
      case "right" => c.move(c.actualPlayer, 1, 0)
    }
    Ok(views.html.ZombieZite(c))
  }

  def attackField(coord: String) = Action { implicit request: Request[AnyContent] =>
    val coordinate = coord.split(",")
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

  /*def getJson() = Action {
    Ok()
  }*/
}

